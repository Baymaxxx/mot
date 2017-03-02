function rnd(min, max) {
    return parseInt((Math.random() * 999999) % (max - min + 1)) + min;
}
function random(m, n) {
    return Math.floor(Math.random() * (n - m + 1) + m);
}

window.onload = function () {
    var ballNum = 8;
    var containW = parseInt($('.contain').css('width'));//盒子宽
    var containH = parseInt($('.contain').css('height'));//盒子高
    var speedRate = 2;
    var speedMax = 10;
    var xArr = [], yArr = [];
    var xSpeed = [], ySpeed = [];
    for (var i = 0; i < ballNum; i++) {
        xArr.push(rnd(0, containW));//x轴坐标
        yArr.push(rnd(0, containH));//y轴坐标
        xSpeed.push(rnd(-speedMax, speedMax));
        ySpeed.push(rnd(-speedMax, speedMax));
    }
    var iAutoPlayTimer = [];
    creatBall(20, '#439086', ballNum);
    var SIZE = parseInt($('.ball').css('width'));//球宽
    var ball = $('.ball');
    for (var i = 0; i < ballNum; i++) {
        (function (i) {
            iAutoPlayTimer[i] = setInterval(function () {
                onMove(ball.eq(i), xArr[i], yArr[i]);
                xArr[i] = xArr[i] + xSpeed[i];
                yArr[i] = yArr[i] + ySpeed[i];
                if (xArr[i] <= speedMax / 2) {
                    xSpeed[i] = rnd(0, speedMax)
                }
                if (xArr[i] >= containW - SIZE - speedMax / 2) {
                    xSpeed[i] = -rnd(0, speedMax)
                }

                if (yArr[i] <= speedMax / 2) {
                    ySpeed[i] = rnd(0, speedMax)
                }
                if (yArr[i] >= containH - SIZE - speedMax / 2) {
                    ySpeed[i] = -rnd(0, speedMax)
                }

                if (xSpeed[i] < -speedMax) {
                    xSpeed[i] += rnd(0, speedRate);
                }
                else if (xSpeed[i] > speedMax) {
                    xSpeed[i] += rnd(-speedRate, 0);
                }
                else {
                    xSpeed[i] += rnd(-speedRate, speedRate);
                }

                if (ySpeed[i] < -speedMax) {
                    ySpeed[i] += rnd(0, speedRate);
                }
                else if (ySpeed[i] > speedMax) {
                    ySpeed[i] += rnd(-speedRate, 0);
                }
                else {
                    ySpeed[i] += rnd(-speedRate, speedRate);
                }
            }, 50);
            setTimeout((function (i) {
                return function () {
                    clearInterval(iAutoPlayTimer[i])
                }
            }(i)),3000);
        }(i))
    }

    function creatBall(width, bgColor, num) {
        for (var i = 0; i < num; i++) {
            var ballHtml = '<i class="ball ball' + i + '"></i>';
            var left = rnd(0, containW - width);//x轴坐标
            var top = rnd(0, containH - width);//x轴坐标
            $('.contain').append(ballHtml);
            $('.ball' + [i]).css({
                width: width + 'px',
                height: width + 'px',
                backgroundColor: bgColor,
                left: left + 'px',
                top: top + 'px'
            })
        }
    }

    function onMove(el, l, t) {
        el.css({
            left: l + 'px',
            top: t + 'px'
        });
    }
};

