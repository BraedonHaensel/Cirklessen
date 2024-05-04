const FPS = 60; // frames per second
const shipSize = 30; // height in pixels
const textSize = 40; // in px

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d"); // used for 2D graphics
document.querySelector("main").focus(); // focus on main

// Background image
const backgroundImg = new Image();
backgroundImg.src = "art/background.png";

// VARIABLES
let gameRunning = false;
let player;
let ship;
let enemies = [];

// Parent class for circle entities (player / enemies)
class CircleEntity {
    x;
    y;
    velx = 1;
    vely = 0;
    topSpeed = 10;
    accRate = 1.5;
    accx = 0;
    accy = 0;
    friction = 0.83;

    radius;
    color = "rgba(0,0,255,1.00)";

    constructor(x, y, radius=20) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    update() {
        // Update velocity
        this.velx = Math.min(this.velx + this.accx, this.topSpeed);
        this.velx = Math.max(this.velx, -this.topSpeed);
        this.vely = Math.min(this.vely + this.accy, this.topSpeed);
        this.vely = Math.max(this.vely, -this.topSpeed);

        // Update position
        this.x += this.velx;
        this.y += this.vely;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        let startAngle = 0; // Starting point on circle
        let endAngle = 2 * Math.PI; // End point on circle
    
        ctx.arc(this.x, this.y, this.radius, startAngle, endAngle);
    
        ctx.fill();
    }
}

class Enemy extends CircleEntity {
    static spawnRadius = 50;
    static spawnVelocity = 3;

    constructor(x, y, velx, vely, radius) {
        super(x, y, radius);
        this.velx = velx;
        this.vely = vely;
        this.color = getRandomColor();
    }

    // No constructor needed, as all args can go straight to super()
    static getNewEnemy() {
        // Random radius between 0.9 and 1 times the Enemy spawn size
        let radius = Enemy.spawnRadius - getRandomInt(Enemy.spawnRadius * 0.1);

        let x = 0;
        let y = 0;
        let xdir = 0;
        let ydir = 0;
        // Pick a spawning axis
        if (getRandomInt(2)) {
            // Get random x coordinate (with radius buffer on either side)
            x = getRandomInt(canvas.width + 2 * radius) - radius;
            xdir = getRandomInt(2);
            // Determine if top or bottom spawn
            if (getRandomInt(2)) {
                y = -radius;
                ydir = 1;
            } else {
                y = canvas.height + radius;
                ydir = -1;
            }
        } else {
            // Get random y coordinate (with radius buffer on either side)
            y = getRandomInt(canvas.height + 2 * radius) - radius;
            ydir = getRandomInt(2);
            // Determine if left or right spawn
            if (getRandomInt(2)) {
                x = -radius;
                xdir = 1;
            } else {
                x = canvas.width + radius;
                xdir = -1;
            }
        }

        // Random velocities between 0.5 and 1 times the Enemy spawn velocity
        let velx = Enemy.spawnVelocity - getRandomInt(Enemy.spawnVelocity * 0.5);
        let vely = Enemy.spawnVelocity - getRandomInt(Enemy.spawnVelocity * 0.5);
        // Correct for spawn directions
        velx *= xdir;
        vely *= ydir;

        return new Enemy(x, y, velx, vely, radius);
    }
}

function enemySpawnManager () {
    // Add new enemy
    enemies.push(Enemy.getNewEnemy());
    // Set timeout for next enemy spawn
    setTimeout(enemySpawnManager, 1000);
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

    eat(enemy) {
        // Grow based on enemy's size
        this.radius += enemy.radius * 0.1;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Get a random color
function getRandomColor() {
    red = getRandomInt(255);
    green = getRandomInt(255);
    blue = getRandomInt(255);
    return `rgba(${red}, ${green}, ${blue}, 1.00)`
}

// Draw the background
function drawBackground () {
    // ctx.fillStyle = "rgba(90,90,90,1.00)";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

// Check for collisions between the player and all enemies
function checkCollisions () {
    for (let i = 0; i < enemies.length; i++) {
        enemy = enemies[i];
        // Collision parameters
        let distance = Math.sqrt((player.x - enemy.x) ** 2 + (player.y - enemy.y)** 2)
        let largerRadius = Math.max(enemy.radius, player.radius);
        let smallerRadius = Math.min(enemy.radius, player.radius);
        if (distance <= largerRadius - (smallerRadius * 0.5)) {
            // Collision detected
            enemy.color = "rgba(255, 255, 255, 1.00)"

            if (enemy.radius > player.radius) {
                // Game over
                console.log("Game Over!");
                return;
            }

            // Player larger, eat the circle
            player.eat(enemy);

            // Remove enemy
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    }
}

// FRAME UPDATE
function update () {
    if (!gameRunning) {
        return;
    }

    // Draw the background
    drawBackground();

    // Update elements
    player.update();
    enemies.forEach(enemy => enemy.update());
    checkCollisions();

    // Draw elements
    player.draw();
    enemies.forEach(enemy => enemy.draw());
}

// START A NEW GAME
function newGame () {
    // Spawn player
    player = new Player(canvas.width / 2, canvas.height / 2, 60);

    // debug
    for (let i = 0; i < 10; i++) {
        enemies.push(new Enemy(i * 100, 200));
    }

    // Schedule first enemy spawn
    setTimeout(enemySpawnManager, 1000);

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