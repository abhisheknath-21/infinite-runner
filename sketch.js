var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score=0;

var ninja, ninja_image, ninja_collided;
var background_1, background_1_image;
var background_2, background_2_image;
var obstacle1, obstacle2,  obstacle_1_image, obstacle_2_image, obstacle_3_image, obstacle_4_image;
var ground, ground_image;
var ground1, ground_image_1;
var obstaclesGroup1, obstacleGroup2;
var game_over, game_over_image;
var restart, restart_image;
var flying_obstacle, flying_image_;

function preload(){
  ninja_image=loadAnimation("ninja_1.png", "ninja_2.png", "ninja_3.png", "ninja_4.png");
  
  ninja_collided=loadAnimation("ninja_collided.png");
  
  obstacle_1_image=loadImage("obstacle_1.png");
  obstacle_2_image=loadImage("obstacle_2.png");
  obstacle_3_image=loadImage("obstacle_3.png");
  obstacle_4_image=loadImage("obstacle_4.png");
  
  flying_image=loadImage("flying_obstacle_1.png");
  
  ground_image=loadImage("ground.png");
  ground_image_1=loadImage("ground1.png");
  
  game_over_image=loadImage("game_over.png");
  restart_image=loadImage("restart_image.png");
}

function setup() {
    createCanvas(1000, 600);

  ninja=createSprite(50, 190, 10, 10);
  ninja.addAnimation("running", ninja_image);
  ninja.addAnimation("fall", ninja_collided);
  ninja.scale =0.5;
  camera.position.y = 0;
  camera.position.x = ninja.x;
  
  ground1=createSprite(280, 290, 10, 10);
  ground1.addImage(ground_image);
  ground1.scale=0.8;
  
  ground=createSprite(280, 290, 10, 10);
  ground.addImage(ground_image);
  ground.scale=0.8;
  ground.x = ground.width /2;
  ground.velocityX = -6;
  
  game_over = createSprite(250,100);
  game_over.addImage(game_over_image);
  game_over.scale=0.5;
  
  restart = createSprite(250,150);
  restart.addImage(restart_image);
  restart.scale=0.2;

  obstaclesGroup1 = new Group();
  obstaclesGroup2 = new Group();
  flyingGroup= new Group();
  
  score = 0;
  
}

function draw() {
  background("white");
  fill("black");
  text("Score: "+ score, 225,20);
  
    if (gameState===PLAY){
    spawnObstacles1();
    spawnObstacles2();
    spawnFlyingObstacle()
      
      restart.visible=false;
      game_over.visible=false;
  
      
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
      
    ninja.collide(ground1);
  
    if(keyDown("space") && ninja.y >= 159) {
      ninja.velocityY = -12;
    }
  
    ninja.velocityY = ninja.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    if(ninja.isTouching(obstaclesGroup1)){
      gameState= END;
    }
    if(ninja.isTouching(obstaclesGroup2)){
      gameState= END;
    }
    if(ninja.isTouching(flyingGroup)){
      gameState= END;
    }

  }
  
  else if (gameState === END) {
    
    restart.visible=true;
    game_over.visible=true;
   
    ground.velocityX = 0;
    ninja.velocityY=0;
    obstaclesGroup1.setVelocityXEach(0);
    obstaclesGroup2.setVelocityXEach(0);
    flyingGroup.setVelocityXEach(0);
    
    obstaclesGroup1.setLifetimeEach(-1);
    obstaclesGroup2.setLifetimeEach(-1);
    flyingGroup.setLifetimeEach(-1);
    
     ninja.changeAnimation("fall", ninja_collided);

    if(mousePressedOver(restart)) {
      reset();
    }

  }
 
 drawSprites();
}

function reset(){
  
  gameState = PLAY;
  game_over.visible = false;
  restart.visible = false;

  obstaclesGroup1.destroyEach();
  obstaclesGroup2.destroyEach();
  flyingGroup.destroyEach();
  
  ninja.changeAnimation("running", ninja_image);
  
  score = 0;

}

function spawnObstacles1() {
  if(frameCount % 100 === 0) {
    var obstacle1 = createSprite(600,200,10,40);
    obstacle1.velocityX =  -(5 + 3*score/100);
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle1.addImage(obstacle_1_image);
              break;
      case 2: obstacle1.addImage(obstacle_2_image);
              break;
      default: break;
    }
            
    obstacle1.scale = 0.2;
    obstacle1.lifetime = 300;
    obstaclesGroup1.add(obstacle1);
   
  }
}

function spawnObstacles2() {
  if(frameCount % 150 === 0) {
    var obstacle2 = createSprite(1100,210,10,40);
    obstacle2.velocityX =  -(5 + 3*score/100);
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle2.addImage(obstacle_3_image);
              break;
      case 2: obstacle2.addImage(obstacle_4_image);
              break;
      default: break;
    }
    
    obstacle2.scale = 0.3;
    obstacle2.lifetime = 300;
    obstaclesGroup2.add(obstacle2);
   
  }
}

function spawnFlyingObstacle(){
  
   if (frameCount % 150 === 0) {
    var flying_obstacle = createSprite(600,120,40,10);
    flying_obstacle.y = Math.round(random(30,150));
    flying_obstacle.addImage(flying_image);
    flying_obstacle.scale = 0.2;
    flying_obstacle.velocityX =  -(2 + 3*score/100);
    
    flying_obstacle.lifetime = 200;
    
    flying_obstacle.depth = ninja.depth;
    ninja.depth = ninja.depth + 1;
    
     flyingGroup.add(flying_obstacle);
  }
}