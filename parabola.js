
function rnd(min, max) {
    return parseInt((Math.random() * 999999) % (max - min + 1)) + min;
}

window.onload = function () {
    var containW = parseInt($('.contain').css('width'));
    var containH = parseInt($('.contain').css('height'));
    var speedRate = 2;
    var speedMax = 10;
    var speedArr = [-speedMax,speedMax];
    var autoRate = 1;
    var x = rnd(0, containW);
    var y = rnd(0, containH);
    var xSpeed = speedArr[rnd(0, 1)];
    var ySpeed = speedArr[rnd(0, 1)];
    var samp = 0;
    var SIZE = 110;
    iAutoPlayTimer = setInterval(function () {
        if (!(samp++ % autoRate)) {
            onMove(x, y);
        }
        x += xSpeed;
        y += ySpeed;

        if (x <= SIZE / 2) {
            xSpeed = rnd(0, speedMax)
        }
        if (x >= document.documentElement.clientWidth - SIZE / 2) {
            xSpeed = -rnd(0, speedMax)
        }

        if (y <= SIZE / 2) {
            ySpeed = rnd(0, speedMax)
        }
        if (y >= document.documentElement.clientHeight - SIZE / 2) {
            ySpeed = -rnd(0, speedMax)
        }

        if (xSpeed < -speedMax) {
            xSpeed += rnd(0, speedRate);
        }
        else if (xSpeed > speedMax) {
            xSpeed += rnd(-speedRate, 0);
        }
        else {
            xSpeed += rnd(-speedRate, speedRate);
        }

        if (ySpeed < -speedMax) {
            ySpeed += rnd(0, speedRate);
        }
        else if (ySpeed > speedMax) {
            ySpeed += rnd(-speedRate, 0);
        }
        else {
            ySpeed += rnd(-speedRate, speedRate);
        }
    }, 50);

    function onMove( l, t) {
        var ball = $('i');
        ball.css({
            left:l + 'px',
            top:t + 'px',
            marginLeft:parseInt(-ball.css('width')) / 2 + 'px',
            marginTop:parseInt(-ball.css('height')) / 2 + 'px'
        });
    }
};

