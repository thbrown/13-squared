// Square particle properties
class FloatingSquare {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.angle = Math.random() * 2 * Math.PI; // Initial rotation angle
        this.rotationSpeed = (Math.random() - 0.5) * 0.02; // Random rotation speed and direction
        this.speedX = (Math.random() - 0.5) * 2; // Horizontal movement speed
        this.speedY = (Math.random() - 0.5) * 2; // Vertical movement speed
    }

    update() {
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around the canvas
        const MARGIN = -100;
        if (this.x > window.innerWidth - MARGIN) this.x = MARGIN;
        if (this.x < MARGIN) this.x = window.innerWidth - MARGIN;
        if (this.y > window.innerHeight - MARGIN) this.y = MARGIN;
        if (this.y < MARGIN) this.y = window.innerHeight - MARGIN;

        // Update rotation angle
        this.angle += this.rotationSpeed;
    }

    draw(ctx) {
        ctx.save();
        
        // Translate and rotate the square
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.angle);
        ctx.translate(-this.size / 2, -this.size / 2); // Center rotation around the square
        
        // Draw the square
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.size, this.size);
        
        // Set text properties
        ctx.fillStyle = '#fff';
        ctx.font = `${this.size / 2}px Arial`;
        
        // Measure text to center it
        const text = "13";
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
        
        // Calculate position to center the text
        const textX = (this.size - textWidth) / 2;
        const textY = (this.size + textHeight) / 2 - textMetrics.actualBoundingBoxDescent;
        
        // Draw the number 13 centered
        ctx.fillText(text, textX, textY);
        
        ctx.restore();
    }
}

/*
        const textAttr = context.measureText(text);
        const textWidth = textAttr.width;
        const textHeight = textAttr.actualBoundingBoxAscent + textAttr.actualBoundingBoxDescent;
        */

export class FloatingSquaresEffect {
    constructor(rate, canvas) {
        this.canvas = canvas;
        this.rate = rate;
        this.ctx = canvas.getContext('2d');
        this.squares = [];
        this.animationId = null;
        this.isRunning = false;
    }

    createSquare(x, y) {
        const colors = ['#ff4949', '#ffcc00', '#4caf50', '#2196f3', '#9c27b0'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 40 + 20; // Random size between 20 and 60

        this.squares.push(new FloatingSquare(x, y, size, color));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.squares.forEach(square => {
            square.update();
            square.draw(this.ctx);
        });

        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    createSquares() {
        for (let i = 0; i < 50; i++) {
            this.createSquare(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.createSquares();
        this.animate();
    }

    stop() {
        console.log("STOPPING");
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}