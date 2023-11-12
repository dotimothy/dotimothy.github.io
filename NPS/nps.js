/* nps.js:  Javascript Engine for TheDoVlog's NPS Blogs /*
/* Author:  Timothy Do */

let parks = {
	Cabrillo: {
		name: 'Cabrillo',
		visited: '2023-02-26'
	},
	RosieTheRiveter: {
		name: 'Rosie the Riveter',
		visited: '2023-04-01'
	},
	PointReyes: {
		name: 'Point Reyes',
		visited: '2023-08-07'
	},
	Whiskeytown: {
		name: 'Whiskeytown',
		visited: '2023-09-02'
	},
	Lassen: {
		name: 'Lassen Volcanic',
		visited: '2023-09-03'
	},
	SantaMonicaMountains: {
		name: 'Santa Monica Mountains',
		visited: '2023-10-29'
	},
	FortPoint: {
		name: 'Fort Point',
		visited: '2023-11-10'
	},
	GoldenGate: {
		name: 'Golden Gate',
		visited: '2023-11-10'
	},
	EugeneONeil: {
		name: 'Eugene O\' Neil',
		visited: '2023-11-11'
	}
};

function showRecent() {
	let recent = document.getElementById('recent');
	let recentCap = 3;
	for (let park in parks) {
		console.log(park);
		recent.innerHTML += `<a href='./postcards/${park}.jpg''><img class='postcard' src='./postcards/${park}.jpg'></a>`;
	}
}