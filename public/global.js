function endLoading(){
    document.getElementById("loading").hidden = true;
    document.getElementById("main").hidden = false;
}

async function showUserLoginStatus(){
    await new Promise(resolve => setTimeout(resolve, 2000));
    if(firebase.auth().currentUser === null){
        isLoggedIn(false);
    }else{
        isLoggedIn(true);
    }
}

function isLoggedIn(boolStatus){
    if(boolStatus){
        var navAccount = document.getElementById("Account");
        navAccount.classList.remove("grayscale");
        var navAccountSVG = document.getElementById("accountSVGPath");
        navAccountSVG.classList.remove("accountLoggedOut");
        navAccountSVG.classList.remove("accountLoggedIn");
        navAccountSVG.classList.add("accountLoggedIn");
    }else{
        var navAccount = document.getElementById("Account");
        navAccount.classList.remove("grayscale");
        navAccount.classList.add("grayscale");
        var navAccountSVG = document.getElementById("accountSVGPath");
        navAccountSVG.classList.remove("accountLoggedOut");
        navAccountSVG.classList.remove("accountLoggedIn");
        navAccountSVG.classList.add("accountLoggedOut");
    }
}