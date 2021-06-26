/*

1. Initialize
2. Update positions of entities per frame
    Ex. detect collision
3. Event Listeners

Single Principle of Responsibility (SRP / SOLID)
Class Objects are a way of defining an object in code w/ better sys architecture
Always uppercase first letter of class, rest of code is camelCase
Every object has selector called this.
The 'new' keyword instantiates new instance of the class

WHen you hve a class, you can use the class to create new objects

Do I need to make a class Canvas?
*/

// event listeners are global --> move to Pong 


// make aiPaddle work
// ball render and appear
// draw net
// draw scores  keep inside game class (Pong) as global var
// collision (last part)

class Paddle {
    constructor(x, y, ctx, speed, canvasHeight, width=10, height=100, color='white') {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.color = color;
        this.canvasHeight = canvasHeight;
        this.direction = 0;
    }

    render() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    move(upArrowPressed, downArrowPressed) {
        if (upArrowPressed && this.y > 0) {
            this.y -= 8;
        } else if (downArrowPressed && (this.y < this.canvasHeight - this.height)) {
            this.y += 8;
        }
    }
}

class Net {
    constructor(width, height, ctx, x, y, color) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.ctx = ctx;
        
    }

    render() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Ball {
    constructor(x, y , ctx, radius, speed, velocityX, velocityY, color, canvasHeight, canvasWidth) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
        this.ctx = ctx;
        this.canvasHeight;
        this.canvasWidth;
    }

    render() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
    }

    reset() { //in update function
        // reset ball's value to older values (position)
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight / 2;
        this.speed = 7;
    
        // changes the direction of the ball
        this.velocityX = -this.velocityX;
        this.velocityY = -this.velocityY;
    }
}

// class Score {
//     constructor(x, y, score = 0, color = 'white', font = '35px san-serif') {
//         this.x = x;
//         this.y = y;
//         this.score = score;
//         this.color = color;
//         this.font = font;
//     }

//     drawScore(x, y, score = 0) {
//         this.ctx.fillStyle = this.color;
//         this.ctx.font = font;
//         this.ctx.fillText(score, x, y);
//     }

//     
// }

// let upArrowPressed = false;
// let downArrowPressed = false;



class Pong { // run the game 
    constructor(canvasId, fps) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d'); 
        this.fps = fps;
        this.paddleSpeed = 8;
        this.userPaddle = new Paddle(10, this.canvas.height / 2 - 50, this.ctx, this.paddleSpeed, this.canvas.height);
        this.aiPaddle = new Paddle(this.canvas.width - 20, this.canvas.height / 2 - 50, this.ctx, this.paddleSpeed, this.canvas.height);
        this.net = new Net(4, this.canvas.height, this.ctx, this.canvas.width / 2 - 2, 0, 'white');
        this.ball = new Ball(canvas.width / 2, canvas.height / 2, this.ctx, 7, 7, 5, 5, 'cyan', this.canvas.height, this.canvas.width);
        // this.userScore = new Score();
        // this.aiScore = new Score();
        this.upArrowPressed = false;
        this.downArrowPressed = false;

        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);

        window.addEventListener('keydown', this.keyDownHandler);
        window.addEventListener('keyup', this.keyUpHandler);   
        
        // if under, bind to window

    }

    // movement
    keyDownHandler(event) {
        switch (event.keyCode) {
            // 'up arrow' key
            case 38: 
                this.userPaddle.direction = -1;
                this.upArrowPressed = true;
                
                break;
            // 'down arrow' key
            case 40:
                this.userPaddle.direction = 1;
                this.downArrowPressed = true;
                break;
        }
    }
    
    keyUpHandler(event) {
        switch (event.keyCode) {
            // 'up arrow' key
            case 38: 
                this.userPaddle.direction = 0;
                this.upArrowPressed = false;
                break;
            // 'down arrow' key
            case 40:
                this.userPaddle.direction = 0;
                this.downArrowPressed = false;
                break;
        }
    }
    // game functions
    renderCanvas() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    update() {
        this.userPaddle.move(this.upArrowPressed, this.downArrowPressed);

        if (this.ball.y + this.ball.radius >= this.canvas.height || this.ball.y - this.ball.radius <= 0) {
            this.ball.velocityY = -this.ball.velocityY
        }
    
        if (this.ball.x + this.ball.radius >= this.canvas.width) {
            // userPaddle.score += 1;
            this.ball.reset();
        }
    
        if (this.ball.x - this.ball.radius <= 0) {
            // aiPaddle.score += 1;
            this.ball.reset();
        }
        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;

        // aiPaddle.y += ((ball.y - (aiPaddle.y + aiPaddle.height / 2))) * 0.09; 

        // let player = (ball.x < canvas.width / 2) ? userPaddle : aiPaddle;

        // if (collisionDetect(player, ball)) {
        //     let angle = 0; // default angle is 0deg radian

        //     if (ball.y < (player.y + player.height / 2)) {
        //         angle = -1 * Math.PI / 4; // -45 deg
        //     } else if (ball.y > (player.y + player.height / 2)) {
        //         angle = Math.PI / 4; // 45 deg
        //     }
            
        //     ball.velocityX = (player === userPaddle ? 1 : -1) * ball.speed * Math.cos(angle);
        //     ball.velocityY = ball.speed * Math.sin(angle);
        
        //     ball.speed += 0.2;
        // }
    
    }

    // render canvas and paddle only
    // don't worry about collison and score for now

    render() {
        // set a style
        this.renderCanvas();
        this.net.render();
        // this.drawScore(canvas.width / 4, canvas.height / 6, userPaddle.score);
        // this.drawScore(3 * canvas.width / 4, canvas.height / 6, aiPaddle.score);

        this.userPaddle.render();
        this.aiPaddle.render();
        this.ball.render();
        
    }

    // collisionDetect(player, ball) {
    //     player.top = player.y;
    //     player.right = player.x + player.width;
    //     player.bottom = player.y + player.height;
    //     player.left = player.x;
    
    //     ball.top = ball.y - ball.radius;
    //     ball.right = ball.x + ball.radius;
    //     ball.bottom = ball.y + ball.radius;
    //     ball.left = ball.x - ball.radius;
    
    //     return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
    // }

    gameLoop() {
        this.update();
        this.render();
    }
    
    start() {
        setInterval(this.gameLoop.bind(this), this.fps); // fps -- look up what .bind does 
    }

}












