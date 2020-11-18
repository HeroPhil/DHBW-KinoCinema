function submit() {
    const eingabeFeld = document.getElementById("eingabe");
    const eingabeString = eingabeFeld.value;
    console.log(eingabeString);
    httpGetAsync("https://us-central1-dhbw-kk-kino.cloudfunctions.net/readFromDatabase", updateP)
}

function updateP(httpReturn) {
    document.getElementById("ausgabe").innerHTML = httpReturn;
}

function httpGetAsync(theUrl, callback) {​​​​​
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {​​​​​ 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }​​​​​
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}​​​​​