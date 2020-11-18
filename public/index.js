function getNumber() {
    let ausgabeP = document.getElementById("ausgabe");
    const randomNumberFunction = firebase.functions().httpsCallable('randomNumber');
    randomNumberFunction().then(result => {
        console.log(result.data);
        ausgabeP.innerHTML = result.data;
    });
}