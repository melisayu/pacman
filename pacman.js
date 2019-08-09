const TILE_SIZE = 20;
const PACMAN_RADIUS = 2 * TILE_SIZE;
const PACMAN_EYE_RADIUS = 0.2 * TILE_SIZE;
const PACMAN_EYE_X_OFFSET = 0.1 * PACMAN_RADIUS
const PACMAN_EYE_Y_OFFSET = -0.6 * PACMAN_RADIUS
const BALL_RADIUS = 0.25 * TILE_SIZE;

const BACKGROUND_STYLE = '#000';
const PACMAN_FILL_STYLE = '#FF0';
const PACMAN_STROKE_STYLE = '#000';
const PACMAN_EYE_FILL_STYLE = '#000';
const PACMAN_EYE_STROKE_STYLE = '#000';
const BALL_FILL_STYLE = '#FFF'

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Painter {
    constructor() {
        this.canvas = document.getElementById('pacmanCanvas');
        this.context = this.canvas.getContext('2d');
    }

    // Fills the canvas with a black background.
    drawBackground() {
        this.context.fillStyle = BACKGROUND_STYLE;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Draws pacman's head.
    drawPacman(pos) {
        // Draw head and mouth
        this.context.beginPath();
        this.context.arc(pos.x, pos.y, PACMAN_RADIUS, 0.2 * Math.PI, 1.8 * Math.PI);
        this.context.lineTo(pos.x, pos.y);
        this.context.closePath();

        this.context.fillStyle = PACMAN_FILL_STYLE;
        this.context.fill();
        this.context.strokeStyle = PACMAN_STROKE_STYLE;
        this.context.stroke();

        // Draw the eye
        const eye_pos = new Position(pos.x + PACMAN_EYE_X_OFFSET, pos.y + PACMAN_EYE_Y_OFFSET);
        this.context.beginPath();
        this.context.arc(eye_pos.x, eye_pos.y, PACMAN_EYE_RADIUS, 0, 2 * Math.PI);

        this.context.fillStyle = PACMAN_EYE_FILL_STYLE
        this.context.fill();
        this.context.strokeStyle = PACMAN_EYE_STROKE_STYLE;
        this.context.stroke();
    }

    // Draws a ball.
    drawBall(pos) {
        this.context.beginPath()
        this.context.arc(pos.x, pos.y, BALL_RADIUS, 0, 2 * Math.PI);
        this.context.fillStyle = BALL_FILL_STYLE
        this.context.fill()
    }

    // Draws ghost
    drawGhostBody() {
        this.context.beginPath();
        this.context.arc(460, 200, 60, 0, 2 * Math.PI);
        this.context.fillRect(400, 200, 120, 65);
        this.context.arc(420, 260, 20, 0, 2 * Math.PI);
        this.context.arc(500, 260, 20, 0, 2 * Math.PI);
        this.context.arc(460, 260, 20, 0, 2 * Math.PI);
        this.context.fill();
    }
    drawGhostEyes() {}
}

