import os
import numpy as np
import cv2 as cv
import json
from tqdm import tqdm
import exifread
import shutil
from datetime import datetime
from PIL import Image
from PIL.ExifTags import TAGS

fullDir = './fulls'
thumbDir = './thumbs'
metadataDir ='./metadata'

if os.path.exists(metadataDir):
    shutil.rmtree(metadataDir)
if os.path.exists(thumbDir):
    shutil.rmtree(thumbDir)

for createDir in [fullDir, thumbDir, metadataDir]:
    if(not(os.path.exists(createDir))): os.mkdir(createDir)

metadataJSON = './metadata/metadata.json'

imgNames = []

def _convert_to_degrees(value):
    d = float(value.values[0].numerator) / value.values[0].denominator
    m = float(value.values[1].numerator) / value.values[1].denominator
    s = float(value.values[2].numerator) / value.values[2].denominator
    return d + (m / 60.0) + (s / 3600.0)

def get_gps_coordinates(tags):
    lat = tags.get('GPS GPSLatitude')
    lat_ref = tags.get('GPS GPSLatitudeRef')
    lon = tags.get('GPS GPSLongitude')
    lon_ref = tags.get('GPS GPSLongitudeRef')

    if lat and lat_ref and lon and lon_ref:
        latitude = _convert_to_degrees(lat)
        if str(lat_ref) == 'S':
            latitude *= -1

        longitude = _convert_to_degrees(lon)
        if str(lon_ref) == 'W':
            longitude *= -1
        return latitude, longitude
    return None

def getThumbs(check=False,size=(1200,900)):
    for name in tqdm(imgNames, desc="Making Thumbnails"):
        thumbPath = f'./{thumbDir}/{name}.jpg'
        fullPath = f'{fullDir}/{name}.jpg'
        if(not(check) or not(os.path.exists(thumbPath))):
            img = cv.imread(fullPath)
            if img is not None:
                resized = cv.resize(img,size)
                cv.imwrite(thumbPath,resized,[cv.IMWRITE_JPEG_QUALITY,80])
            else:
                print(f"Warning: Could not read image {fullPath}. Skipping thumbnail generation.")

def getFileSize(filePath):
    return os.stat(filePath).st_size

def getMetadatas(check=False):
    all_metadata = {}
    if check and os.path.exists(metadataJSON):
        try:
            with open(metadataJSON, 'r') as f:
                all_metadata = json.load(f)
        except json.JSONDecodeError:
            print(f"Warning: Could not decode existing {metadataJSON}. Starting fresh.")
            all_metadata = {}

    for name in tqdm(imgNames, desc="Extracting Metadata"):
        fullPath = f'{fullDir}/{name}.jpg'
        
        if not check or name not in all_metadata or "Error" in all_metadata.get(name, {}):
            try:
                with open(fullPath,'rb') as full_file:
                    tags = exifread.process_file(full_file)
                    metadata = {}
                for tag in tags.keys():
                    if tag not in ('JPEGThumbnail', 'TIFFThumbnail'):
                        metadata[tag] = str(tags[tag])

                # Get width and height from PIL.Image if not already in EXIF
                try:
                    with Image.open(fullPath) as img_pil:
                        if 'Image Width' not in metadata:
                            metadata['Image Width'] = img_pil.width
                        if 'Image Height' not in metadata:
                            metadata['Image Height'] = img_pil.height
                except Exception as e:
                    print(f"Warning: Could not get dimensions for {name}.jpg: {e}")
                    if 'Image Width' not in metadata:
                        metadata['Image Width'] = 'N/A'
                    if 'Image Height' not in metadata:
                        metadata['Image Height'] = 'N/A'

                # Store raw GPS EXIF tags, index.html will handle formatting
                if tags.get('GPS GPSLatitude') and tags.get('GPS GPSLongitude'):
                    metadata['GPS GPSLatitude'] = str(tags['GPS GPSLatitude'])
                    metadata['GPS GPSLatitudeRef'] = str(tags['GPS GPSLatitudeRef'])
                    metadata['GPS GPSLongitude'] = str(tags['GPS GPSLongitude'])
                    metadata['GPS GPSLongitudeRef'] = str(tags['GPS GPSLongitudeRef'])

                metadata['File Size'] = getFileSize(fullPath)
                all_metadata[name] = metadata
            except Exception as e:
                print(f"Warning: Could not process metadata for {name}.jpg: {e}")
                all_metadata[name] = {"Error": str(e)}
    
    all_metadata['image_order'] = imgNames

    with open(metadataJSON, 'w') as metadataFile:
        json.dump(all_metadata, metadataFile, indent=4)

def createSampleImages(N=25,size=(4000,3000)):
    for i in tqdm(range(N), desc="Creating Sample Images"):
        sample = np.zeros(size[::-1],np.uint8)
        cv.putText(sample,str(i),(size[0]//2,size[1]//2),cv.FONT_HERSHEY_SIMPLEX,10,255,20,cv.LINE_AA)
        sample = cv.copyMakeBorder(sample,100,100,100,100,cv.BORDER_CONSTANT,None,value=255)
        sample = cv.copyMakeBorder(sample,75,75,75,75,cv.BORDER_CONSTANT,None,value=0)
        cv.imwrite(f'{fullDir}/{i}.jpg',sample)

if __name__ == '__main__':
    if(len(os.listdir(fullDir)) == 0):
        print('No images found in fulls directory. Creating sample images...')
        createSampleImages()
    else:
        print('Processing existing images in fulls directory...')

    processable_files = []
    for file in os.listdir(fullDir):
        name, ext = os.path.splitext(file)
        ext = ext.lower()

        if ext == '.jpeg' or ext == '.jpg' and file.endswith('.JPG'):
            old_path = os.path.join(fullDir, file)
            new_file = name + '.jpg'
            new_path = os.path.join(fullDir, new_file)
            if old_path != new_path:
                os.rename(old_path, new_path)
            file = new_file
        
        if file.lower().endswith('.jpg'):
            processable_files.append(file)

    image_files_for_sorting = []
    for file in processable_files:
        name_without_ext = os.path.splitext(file)[0]
        full_path = os.path.join(fullDir, file)

        exif_date_time = None
        try:
            with open(full_path, 'rb') as f:
                tags = exifread.process_file(f, stop_tag='DateTimeOriginal')
                if 'EXIF DateTimeOriginal' in tags:
                    exif_date_str = str(tags['EXIF DateTimeOriginal'])
                    try:
                        exif_date_time = datetime.strptime(exif_date_str, "%Y:%m:%d %H:%M:%S")
                    except ValueError:
                        print(f"Warning: Could not parse EXIF DateTimeOriginal for {file}: '{exif_date_str}'. Falling back to modification time.")
                        exif_date_time = None
        except Exception as e:
            print(f"Warning: Could not read EXIF for {file}: {e}. Falling back to modification time.")
            exif_date_time = None

        sort_key = exif_date_time.timestamp() if exif_date_time else os.path.getmtime(full_path)
        image_files_for_sorting.append((name_without_ext, sort_key))

    image_files_for_sorting.sort(key=lambda x: x[1])
    imgNames = [name for name, sort_key in image_files_for_sorting]

    print('Generating thumbnails...')
    getThumbs(check=False)
    print('Extracting metadata and saving to single JSON file...')
    getMetadatas(check=False)
    print('Processing complete!')
