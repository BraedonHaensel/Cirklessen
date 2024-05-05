class Button {
    x;
    y;
    width;
    height;
    text;
    font;
    color;
    textWidth;
    textHeight;
    textColor
    textX;
    textY;
    clickFunction;

    constructor(x, y, width, height, text, fontSize, color, textColor, clickFunction) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.font = `${fontSize}px serif`;
        this.color = color;
        this.textColor = textColor;
        this.clickFunction = clickFunction;
        this.calculateTextPosition();
    }

    calculateTextPosition() {
        // Measure text
        ctx.font = this.font;
        let metrics = ctx.measureText(this.text);
        this.textWidth = metrics.width;
        this.textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        // Calculate text position (centered within rect)
        let rectCenterX = this.x + this.width / 2;
        let rectCenterY = this.y + this.height / 2;
        this.textX = rectCenterX - this.textWidth / 2;
        this.textY = rectCenterY + this.textHeight / 2;
    }

    clickAt(x, y) {
        // Skip if not clicked
        if (x < this.x || x > this.x + this.width || 
            y < this.y || y > this.y + this.height) {
            return;
        }
        this.clickFunction();
    }

    draw() {
        // Draw button rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw text
        ctx.fillStyle = this.textColor;
        ctx.font = this.font;
        ctx.fillText(this.text, this.textX, this.textY);
    }
}

// Master manager for the user interfaces and menus
class UIManager {
    static draw() {
        Title.draw();
    }

    // Handle mouse clicks
    static clickAt(x, y) {
        console.log(x, y);
        Title.clickAt(x, y);
    }
}

function foo() {
    console.log("success");
}

class Title {
    static titleButtons = [new Button(100, 200, 200, 100, "ooo", 40, "blue", "red", foo)];

    static draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 100, 100);

        ctx.font = "48px serif";
        ctx.fillText("Hello world", 10, 50);

        Title.titleButtons.forEach(button => button.draw());
    }

    static clickAt(x, y) {
        Title.titleButtons.forEach(button => button.clickAt(x, y));
    }
}

