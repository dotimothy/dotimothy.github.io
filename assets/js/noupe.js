if(!urlParams) {
    let urlParams = new URLSearchParams(window.location.search);
}

if(urlParams.has('noupe') || urlParams.has('ai')) {
    document.write("<script src=\'https://www.noupe.com/embed/0197fca40dc275e394264a5284d12d463e08.js\'></script>");
}