const about = [
  ['Timothy Do', 'I’m a Senior Developer Evangelist at SiMa.ai in San Jose. I help developers bring physical and generative AI to the Modalix edge platform.', '../resume.html', 'View Resume', '../assets/game/img/figure.jpg'],
  ['Education', 'I earned an M.S. in Electrical and Computer Engineering from UCLA, specializing in signal processing, and a B.S. in Electrical Engineering from UC Irvine.', '../academic/index.html', 'View Research', '../assets/game/img/album/uclagrad.jpg'],
  ['Research', 'At the Irvine Computer Vision Laboratory, I led undergraduate research on spectral analysis of wildfire scenes. My interests include hyperspectral imaging, embedded IoT, and GPU optimization.', '../awards/index.html', 'View Awards', '../assets/game/img/album/icvl.jpg'],
];
const experience = [
  ['SiMa.ai', 'As Senior Developer Evangelist, I deploy physical AI applications on Modalix, build developer tools like Neat GenAI Studio, and lead workshops for customers and developers.', 'https://sima.ai/', 'Visit SiMa.ai', '../assets/game/img/album/simaaihwteam.jpg'],
  ['Computer Vision Engineering', 'At SiMa.ai I built edge demos for anomaly detection, car scratch detection, OCR verification, and change detection, with GStreamer and on-device models.', null, null, '../portfolio/images/projects/car-scratch-detector.jpg'],
  ['UCLA and UC Irvine', 'My work includes computational imaging, digital speech processing, machine learning, and spectral analysis of wildfires.', '../resume.html', 'View Resume', '../assets/game/img/album/uclagrad.jpg'],
];
const interests = [
  ['TheDoLab', 'My homelab hosts a website, a WireGuard VPN, an ML rig, a Minecraft server, and an electronics workbench for circuit design and IoT projects.', '../thedolab.html', 'Visit TheDoLab', '../assets/game/img/album/thedolab.jpg'],
  ['Photography', 'TheDoShoots collects my photography, including the night sky, wildlife, and places I’ve explored.', 'https://thedoshoots.me/', 'Open Galleries', '../assets/game/img/album/photography.jpg'],
  ['Euphonium', 'I play euphonium and enjoy making music with local ensembles.', '../euphonium/index.html', 'Visit Music Page', '../assets/game/img/album/euphonium.jpg'],
  ['Scouting', 'I earned Eagle Scout with a Bronze Palm and volunteer as a merit badge counselor in photography, electronics, astronomy, and more.', '../meritbadge/', 'Open Merit Badges', '../assets/game/img/album/bsa.jpg'],
];
const contact = [
  ['Say Hello', 'Reach out about edge AI, computer vision, a project you’d like to build together, or a brass gig.', 'mailto:timothydobsa@gmail.com', 'Send Email', '../assets/game/img/logo.png'],
  ['LinkedIn', 'Find me on LinkedIn for my professional work and updates.', 'https://www.linkedin.com/in/do-timothy/', 'Open LinkedIn', '../contact/assets/css/images/social/linkedin.png'],
  ['GitHub', 'Browse my repositories and open-source work.', 'https://github.com/dotimothy', 'Open GitHub', '../contact/assets/css/images/social/github.png'],
  ['Hugging Face', 'Find my models and machine learning projects on Hugging Face.', 'https://huggingface.co/dotimothy', 'Open Hugging Face', '../contact/assets/css/images/social/hugging-face.png'],
];
const categoryPhotos = {
  edge: 'simaaihwteam', hack: 'TheDoProGuys', research: 'icvl', imaging: 'photography',
  hardware: 'thedolab', web: 'thedolab', community: 'mentor',
};
const projects = (window.PROJECTS ?? []).map(project => [
  project.title, project.blurb, project.live ?? project.repo, project.live ? 'Open Project' : 'View Source',
  project.img ? '../portfolio/images/projects/' + project.img : '../assets/game/img/album/' + (categoryPhotos[project.cat] ?? 'thedolab') + '.jpg',
]);
export const exhibits = { about, experience, projects, interests, contact };
