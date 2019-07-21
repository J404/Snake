let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let cols = Math.floor(canvas.width / 20);
let rows = Math.floor(canvas.height / 20);
let snakeColor = "#ffffff";
let foodColor = "#ff0000";
let s = new snake();
let f = new food();
let highScore = 0;
let tickSpeed = 90;
let tailPositions = [];
let aiMode = false;
s.x = 20;
s.y = 20;

let tick = setInterval(updateArea, tickSpeed);

document.addEventListener("keydown", function(e) {
    if (e.keyCode === 37 && s.head.velX !== 1) {
        s.dir(-1, 0);
    } else if (e.keyCode === 38 && s.head.velY !== 1) {
        s.dir(0, -1);
    } else if (e.keyCode === 39 && s.head.velX !== -1) {
        s.dir(1, 0);
    } else if (e.keyCode === 40 && s.head.velY !== -1) {
        s.dir(0, 1);
    }
});

document.getElementById("settings").addEventListener("click", function() {
    document.getElementById("overlay").style.animation = "fadeinhalf .25s linear 1";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("settings-popup").style.animation = "fadein .5s linear 1";
    document.getElementById("settings-popup").style.display = "block";
    document.getElementById("settings").style.color = "#adadad";
});

document.getElementById("settingsChange").addEventListener("click", function() {
    tickSpeed = document.getElementById("tickSpeed").value;
    clearInterval(tick);
    tick = setInterval(updateArea, tickSpeed);
    aiMode = document.getElementById("aimode").checked;

    if (document.getElementById("snakeColor").value.indexOf("#") == -1 || document.getElementById("appleColor").value.indexOf("#") == -1) {
        alert("Colors must be in hex format (e.g. #ffffff)");
    } else {
        snakeColor = document.getElementById("snakeColor").value;
        foodColor = document.getElementById("appleColor").value;
    }

    document.getElementById("overlay").style.animation = "fadeouthalf 0.25s linear 1";
    document.getElementById("settings-popup").style.animation = "fadeout 0.25s linear 1";
    setTimeout(function() {
        document.getElementById("settings-popup").style.display = "none";
        document.getElementById("settings-popup").style.animation = "none";
    }, 250);

    setTimeout(function() {
        document.getElementById("overlay").style.display = "none";
        document.getElementById("overlay").style.animation = "none";
    }, 250);
    document.getElementById("settings").style.color = "#ffffff";
});

document.getElementById("restart").addEventListener("click", function() {
    s.dead = false;
    s.tail = [];
    s.score = 0;
    s.head = {
        x: 20,
        y: 20,
        velX: 0,
        velY: 0
    }

    f.move();

    document.getElementById("overlay").style.animation = "fadeouthalf 0.25s linear 1";
    document.getElementById("alert").style.animation = "fadeout 0.25s linear 1";
    setTimeout(function() {
        document.getElementById("alert").style.display = "none";
        document.getElementById("alert").style.animation = "none";
    }, 250);

    setTimeout(function() {
        document.getElementById("overlay").style.display = "none";
        document.getElementById("overlay").style.animation = "none";
    }, 250);

    tick = setInterval(updateArea, tickSpeed);
});

function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function updateArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (f.inTail()) {
        while(f.inTail()) {
            f.move();
        }
    }
    f.show();

    s.update();
    
    if (aiMode) {
        let oX = f.x;
        let oY = f.y;
        if (Math.abs(oX - s.head.x) < Math.abs(oY - s.head.y) && Math.abs(oX - s.head.x) > 1) {
            if (oX > s.x) {
                s.dir(1, 0);
            } else {
                s.dir(-1, 0);
            }
        } else if (Math.abs(oY - s.head.y) > 1) {
            if (oY > s.head.y) {
                s.dir(0, 1);
            } else {
                s.dir(0, -1);
            }
        } else {
            if (oX > s.head.x) {
                s.dir(1, 0);
            } else {
                s.dir(-1, 0);
            }
        }
        if (s.head.x === 0 && s.head.velX === -1 && f.x !== 0) {
                if (s.head.y > f.y) {
                    s.dir(0, -1);
                } else {
                    if (s.head.y !== canvas.height - 20) {
                        s.dir(0, 1);
                    } else {
                        s.dir(1, 0);
                    }
            }
        } else if (s.head.x === canvas.width - 20 && s.head.velX === 1 && f.x !== canvas.width - 20) {
                if (s.head.y > f.y) {
                    s.dir(0, -1);
                } else {
                    if (s.head.y !== canvas.height - 20) {
                        s.dir(0, 1);
                    } else {
                        s.dir(-1, 0);
                    }
            }
        } else if (s.head.y === 0 && s.head.velY === -1 && f.y !== 0) {
                if (s.head.x > f.x) {
                    s.dir(-1, 0);
                } else {
                    if (s.head.x !== canvas.width - 20) {
                        s.dir(1, 0);
                    } else {
                        s.dir(0, 1);
                    }
            }
        } else if (s.head.y === canvas.height - 20 && s.head.velY === 1 && f.y !== canvas.height - 20) {
                if (s.head.x > f.x) {
                    s.dir(-1, 0);
                } else {
                    if (s.head.x !== canvas.width - 20 || s.head.x !== 0) {
                        s.dir(1, 0);
                    } else {
                        s.dir(0, -1);
                    }
            }
        }
        for (let i = 0; i < s.tail.length; i++) {
            if (s.head.x + s.head.velX * 20 === s.tail[i].x && s.head.y + s.head.velY * 20 === s.tail[i].y) {
                console.log("about to hit");
                if (s.head.x === s.tail[i].x) {
                    let sameLevel = [];
                    for (let t of tailPositions) {
                        if (s.head.y === t.y) {
                            if (sameLevel.length === 2) {
                                if (Math.abs(t.x - s.head.x) < Math.abs(sameLevel[0].x - s.head.x)) {
                                    if (Math.abs(sameLevel[0].x - s.head.x) < Math.abs(sameLevel[1].x - s.head.x)) {
                                        sameLevel[1] = sameLevel[0];
                                    }
                                    sameLevel[0] = t;
                                }
                            } else {
                                sameLevel[sameLevel.length] = {
                                    x: t.x,
                                    y: t.y
                                }
                            }
                        }
                    }
                    if (sameLevel.length > 1 && sameLevel[0].x - s.head.x < 0 && sameLevel[1].x - s.head.x < 0) {
                        s.dir(1, 0);
                        console.log("used logic");
                        sameLevel = [];
                    } else if (sameLevel.length > 1 && sameLevel[0].x - s.head.x > 0 && sameLevel[1].x - s.head.x > 0) {
                        s.dir(-1, 0);
                        console.log("used logic");
                        sameLevel = [];
                    } else if (sameLevel.length > 1 && Math.abs(sameLevel[0].x - s.head.x) < Math.abs(sameLevel[1].x - s.head.x) && Math.abs(sameLevel[1].x - s.head.x) !== 20) {
                        if (sameLevel[1].x - s.head.x < 0) {
                            s.dir(-1, 0);
                            console.log("fix?");
                        } else {
                            s.dir(1, 0);
                            console.log("fix?");
                        }
                        console.log("used logic");
                        sameLevel = [];
                    } else if (sameLevel.length > 1 && Math.abs(sameLevel[0].x - s.head.x) > Math.abs(sameLevel[1].x - s.head.x) && Math.abs(sameLevel[0].x - s.head.x) !== 20) {
                        if (sameLevel[0].x - s.head.x > 0) {
                            s.dir(-1, 0);
                            console.log("fix?");
                        } else {
                            s.dir(1, 0);
                            console.log("fix?");
                        }
                        console.log("used logic");
                        sameLevel = [];
                    } else if (s.head.x > sameLevel[0].x) {
                        s.dir(1, 0);
                        console.log("used logic");
                        sameLevel = [];
                    } else if (s.head.x < sameLevel[0].x) {
                        s.dir(-1, 0);
                        console.log("used logic");
                        sameLevel = [];
                    } else if (random(0, 1) > .5) {
                        s.dir(1, 0);
                        console.log("used random");
                        sameLevel = [];
                    } else {
                        s.dir(-1, 0);
                        console.log("used random");
                        sameLevel = [];
                    }
                } else if (s.head.y === s.tail[i].y) {
                    let sameLevel = [];
                    for (let t of tailPositions) {
                        if (s.head.x === t.x) {
                            if (sameLevel.length === 2) {
                                if (Math.abs(t.y - s.head.y) < Math.abs(sameLevel[0].y - s.head.y)) {
                                    if (Math.abs(sameLevel[0].y - s.head.y) < Math.abs(sameLevel[1].y - s.head.y)) {
                                        sameLevel[1] = sameLevel[0];
                                    }
                                    sameLevel[0] = t;
                                }
                            } else {
                                sameLevel[sameLevel.length] = {
                                    x: t.x,
                                    y: t.y
                                }
                            }
                        }
                    }
                    if (sameLevel.length > 1 && sameLevel[0].y - s.head.y < 0 && sameLevel[1].y - s.head.y < 0) {
                        s.dir(0, 1);
                        console.log("used logic");
                        sameLevel = [];
                    } else if (sameLevel.length > 1 && sameLevel[0].y - s.head.y > 0 && sameLevel[1].y - s.head.y > 0) {
                        s.dir(0, -1);
                        console.log("used logic");
                        sameLevel = [];
                    } else if (sameLevel.length > 1 && Math.abs(sameLevel[0].y - s.head.y) < Math.abs(sameLevel[1].y - s.head.y) && Math.abs(sameLevel[1].y - s.head.y) !== 20) {
                        if (sameLevel[1].y - s.head.y < 0) {
                            s.dir(0, -1);
                            console.log("fix?");
                        } else {
                            s.dir(0, 1);
                            console.log("fix?");
                        }
                        console.log("used logic");
                        sameLevel = [];
                    } else if (sameLevel.length > 1 && Math.abs(sameLevel[0].y - s.head.y) > Math.abs(sameLevel[1].y - s.head.y) && Math.abs(sameLevel[0].y - s.head.y) !== 20) {
                        if (sameLevel[0].y - s.head.y > 0) {
                            s.dir(0, -1);
                            console.log("fix?");
                        } else {
                            s.dir(0, 1);
                            console.log("fix?");
                        }
                        console.log("used logic");
                        sameLevel = [];
                    } else if (s.head.y > sameLevel[0].y) {
                        s.dir(0, 1);
                        console.log("used logic");
                        sameLevel = [];
                    } else if (s.head.y < sameLevel[0].y) {
                        s.dir(0, -1);
                        console.log("used logic");
                        sameLevel = [];
                    } else if (random(0, 1) > .5) {
                        s.dir(0, 1);
                        console.log("used random");
                        sameLevel = [];
                    } else {
                        s.dir(0, -1);
                        console.log("used random");
                        sameLevel = [];
                    }
                }
            }
        }
    }

    //s.update();
    s.show();
    if (s.dead) {
        dead();
    }
    /*if (s.dead) {
        document.getElementById("restart").click();
    }*/
    highScore = (s.score > highScore) ? s.score : highScore;
    document.getElementById("score").innerHTML = "Score: " + s.score;
    document.getElementById("highscore").innerHTML = "High score: " + highScore;
}

function food() {
    this.x = random(0, cols) * 20;
    this.y = random(0, rows) * 20;
    this.isInTail = false;
    this.inTail = function() {
        for (let i of s.tail) {
            if (this.x === i.x && this.y === i.y) {
                this.isInTail = true;
            }
        }
        if (this.isInTail) {
            this.isInTail = false;
            return true;
        } else {
            return false;
        }
    }
    this.move = function() {
        this.x = random(0, cols) * 20;
        this.y = random(0, rows) * 20;
    }
    this.show = function() {
        ctx.fillStyle = foodColor;
        ctx.fillRect(this.x, this.y, 20, 20);
    }
}

function dead() {
    clearInterval(tick);

    document.getElementById("overlay").style.animation = "fadeinhalf 0.25s linear 1";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("alert").style.animation = "fadein 0.5s linear 1";
    document.getElementById("alert").style.display = "block";
}

function snake() {
    this.head = {
        x: 20,
        y: 20,
        velX: 0,
        velY: 0
    }
    this.score = 0;
    this.dead = false;
    this.tail = [];
    this.dir = function(x, y) {
        this.head.velX = x;
        this.head.velY = y;
        if (this.tail.length > 0) {
            if (this.head.x + this.head.velX * 20 === this.tail[0].x && this.head.y + this.head.velY * 20 === this.tail[0].y) {
                this.head.velX *= -1;
                this.head.velY *= -1;
            }
        }
    }
    this.addTail = function() {
        this.tail[this.tail.length] = {
            x: (this.tail.length <= 0) ? this.head.velX * (this.tail.length * -20) + this.head.x : this.tail[this.tail.length - 1].tailX * (this.tail.length * -20) + this.head.x,
            y: (this.tail.length <= 0) ? this.head.velY * (this.tail.length * -20) + this.head.y : this.tail[this.tail.length - 1].tailY * (this.tail.length * -20) + this.head.y,
            prevX: 0,
            prevY: 0,
        };
    }
    this.update = function() {
        if (this.head.x >= 0 && this.head.x < canvas.width && this.head.y >= 0 && this.head.y < canvas.height) {
            this.head.x += this.head.velX * 20;
            this.head.y += this.head.velY * 20;
        } else {
            console.log("snake hit wall");
            this.dead = true;
        }
        if (Math.abs(this.head.x - f.x) < 1 && Math.abs(this.head.y - f.y) < 1) {
            f.x = random(0, cols) * 20;
            f.y = random(0, rows) * 20;
            this.score++;
            this.addTail();
        }
        tailPositions = [];
        for (let i = 0; i < this.tail.length; i++) {
            if (i > 0) {
                this.tail[i].x = this.tail[i - 1].x + (this.tail[i].tailX * -20);
                this.tail[i].y = this.tail[i - 1].y + (this.tail[i].tailY * -20);
                this.tail[i].prevX = this.tail[i].tailX;
                this.tail[i].prevY = this.tail[i].tailY;
                this.tail[i].tailX = this.tail[i - 1].prevX;
                this.tail[i].tailY = this.tail[i - 1].prevY;
                tailPositions[tailPositions.length] = {
                    x: this.tail[i].x,
                    y: this.tail[i].y
                }
            } else if (i == 0) {
                this.tail[i].x = this.head.x + (this.head.velX * -20);
                this.tail[i].y = this.head.y + (this.head.velY * -20);
                this.tail[i].prevX = this.head.velX;
                this.tail[i].prevY = this.head.velY;
                this.tail[i].tailX = this.head.velX;
                this.tail[i].tailY = this.head.velY;
                tailPositions[0] = {
                    x: this.tail[i].x,
                    y: this.tail[i].y
                }
            }
            if (this.head.x === this.tail[i].x && this.head.y === this.tail[i].y) {
                this.dead = true;
                console.log("snake head hit tail");
            }
        }
    }
    this.show = function() {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(this.head.x, this.head.y, 20, 20);
        for (let t of this.tail) {
            ctx.fillRect(t.x, t.y, 20, 20);
        }
    }
}