
class Painter {
    constructor() {
        this.canvas = document.getElementById('pacmanCanvas');
        this.context = this.canvas.getContext('2d');
    }

    // Fills the canvas with a black background.
    drawBackground() {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Draws pacman's head.
    drawPacman() {
        this.context.beginPath();
        this.context.arc(100, 100, 100, 0.2 * Math.PI, 1.8 * Math.PI);

        this.context.lineTo(100, 100);
        this.context.closePath();

        this.context.fillStyle = '#FF0';
        this.context.fill();

        this.context.strokeStyle = '#000';
        this.context.stroke();

        this.context.beginPath();
        this.context.arc(110, 40, 10, 0, 2 * Math.PI);
        this.context.fillStyle = "#000"
        this.context.fill();
        this.context.strokeStyle = '#000';
        this.context.stroke();
    }

    // Draws a ball.
    drawBall() {
        this.context.beginPath()
        this.context.arc(700, 80, 10, 0, 2 * Math.PI);
        this.context.fillStyle = '#FFF'
        this.context.fill()
    }
}

