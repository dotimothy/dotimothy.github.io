import os
import shutil
import cv2 as cv
import json
from tqdm import tqdm
import exifread
from datetime import datetime

fullDir = './fulls'
thumbDir = './thumbs'
metadataDir ='./metadata'
imgNameJS = './imgNames.js'
imgNames = [imgName.split('.jpg')[0] for imgName in os.listdir(fullDir) if imgName.endswith('.jpg')]
newline = '\n'
empty = '' 

def get_exif_datetime(image_path):
    try:
        with open(image_path, 'rb') as img_file:
            tags = exifread.process_file(img_file)
        if 'EXIF DateTimeOriginal' in tags:
            date_str = str(tags['EXIF DateTimeOriginal'])
            return datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')
        elif 'Image DateTime' in tags:  #check for other date fields
            date_str = str(tags['Image DateTime'])
            return datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')
        else:
            return datetime.min # Return the earliest possible datetime.
    except Exception as e:
        print(f"Error reading EXIF data from {image_path}: {e}")
        return datetime.min  # Return a default value on error

imgNames = sorted(
    [imgName.split('.jpg')[0] for imgName in os.listdir(fullDir) if imgName.endswith('.jpg')],
    key=lambda x: get_exif_datetime(os.path.join(fullDir, f'{x}.jpg'))
)

def makeImgList(split=2):
    with open(imgNameJS,'w') as file:
        arrayStr = 'const imgNames = ['
        for i,name in tqdm(enumerate(imgNames)): 
            arrayStr += f"\'{name}\'{'' if i == len(imgNames) - 1 else f',{newline if i % split == split-1 else empty}'}"
        arrayStr += '];'
        file.write(arrayStr)

def getThumbs(check=False,size=(400,300),quality=80):
    for name in tqdm(imgNames):
        thumbPath = f'./{thumbDir}/{name}.jpg'
        fullPath = f'{fullDir}/{name}.jpg'
        if(not(check) or not(os.path.exists(thumbPath))):
            img = cv.imread(fullPath)
            resized = cv.resize(img,size)
            cv.imwrite(thumbPath,resized,[cv.IMWRITE_JPEG_QUALITY,quality])

def getFileSize(filePath):
    return os.stat(filePath).st_size

def getMetadatas(check=False):
    for name in tqdm(imgNames):
        fullPath = f'{fullDir}/{name}.jpg'
        metadataPath = f'{metadataDir}/{name}.json'
        if(not(check) or not(os.path.exists(metadataPath))): # EXIF Metadata
            with open(fullPath,'rb') as full:
                tags = exifread.process_file(full)
                metadata = {} 
            for tag in tags.keys():
                if tag not in ('JPEGThumbnail', 'TIFFThumbnail'):
                    metadata[tag] = str(tags[tag])
            # Custom Metadata
            metadata['File Size'] = getFileSize(fullPath)
            with open(metadataPath, 'w') as metadataFile:
                json.dump(metadata,metadataFile,indent=4)

def cleanState(): 
    if(os.path.exists(thumbDir)): 
        shutil.rmtree(thumbDir)
    if(os.path.exists(metadataDir)): 
        shutil.rmtree(metadataDir)
    for createDir in [thumbDir, metadataDir]: 
        if(not(os.path.exists(createDir))): os.mkdir(createDir)

if __name__ == '__main__':
    print('Cleaning Previous State...')
    cleanState()
    print('Making Image List!')
    makeImgList()
    print('Making Thumbnails!')
    getThumbs(check=False,size=(1600,1200),quality=66)
    print('Extracting Metadata!')
    getMetadatas(check=False)