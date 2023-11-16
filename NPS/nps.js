/* nps.js:  Javascript Engine for TheDoVlog's NPS Blogs /*
/* Author:  Timothy Do */

/* feteching parks metadata */
let parks;    
fetch('./nps.json').then(function(response){ return response.json();}).then(function(json){parks = json;});

function showRecent() {
	let recent = document.getElementById('recent');
	let recentCap = 3;
	let parksRendered = 0;
	for (let park in parks) {
		setTimeout(function () {
			console.log(`Rendered Postcard for ${parks[park]["name"]} (${parks[park]["alpha"]})`);
			recent.innerHTML += `<a href='./postcards/${park}.jpg' onmouseover=\'showVisited("${park}")\'><img class='postcard' src='./postcards/${park}.jpg'></a>`;
			parksRendered++;
		}, 1000*parksRendered);
	}
}

function showVisited(park) {
	let visited = document.getElementById('visited');
	let visitedDate = new Date(parks[park]["visited"]);
	let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	let visitedString = visitedDate.toLocaleDateString('en-US');
	visited.innerHTML = `<h2>Visited: <a href=\"https://nps.gov/${parks[park]["alpha"]}\">${parks[park]["name"]} ${parks[park]["type"]}</a> (${parks[park]["alpha"]}) on ${weekday[visitedDate.getDay()]}, ${visitedString}!`
}