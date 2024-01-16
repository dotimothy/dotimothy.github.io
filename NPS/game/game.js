/* NPS Alpha Code Guessing Game Engine */
/* Author: Timothy Do (@dotimothy) */

/* Variables */
let randIndex = 0;
let park = document.getElementById('parkContainer');
let gen = document.getElementById('gen');
let guess = document.getElementById('guessCode');
let code = document.getElementById('code');
let maxTries = 3;
let tries = maxTries;
let counter = document.getElementById('counter');
let ding = document.getElementById('ding');
let sizzle = document.getElementById('sizzle');
let numPoints = 0;
let points = document.getElementById('points');

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

function toBlog() {
  window.open("../index.html");
}

function playSound(sound) {
  sound.volume = 0.25;
  sound.currentTime = 0;
  sound.play();
}

function updatePoints() {
  points.innerHTML = `<h3>Points: ${numPoints}</h3>`;
}

function displayRules() {
  playSound(ding)
  let rules = "Read the Alpha Code Conventions:\n\n";
  rules += "1. If a NPS Unit has One Word, then it's corresponding Alpha Code is the First Four Letters of that Word. (Ex: Arches -> ARCH)\n\n";
  rules += "2. If a NPS Unit has Two Words or more, then it's corresponding Alpha Code is the First Two Letters of the First Two Words. (Ex: Golden Gate -> GOGA)\n\n";
  rules += "3. If the Alpha Code doesn't follow convention, it usually has to do with the historical significance of the park. (noted when played).\n\n";
  rules += `Guess in Under ${maxTries} Tries to Get a Point. Special Cases get 2 Points. Good Luck!`;
  alert(rules);
}

function generatePark() {
  playSound(sizzle);
  gen.hidden = true;
  guess.hidden = false;
  counter.hidden = false;
	park.innerHTML = "";
	randIndex = Math.floor((gameData.length)*Math.random());
	park.innerHTML = `<h2>Park Name: ${toTitleCase(gameData[randIndex]["Name"])} ${typeToWord[gameData[randIndex]["Type"]]}</h2>\n`;
  tries = maxTries;
  updateTryCounter();
  return `${toTitleCase(gameData[randIndex]["Name"])} ${typeToWord[gameData[randIndex]["Type"]]}`;
}

function updateTryCounter() {
  counter.innerHTML = `<h2>Tries: ${tries}</h2>`;
}

function showAnswer() {
  let correctCode = gameData[randIndex]["Park Code"];
  gen.innerHTML = "Generate Another Park";
  gen.hidden = false;
  code.value = "";
  guess.hidden = true;
  counter.hidden = true;
  park.innerHTML =  `<h2>Park Name: ${toTitleCase(gameData[randIndex]["Name"])} ${typeToWord[gameData[randIndex]["Type"]]} (${correctCode})</h2>\n`;
  park.innerHTML += `<iframe scrolling="no" class="parkSite" width="100%" src="https://nps.gov/${gameData[randIndex]['Park Code']}"></iframe>`;
}



function correct() {
  playSound(ding);
  let correctCode = gameData[randIndex]["Park Code"];
  alert(`Correct! The Correct Code is ${correctCode}.`);
  showAnswer();
  numPoints += 1;
  updatePoints();
}

function incorrect() {
  playSound(sizzle);
  alert("Incorrect. Try Again.");
  
}

function failure() {
  playSound(sizzle);
  let correctCode = gameData[randIndex]["Park Code"];
  alert(`All Guesses are Out. The Correct Code is ${correctCode}`);
  showAnswer();
  
}


function verifyPark() {
  let parkGuess = code.value.toUpperCase();
  let correctCode = gameData[randIndex]["Park Code"];
  if(correctCode == parkGuess) {
    correct();
  }
  else if(parkGuess.length == 0)
  {
    playSound(sizzle);
    alert("Nothing Entered. Try Again.");
  }
  else {
    tries = tries - 1;
    updateTryCounter();
    if(tries == 0) {
      failure();
    }
    else {
      incorrect();
    }
  }
}

