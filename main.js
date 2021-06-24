// grab a reference of our "canvas" using its id
const canvas = document.getElementById('canvas');
// get a "context". Without "context" we can't draw on canvas
const ctx = canvas.getContext('2d');
// extra variables
const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

let upArrowPressed = false;
let downArrowPressed = false;

/* objects */
// draw the rest of the objects like net, userPaddle, aiPaddle, ball, etc ...
// add each objects properities like width, height, position, color, etc ...

const net = {
    x: canvas.width / 2 - netWidth / 2,
    y: 0,
    width: netWidth,
    height: netHeight,
    color: "#FFF"
};

const userPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FFF',
    score: 0
};

const aiPaddle = {
    x: canvas.width - (paddleWidth + 10),
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FFF',
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: "#05EDFF"
};

// drawing functions
function drawNet() {
    ctx.fillStyle = net.color;
    ctx.fillRect(net.x, net.y, net.width, net.height);
}

function drawScore(x, y, score) {
    ctx.fillStyle = "#fff";
    ctx.font = '35px san-serif';
    ctx.fillText(score, x, y);
}

function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();

    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// draw game board
function render() {
    // set a style
    ctx.fillStyle = "#000"; // whatever comes after this acquires the color black
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);

    drawNet();
    drawScore(canvas.width / 4, canvas.height / 6, userPaddle.score);
    drawScore(3 * canvas.width / 4, canvas.height / 6, aiPaddle.score);
    drawPaddle(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, userPaddle.color);
    drawPaddle(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, aiPaddle.color);
    drawBall(ball.x, ball.y, ball.radius, ball.color);
}

/* moving Paddles */
window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
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

function keyUpHandler(event) {
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

function reset() {
    // reset ball's value to older values (position)
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;

    // changes the direction of the ball
    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
    
}

// // collision Detect function
function collisionDetect(player, ball) {
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

function update() {
    // move paddle
    if (upArrowPressed && userPaddle.y > 0) {
        userPaddle.y -= 8;
    } else if (downArrowPressed && (userPaddle.y < canvas.height - userPaddle.height)) {
        userPaddle.y += 8;
    }
    // check if ball hits top of bottom wall
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        ball.velocityY = -ball.velocityY
    }

    // if ball hit on right wall
    if (ball.x + ball.radius >= canvas.width) {
        userPaddle.score += 1;
        reset();
    }

    //if ball hit on left wall
    if (ball.x - ball.radius <= 0) {
        aiPaddle.score += 1;
        reset();
    }

    // move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // aiPaddle movement
    // Tweak the last value 0.09 to make game harder
    aiPaddle.y += ((ball.y - (aiPaddle.y + aiPaddle.height / 2))) * 0.09; 

    // collision detection on Paddles
    let player = (ball.x < canvas.width / 2) ? userPaddle : aiPaddle;

    if (collisionDetect(player, ball)) {
        let angle = 0; // default angle is 0deg radian

        // if ball hits the top half of paddle vs. bottom half of paddle
        if (ball.y < (player.y + player.height / 2)) {
            angle = -1 * Math.PI / 4; // -45 deg
        } else if (ball.y > (player.y + player.height / 2)) {
            angle = Math.PI / 4; // 45 deg
        }
        
        // change velocity of ball depending on which paddle was hit
        ball.velocityX = (player === userPaddle ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
    
        //increase ball speed
        ball.speed += 0.2;
    }
    
}

function gameLoop() {
    update();
    render();
}

setInterval(gameLoop, 1000 / 60); // 60 fps


