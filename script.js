const FPS = 60; // frames per second
const shipSize = 30; // height in pixels
const textSize = 40; // in px

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d"); // used for 2D graphics
document.querySelector("main").focus(); // focus on main

// VARIABLES
let gameRunning = false;
let player;
let ship;
let enemies = [];

// Parent class for circle entities (player / enemies)
class CircleEntity {
    x;
    y;
    velx = 0;
    vely = 0;
    topSpeed = 10;
    accRate = 1.5;
    accx = 0;
    accy = 0;
    friction = 0.83;

    radius;

    constructor(x, y, radius=20) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    update() {
        // Update velocity
        console.log(this.vely);
        this.velx = Math.min(this.velx + this.accx, this.topSpeed);
        this.velx = Math.max(this.velx, -this.topSpeed);
        this.vely = Math.min(this.vely + this.accy, this.topSpeed);
        this.vely = Math.max(this.vely, -this.topSpeed);
        console.log("a: ", this.vely);

        // Update position
        this.x += this.velx;
        this.y += this.vely;
    }

    draw() {
        ctx.fillStyle = "rgba(0,0,255,1.00)";
        ctx.beginPath();
        let startAngle = 0; // Starting point on circle
        let endAngle = 2 * Math.PI; // End point on circle
    
        ctx.arc(this.x, this.y, this.radius, startAngle, endAngle);
    
        ctx.fill();
    }
}

class Enemy extends CircleEntity {
    // No constructor needed, as all args can go straight to super()
}

class Player extends CircleEntity {
    accRight = false;
    accLeft = false;
    accUp = false;
    accDown = false;

    constructor(x, y, radius) {
        super(x, y, radius);
    }

    update() {
        // Update player acceleration from keyboard input
        this.accx = 0;
        this.accy = 0;
        if (this.accRight) this.accx += this.accRate; 
        if (this.accLeft) this.accx -= this.accRate;
        if (this.accUp) this.accy -= this.accRate;
        if (this.accDown) this.accy += this.accRate;

        super.update();

        // World border collisions
        if (this.x + this.radius > canvas.width) this.x = canvas.width - this.radius;
        if (this.x - this.radius < 0) this.x = this.radius;
        if (this.y + this.radius > canvas.height) this.y = canvas.height - this.radius;
        if (this.y - this.radius < 0) this.y = this.radius;

        // Apply friction (uses xor)
        if (!(this.accRight != this.accLeft)) this.velx *= this.friction;
        if (!(this.accUp != this.accDown)) this.vely *= this.friction;
    }

}

// Draw the background
function drawBackground () {
    ctx.fillStyle = "rgba(255,44,44,1.00)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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

// FRAME UPDATE
function update () {
    if (!gameRunning) {
        return;
    }

    // Draw the background
    drawBackground();

    player.update();
    player.draw();

    // Draw enemies
    enemies.forEach(enemy => enemy.draw());
}

// START A NEW GAME
function newGame () {
    player = new Player(canvas.width / 2, canvas.height / 2, 30);
	ship = newShip();
    for (let i = 0; i < 10; i++) {
        enemies.push(new Enemy(i * 100, 200));
    }

    gameRunning = true;
}

// MOVE THE SHIP AND SHOOT THE LASERS ON KEYDOWN
function keyDown (e) {
    if (!gameRunning) {
        return;
    }

	switch (e.key) {
		// W or Up
        case "w":
        case "ArrowUp":
            player.accUp = true;
            break;
        // S or Down
        case "s":
        case "ArrowDown":
            player.accDown = true;
            break;
        // A or Left
        case "a":
        case "ArrowLeft":
            player.accLeft = true;
            break;
        // D or Right
        case "d":
        case "ArrowRight":
            player.accRight = true;
            break;
	}
}

function keyUp (e) {
    if (!gameRunning) {
        return;
    }

    switch (e.key) {
        // W or Up
        case "w":
        case "ArrowUp":
            player.accUp = false;
            break;
        // S or Down
        case "s":
        case "ArrowDown":
            player.accDown = false;
            break;
        // A or Left
        case "a":
        case "ArrowLeft":
            player.accLeft = false;
            break;
        // D or Right
        case "d":
        case "ArrowRight":
            player.accRight = false;
            break;
    }
}

// Add keyboard event listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Set update interval
setInterval(update, 1000 / FPS); // call update every 1/FPS seconds

// Start the game
newGame();