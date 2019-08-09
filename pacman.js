
const Size = new (function () {
    this.TILE_RADIUS = 20;
    this.CREATURE_RADIUS = 1.7 * this.TILE_RADIUS;
    this.PACMAN = {
        RADIUS: this.CREATURE_RADIUS,
        STROKE_WIDTH: 1,
        EYE_RADIUS: 0.1 * this.CREATURE_RADIUS,
        EYE_X_OFFSET: 0.1 * this.CREATURE_RADIUS,
        EYE_Y_OFFSET: -0.6 * this.CREATURE_RADIUS,
    };
    this.BALL_RADIUS = 0.5 * this.TILE_RADIUS;
    this.WALL_WIDTH = 0.5 * this.TILE_RADIUS;
})();

const Style = {
    BACKGROUND: '#000',
    PACMAN_FILL: '#FF0',
    PACMAN_STROKE: '#000',
    PACMAN_EYE_FILL: '#000',
    PACMAN_EYE_STROKE: '#000',
    BALL_FILL: '#FFF',
    WALL: '#55F',
};

const Tile = {
    EMPTY: ' ',
    BALL: '·',
    WALL_H: '─',
    WALL_V: '│',
    WALL_SE: '╭',
    WALL_SW: '╮',
    WALL_NW: '╯',
    WALL_NE: '╰',
};

const Side = {
    N: 1,
    E: 2,
    S: 3,
    W: 4,
};

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
        this.context.fillStyle = Style.BACKGROUND;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Draws a ball.
    drawBall(pos) {
        this.context.beginPath();
        this.context.arc(pos.x, pos.y, Size.BALL_RADIUS, 0, 2 * Math.PI);
        this.context.fillStyle = Style.BALL_FILL;
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
        painter.context.moveTo(this.position.x - Size.TILE_RADIUS, this.position.y);
        painter.context.lineTo(this.position.x + Size.TILE_RADIUS, this.position.y);
        painter.context.lineWidth = Size.WALL_WIDTH;
        painter.context.strokeStyle = Style.WALL;
        painter.context.stroke();
    }
}

class VerticalWallTile extends BasicTile {
    constructor(position) {
        super(position);
    }

    paint(painter) {
        painter.context.beginPath();
        painter.context.moveTo(this.position.x, this.position.y - Size.TILE_RADIUS);
        painter.context.lineTo(this.position.x, this.position.y + Size.TILE_RADIUS);
        painter.context.lineWidth = Size.WALL_WIDTH;
        painter.context.strokeStyle = Style.WALL;
        painter.context.stroke();
    }
}

class TurnWallTile extends BasicTile {
    constructor(position, side1, side2) {
        super(position);

        this.origin = new Position(position.x, position.y);
        if (side1 == Side.N) {
            this.origin.y -= Size.TILE_RADIUS;
            this.start_angle = 0.5 * Math.PI;
            this.anticlockwise = true;
        } else if (side1 == Side.S) {
            this.origin.y += Size.TILE_RADIUS;
            this.start_angle = 1.5 * Math.PI;
            this.anticlockwise = false;
        }
        if (side2 == Side.W) {
            this.origin.x -= Size.TILE_RADIUS;
            this.end_angle = 2.0 * Math.PI;
        } else if (side2 == Side.E) {
            this.origin.x += Size.TILE_RADIUS;
            this.end_angle = 1.0 * Math.PI;
            this.anticlockwise = !this.anticlockwise;
        }
    }

    paint(painter) {
        painter.context.beginPath();
        painter.context.arc(
            this.origin.x,
            this.origin.y,
            Size.TILE_RADIUS,
            this.start_angle,
            this.end_angle,
            this.anticlockwise
        );
        painter.context.lineWidth = Size.WALL_WIDTH;
        painter.context.strokeStyle = Style.WALL;
        painter.context.stroke();
    }
}

class Pacman {
    constructor(position) {
        this.move_to(position);
    }

    move_to(position) {
        this.position = position;
    }

    paint(painter) {
        // Draw head and mouth
        painter.context.beginPath();
        painter.context.arc(
            this.position.x,
            this.position.y,
            Size.PACMAN.RADIUS,
            0.2 * Math.PI,
            1.8 * Math.PI
        );
        painter.context.lineTo(this.position.x, this.position.y);
        painter.context.closePath();

        painter.context.lineWidth = Size.PACMAN.STROKE_WIDTH;
        painter.context.fillStyle = Style.PACMAN_FILL;
        painter.context.fill();
        painter.context.strokeStyle = Style.PACMAN_STROKE;
        painter.context.stroke();

        // Draw the eye
        const eye_pos = new Position(
            this.position.x + Size.PACMAN.EYE_X_OFFSET,
            this.position.y + Size.PACMAN.EYE_Y_OFFSET
        );
        painter.context.beginPath();
        painter.context.arc(eye_pos.x, eye_pos.y, Size.PACMAN.EYE_RADIUS, 0, 2 * Math.PI);

        painter.context.fillStyle = Style.PACMAN_EYE_FILL;
        painter.context.fill();
        painter.context.strokeStyle = Style.PACMAN_EYE_STROKE;
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
                let pos = new Position(
                    2 * Size.TILE_RADIUS * x + position.x,
                    2 * Size.TILE_RADIUS * y + position.y
                );
                let tile = new BasicTile(pos);
                if (element == Tile.BALL) {
                    tile = new BallTile(pos);
                } else if (element == Tile.WALL_H) {
                    tile = new HorizontalWallTile(pos);
                } else if (element == Tile.WALL_V) {
                    tile = new VerticalWallTile(pos);
                } else if (element == Tile.WALL_NW) {
                    tile = new TurnWallTile(pos, Side.N, Side.W);
                } else if (element == Tile.WALL_NE) {
                    tile = new TurnWallTile(pos, Side.N, Side.E);
                } else if (element == Tile.WALL_SE) {
                    tile = new TurnWallTile(pos, Side.S, Side.E);
                } else if (element == Tile.WALL_SW) {
                    tile = new TurnWallTile(pos, Side.S, Side.W);
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

