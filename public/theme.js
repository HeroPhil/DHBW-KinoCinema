const themeButton = document.getElementById('themeButton');
const body = document.body;


const theme = localStorage.getItem('theme');
if(theme){
  body.classList.replace("light", theme);
  body.classList.replace("dark", theme);
}

function toggleTheme() {
  
    if(!body.classList.replace("dark", "light")){
      body.classList.replace("light", "dark");
      localStorage.setItem('theme', 'dark');
    }else{
      localStorage.setItem('theme', 'light');
    }
}
  

themeButton.onclick = toggleTheme;