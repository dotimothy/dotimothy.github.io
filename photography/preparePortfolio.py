import os
import shutil
import git
import tqdm
import webbrowser
import argparse
import subprocess
import socket
import time # We'll still use a small sleep within the polling loop

GALLERY_REPO = 'https://github.com/dotimothy/gallery.git'

class color:
     BOLD = '\033[1m'
     END = '\033[0m'

def is_port_open(host, port, timeout=1):
    """
    Checks if a given TCP port on a host is open.
    Returns True if open, False otherwise.
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    try:
        sock.connect((host, port))
        return True
    except socket.error:
        return False
    finally:
        sock.close()

def updateGalleryRepo():
    os.makedirs('tmp', exist_ok=True)
    if not os.path.exists('./tmp/gallery'):
        print(f"{color.BOLD}Cloning gallery repo from {GALLERY_REPO}{color.END}")
        git.Repo.clone_from(GALLERY_REPO, 'tmp/gallery')
    else:
        print(f"Gallery repo ({GALLERY_REPO}) already exists. Pulling latest changes...")
        repo = git.Repo('./tmp/gallery')
        repo.remotes.origin.pull()

def prepareGallery(gallery,title='📷 Gallery Template!!! 📷',modifyGPS=False):
        print(f"{color.BOLD}Preparing {gallery} gallery!{color.END}")
        htmlPath = f'./{gallery}/index.html'
        pythonPath = f'./{gallery}/prepareSite.py'
        fullsPath = f'./{gallery}/fulls'
        if(modifyGPS):
             print(f"{color.BOLD} Modifying EXIF of Images!!!{color.END}")
             print(f"{color.BOLD} Please close the browser tab and press Ctrl+C in this terminal when finished.{color.END}")
             
             original_cwd = os.getcwd() # Save original current working directory
             os.chdir('./tmp/gallery')

             # Start the Flask server in a non-blocking way
             # We assume prepareExif.py starts a Flask server on port 8000
             # We'll redirect stdout/stderr to hide Flask's own output if desired,
             # or capture it to check for "running on" message.
             # For simplicity, we'll let it print to the console.
             print("Starting EXIF modification server...")
             server_process = subprocess.Popen(
                 ['python', 'prepareExif.py', '--fulls', f'../../{fullsPath}'],
                 # Optional: If you want to suppress Flask output or read it:
                 # stdout=subprocess.PIPE, stderr=subprocess.PIPE
             )

             # Poll until the server's port is open
             host = '127.0.0.1'
             port = 8000
             max_retries = 30 # Try for up to 30 seconds (30 * 1 second delay)
             for i in range(max_retries):
                 if is_port_open(host, port):
                     print(f"Flask server detected on {host}:{port}. Opening browser...")
                     webbrowser.open_new_tab(f'http://{host}:{port}')
                     break
                 else:
                     print(f"Waiting for Flask server to start... (Attempt {i+1}/{max_retries})")
                     time.sleep(1) # Wait 1 second before retrying
             else:
                 print(f"{color.BOLD}Warning: Flask server did not start on {host}:{port} within the expected time.{color.END}")

             # This will block until the server process terminates (e.g., by user Ctrl+C)
             server_process.wait()
             print("EXIF modification server stopped. Continuing script...")
             os.chdir(original_cwd) # Go back to the original working directory
        
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
    parser = argparse.ArgumentParser(description='Flask EXIF Editor Application.')
    parser.add_argument('--exif', action='store_true', help='Flag to launch the EXIF Modification Web App')
    args = parser.parse_args()

    print(f"{color.BOLD}*** Preparing TheDoShoots Photography Portfolio ***{color.END}\n")
    print(f"{color.BOLD}*** Step 1: Basing Template gallery repo *** {color.END}")
    updateGalleryRepo()
    print(f"\n{color.BOLD}*** Step 2: Building galleries ***{color.END}\n")
    galleries = ['astronomy','wildlife']
    titles = ['🌌 Astronomy Gallery!!! 🌌', '🐿️ Wildlife Gallery!!! 🐿️']
    for gallery,title in zip(galleries,titles):
          prepareGallery(gallery,title, args.exif)
    print(f"{color.BOLD}All galleries prepared!{color.END}")