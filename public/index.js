function getNumber() {
    let ausgabeP = document.getElementById("ausgabe");
    firebase.functions().httpsCallable('temp-randomNumber')()
    .then(result => {
        console.log(result.data);
        ausgabeP.innerHTML = result.data;
    });
}

function getDoc() {
    let eingabeInput = document.getElementById("eingabe");
    let ausgabeP = document.getElementById("ausgabe");

    const data = {id: eingabeInput.value};

    firebase.functions().httpsCallable('database-getDocument')(data)
    .then(result => {
        console.log(result.data);
        ausgabeP.innerHTML = result.data.name;
    });
}