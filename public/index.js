const nameCollectionPath = 'temp/demo/names/';

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

    ausgabeP.innerHTML = "";

    const id = nameCollectionPath+eingabeID.value;
    const param = {id: id};

    firebase.functions().httpsCallable('database-getDocumentByID')(param)
    .then(result => {
        console.log(result.data);
        eingabeData.value = result.data.name;
    });
}

async function addName() {
    let eingabeID = document.getElementById("eingabeID");
    let eingabeData = document.getElementById("eingabeData");
    let ausgabeP = document.getElementById("ausgabe");

    ausgabeP.innerHTML = "";

    const id = nameCollectionPath+eingabeID.value;
    const param = {
        id: id,
        data: {
            name: eingabeData.value
        }
    };

    await firebase.functions().httpsCallable('database-setDocumentByID')(param);
    ausgabeP.innerHTML = "successfully added";
}

async function updateName() {
    let eingabeID = document.getElementById("eingabeID");
    let eingabeData = document.getElementById("eingabeData");
    let ausgabeP = document.getElementById("ausgabe");

    ausgabeP.innerHTML = "";

    const id = nameCollectionPath+eingabeID.value;
    const param = {
        id: id,
        data: {
            name: eingabeData.value
        }
    };

    await firebase.functions().httpsCallable('database-updateDocumentByID')(param);
    ausgabeP.innerHTML = "successfully updated";
}