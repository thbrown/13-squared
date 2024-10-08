
// Firework particle properties
class FireworkParticle {
    constructor(x, y, color, longLasting) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 2 + 1;
        this.angle = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 5 + .01;
        this.friction = longLasting ? .999 : 0.98;
        this.gravity = 0.05;
        this.opacity = 1;
        this.decay = longLasting ? .004 : .01 ;//Math.random() * 0.01 + 0.005; // Flicker isn't as good I don't think
    }

    update() {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.opacity -= this.decay;
        this.opacity = Math.max(0, this.opacity);
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        if(Math.random() > 1) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.font = `${this.size}px Arial`; // Set font size and type
            ctx.fillText("13", this.x, this.y); // Draw "13" instead of a circle
        }
        ctx.restore();
    }
}

export class FireworkEffect {

    constructor(rate, canvas) {
        this.canvas = canvas;
        this.rate = rate;
        this.ctx = canvas.getContext('2d');
        console.log("Canvas", this.canvas, this.ctx);
        this.fireworks = [];
        this.animationId = null;
        this.isRunning = false;
        this.fireworksTimeout = null;
    }

    createFirework(x, y, big) {
        const colors = ['#ff4949', '#ffcc00', '#4caf50', '#2196f3', '#9c27b0'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        if(big) {
            for(let selectColor of colors) {
                for (let i = 0; i < 500; i++) {
                    this.fireworks.push(new FireworkParticle(x, y, selectColor, true));
                }
            }
        } else {
            for (let i = 0; i < 100; i++) {
                this.fireworks.push(new FireworkParticle(x, y, color, false));
            }
        }

    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.fireworks = this.fireworks.filter(particle => particle.opacity > 0);
        this.fireworks.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    sample_poisson(lambda) {
        return -Math.log(Math.random()) / lambda;
    }

    createPoissonFirework() {
        if (!this.isRunning) return;
        this.createFirework(window.innerWidth * Math.random(), window.innerHeight * Math.random());
        const interval = this.sample_poisson(10);
        this.fireworksTimeout = setTimeout(this.createPoissonFirework.bind(this), interval * 1000);
    }

    startFireworks() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.createPoissonFirework();
        this.animate();
    }

    stopFireworks() {
        this.isRunning = false;
        clearTimeout(this.fireworksTimeout)
        cancelAnimationFrame(this.animationId);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}

