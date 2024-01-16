/* nps.js:  Javascript Engine for TheDoVlog's NPS Blogs /*
/* Author:  Timothy Do */

/* feteching parks metadata */
console.log('Loading NPS Blogs with nps.js...')

function showRecent() {
	console.log('Showing Recent Adventures!!!')
	let recent = document.getElementById('recent');
	recent.innerHTML = '';
	let recentCap = 4;
	for(let i = Object.keys(parks).length-1; i >= Math.max(Object.keys(parks).length-recentCap,0); i--) {
		renderPostcard(Object.keys(parks)[i]);
	}
}

function showPostcardWall() {
	console.log('Showing All Postcards!!!')
	let postcards = document.getElementById('postcards');
	postcards.innerHTML = '';
	for(let i = Object.keys(parks).length-1; i >= 0; i--) {
		renderPostcard(Object.keys(parks)[i]);
	}
}


function renderPostcard(park) {
	let container = document.getElementById('recent') == null ? document.getElementById('postcards') : document.getElementById('recent');
	console.log(`Rendered Postcard for ${parks[park]["name"]} (${parks[park]["alpha"]})`);
	container.innerHTML += `<a href='./postcards/${park}.jpg' onmouseover=\'showVisited("${park}")\'><img class='postcard' src='./postcards/${park}.jpg'></a>`;
}

function showVisited(park) {
	let visited = document.getElementById('visited');
	let visitedDate = new Date(`${parks[park]["visited"]}T00:00`);
	let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	let visitedString = visitedDate.toLocaleDateString();
	visited.innerHTML = `<h2>Visited: <a href=\"https://nps.gov/${parks[park]["alpha"]}\">${parks[park]["name"]} National ${parks[park]["type"]}</a> (${parks[park]["alpha"]}) on ${weekday[visitedDate.getDay()]}, ${visitedString}!`
}

function toGame() {
	window.open("./game/index.html");
}

function toBlogFromPostcard() {
	window.open("./index.html");
}

if(document.getElementById('recent') != null) {
	window.addEventListener('load', showRecent);
}
if(document.getElementById('postcards') != null) {
	window.addEventListener('load', showPostcardWall);
}
