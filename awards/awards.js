/* awards.js: Script to Load Award Documents and Information */
/* Author: Timothy Do */

let files = {
	APScholar: "TimothyDo_APScholar.pdf",
	Billingual: "TimothyDo_Billingual.pdf",
	CarolynClarkDiploma: "TimothyDo_CarolynClarkDiploma.pdf",
	DeansHonorList: "TimothyDo_DeansHonorList.pdf",
	EagleScout: "TimothyDo_EagleScout.pdf",
	EVHSBandScholar: "TimothyDo_EVHSBandScholar.pdf",
	EVHSDiploma: "TimothyDo_EVHSDiploma.pdf",
	EVHSMagnaCumLaude: "TimothyDo_EVHSMagnaCumLaude.pdf",
	GoldenStateDiploma: "TimothyDo_GoldenStateDiploma.pdf",
	QuimbyOakDiploma: "TimothyDo_QuimbyOakDiploma.pdf",
	SixSigmaYellowBelt: "TimothyDo_SixSigmaYellowBelt.pdf"
};

let titles = {
	APScholar: "AP Scholar with Distinction",
	Billingual: "Billingual Certification: Vietnamese",
	CarolynClarkDiploma: "Carolyn Clark Elementary School Diploma",
	DeansHonorList: "Dean's Honor List for 2019-2020, 2020-2021, 2021-2022, and Fall 2022 Academic Quarters",
	EagleScout: "Eagle Scout with Bronze Palm",
	EVHSBandScholar: "EVHS Band Scholar",
	EVHSDiploma: "Evergreen Valley High School Diploma",
	EVHSMagnaCumLaude: "Magna Cum Laude @ Evergreen Valley High School",
	GoldenStateDiploma: "Golden State Diploma",
	QuimbyOakDiploma: "Quimby Oak Middle School Diploma",
	SixSigmaYellowBelt: "Six Sigma Yellow Belt Certified by Western Digital"
};

function showAward(award) {
	document.getElementById('showAward').hidden = false;
	document.getElementById('selection').hidden = true;
	document.getElementById('title').innerHTML = `Selected Award: ${titles[award]}`;
	document.getElementById('embed').innerHTML = `<iframe width="50%" height="50%" frameborder="0" src="https://docs.google.com/gview?url=https://timothydo.me/awards/${files[award]}&embedded=true"></iframe>`;
	//document.getElementById('embed').innerHTML = `<embed width="50%" height="50%" frameborder="0" src="${files[award]}"/>`; //doesn't work for Android
}

function revert() {
	document.getElementById('showAward').hidden = true;
	document.getElementById('selection').hidden = false;
	document.getElementById('title').innerHTML = "";
	document.getElementById('embed').innerHTML = "";
}