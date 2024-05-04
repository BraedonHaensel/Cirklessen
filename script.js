const FPS = 60; // frames per second
const shipSize = 30; // height in pixels
const textSize = 40; // in px

let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d"); // used for 2D graphics
document.querySelector("main").focus(); // focus on main

// SET UP THE GAME LOOP
setInterval(update, 1000 / FPS); // call update every 1/FPS seconds

// SET UP GAME PARAMETERS
let ship;
let enemies = [];

// Parent class for circle entities (player / enemies)
class CircleEntity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Draw to canvas
    draw() {
        context.fillStyle = "rgba(0,0,255,1.00)";
        context.beginPath();
        let radius = 20; // Arc radius
        let startAngle = 0; // Starting point on circle
        let endAngle = 2 * Math.PI; // End point on circle
    
        context.arc(this.x, this.y, radius, startAngle, endAngle);
    
        context.fill();
    }
}

class Enemy extends CircleEntity {
    // No constructor needed, as all args can go straight to super().
}

class Player extends CircleEntity {

}

// Draw the background
function drawBackground () {
    context.fillStyle = "rgba(255,44,44,1.00)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

// BUILD A NEW SHIP
function newShip () {
	return {
		x: canvas.width / 2,
		y: canvas.height / 2,
		r: shipSize / 2,
		a: 90 / 180 * Math.PI, // radiant
	}
}

// DRAW A NEW SHIP
function drawShip(x, y, a, color = "#fff") {
	context.strokeStyle = color;
	context.lineWidth = shipSize / 20;
	context.beginPath();
	context.moveTo(
		x + 5 / 3 * ship.r * Math.cos(a),
		y - 5 / 3 * ship.r * Math.sin(a)
	);
	context.lineTo(
		x - ship.r * (2 / 3 * Math.cos(a) + Math.sin(a)),
		y + ship.r * (2 / 3 * Math.sin(a) - Math.cos(a))
	);
	context.lineTo(
		x - ship.r * (2 / 3 * Math.cos(a) - Math.sin(a)),
		y + ship.r * (2 / 3 * Math.sin(a) + Math.cos(a))
	);
	context.closePath();
	context.stroke();
}

// FRAME UPDATE
function update () {
    // Draw the background
    drawBackground();

	drawShip(ship.x, ship.y, ship.a);
    // Draw shapes
    // Draw shapes
    context.fillStyle = "rgba(0,255,0,1.00)";
    for (let i = 0; i <= 3; i++) {
        for (let j = 0; j <= 2; j++) {
            context.beginPath();
            let x = 25 + j * 50; // x coordinate
            let y = 25 + i * 50; // y coordinate
            let radius = 20; // Arc radius
            let startAngle = 0; // Starting point on circle
            let endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
            let counterclockwise = i % 2 === 1; // Draw counterclockwise
        
            context.arc(x, y, radius, startAngle, endAngle, counterclockwise);
        
            if (i > 1) {
                context.fill();
            } else {
                context.stroke();
            }
        }
    }

    // Draw enemies
    enemies.forEach(enemy => enemy.draw());

    // TODO PROBLEM! WILL NOT UPDATE CHANGES WITH THIS FOR EACH STYLE
}

// START A NEW GAME
function newGame () {
	ship = newShip();
    for (let i = 0; i < 10; i++) {
        enemies.push(new Enemy(i * 100, 200));
    }
}

// MOVE THE SHIP AND SHOOT THE LASERS ON KEYDOWN
function keyDown (e) {
	switch (e.key) {
		// W or Up
        case "w":
        case "ArrowUp":
            console.log('up');
            break;
        // S or Down
        case "s":
            case "ArrowDown":
                console.log('down');
            break;
        // A or Left
        case "a":
        case "ArrowLeft":
            console.log('left');
            break;
        // D or Right
        case "d":
        case "ArrowRight":
            console.log('right');
            break;
	}
}

function keyUp (e) {
    switch (e.key) {
        // W or Up
        case "w":
        case "ArrowUp":
            player.movingUp = false;
            break;
        // S or Down
        case "s":
            case "ArrowDown":
                player.movingDown = false;
            break;
        // A or Left
        case "a":
        case "ArrowLeft":
            player.movingLeft = false;
            break;
        // D or Right
        case "d":
        case "ArrowRight":
            player.movingRight = false;
            break;
    }
}

// Add keyboard event listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Start the game
newGame();