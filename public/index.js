function getNumber() {
    let ausgabeP = document.getElementById("ausgabe");
    firebase.functions().httpsCallable('temp-randomNumber')()
    .then(result => {
        console.log(result.data);
        ausgabeP.innerHTML = result.data;
    });
}

function getName() {
    let eingabeID = document.getElementById("eingabeID");
    let eingabeData = document.getElementById("eingabeData");

    const id = 'temp/names/'+eingabeID.value;
    const data = {id: id};

    firebase.functions().httpsCallable('database-getDocumentByID')(data)
    .then(result => {
        console.log(result.data);
        eingabeData.value = result.data.name;
    });
}

async function addName() {
    let eingabeID = document.getElementById("eingabeID");
    let eingabeData = document.getElementById("eingabeData");
    let ausgabeP = document.getElementById("ausgabe");

    const id = 'temp/names/'+eingabeID.value;
    const data = {
        id: id,
        data: {
            name: eingabeData.value
        }
    };

    await firebase.functions().httpsCallable('database-setDocumentByID')(data);
    ausgabeP.innerHTML = "successfully added";
}

async function updateName() {
    let eingabeID = document.getElementById("eingabeID");
    let eingabeData = document.getElementById("eingabeData");
    let ausgabeP = document.getElementById("ausgabe");

    const id = 'temp/names/'+eingabeID.value;
    const data = {
        id: id,
        data: {
            name: eingabeData.value
        }
    };

    await firebase.functions().httpsCallable('database-updateDocumentByID')(data);
    ausgabeP.innerHTML = "successfully updated";
}