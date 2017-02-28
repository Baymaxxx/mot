
function rnd(min, max) {
    return parseInt((Math.random() * 999999) % (max - min + 1)) + min;
}
function random(m,n) {
    return Math.floor(Math.random()*(n - m + 1) + m);
}

window.onload = function () {
    var ballNum = 8;
    var containW = parseInt($('.contain').css('width'));//盒子宽
    var containH = parseInt($('.contain').css('height'));//盒子高
    var speedRate = 2;
    var speedMax = 10;
    var speedArr = [-speedMax,speedMax]; //速度数组
    var xArr = [];
    var yArr = [];
    for(var i = 1 ;i <= ballNum;i++) {
        xArr.push(rnd(0, containW));//x轴坐标
        yArr.push(rnd(0, containH));//y轴坐标
    }
    var xSpeed = speedArr[rnd(0, 1)];
    var ySpeed = speedArr[rnd(0, 1)];
    creatBall(20,'#439086',ballNum);
    var SIZE = parseInt($('.ball').css('width'));//球宽
    for(var i = 1 ;i <= ballNum;i++) {
        iAutoPlayTimer = setInterval(function () {
            onMove(x, y);
            x = x + xSpeed;
            y = y + ySpeed;
            if (x <= SIZE / 2) {
                xSpeed = rnd(0, speedMax)
            }
            if (x >= containW - SIZE / 2) {
                xSpeed = -rnd(0, speedMax)
            }

            if (y <= SIZE / 2) {
                ySpeed = rnd(0, speedMax)
            }
            if (y >= containH - SIZE / 2) {
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
    }
    function creatBall(width,bgColor,num) {
        for(var i = 1;i <= num ;i++){
            var ballHtml = '<i class="ball ball' + i + '"></i>';
            var left =  rnd(0, containW - width);//x轴坐标
            var top =  rnd(0, containH - width);//x轴坐标
            $('.contain').append(ballHtml);
            $('.ball' + [i]).css({
                width:width + 'px',
                height:width + 'px',
                backgroundColor: bgColor,
                left:left + 'px',
                top:top + 'px'
            })
        }
    }
    function onMove( l, t) {
        var ball = $('.ball');
        // ball.css({
        //     left:l + 'px',
        //     top:t + 'px'
        // });
    }
};

