var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");
var ballRadius = 400;
canvas.width = 1986
canvas.height = 1110
div_element = document.createElement('div')
let newGameWrapper;
window.onload = function() {
    newGameWrapper = document.getElementById("new-game-wrapper")
};
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -5;
var paddleHeight = 175;
var paddleWidth = 200;
var paddleX = (canvas.width-paddleWidth)/2;
var fallingBalls = []
var score = 0
var lives = 3
var rightPressed = false;
var leftPressed = false;
const controller = {
  x:0,
  y:0,
}
var playImage = new Image();
playImage.onload = function(){
  context.drawImage(playImage, buttonX[0], buttonY[0]);
}

class Fruit{
  constructor(x, y, type){
    this.x = x
    this.y = y
    this.height = 100;
    this.width = 100;
    this.type = type
  }

  draw(){
    this.image = new Image();
    if (type == 0) {
      this.image.src = "images/pineapple.png"; 
    }else if(type == 1) {
      this.image.src = "images/banana.png"; 
    }else if(type ==2){
      this.image.src = "images/apple.png";
    }else if(type ==3){
      this.image.src = "images/grapes.png";
    }else if(type ==4){
      this.image.src = "images/special.png";
    }
    ctx.drawImage(this.image, 
      this.x, 
      this.y,
      this.width, this.height);
  }

  fall(){
    this.y -= dy
  }
}


function resetController() {
  controller.x = 0;
  controller.y = 0;
}


function getType() {
  return Math.floor(Math.random() * 5);
}

function drawScore() {
  ctx.font = "25px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 22);
}

function drawLives() {
  ctx.font = "25px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-95, 22);
}

function checkForCollision(){
  newArray = []
  for(var i = 0 ; i  < fallingBalls.length; i++ ){
    var arc = fallingBalls[i];
    if(paddleX + paddleWidth > arc.x && paddleX - paddleWidth < arc.x && arc.y > canvas.height - paddleHeight && arc.y < canvas.height) {
      score++;
      //handle special fruit
      if(arc.type == 4){
        score ++
      }
    }else if(arc.y > canvas.height - paddleHeight && arc.y < canvas.height){
      lives--;
    }
    else{
      newArray.push(fallingBalls[i])
    }
  }
  fallingBalls = newArray
}

function newFruit(){
  posWidth = Math.random() * canvas.width
  type = getType()
  fallingBalls.push(new Fruit(posWidth, 50, 20, type));
}

function drawBalls() {
    for(var i = 0 ; i  < fallingBalls.length; i++ ){
      fallingBalls[i].fall()
      fallingBalls[i].draw()
    }
}

function drawBasket() {
  ctx.beginPath();
  this.image = new Image();
    this.image.src = "basket.png"; 
  ctx.drawImage(this.image, 
    paddleX, 
    canvas.height-paddleHeight,
    paddleWidth, paddleHeight);


 
    /*ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();*/
    ctx.closePath();
}

function draw() {
    //if (lives > 0){
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBalls();
      drawBasket();
      drawScore();
      drawLives();
      if(controller.y > 30) {
          paddleX += 7;
          if (paddleX + paddleWidth > canvas.width){
              paddleX = canvas.width - paddleWidth;
          }
      }
      else if(controller.y < -30) {
          paddleX -= 7;
          if (paddleX < 0){
              paddleX = 0;
          }
      }
      if ( (score+1)  % 15 === 0){
          dy--
      }
      checkForCollision();
    //}else{
    //  alert("GAME OVER");
    //  document.location.reload();
    //}
   

}


function animate(){
  function my_func() {
    newFruit()
    setTimeout( my_func, 2500);
  };
  
  my_func()
  setInterval(draw, 10);
}

var newGame = false


function startGame(){
    if ( newGame == true ) {
      animate()
    }
}





/*
var ip = '192.168.1.100', // Your ip
		port = ':8080',
		io = io.connect(),
		current_url = window.location.href;

io.on('connect', function() {
	// Game setup
	var game = function(ip){

		var QR_code_element,
		create_QR = function(){

			var QR_code,
					url = "http://" + ip + port + "?id=" + io.id;

			// Create the container for the QR code to be created in
			QR_code_element = document.createElement('div');

			// Assign an id to the element
			QR_code_element.id = "QR_code";

			// Append QR code element to the body
			document.body.appendChild(QR_code_element);

			// Assign the actual DOM element
			QR_code_element = document.getElementById('QR_code');

			// Create a QRCode
			QR_code = new QRCode("QR_code");
			QR_code.makeCode(url);
            alert(url)
		},
		game_connected = function(){

			create_QR();
            canvas.style.display="none"

			io.removeListener('game_connected', game_connected);
		};
		
		// Tell the server that the client is connecting as a game
		io.emit('game_connect');

		// When the server has registered this client as a game
		// Create a QR code which will be a url with this game id as a parameter
		io.on('game_connected', game_connected);

		// When a controller has connected/disconnected to this game
		io.on('controller_connected', function(connected){

			if(connected){

				// Hide the QR code
				QR_code_element.style.display = "none";
                canvas.style.display="block"
                animate();
			}else{
				// Show the QR code
                canvas.style.display="none"
				QR_code_element.style.display = "block";
                score = 0;
			}

		});

		// When the server sends a changed controller state update it in the game
		io.on('controller_state_change', function(state){
            console.log("tuk")
            console.log(state.x)
            console.log(state.y)
			      controller.x = state.x;
            controller.y = state.y
		});

        io.on("game_state_change", function(newGame){
            if (newGame){
                isGameOver = false
                newGameWrapper.style.display = "none"
                canvas.style.display = "flex"
                draw()
            }
        })

	}
    setup_controller_outlook = function() {
        canvas.style.display='none'
            
            img_element = document.createElement('img')
            img_element.src = 'controller.png';
            img_element.style.width = '100%';
            img_element.style.height = '75%';

            paragraph_element = document.createElement('div')
            paragraph_element.style.height = '15%';
            paragraph_element.style.fontSize = 'x-large';
            paragraph_element.innerHTML = 'Control the game with you device motion sensors'
            paragraph_element.style.textAlign = 'center'

            info_wrapper = document.createElement('div');
            info_wrapper.style.width = '95%'
            info_wrapper.style.height = '100%'
            info_wrapper.style.display = 'flex';
            info_wrapper.style.justifyContent = 'center';
            info_wrapper.style.alignItems = 'center'
            info_wrapper.style.flexDirection = 'column'
            
           // info_wrapper.innerHTML = "Control the game with you divice motion sensors";

            info_wrapper.appendChild(paragraph_element)
            info_wrapper.appendChild(img_element)
            document.body.appendChild(info_wrapper); 
    }

	// If the url has an id in it
	if(current_url.indexOf('?id=') > 0){
        console.log("tuk12312321")
        io.emit('controller_connect', current_url.split('?id=')[1]);

        // Server will send back a connected boolean
        io.on('controller_connected', function(connected){

            if(connected){             
                setup_controller_outlook()
                alert("Connected!");

                emit_controller_updates = function(){
					          io.emit('controller_state_change', controller);
				        }
                handleOrientation = function(e) {
                    // Device Orientation API
                    controller.x = e.gamma ; // range [-90,90], left-right
                    controller.y = e.beta ;  // range [-180,180], top-bottom
                    console.log("tuk")
                    console.log(e.gamma)
                    console.log(e.beta)

                    emit_controller_updates();
                }

                window.addEventListener("deviceorientation", handleOrientation);
                
                var newGame = false
                emit_new_game_update = function() {
                    io.emit("game_state_change", newGame)
                }
                handleGameState = function(e) {
                    newGame = true
                 //   newGameWrapper.removeChild(div_element)
                    emit_new_game_update()
                }
                window.addEventListener("click", handleGameState)             
            }else{
                // Failed connection
                alert("Not connected!");
            }
        });
	} else {
		// Set up the game using ip
		game(ip);
	}
});
*/