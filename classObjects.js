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

class Paddle {
    constructor(x, y = canvas.height / 2 - 50, width = 10, height = 100, color = 'white') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    drawPaddle(x, y, width, height, color) {
        this.fillStyle = color;
        this.ctx.fillRect(x, y, width, height)
    }

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    
    move(upArrowPressed, downArrowPressed) {

    }

    keyDownHandler(event) {
        switch (event.keyCode) {
            // 'up arrow' key
            case 38: 
                upArrowPressed = true;
                break;
            // 'down arrow' key
            case 40:
                downArrowPressed = true;
                break;
        }
    }
    
    keyUpHandler(event) {
        switch (event.keyCode) {
            // 'up arrow' key
            case 38: 
                upArrowPressed = false;
                break;
            // 'down arrow' key
            case 40:
                downArrowPressed = false;
                break;
        }
    }

}

class Net {
    constructor(width = 4, height = canvas.height, x = canvas.width / 2 - width / 2, y = 0, color = 'white') {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    drawNet() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Ball {
    constructor(x = canvas.width / 2, y = canvas.height / 2, radius = 7, speed = 7, velocityX = 5, velocityY = 5, color = 'cyan') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
    }
    drawBall(x, y, radius, color) {
        this.fillStyle = color;
        this.ctx.beginPath();

        this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

class Score {
    constructor(x, y, score = 0, color = 'white', font = '35px san-serif') {
        this.x = x;
        this.y = y;
        this.score = score;
        this.color = color;
        this.font = font;
    }

    drawScore(x, y, score = 0) {
        this.ctx.fillStyle = this.color;
        this.ctx.font = font;
        this.ctx.fillText(score, x, y);
    }

    reset() {
        // reset ball's value to older values (position)
        this.ball.x = canvas.width / 2;
        this.ball.y = canvas.height / 2;
        this.ball.speed = 7;
    
        // changes the direction of the ball
        this.ball.velocityX = -ball.velocityX;
        this.ball.velocityY = -ball.velocityY;
    }
}


class Pong { // run the game 
    constructor(canvasId, fps) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext('2d'); 
        this.fps = fps;
        this.userPaddle = new Paddle();
        this.aiPaddle = new Paddle();
        this.net = new Net();
        this.ball = new Ball();
        this.userScore = new Score();
        this.aiScore = new Score();

    }

    // game functions
    drawCanvas() {
        this.ctx.fillStyle = "black";
        this.ctx(0, 0, this.canvas.width, this.canvas.height)
    }
    update() {
        if (upArrowPressed && userPaddle.y > 0) {
            userPaddle.y -= 8;
        } else if (downArrowPressed && (userPaddle.y < canvas.height - userPaddle.height)) {
            userPaddle.y += 8;
        }
        if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
            ball.velocityY = -ball.velocityY
        }
    
        if (ball.x + ball.radius >= canvas.width) {
            userPaddle.score += 1;
            reset();
        }
    
        if (ball.x - ball.radius <= 0) {
            aiPaddle.score += 1;
            reset();
        }
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        aiPaddle.y += ((ball.y - (aiPaddle.y + aiPaddle.height / 2))) * 0.09; 

        let player = (ball.x < canvas.width / 2) ? userPaddle : aiPaddle;

        if (collisionDetect(player, ball)) {
            let angle = 0; // default angle is 0deg radian

            if (ball.y < (player.y + player.height / 2)) {
                angle = -1 * Math.PI / 4; // -45 deg
            } else if (ball.y > (player.y + player.height / 2)) {
                angle = Math.PI / 4; // 45 deg
            }
            
            ball.velocityX = (player === userPaddle ? 1 : -1) * ball.speed * Math.cos(angle);
            ball.velocityY = ball.speed * Math.sin(angle);
        
            ball.speed += 0.2;
        }
    
    }

    render() {
        // set a style
        ctx.fillStyle = "#black"; 
    
        this.drawNet();
        this.drawScore(canvas.width / 4, canvas.height / 6, userPaddle.score);
        this.drawScore(3 * canvas.width / 4, canvas.height / 6, aiPaddle.score);
        this.drawPaddle(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, userPaddle.color);
        this.drawPaddle(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, aiPaddle.color);
        this.drawBall(ball.x, ball.y, ball.radius, ball.color);
    }

    collisionDetect(player, ball) {
        player.top = player.y;
        player.right = player.x + player.width;
        player.bottom = player.y + player.height;
        player.left = player.x;
    
        ball.top = ball.y - ball.radius;
        ball.right = ball.x + ball.radius;
        ball.bottom = ball.y + ball.radius;
        ball.left = ball.x - ball.radius;
    
        return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
    }
    gameLoop() {
        this.update();
        this.render();
    }
    
    setInterval(gameLoop, 1000 / 60); // fps

}












