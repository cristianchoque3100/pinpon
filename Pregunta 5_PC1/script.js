let canvas = document.getElementById("juegoCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let sonidoColision = new Audio('assets/sonido_colision.mp3');
let sonidoFondo = new Audio('assets/sonido_fondo.mp3');
sonidoFondo.loop = true;

let jugador1 = { x: 50, y: canvas.height/2 - 50, ancho: 50, alto: 100, puntos: 0, img: new Image() };
jugador1.img.src = 'assets/mano1.png';

let jugador2 = { x: canvas.width - 100, y: canvas.height/2 - 50, ancho: 50, alto: 100, puntos: 0, img: new Image() };
jugador2.img.src = 'assets/mano2.png';

let bola = { x: canvas.width/2, y: canvas.height/2, radio: 15, dx: 5, dy: 5, img: new Image() };
bola.img.src = 'assets/bola.png';

let nivel = 1;
let juegoActivo = false;

function iniciarJuego() {
  document.getElementById('pantalla-inicio').style.display = 'none';
  canvas.style.display = 'block';
  sonidoFondo.play();
  juegoActivo = true;
  requestAnimationFrame(actualizar);
}

function actualizar() {
  if (!juegoActivo) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(jugador1.img, jugador1.x, jugador1.y, jugador1.ancho, jugador1.alto);
  ctx.drawImage(jugador2.img, jugador2.x, jugador2.y, jugador2.ancho, jugador2.alto);

  ctx.drawImage(bola.img, bola.x - bola.radio, bola.y - bola.radio, bola.radio*2, bola.radio*2);

  bola.x += bola.dx;
  bola.y += bola.dy;

  if (bola.y < 0 || bola.y > canvas.height) bola.dy *= -1;

  if (colision(jugador1, bola)) {
    bola.dx *= -1;
    sonidoColision.play();
  }
  if (colision(jugador2, bola)) {
    bola.dx *= -1;
    sonidoColision.play();
  }

  if (bola.x < 0) {
    jugador2.puntos++;
    reiniciarBola();
  }
  if (bola.x > canvas.width) {
    jugador1.puntos++;
    reiniciarBola();
  }

  // Nivel
  if (jugador1.puntos === 3 || jugador2.puntos === 3) {
    if (nivel === 1) {
      nivel = 2;
      bola.dx *= 1.2;
      bola.dy *= 1.2;
      jugador1.puntos = 0;
      jugador2.puntos = 0;
    } else {
      alert("Felicitaciones, Tu Nombre y Apellido");
      juegoActivo = false;
      sonidoFondo.pause();
    }
  }

  // Mostrar puntuación
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText(jugador1.puntos, canvas.width/4, 50);
  ctx.fillText(jugador2.puntos, canvas.width*3/4, 50);

  requestAnimationFrame(actualizar);
}

function colision(jugador, bola) {
  return (
    bola.x - bola.radio < jugador.x + jugador.ancho &&
    bola.x + bola.radio > jugador.x &&
    bola.y - bola.radio < jugador.y + jugador.alto &&
    bola.y + bola.radio > jugador.y
  );
}

function reiniciarBola() {
  bola.x = canvas.width/2;
  bola.y = canvas.height/2;
  bola.dx *= -1;
}

window.addEventListener('keydown', function(e) {
  switch (e.key) {
    case "ArrowUp":
      jugador2.y = Math.max(0, jugador2.y - 20);
      break;
    case "ArrowDown":
      jugador2.y = Math.min(canvas.height - jugador2.alto, jugador2.y + 20);
      break;
    case "w":
    case "W":
      jugador1.y = Math.max(0, jugador1.y - 20);
      break;
    case "s":
    case "S":
      jugador1.y = Math.min(canvas.height - jugador1.alto, jugador1.y + 20);
      break;
  }
});