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
function verifyPark() {
  let parkGuess = code.value;
  let correctCode = gameData[randIndex]["Park Code"];
  if(correctCode == parkGuess) {
    alert("Correct!");
    gen.innerHTML = "Generate Another Park"
    gen.hidden = false;
    code.value = "";
    guess.hidden = true;
    park.innerHTML += `<iframe scrolling="no" class="parkSite" width="100%" src="https://nps.gov/${gameData[randIndex]['Park Code']}"></iframe>`;
  }
  else {
    alert("Incorrect. Try Again.")
  }
}