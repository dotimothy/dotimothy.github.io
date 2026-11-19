/*
 * Project data for timothydo.me
 * Used by the main page (featured projects) and portfolio/index.html (all projects).
 *
 * To add a project, copy one entry and edit it:
 *   id        unique, lowercase, used in links like portfolio/#project-my-project
 *   title     name shown in the list
 *   cat       one of the keys in PROJECT_CATEGORIES below
 *   year      year the project started
 *   blurb     one or two plain sentences
 *   tags      short list of tools or techniques
 *   img       file in portfolio/images/projects/ (800x450 JPG), or null for the category artwork
 *   live      optional link to a demo or project page, with liveLabel for the button text
 *   repo      optional link to the source
 *   featured  true to also show it on the main page
 */
window.PROJECT_CATEGORIES = [
  { key: 'edge',      label: 'Edge AI',              icon: 'chip',    blurb: 'On-device AI for the SiMa.ai Modalix' },
  { key: 'hack',      label: 'Hackathons',           icon: 'bolt',    blurb: 'Built against the clock' },
  { key: 'research',  label: 'Research and ML',      icon: 'flask',   blurb: 'Coursework, research and model experiments' },
  { key: 'imaging',   label: 'Imaging and Astronomy', icon: 'camera', blurb: 'Photography, image processing and the night sky' },
  { key: 'hardware',  label: 'Hardware',             icon: 'wave',    blurb: 'Raspberry Pi, Arduino, ESP32 and signal processing' },
  { key: 'web',       label: 'Web and Games',        icon: 'gamepad', blurb: 'Browser apps, games and homelab tools' },
  { key: 'community', label: 'Community',            icon: 'people',  blurb: 'Sites and apps made for schools, clubs and neighbors' }
];

window.PROJECTS = [
  /* ---------- Edge AI on SiMa.ai Modalix ---------- */
  {
    id: 'neat-genai-studio', title: 'Neat GenAI Studio', cat: 'edge', year: 2026, featured: true,
    blurb: 'An on-device GenAI studio for the SiMa.ai Modalix. Chat with language and vision-language models, load new ones from Hugging Face without restarting, transcribe speech with Whisper, hear replies spoken back, and search local documents with RAG.',
    tags: ['Python', 'LLM', 'VLM', 'Whisper', 'RAG', 'Text to Speech'],
    img: 'neat-genai-studio.jpg',
    live: 'https://timothydo.me/neat-genai-studio/', liveLabel: 'Open Project Page',
    repo: 'https://github.com/dotimothy/neat-genai-studio'
  },
  {
    id: 'neat-decision-studio', title: 'Neat Decision Studio', cat: 'edge', year: 2026, featured: true,
    blurb: 'Compiles Laya “System 1” decision models for the Modalix MLA and runs them through a standalone C++ runtime. The web app answers a yes-or-no projection again on every keystroke, in about 19 ms per decision, and plays eight games in real time.',
    tags: ['Python', 'C++', 'Laya', 'Model Compilation'],
    img: 'neat-decision-studio.jpg',
    live: 'https://timothydo.me/neat-decision-studio/', liveLabel: 'Open Project Page',
    repo: 'https://github.com/dotimothy/neat-decision-studio'
  },
  {
    id: 'neat-dino-studio', title: 'Neat DINO Studio', cat: 'edge', year: 2026, featured: true,
    blurb: 'Open-vocabulary object detection with Grounding DINO on the Modalix MLA. Type or say what to find and get boxes from a photo or a live webcam; Whisper and a small language model turn a spoken request into a prompt.',
    tags: ['Python', 'Grounding DINO', 'Whisper', 'Open-Vocabulary Detection'],
    img: 'neat-dino-studio.jpg',
    repo: 'https://github.com/dotimothy/neat-dino-studio'
  },
  {
    id: 'neat-change-studio', title: 'Neat Change Studio', cat: 'edge', year: 2026,
    blurb: 'Before-and-after change detection on the Modalix MLA, with a web demo. Choose CYWS, trained for change detection; DINOv2, zero-shot; or C-3PO, trained change segmentation.',
    tags: ['Python', 'CYWS', 'DINOv2', 'Flask'],
    img: 'neat-change-studio.jpg',
    live: 'https://timothydo.me/neat-change-studio/', liveLabel: 'Open Project Page',
    repo: 'https://github.com/dotimothy/neat-change-studio'
  },
  {
    id: 'neat-studio-launcher', title: 'Neat Studio Launcher', cat: 'edge', year: 2026,
    blurb: 'The out-of-box home for the Neat studios on Modalix: a showcase, one-click install and launch, and a manager with live logs, update checks and a shell on the board.',
    tags: ['Python', 'JavaScript', 'Device Manager'],
    img: 'neat-studio-launcher.jpg',
    repo: 'https://github.com/dotimothy/neat-studio-launcher'
  },
  {
    id: 'neat-apps-launcher', title: 'Neat Apps Launcher', cat: 'edge', year: 2026,
    blurb: 'One page to install, run and watch every sima-neat example app on Modalix. It fetches the models, runs each app on the MLA and plays the results live in Neat Insight.',
    tags: ['Python', 'JavaScript', 'YOLO'],
    img: 'neat-apps-launcher.jpg',
    repo: 'https://github.com/dotimothy/neat-apps-launcher'
  },
  {
    id: 'car-scratch-detector', title: 'Car Scratch Detector', cat: 'edge', year: 2026,
    blurb: 'Car and scratch detection on the Modalix DevKit with a web app. It works on a live USB webcam or uploaded photos and switches between YOLO26n and YOLOv9s, all running locally.',
    tags: ['Python', 'YOLO', 'Flask'],
    img: 'car-scratch-detector.jpg',
    repo: 'https://github.com/dotimothy/car-scratch-detector'
  },
  {
    id: 'polima', title: 'PoLiMa', cat: 'edge', year: 2026,
    blurb: 'Robot policy compilation and deployment for the SiMa.ai Modalix, with the ACT, SmolVLA and GR00T training stacks.',
    tags: ['Python', 'Robot Policies', 'ACT', 'SmolVLA', 'GR00T'],
    img: null,
    repo: 'https://github.com/dotimothy/SiMaSandbox'
  },

  /* ---------- Hackathons ---------- */
  {
    id: 'dispatchiq', title: 'DispatchIQ', cat: 'hack', year: 2026, featured: true,
    blurb: 'Multilingual call documentation support for emergency dispatchers, built for SpeedHacks 2026. Local models transcribe and translate the call, then suggest each form field with a confidence score and the quote it came from. A human approves everything.',
    tags: ['Python', 'Whisper', 'Laya', 'Piper TTS'],
    img: null,
    repo: 'https://github.com/dotimothy/speedrun-hacks-26'
  },
  {
    id: 'playlattice', title: 'PlayLattice', cat: 'hack', year: 2026, featured: true,
    blurb: 'An autonomous basketball clipping engine built for the YC Naive Hackathon. Local video analysis and a crew of agents select moments, prepare captions and create portrait prediction quizzes.',
    tags: ['Python', 'Video Analysis', 'Agents'],
    img: 'playlattice.jpg',
    live: 'https://playlattice-project.pages.dev', liveLabel: 'Open Project Site',
    repo: 'https://github.com/dotimothy/yc-naive-hackathon'
  },
  {
    id: 'afterhello', title: 'AfterHello', cat: 'hack', year: 2026,
    blurb: 'Built with a team for VexoHacks 2026. A Vexo Open band captures a conversation, and ending it creates a contact with the person’s name, company, role, notes and the promises you made.',
    tags: ['Python', 'Pipecat', 'Deepgram'],
    img: 'afterhello.jpg',
    repo: 'https://github.com/raymondymmak/vexo-hacks'
  },
  {
    id: 'gratition', title: 'Gratition', cat: 'hack', year: 2020,
    blurb: 'A mental health check-in web app from the Cisco Webex Hackathon 2020. It asks about your day and answers with a spoken message, with adjustable voice and lighting.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Speech Synthesis'],
    img: 'gratition.jpg',
    live: 'https://timothydo.me/gratition/', liveLabel: 'Open the App',
    repo: 'https://github.com/dotimothy/gratition'
  },
  {
    id: 'hacknerd-schedule', title: 'Hacknerds Schedule', cat: 'hack', year: 2019,
    blurb: 'My first hackathon project: a Java schedule program written at MVHacks II.',
    tags: ['Java'],
    img: null,
    repo: 'https://github.com/dotimothy/HacknerdSchedule'
  },

  /* ---------- Research and ML ---------- */
  {
    id: 'ruhuman', title: 'RuHuman', cat: 'research', year: 2023, featured: true,
    blurb: 'A multimodal audio verification system that decides whether speech comes from a live human or an audio deepfake, evaluated with the ASVspoof 2021 metrics. Built for ECE 202A Embedded Systems at UCLA.',
    tags: ['Python', 'Audio Deepfake Detection', 'ASVspoof'],
    img: 'ruhuman.jpg',
    live: 'https://timothydo.me/RuHuman/', liveLabel: 'Open Project Page',
    repo: 'https://github.com/dotimothy/RuHuman'
  },
  {
    id: 'thedopro', title: 'The Do-Pro', cat: 'research', year: 2022, featured: true,
    blurb: 'A simplistic stereo-vision camera, and my UC Irvine senior design project for 2022–2023. I led a team of four under Professor Glenn Healey.',
    tags: ['Python', 'Stereo Vision', 'Disparity Mapping'],
    img: 'thedopro.jpg',
    live: 'https://timothydo.me/TheDoPro/', liveLabel: 'Open Project Page',
    repo: 'https://github.com/dotimothy/TheDoPro'
  },
  {
    id: 'amr', title: 'Automatic Modulation Recognition', cat: 'research', year: 2024,
    blurb: 'End-to-end convolutional networks that recognize modulation schemes from I/Q samples on the RadioML and HisarMod datasets, reaching 93.2% test accuracy at high SNR. UCLA ECE 239AS Modern Wireless Communications.',
    tags: ['Python', 'MATLAB', 'PyTorch'],
    img: 'amr.jpg',
    repo: 'https://github.com/dotimothy/ECE239AS-MWC-AMR'
  },
  {
    id: 'dialect', title: 'Dialect Region Classification', cat: 'research', year: 2024,
    blurb: 'Classifies the dialect region of African American speakers in the CORAAL dataset with an XGBoost classifier on openSMILE and GFCC features, at 95% test accuracy. A team project for UCLA M214A Digital Speech Processing.',
    tags: ['Python', 'Librosa', 'openSMILE', 'XGBoost'],
    img: null,
    live: 'https://timothydo.me/M214A-Project/', liveLabel: 'Open the Notebook',
    repo: 'https://github.com/dotimothy/M214A-Project'
  },
  {
    id: 'eeg', title: 'EEG Action Classification', cat: 'research', year: 2024,
    blurb: 'Compares neural network architectures for classifying a subject’s actions from BCI EEG recordings. The best reached 75.4% test accuracy. A team project for UCLA C247 Neural Networks and Deep Learning.',
    tags: ['Python', 'TensorFlow', 'PyTorch'],
    img: 'eeg.jpg',
    repo: 'https://github.com/dotimothy/C247-Project'
  },
  {
    id: 'colorization', title: 'Image Colorization', cat: 'research', year: 2022,
    blurb: 'Colorizing grayscale images with GANs and autoencoder networks. UC Irvine EECS 195 research with Matthew Prata, Jorge Ragde and Alex Wang.',
    tags: ['Python', 'GAN', 'Autoencoder'],
    img: 'colorization.jpg',
    repo: 'https://github.com/dotimothy/EECS195-Colorization'
  },
  {
    id: 'duckdetector', title: 'DuckDetector', cat: 'research', year: 2024,
    blurb: 'A fun multi-platform app for automatically detecting ducks, with a YOLOv8n model trained on Open Images.',
    tags: ['Python', 'YOLOv8', 'Jupyter'],
    img: null,
    live: 'https://timothydo.me/DuckDetector/', liveLabel: 'Open the App',
    repo: 'https://github.com/dotimothy/DuckDetector'
  },
  {
    id: 'acceleration', title: 'Acceleration Methods', cat: 'research', year: 2023,
    blurb: 'A notebook case study of hardware acceleration, from a single CPU core to multi-core and GPU: NumPy against CuPy, and OpenCV against Kornia.',
    tags: ['Python', 'CuPy', 'Kornia', 'Jupyter'],
    img: null,
    repo: 'https://github.com/dotimothy/AccelerationMethods'
  },
  {
    id: 'classifiers', title: 'Classifiers', cat: 'research', year: 2024,
    blurb: 'An overview of classification models on popular datasets, including MNIST and CIFAR-10.',
    tags: ['Python', 'Jupyter'],
    img: null,
    repo: 'https://github.com/dotimothy/Classifiers'
  },
  {
    id: 'depthscripts', title: 'DepthScripts', cat: 'research', year: 2024,
    blurb: 'A collection of scripts for working with Apple Depth Pro and other depth models.',
    tags: ['Python', 'Depth Estimation'],
    img: null,
    repo: 'https://github.com/dotimothy/DepthScripts'
  },

  /* ---------- Imaging and astronomy ---------- */
  {
    id: 'thedoshoots', title: 'TheDoShoots', cat: 'imaging', year: 2025, featured: true,
    blurb: 'My photography portfolio. Scripts build each gallery page from a template, and a small Flask tool makes it easier to edit image EXIF data.',
    tags: ['Python', 'Flask', 'HTML'],
    img: 'thedoshoots.jpg',
    live: 'https://thedoshoots.me/', liveLabel: 'Visit TheDoShoots',
    repo: 'https://github.com/dotimothy/photography'
  },
  {
    id: 'gallery', title: 'Gallery', cat: 'imaging', year: 2021,
    blurb: 'A web app that displays your images and their metadata just by putting them in a folder, with an immersive 3D sphere view and a classic 2D grid.',
    tags: ['JavaScript', 'Python'],
    img: null,
    live: 'https://timothydo.me/gallery/', liveLabel: 'Open the Gallery',
    repo: 'https://github.com/dotimothy/gallery'
  },
  {
    id: 'astronomy', title: 'Astronomy', cat: 'imaging', year: 2024,
    blurb: 'Exploring space with stargazing, data and programming: a light pollution visualization, an astrophotography gallery and an image stacking notebook.',
    tags: ['Jupyter', 'Python', 'VIIRS Data'],
    img: 'astronomy.jpg',
    live: 'https://timothydo.me/astronomy/', liveLabel: 'Open the Site',
    repo: 'https://github.com/dotimothy/astronomy'
  },
  {
    id: 'imagestacker', title: 'ImageStacker', cat: 'imaging', year: 2025,
    blurb: 'A Python engine for stacking images for astrophotography.',
    tags: ['Python'],
    img: null,
    repo: 'https://github.com/dotimothy/ImageStacker'
  },
  {
    id: 'remoteshutter', title: 'RemoteShutter', cat: 'imaging', year: 2025,
    blurb: 'A wireless remote shutter for DSLRs built on an ESP32 and a relay, made for steadier astrophotography.',
    tags: ['ESP32', 'Arduino'],
    img: 'remoteshutter.jpg',
    repo: 'https://github.com/dotimothy/RemoteShutter'
  },
  {
    id: 'thedopixel', title: 'TheDoPixel', cat: 'imaging', year: 2026,
    blurb: 'A self-hosted media relay that moves photos, RAW images and videos from server folders to a Google Pixel, then tracks each file through to Google Photos without deleting the originals.',
    tags: ['Python', 'Android', 'ADB'],
    img: null,
    repo: 'https://github.com/dotimothy/TheDoPixel'
  },
  {
    id: 'photolab-js', title: 'PhotoLab JS', cat: 'imaging', year: 2020,
    blurb: 'Pixel manipulation in the browser: edge detection, inversion and color channel swaps.',
    tags: ['JavaScript'],
    img: null,
    live: 'https://timothydo.me/PhotoLab_JS/', liveLabel: 'Open the App',
    repo: 'https://github.com/dotimothy/PhotoLab_JS'
  },
  {
    id: 'photolabserver', title: 'PhotoLabServer', cat: 'imaging', year: 2022,
    blurb: 'An image processing web server powered by a MATLAB engine.',
    tags: ['Python', 'MATLAB', 'Flask', 'OpenCV'],
    img: 'photolabserver.jpg',
    repo: 'https://github.com/dotimothy/PhotoLabServer'
  },
  {
    id: 'refreshvideos', title: 'RefreshVideos', cat: 'imaging', year: 2020,
    blurb: 'An in-browser video player that can play high refresh rate video at high resolutions.',
    tags: ['JavaScript', 'HTML'],
    img: null,
    live: 'https://timothydo.me/RefreshVideos/', liveLabel: 'Open the Player',
    repo: 'https://github.com/dotimothy/RefreshVideos'
  },

  /* ---------- Hardware ---------- */
  {
    id: 'pifmmorse', title: 'PiFmMorse', cat: 'hardware', year: 2020,
    blurb: 'A Morse code FM radio transmitter for the Raspberry Pi. Type a message, pick a frequency and tune a radio to hear it.',
    tags: ['C++', 'Python', 'Raspberry Pi'],
    img: 'pifmmorse.jpg',
    live: 'https://timothydo.me/PiFmMorse/', liveLabel: 'Open Project Page',
    repo: 'https://github.com/dotimothy/PiFmMorse'
  },
  {
    id: 'rpimorse', title: 'RPiMorse', cat: 'hardware', year: 2020,
    blurb: 'Converts typed text to Morse code, printed to the console on any device with Python or flashed on an LED through a Raspberry Pi GPIO pin.',
    tags: ['Python', 'Raspberry Pi', 'GPIO'],
    img: 'rpimorse.jpg',
    live: 'https://timothydo.me/RPiMorse/', liveLabel: 'Open Project Page',
    repo: 'https://github.com/dotimothy/RPiMorse'
  },
  {
    id: 'picotemp', title: 'picoTemp', cat: 'hardware', year: 2021,
    blurb: 'An LED temperature indicator on the Raspberry Pi Pico. Above the threshold it lights red, sounds a buzzer and switches on a fan through a relay.',
    tags: ['MicroPython', 'Raspberry Pi Pico'],
    img: 'picotemp.jpg',
    live: 'https://timothydo.me/picoTemp/', liveLabel: 'Open Project Page',
    repo: 'https://github.com/dotimothy/picoTemp'
  },
  {
    id: 'timduino', title: 'TimduinoTutorials', cat: 'hardware', year: 2020,
    blurb: 'Experiments with microcontrollers, covering the Arduino Uno R3 and the ESP32.',
    tags: ['C++', 'Arduino', 'ESP32'],
    img: 'timduino.jpg',
    live: 'https://timothydo.me/TimduinoTutorials/', liveLabel: 'Open Project Page',
    repo: 'https://github.com/dotimothy/TimduinoTutorials'
  },
  {
    id: 'tpiopi', title: 'TPIOPi', cat: 'hardware', year: 2020,
    blurb: 'Quick Raspberry Pi experiments with the GPIO pins.',
    tags: ['Python', 'Raspberry Pi', 'GPIO'],
    img: null,
    repo: 'https://github.com/dotimothy/TPIOPi'
  },
  {
    id: 'speechtofmpi', title: 'SpeechtoFmPi', cat: 'hardware', year: 2020,
    blurb: 'A text-to-speech FM transmitter for the Raspberry Pi.',
    tags: ['C++', 'Raspberry Pi'],
    img: null,
    repo: 'https://github.com/dotimothy/SpeechtoFmPi'
  },
  {
    id: 'micromouse', title: 'MicroMouse UCI', cat: 'hardware', year: 2020,
    blurb: 'A team repository for an Arduino micromouse robot that solves mazes, with Tiffany Mejia, Alex Wang and Christina Wong.',
    tags: ['Arduino'],
    img: null,
    repo: 'https://github.com/dotimothy/MicroMouseUCI'
  },
  {
    id: 'cdsp', title: 'cDSP', cat: 'hardware', year: 2021,
    blurb: 'Digital signal processing techniques written in C.',
    tags: ['C', 'DSP'],
    img: null,
    repo: 'https://github.com/dotimothy/cDSP'
  },
  {
    id: 'pddsp', title: 'pdDSP', cat: 'hardware', year: 2021,
    blurb: 'Pure Data experiments for learning digital signal processing.',
    tags: ['Pure Data', 'DSP'],
    img: null,
    repo: 'https://github.com/dotimothy/pdDSP'
  },

  /* ---------- Web and games ---------- */
  {
    id: 'humansvsbugs', title: 'HumansVsBugs', cat: 'web', year: 2026, featured: true,
    blurb: 'A browser tower defense game with procedural Three.js graphics and synthesized audio. Defend sleeping humans, lead an infestation against a CPU, or experiment in Sandbox.',
    tags: ['JavaScript', 'Three.js', 'Web Audio'],
    img: 'humansvsbugs.jpg',
    live: 'https://timothydo.me/HumansVsBugs/', liveLabel: 'Play the Game',
    repo: 'https://github.com/dotimothy/HumansVsBugs'
  },
  {
    id: 'anteatings', title: 'Peter’s Anteatings', cat: 'web', year: 2021,
    blurb: 'A web game for UC Irvine students: squash the ants before they reach the cookies, across three difficulty levels. Made with Tiffany Mejia and Christina Wong.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    img: 'anteatings.jpg',
    live: 'https://timothydo.me/anteatings/', liveLabel: 'Play the Game',
    repo: 'https://github.com/dotimothy/anteatings'
  },
  {
    id: 'defendcovid', title: 'DefendCOVID', cat: 'web', year: 2020,
    blurb: 'A browser game made to kill time during quarantine.',
    tags: ['JavaScript'],
    img: 'defendcovid.jpg',
    live: 'https://timothydo.me/DefendCOVID/', liveLabel: 'Play the Game',
    repo: 'https://github.com/dotimothy/DefendCOVID'
  },
  {
    id: 'digdogesj', title: 'DigDogeSJ', cat: 'web', year: 2021,
    blurb: 'A crypto pool dashboard that uses the unMineable and CoinGecko APIs to show the live pool balance, coin prices and value in dollars, with a battery-saving sleep mode.',
    tags: ['JavaScript', 'REST APIs'],
    img: null,
    live: 'https://timothydo.me/DigDogeSJ/', liveLabel: 'Open the Dashboard',
    repo: 'https://github.com/dotimothy/DigDogeSJ'
  },
  {
    id: 'memocate', title: 'Memocate', cat: 'web', year: 2021,
    blurb: 'A useless web program that tries to allocate all of your memory, in JavaScript, C and Python. Use at your own discretion.',
    tags: ['JavaScript', 'C', 'Python'],
    img: null,
    live: 'https://timothydo.me/memocate/', liveLabel: 'Open the Demo',
    repo: 'https://github.com/dotimothy/memocate'
  },
  {
    id: 'cybernotes', title: 'Cybernotes', cat: 'web', year: 2019,
    blurb: 'An online interactive video conferencing platform for musicians.',
    tags: ['Node.js', 'JavaScript'],
    img: null,
    live: 'https://timothydo.me/Cybernotes/', liveLabel: 'Open Project Page',
    repo: 'https://github.com/dotimothy/Cybernotes'
  },
  {
    id: 'wollabs', title: 'WOLLabs', cat: 'web', year: 2023,
    blurb: 'A multi-user interface for Wake-on-LAN and SSH, for waking and reaching machines in a homelab.',
    tags: ['Python'],
    img: null,
    repo: 'https://github.com/dotimothy/WOLLabs'
  },
  {
    id: 'thedolab', title: 'TheDoLab', cat: 'web', year: 2022,
    blurb: 'The website for TheDoLab, my homelab.',
    tags: ['HTML'],
    img: 'thedolab.jpg',
    live: 'https://timothydo.me/thedolab', liveLabel: 'Visit TheDoLab',
    repo: 'https://github.com/dotimothy/TheDoLab'
  },

  /* ---------- Community ---------- */
  {
    id: 'scucomplexfires', title: 'SCU Complex Fires', cat: 'community', year: 2020,
    blurb: 'A clean, lightweight site with essential information, resources and links about the SCU Lightning Complex fires, with a dark mode to save battery. Made with Bennett Nguyen, Wilson Nguyen and Jason Vu.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    img: 'scucomplexfires.jpg',
    live: 'https://timothydo.me/scucomplexfires/', liveLabel: 'Open the Site',
    repo: 'https://github.com/dotimothy/scucomplexfires'
  },
  {
    id: 'evhub', title: 'EVHub', cat: 'community', year: 2019,
    blurb: 'An all-in-one Android app for Evergreen Valley High School with schedules, classes, the district calendar, clubs and a social tab. I was developer lead on a team of five.',
    tags: ['Java', 'Android'],
    img: 'evhub.jpg',
    live: 'https://timothydo.me/EVHub/', liveLabel: 'Open Project Page',
    repo: 'https://github.com/dotimothy/EVHub'
  },
  {
    id: 'meritbadge', title: 'Programming Merit Badge', cat: 'community', year: 2021,
    blurb: 'The code I used to demonstrate debugging techniques during a Programming merit badge session in August 2021.',
    tags: ['HTML', 'JavaScript'],
    img: 'meritbadge.jpg',
    live: 'https://timothydo.me/meritbadge/', liveLabel: 'Open the Site',
    repo: 'https://github.com/dotimothy/meritbadge'
  },
  {
    id: 'ipcuci', title: 'IPC at UCI', cat: 'community', year: 2021,
    blurb: 'The website for the Institute of Printed Circuits club at UC Irvine.',
    tags: ['HTML', 'CSS'],
    img: 'ipcuci.jpg',
    live: 'https://ipcuci.github.io', liveLabel: 'Open the Site',
    repo: 'https://github.com/dotimothy/ipcuci'
  },
  {
    id: 'rmp-facilities', title: 'RMP Facilities Map', cat: 'community', year: 2020,
    blurb: 'Datasets, maps and visualizations of Risk Management Plan facilities in Los Angeles County, a companion to UC Irvine’s Environmental Injustice course. Maintained with Tim Schütz and Rieko Konishi.',
    tags: ['HTML', 'Mapping'],
    img: null,
    live: 'https://timothydo.me/rmp-facilities-los-angeles-county/', liveLabel: 'Open the Site',
    repo: 'https://github.com/dotimothy/rmp-facilities-los-angeles-county'
  }
];
