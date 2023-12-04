/* NPS Alpha Code Guessing Game Engine */

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

function toBlog() {
  window.open("index.html");
}

function displayRules() {
  let rules = "Read the Alpha Code Conventions:\n\n";
  rules += "1. If a NPS Unit has One Word, then it's corresponding Alpha Code is the First Four Letters of that Word. (Ex: Arches -> ARCH)\n\n";
  rules += "2. If a NPS Unit has Two Words or more, then it's corresponding Alpha Code is the First Two Letters of the First Two Words. (Ex: Golden Gate -> GOGA)\n\n";
  rules += "3. If the Alpha Code doesn't follow convention, it usually has to do with the historical significance of the park. (noted when played).\n\n";
  rules += "Guess in Under 3 Tries to Get a Point. Special Cases get 2 Points. Good Luck!";
  alert(rules);
}

let randIndex = 0;
let park = document.getElementById('parkContainer');
let gen = document.getElementById('gen');
let guess = document.getElementById('guessCode');
function generatePark() {
  gen.hidden = true;
  guess.hidden = false;
	park.innerHTML = "";
	randIndex = Math.floor((gameData.length)*Math.random());
	park.innerHTML = `<h2>Park Name: ${toTitleCase(gameData[randIndex]["Name"])}</h2>\n`;
  
}

let code = document.getElementById('code');
let guess = 3;
function verifyPark() {
  let parkGuess = code.value.toUpperCase();
  let correctCode = gameData[randIndex]["Park Code"];
  if(correctCode == parkGuess) {
    alert(`Correct! The Correct Code is ${correctCode}.`);
    gen.innerHTML = "Generate Another Park"
    gen.hidden = false;
    code.value = "";
    guess.hidden = true;
    park.innerHTML += `<iframe scrolling="no" class="parkSite" width="100%" src="https://nps.gov/${gameData[randIndex]['Park Code']}"></iframe>`;
  }
  else if(parkGuess.length == 0)
  {
    alert("Nothing Entered. Try Again.");
  }
  else {
    alert("Incorrect. Try Again.");
    guess = guess - 1;
  }
  if(guess == 0) {
    alert(`All Guesses are Out. The Correct Code is ${correctCode}`)
    gen.innerHTML = "Generate Another Park"
    gen.hidden = false;
    code.value = "";
    guess.hidden = true;
    park.innerHTML += `<iframe scrolling="no" class="parkSite" width="100%" src="https://nps.gov/${gameData[randIndex]['Park Code']}"></iframe>`;
  }
}