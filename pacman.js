const TILE_RADIUS = 20;
const TILE_SIZE = 2 * TILE_RADIUS;
const PACMAN_RADIUS = 1.7 * TILE_RADIUS;
const PACMAN_STROKE_WIDTH = 1;
const PACMAN_EYE_RADIUS = 0.1 * PACMAN_RADIUS;
const PACMAN_EYE_X_OFFSET = 0.1 * PACMAN_RADIUS
const PACMAN_EYE_Y_OFFSET = -0.6 * PACMAN_RADIUS
const BALL_RADIUS = 0.25 * TILE_SIZE;
const WALL_WIDTH = 0.5 * TILE_RADIUS;

const BACKGROUND_STYLE = '#000';
const PACMAN_FILL_STYLE = '#FF0';
const PACMAN_STROKE_STYLE = '#000';
const PACMAN_EYE_FILL_STYLE = '#000';
const PACMAN_EYE_STROKE_STYLE = '#000';
const BALL_FILL_STYLE = '#FFF'
const WALL_STYLE = '#55F'

const TILE_EMPTY = ' ';
const TILE_BALL = '·';
const TILE_WALL_H = '─';
const TILE_WALL_V = '│';
const TILE_WALL_SE = '╭';
const TILE_WALL_SW = '╮';
const TILE_WALL_NW = '╯';
const TILE_WALL_NE = '╰';

const SIDE_N = 1;
const SIDE_E = 2;
const SIDE_S = 3;
const SIDE_W = 4;

const BOARDS = [
    '╭─╮\n' +
    '│·│\n' +
    '╰─╯\n',
    '╭──────╮\n' +
    '│ ·····│\n' +
    '╰─╮·╭──╯\n' +
    '  │·╰──╮\n' +
    '  ╰────╯\n'];

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(that) {
        return new Position(this.x + that.x, this.y + that.y);
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

        this.context.lineWidth = PACMAN_STROKE_WIDTH;
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
        this.context.beginPath();
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

        
        this.context.beginPath();
        this.context.arc(430, 200, 15, 0, 2 * Math.PI);
        this.context.fillStyle = "white";
        this.context.fill();
        this.context.lineWidth = 2;
        this.context.strokeStyle = "black";
        this.context.stroke();

        this.context.beginPath();
        this.context.arc(435, 200, 10, 0, 2 * Math.PI);
        this.context.fillStyle = "blue";
        this.context.fill();
    
        this.context.beginPath();
        this.context.arc(490, 200, 15, 0, 2 * Math.PI);
        this.context.fillStyle = "white";
        this.context.fill();
        this.context.lineWidth = 2;
        this.context.strokeStyle = "black";
        this.context.stroke();

        this.context.beginPath();
        this.context.arc(495, 200, 10, 0, 2 * Math.PI);
        this.context.fillStyle = "blue";
        this.context.fill();
    }
}

class BasicTile {
    constructor(position) {
        this.position = position;
    }

    paint(painter) {
        // Basic tile leaves the tile empty.
    }
}

class BallTile extends BasicTile {
    constructor(position) {
        super(position);
    }

    paint(painter) {
        painter.drawBall(this.position);
    }
}

class HorizontalWallTile extends BasicTile {
    constructor(position) {
        super(position);
    }

    paint(painter) {
        painter.context.beginPath();
        painter.context.moveTo(this.position.x - TILE_RADIUS, this.position.y);
        painter.context.lineTo(this.position.x + TILE_RADIUS, this.position.y);
        painter.context.lineWidth = WALL_WIDTH;
        painter.context.strokeStyle = WALL_STYLE;
        painter.context.stroke();
    }
}

class VerticalWallTile extends BasicTile {
    constructor(position) {
        super(position);
    }

    paint(painter) {
        painter.context.beginPath();
        painter.context.moveTo(this.position.x, this.position.y - TILE_RADIUS);
        painter.context.lineTo(this.position.x, this.position.y + TILE_RADIUS);
        painter.context.lineWidth = WALL_WIDTH;
        painter.context.strokeStyle = WALL_STYLE;
        painter.context.stroke();
    }
}

class TurnWallTile extends BasicTile {
    constructor(position, side1, side2) {
        super(position);

        this.origin = new Position(position.x, position.y);
        if (side1 == SIDE_N) {
            this.origin.y -= TILE_RADIUS;
            this.start_angle = 0.5 * Math.PI;
            this.anticlockwise = true;
        } else if (side1 == SIDE_S) {
            this.origin.y += TILE_RADIUS;
            this.start_angle = 1.5 * Math.PI;
            this.anticlockwise = false;
        }
        if (side2 == SIDE_W) {
            this.origin.x -= TILE_RADIUS;
            this.end_angle = 2.0 * Math.PI;
        } else if (side2 == SIDE_E) {
            this.origin.x += TILE_RADIUS;
            this.end_angle = 1.0 * Math.PI;
            this.anticlockwise = !this.anticlockwise;
        }
    }

    paint(painter) {
        painter.context.beginPath();
        painter.context.arc(
            this.origin.x,
            this.origin.y,
            TILE_RADIUS,
            this.start_angle,
            this.end_angle,
            this.anticlockwise
        );
        painter.context.lineWidth = WALL_WIDTH;
        painter.context.strokeStyle = WALL_STYLE;
        painter.context.stroke();
    }
}

class Board {
    // The boards is constructed from a string to make it easy to visualy define its layout.
    constructor(template, position) {
        this.tiles = [];
        for (let [y, subtemplate] of template.split('\n').entries()) {
            let row = []
            for (let [x, element] of subtemplate.split('').entries()) {
                let pos = new Position(TILE_SIZE * x + position.x, TILE_SIZE * y + position.y);
                let tile = new BasicTile(pos);
                if (element == TILE_BALL) {
                    tile = new BallTile(pos);
                } else if (element == TILE_WALL_H) {
                    tile = new HorizontalWallTile(pos);
                } else if (element == TILE_WALL_V) {
                    tile = new VerticalWallTile(pos);
                } else if (element == TILE_WALL_NW) {
                    tile = new TurnWallTile(pos, SIDE_N, SIDE_W);
                } else if (element == TILE_WALL_NE) {
                    tile = new TurnWallTile(pos, SIDE_N, SIDE_E);
                } else if (element == TILE_WALL_SE) {
                    tile = new TurnWallTile(pos, SIDE_S, SIDE_E);
                } else if (element == TILE_WALL_SW) {
                    tile = new TurnWallTile(pos, SIDE_S, SIDE_W);
                }
                row.push(tile);
            }
            this.tiles.push(row);
        }
    }

    paint(painter) {
        for (let row of this.tiles) {
            for (let tile of row) {
                tile.paint(painter);
            }
        }
    }
}

