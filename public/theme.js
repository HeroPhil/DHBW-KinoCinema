function loadTheme() {
  const theme = localStorage.getItem('theme');
  if(theme != null){
    body.classList.replace("light", theme);
    body.classList.replace("dark", theme);
  }
}


function toggleTheme() {
  const body = document.body;
  if(!body.classList.replace("dark", "light")){
    body.classList.replace("light", "dark");
    localStorage.setItem('theme', 'light');
  }else{
    localStorage.setItem('theme', 'dark');
  }
}
  

