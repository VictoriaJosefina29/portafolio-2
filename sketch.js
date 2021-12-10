var trex, trex_running, trex_choque;
var piso, invisiblepiso, pisoImage, cargar, reiniciar;
var nube;
var fin,perder;
var total=0;
var o1, o2, o3, o4, o5, o6;
var puntaje_trex, trexsorpresa;
var tipo_obstaculo, obstaculo, brinco, muerte, punto;
var estado="inicio";

function preload() {
  
  brinco=loadSound("jump.mp3")
  muerte=loadSound("die.mp3")
  punto=loadSound("checkPoint.mp3")
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_choque = loadImage("trex_collided.png");
perder=loadImage("dameover2.png");
  pisoImage = loadImage("ground2.png");
  nube = loadImage("cloud.png");
  cargar=loadImage("restart.png")

  o1 = loadImage("obstacle1.png");
  o2 = loadImage("obstacle2.png");

  o3 = loadImage("obstacle3.png");
  o4 = loadImage("obstacle4.png");
  o5 = loadImage("obstacle5.png");
  o6 = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(600, 200);
  puntaje_trex = 0;

  //crea un suelo invisible
  invisiblepiso = createSprite(200, 190, 400, 10);
  invisiblepiso.visible = false;

  //crea el sprite del suelo
  piso = createSprite(200, 180, 400, 20);
  piso.addImage("piso", pisoImage);
  piso.velocityX = -4;
  piso.x = piso.width / 2;

  //crea el sprite del Trex
  trex = createSprite(50, 160);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.setCollider("circle", 0,0,50);
  //trex.debug=true;
  
  //se crea trex choque 48-51
trexsorpresa=createSprite(50, 160, 20, 50);
  trexsorpresa.addImage("quieto",trex_choque);
  trexsorpresa.scale = 0.5;
  trexsorpresa.visible=false;
  

  fin=createSprite(width/2,90);
  fin.addImage("pausa",perder);
  fin.scale=0.5;
  fin.visible=false;
  
  reiniciar=createSprite(width/2,150);
  reiniciar.addImage("otravez",cargar);
  reiniciar.scale=0.5;
  reiniciar.visible=false;
  
  //crea GRUPOS de nubes y GRUPOS de obstaculos
  grupoNubes = new Group();
  grupoObstaculos = new Group();
}

function draw() {
  //establece el color del fondo
  background("white");
  
if(estado=="inicio"){
  
  //llamada a funciones exrternas
  cielo();
  obstaculos();
  puntaje();

  //salta cuando se presiona la barra espaciadora y está en el piso
  //&& trex.y >= 155
  if(trex.collide(invisiblepiso)){
  if (touches.length >0 || keyDown("space")) {
    trex.velocityY =-15 ;
    trex.velocityx= 6;
    brinco.play();
    touches=[]
  }
  }
  //agrega gravedad
  trex.velocityY = trex.velocityY + 0.8;

  //piso infinito
  if (piso.x < 0)
    piso.x = piso.width / 2;
 
  if (grupoObstaculos.isTouching(trex)){
    estado="final";
    muerte.play();
  }
}  //esta es la llave de estado=="inicio"
  
  if(estado=="final"){ 
    total=puntaje_trex;
    text("Puntuación: " + total, 25, 15);
    grupoObstaculos.setVelocityXEach(0);
    grupoNubes.setVelocityXEach(0);
    piso.velocityX=0;
    grupoNubes.setLifetimeEach(-1);
    grupoObstaculos.setLifetimeEach(-1);
    trex.visible=false;
    trexsorpresa.x=trex.x;
    trexsorpresa.y=trex.y;
    trex.velocityY=0;
    trexsorpresa.visible=true;
    fin.visible=true;
    reiniciar.visible=true;
    reiniciar.depth=grupoObstaculos.maxDepth();
    fin.depth=grupoNubes.maxDepth();
    if (touches.length >0 ||mousePressedOver(reiniciar)) {
      again();
      touches=[]
    }
  }  //cierra estado=="final"
  
  drawSprites();
   //evita que el Trex caiga
  trex.collide(invisiblepiso);
  //console.log(obstaculo.velocityX);
}

function cielo() {
  // Cada ciertos cuadros (frames) se crea una nube y se destruye
  if (frameCount % 30 === 0) {
    var nubes = createSprite(600, random(20, 100));
    nubes.addImage("volando", nube);
    nubes.scale = 0.2;
    nubes.velocityX = -5;
    nubes.lifetime = 150;
    nubes.depth=trex.depth;
    trex.depth=trex.depth+1;
    grupoNubes.add(nubes);
    
  }
}

function obstaculos() {
  tipo_obstaculo = Math.round(random(1, 6));
  if (frameCount % 60 == 0) {
    obstaculo = createSprite(600, 160);
    obstaculo.scale = 0.1;
    //obstaculo.velocityX = -7;
    obstaculo.velocityX=-(4+puntaje_trex/100);
    piso.velocityX = obstaculo.velocityX;
    obstaculo.depth = trex.depth;
trex.depth=trex.depth+1;
    switch (tipo_obstaculo) {
      case 1:
        obstaculo.addImage(o1);
        break;
      case 2:
        obstaculo.addImage(o2);
        break;
      case 3:
        obstaculo.addImage(o3);
        break;
      case 4:
        obstaculo.addImage(o4);
        break;
      case 5:
        obstaculo.addImage(o5);
        break;
      case 6:
        obstaculo.addImage(o6);
        break;
    }
    obstaculo.lifetime = 250;
    grupoObstaculos.add(obstaculo);
    obstaculo.debug=false;
  }
}

function puntaje() {
  puntaje_trex = puntaje_trex + Math.round(getFrameRate() / 65);
  text("Puntuación: " + puntaje_trex, 25, 15);
  if (puntaje_trex>0 && puntaje_trex%100==0){
    punto.play();
  }
}

function again(){
  estado="inicio";
  grupoNubes.destroyEach();
  grupoObstaculos.destroyEach();
  fin.visible=false;
  reiniciar.visible=false;
  trexsorpresa.visible=false;
  trex.visible=true;
  puntaje_trex=0;
  piso.velocityX=-4;
  trex.x=50;
  trex.y=160;
}
