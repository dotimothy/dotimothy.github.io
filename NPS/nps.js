/* nps.js:  Javascript Engine for TheDoVlog's NPS Blogs /*
/* Author:  Timothy Do */

/* feteching parks metadata */
console.log('Loading NPS Blogs with nps.js...')

function showRecent() {
	console.log('Showing Recent Adventures!!!')
	let recent = document.getElementById('recent');
	recent.innerHTML = '';
	let recentCap = 3;
	let parksRendered = 0;
	for (let park in parks) {
		//renderPostcard(park);
		setTimeout(function(){renderPostcard(park)},250*parksRendered);
		parksRendered++;
	}
}

function renderPostcard(park) {
	let recent = document.getElementById('recent');
	console.log(`Rendered Postcard for ${parks[park]["name"]} (${parks[park]["alpha"]})`);
	recent.innerHTML += `<a href='./postcards/${park}.jpg' onmouseover=\'showVisited("${park}")\'><img class='postcard' src='./postcards/${park}.jpg'></a>`;
}

function showVisited(park) {
	let visited = document.getElementById('visited');
	let visitedDate = new Date(`${parks[park]["visited"]}T00:00`);
	let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	let visitedString = visitedDate.toLocaleDateString();
	visited.innerHTML = `<h2>Visited: <a href=\"https://nps.gov/${parks[park]["alpha"]}\">${parks[park]["name"]} National ${parks[park]["type"]}</a> (${parks[park]["alpha"]}) on ${weekday[visitedDate.getDay()]}, ${visitedString}!`
}

function toGame() {
	window.open("game.html");
}


window.addEventListener('load', showRecent);
