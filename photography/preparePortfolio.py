import os

if __name__ == '__main__':
    galleries = [
        'astronomy',
        'wildlife',
    ]
    for gallery in galleries:
        print(f"Preparing {gallery} gallery!")
        pythonPath = os.path.join(os.getcwd(), gallery, 'prepareSite.py')
        exec(open(pythonPath).read())
