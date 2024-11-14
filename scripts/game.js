//definiranje osnovih varijabli za kanvas
let canvas;
let canvasWidth = window.innerWidth - 6; //postavljam širinu kanvasa - uzimam u obzir 3px sa svake strane
let canvasHeight = window.innerHeight - 6; //postavljam  visinu kanvasa - uzimam u obzir 3px sa svake strane
let context;

//postavljanje velicine canvasa pri ucitavanju zaslona i definiranje konteksta
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  context = canvas.getContext("2d");
};
