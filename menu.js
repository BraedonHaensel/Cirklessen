function getTextSize(text, font) {
    ctx.font = font;
    let metrics = ctx.measureText(text);
    let textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    console.log(metrics.width);
    return {width: metrics.width, height: textHeight};
}

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
        let textSize = getTextSize(this.text, this.font);
        this.textWidth = textSize.width;
        this.textHeight = textSize.height;

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

class Text {
    constructor(text, font, color, x, y) {
        this.text = text;
        this.font = font;
        this.color = color;
        this.x = x;
        this.y = y;
    }

    draw() {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }
}

class BorderedText extends Text {
    constructor(text, font, color, x, y, borderColor) {
        super(text, font, color, x, y);
        this.borderColor = borderColor;
    }

    draw() {
        super.draw();
        // Border
        ctx.fillStyle = this.borderColor;
        ctx.strokeText(this.text, this.x, this.y); 
    }
}

function foo() {
    console.log("success");
}

class Title {
    static titleButtons = [
        new Button(100, 200, 200, 100, "ooo", 40, "blue", "red", foo),
    ];
    static titleTexts = [];

    // Setup title text
    static {
        let z;
        let titleText = "CIRKLESSEN"
        let titleFont = "120px Arial Black";
        let titleColor = "rgba(200, 200, 200, 1)";
        let titleBorderColor = "black";
        let textSize = getTextSize(titleText, titleFont)
        let titleX = canvas.width / 2 - textSize.width / 2
        let titleY = canvas.height * 0.2;
        this.titleTexts.push(new BorderedText(titleText, titleFont, titleColor, titleX, titleY, titleBorderColor));
    }

    // Setup start button
    static {
        
    }



    static draw() {
        // Background blur
        ctx.fillStyle = "rgba(100, 100, 100, 0.50)";
        ctx.roundRect(canvas.width * 0.05, canvas.height * 0.05, 
                        canvas.width * 0.9, canvas.height * 0.9, 50);
        ctx.fill();

        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 100, 100);

        ctx.font = "48px serif";
        ctx.fillText("Hello world", 10, 50);

        // Draw elements
        Title.titleTexts.forEach(text => text.draw());
        Title.titleButtons.forEach(button => button.draw());
    }

    static clickAt(x, y) {
        Title.titleButtons.forEach(button => button.clickAt(x, y));
    }
}

