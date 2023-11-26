/* awards.js: Script to Load Award Documents and Information */
/* Author: Timothy Do */

let files = {
	AcceleratedStatus: "TimothyDo_AcceleratedStatus.pdf",
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
	SixSigmaYellowBelt: "TimothyDo_SixSigmaYellowBelt.pdf",
	TauBetaPi: "TimothyDo_TauBetaPi.pdf",
	IEEEStudent: "TimothyDo_IEEEStudentMember.pdf",
	HKN: "TimothyDo_HKN.pdf",
	UCIDiploma: "TimothyDo_UCIDiploma.pdf"
};

let titles = {
	AcceleratedStatus: "Accelerated Status Petition",
	APScholar: "AP Scholar with Distinction",
	Billingual: "Billingual Certification: Vietnamese",
	CarolynClarkDiploma: "Carolyn Clark Elementary School Diploma",
	DeansHonorList: "Dean's Honor List for All Academic Quarters @ UCI",
	EagleScout: "Eagle Scout with Bronze Palm",
	EVHSBandScholar: "EVHS Band Scholar",
	EVHSDiploma: "Evergreen Valley High School Diploma",
	EVHSMagnaCumLaude: "Magna Cum Laude @ Evergreen Valley High School",
	GoldenStateDiploma: "Golden State Diploma",
	QuimbyOakDiploma: "Quimby Oak Middle School Diploma",
	SixSigmaYellowBelt: "Six Sigma Yellow Belt Certified by Western Digital",
	TauBetaPi: "Tau Beta Pi (TBP) Member Initiation",
	IEEEStudent: "IEEE Student Member",
	HKN: "IEEE Eta Kappa Nu (HKN) Member Initiation",
	UCIDiploma: "Bachelor of Science in Electrical Engineering (Magna Cum Laude)"
};

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

function showAward(award) {
	document.getElementById('showAward').hidden = false;
	document.getElementById('selection').hidden = true;
	document.getElementById('title').innerHTML = `Selected Award: ${titles[award]}`;
	if(isMobileDevice()) {
		document.getElementById('embed').innerHTML = `<iframe width="100%" height="50%" frameborder="0" src="https://docs.google.com/gview?url=https://timothydo.me/awards/${files[award]}&embedded=true"></iframe>`;
	}
	else {
		document.getElementById('embed').innerHTML = `<embed width="85%" height="75%" frameborder="0" src="${files[award]}#toolbar=0"/>`; //doesn't work for Android
	}
}

function revert() {
	document.getElementById('showAward').hidden = true;
	document.getElementById('selection').hidden = false;
	document.getElementById('title').innerHTML = "";
	document.getElementById('embed').innerHTML = "";
}