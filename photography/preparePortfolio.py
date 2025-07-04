import os
import shutil
import git
import tqdm

GALLERY_REPO = 'https://github.com/dotimothy/gallery.git'

class color:
     BOLD = '\033[1m'
     END = '\033[0m'

def updateGalleryRepo():
    os.makedirs('tmp', exist_ok=True)
    if not os.path.exists('./tmp/gallery'):
        print(f"{color.BOLD}Cloning gallery repo from {GALLERY_REPO}{color.END}")
        git.Repo.clone_from(GALLERY_REPO, 'tmp/gallery')
    else:
        print(f"Gallery repo ({GALLERY_REPO}) already exists. Pulling latest changes...")
        repo = git.Repo('./tmp/gallery')
        repo.remotes.origin.pull()

def prepareGallery(gallery,title='📷 Gallery Template!!! 📷'):
        print(f"{color.BOLD}Preparing {gallery} gallery!{color.END}")
        htmlPath = f'./{gallery}/index.html'
        pythonPath = f'./{gallery}/prepareSite.py'
        shutil.copyfile('./tmp/gallery/index.html', htmlPath)
        with open(htmlPath, 'r') as file:
            content = file.read()
        content = content.replace('📷 Gallery Template!!! 📷', title)
        content = content.replace('📷',title[0])
        with open(htmlPath, 'w') as file:
            file.write(content)
        shutil.copyfile('./tmp/gallery/prepareSite.py', pythonPath)
        os.chdir(f'./{gallery}')
        os.system(f'python prepareSite.py')
        os.chdir('..')
        print()


if __name__ == '__main__':
    print(f"{color.BOLD}*** Preparing TheDoShoots Photography Portfolio ***{color.END}\n")
    print(f"{color.BOLD}*** Step 1: Basing Template gallery repo *** {color.END}")
    updateGalleryRepo()
    print(f"\n{color.BOLD}*** Step 2: Building galleries ***{color.END}\n")
    galleries = ['astronomy','wildlife']
    titles = ['🌌 Astronomy Gallery!!! 🌌', '🐿️ Wildlife Gallery!!! 🐿️']
    for gallery,title in zip(galleries,titles):
          prepareGallery(gallery,title)
    print(f"{color.BOLD}All galleries prepared!{color.END}")
          

