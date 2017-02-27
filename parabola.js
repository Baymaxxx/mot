function getNow() {
    return (new Date()).getTime();
}

function rnd(min, max) {
    return parseInt((Math.random() * 999999) % (max - min + 1)) + min;
}

window.onload = function () {
    var bManual = true;
    var speedRate = 3;
    var speedMax = 10;
    var autoRate = 1;
    var x = rnd(0, document.documentElement.clientWidth);
    var y = rnd(0, document.documentElement.clientHeight);
    var xSpeed = rnd(-1, 1)*speedMax;
    var ySpeed = rnd(-1, 1)*speedMax;

    iAutoPlayTimer = setInterval(function () {
        if (!(samp++ % autoRate)) {
            onMove(x, y);
        }
        x += xSpeed;
        y += ySpeed;

        if (x <= SIZE / 2) {xSpeed = rnd(0, speedMax)};
        if (x >= document.documentElement.clientWidth - SIZE / 2) {xSpeed = -rnd(0, speedMax)};

        if (y <= SIZE / 2) {ySpeed = rnd(0, speedMax)};
        if (y >= document.documentElement.clientHeight - SIZE / 2) {ySpeed = -rnd(0, speedMax)};

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
    }, 30);
    bManual = false;
    var bCanUse = false;
    var oFps = document.getElementById('fps');
    var aSharps = [];
    var aImgs = [];
    var aSrc = ['images/qun_1.png'];
    var count = 0;
    var samp = 0;
    var continue_count = 0;
    var i = 0;
    var lastIType = -1;
    var SAMP_RATE = 3;
    var SPEED_RATE = 30;
    var FPS_RATE = 120;
    var SIZE = 110;
    var CONTINUE_LEN = 5;
    for (i = 0; i < aSrc.length; i++) {
        aImgs[i] = new Image();
        var divHtml = '<div class="ball"></div>';
        $('body').append(divHtml);
        start();
        aImgs[i].src = aSrc[i];
    }
    function onMove(x, y) {
        if (continue_count++ % CONTINUE_LEN) {
            var iType = lastIType;
        }
        else {
            iType = (lastIType + 1) % aSrc.length;

            lastIType = iType;
        }
        createImg(iType, x, y, 1000);
    }
    function createImg(index, l, t) {
        var oImg = document.createElement('img');
        oImg.src = aImgs[index].src;
        oImg.style.left = l + 'px';
        oImg.style.top = t + 'px';
        oImg.height = aImgs[index].height;
        oImg.width = aImgs[index].width;
        oImg.style.marginLeft = -oImg.width / 2 + 'px';
        oImg.style.marginTop = -oImg.height / 2 + 'px';
        document.body.appendChild(oImg);
        aSharps.push({
            obj: oImg,
            endTime: getNow(),
            speedX: aImgs[index].width / SPEED_RATE,
            speedY: aImgs[index].height / SPEED_RATE
        });
    }
    function start() {
        var lastTime = 0;
        var iShowFps = 0;
        var lastMove = 0;

        setInterval(function () {
            var iNow = getNow();
            var aNewSharps = [];
            if (iNow - lastMove > 30) {
                for (i = 0; i < aSharps.length; i++) {
                    aSharps[i].obj.width = Math.max(aSharps[i].obj.offsetWidth - aSharps[i].speedX, 0);
                    aSharps[i].obj.height = Math.max(aSharps[i].obj.offsetHeight - aSharps[i].speedY, 0);

                    if (bManual)
                        aSharps[i].obj.style.top = parseInt(aSharps[i].obj.style.top) - 5 + 'px';

                    aSharps[i].obj.style.marginLeft = -aSharps[i].obj.offsetWidth / 2 + 'px';
                    aSharps[i].obj.style.marginTop = -aSharps[i].obj.offsetHeight / 2 + 'px';
                    var imgArr = $('img');
                    for (i = 1;i<imgArr.length;i++) {
                        imgArr[i-1].remove();
                    }
                }
                aSharps = aNewSharps;
                lastMove = iNow;
            }

            if (!(iShowFps++ % FPS_RATE)) {
                oFps.innerHTML = parseInt(1000 / (iNow - lastTime));
            }
            lastTime = iNow;
        }, 1);
    }
};

