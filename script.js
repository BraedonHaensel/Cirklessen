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
let gameState;
let player;
let ship;
let enemies = [];

// Note: Compare with gameState == gameStates.<State>
const GameStates = {
    RUNNING: 0,
    TITLE: 1,
    GAMEOVER: 2
}
gameState = GameStates.TITLE;

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
    static maxSpawnRadius = 20;
    static minSpawnRadius = 2;
    static spawnVelocity = 5;

    constructor(x, y, velx, vely, radius) {
        super(x, y, radius);
        this.velx = velx;
        this.vely = vely;
        this.color = getRandomColor();
    }

    // No constructor needed, as all args can go straight to super()
    static getNewEnemy() {
        // Random spawn radius within range
        let radius = getRandomInt(Enemy.maxSpawnRadius - Enemy.minSpawnRadius) + Enemy.minSpawnRadius;

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
    setTimeout(enemySpawnManager, 300);
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

    updateDifficulty() {
        // Difficulty scales based on player size
    }

    eat(enemy) {
        // Grow based on enemy's size
        this.radius += Math.max(1, enemy.radius * 0.1);
        // Update enemy spawn radius
        Enemy.maxSpawnRadius = this.radius * 2;
        Enemy.minSpawnRadius = this.radius * 0.2;
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
    // Draw the background
    drawBackground();

    if (gameState != GameStates.RUNNING) {
        // Draw UI
        UIManager.draw();
        return;
    }

    // Update elements
    player.update();
    enemies.forEach(enemy => enemy.update());
    checkCollisions();

    // Draw elements
    enemies.forEach(enemy => enemy.draw());
    player.draw();
}

// START A NEW GAME
function newGame () {
    // Spawn player
    player = new Player(canvas.width / 2, canvas.height / 2, 10);

    // Schedule first enemy spawn
    setTimeout(enemySpawnManager, 1000);

    // Update game state
    gameState = GameStates.RUNNING;
}

function keyDown (e) {
    if (gameState != GameStates.RUNNING) {
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
    if (gameState != GameStates.RUNNING) {
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

function mouseClick(e) {
    // Get coordinates relative to canvas
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    let x = (e.clientX - rect.left) * scaleX;
    let y = (e.clientY - rect.top) * scaleY;

    // Pass to UI Manager
    UIManager.clickAt(x, y);
}

// Add keyboard event listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
canvas.addEventListener("click", mouseClick);

// Set update interval
setInterval(update, 1000 / FPS); // call update every 1/FPS seconds