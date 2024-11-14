//dohvaćam canvas kao element
const canvas = document.getElementById("gameCanvas");

//funkcija za promjenu veličine kanvasa
function resizeCanvas() {
  //postavljam širinu i visinu kanvasa - uzimam u obzir 3px sa svake strane
  canvas.width = window.innerWidth - 6;
  canvas.height = window.innerHeight - 6;
}

//postavljam inicijalnu veličinu zaslona
resizeCanvas();
//slušam za potencijalne promjene zaslona i mijenjam veličinu kanvasa
window.addEventListener("resize", resizeCanvas);
