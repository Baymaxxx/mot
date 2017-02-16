package {

import flash.display.Sprite;
import flash.display.StageAlign;
import flash.display.StageScaleMode;
import flash.events.Event;
import flash.display.DisplayObject;
import flash.utils.Timer;
import flash.utils.*;
import flash.events.MouseEvent;
import flash.external.ExternalInterface;
import flash.ui.ContextMenu;
import flash.ui.ContextMenuItem;

public class ZhedangMain extends Sprite {


    /**
     *ZhedangMOT_v1.000_201311221511
     *ZhedangMOT_v1.001_201311221604 修改testStart函数可见性;
     *                               修复saveResult缺少答题用时;
     *                                 修改舞台大小934*540;
     *ZhedangMOT_v1.002_201311261548 增加loadCompleted事件的参数为空参数，当没有初始化的时候会每300毫秒触发一次该事件。
     *ZhedangMOT_v1.003_201311271608 修改小球选中颜色
     **/
    ;
    static private var VER: String = "ZhedangMOT_v1.003_201311271608";
    //callbacks
    static private var START_TEST: String = "startTest";
    static private var SET_CONFIG: String = "setConfig";
    static private var CLEAR_BALLS: String = "clearBalls"
    //calls
    static private const SAVE_RESULT: String = "saveResult";
    static private const LOAD_COMPLETED: String = "loadCompleted";

    static private var CODE: String = "";
    static private var TIME_STAMP: String = "";

    private var _stageWidth: Number = 934;//总体宽度;
    private var _stageHeight: Number = 540;//总体高度;

    private var _ballContainer: BallContainer;//小球容器;
    private var _cWidth: Number = 918;//容器宽度;
    private var _cHeight: Number = 524;//容器高度;
    private var _cColor: uint = 0x3a3a3a;//容器背景颜色;
    private var _bWidth: Number = 8;//容器描边宽度;
    private var _bColor: uint = 0xb6b6b6;//容器描边颜色;

    private var _numball: int = 10;//小球数量
    private var _radius: Number = 20;//小球半径;
    private var _ballColor: uint = 0xffffff;//小球颜色;
    private var _ballMaxspeed: Number = 6;
    private var _selNum: uint = 3;//可选数量;
    private var _selList: Array;//闪烁索引列表;
    private var _balls: Vector.<MoveBall>;//小球列表;

    private var timeoutId: Number;
    private var flashTimeoutId: Number;
    private var completedIntervalId: Number;

    private var _moveTime: uint = 5000;//小球漫游时间 ms
    private var _flashTime: uint = 1000;//小球闪烁时间 ms

    private var _selectHistory: Array;
    private var _selTimer: int;

    private var _callCompleted: Boolean = false;

    public function ZhedangMain() {
        if (stage) {
            init();
        } else {
            addEventListener(Event.ADDED_TO_STAGE, init);
        }
    }

    private function init(e: Event = null): void {
        removeEventListener(Event.ADDED_TO_STAGE, init);
        // entry point
        stage.align = StageAlign.TOP_LEFT;
        stage.scaleMode = StageScaleMode.NO_SCALE;
        var cm: ContextMenu = new ContextMenu();
        cm.customItems.push(new ContextMenuItem(VER, false, false));
        cm.hideBuiltInItems();
        this.contextMenu = cm;
        if (ExternalInterface.available) {
            ExternalInterface.addCallback(START_TEST, testStart);
            ExternalInterface.addCallback(SET_CONFIG, setConfig);
            ExternalInterface.addCallback(CLEAR_BALLS, clearBalls);
            ExternalInterface.call(LOAD_COMPLETED, "");
            if (!_callCompleted) {
                completedIntervalId = setInterval(function () {
                    if (_callCompleted) {
                        clearInterval(completedIntervalId);
                    }
                    ExternalInterface.call(LOAD_COMPLETED, "");
                }, 300);
            }
        }
        createContainer();
//			setConfig("10|@|20|@|0xffffff|@|6|@|1000|@|5000|@|3|@|2||4||6");
        //testStart();
    }

    //设置初始数据;
    protected function setConfig(cStr: String = ""): void {
        if (!_callCompleted) _callCompleted = true;
        if (cStr === "")return;
        var arr: Array = cStr.split("|@|");
        _numball = int(arr[0]);
        _radius = Number(arr[1]);
        _ballColor = uint(arr[2]);
        _ballMaxspeed = Number(arr[3]);
        _flashTime = uint(arr[4]);
        _moveTime = uint(arr[5]);
        _selNum = uint(arr[6]);
        _selList = null;
        _selList = (arr[7] as String).split("||");
        _selectHistory = new Array();
        createBalls()
    }

    //创建容器;
    private function createContainer(): void {
        if (_ballContainer) {
            return;
        }
        _ballContainer = new BallContainer(_cWidth, _cHeight, _cColor, _bWidth, _bColor);
        _ballContainer.x = (_stageWidth - _ballContainer.width) / 2;
        _ballContainer.y = (_stageHeight - _ballContainer.height) / 2;
        addChild(_ballContainer);
    }

    //创建小球;
    private function createBalls(): void {
        if (_balls && _balls.length > 0) clearBalls();
        _balls = new Vector.<MoveBall>;
        var b: MoveBall;
        var startx: Number = _ballContainer.rect.x;
        var starty: Number = _ballContainer.rect.y;
        var w: Number = _ballContainer.rect.width;
        var h: Number = _ballContainer.rect.height;
        var dx: Number;
        var dy: Number;
        for (var i: int = 0; i < _numball; i++) {
            b = new MoveBall(_radius, _ballColor, _ballContainer.rect);
            b.ballIndex = i;
            b.maxSpeed = _ballMaxspeed;
            dx = Math.min(startx + Math.random() * w + _radius, startx + w - _radius);
            dy = Math.min(starty + Math.random() * h + _radius, starty + h - _radius);
            b.position = new Vector2D(dx, dy);
            _balls.push(b);
            addChild(b);
        }
    }

    //测试开始;
    protected function testStart(s: String = ""): void {
        if (flashTimeoutId) {
            clearTimeout(flashTimeoutId);
            stopBallsFlash();
        }
        flashBalls(250);
        flashTimeoutId = setTimeout(function () {
            stopBallsFlash();
            startMove();
        }, _flashTime);

    }

    //清除小球;
    protected function clearBalls(): void {
        if (timeoutId || hasEventListener(Event.ENTER_FRAME)) {
            clearTimeout(timeoutId);
            removeEventListener(Event.ENTER_FRAME, onEnterFrame);
        }
        while (_balls.length > 0) {
            removeChild(_balls.pop() as MoveBall);
        }
    }

    //小球闪烁;
    protected function flashBalls(delay: uint): void {
        if (!_selList || _selList.length < 1)return;
        var b: MoveBall;
        for (var i: int = 0; i < _balls.length; i++) {
            b = _balls[i] as MoveBall;
            if (_selList.indexOf(b.ballIndex.toString()) > -1) {
                b.ballFlash(delay);
            }
        }
    }

    //小球停止闪烁;
    protected function stopBallsFlash(): void {
        var b: MoveBall;
        for (var i: int = 0; i < _balls.length; i++) {
            b = _balls[i] as MoveBall;
            b.stopBallFlash();
        }
    }

    //开始移动;
    private function startMove(): void {
        if (!timeoutId && !hasEventListener(Event.ENTER_FRAME)) {
            addEventListener(Event.ENTER_FRAME, onEnterFrame);
            setTimeout(stopMove, _moveTime);
        }
    }

    //移动小球(漫游)
    private function onEnterFrame(e: Event): void {
        for (var i: int = 0; i < _balls.length; i++) {
            (_balls[i] as MoveBall).wander();
            (_balls[i] as MoveBall).update();
        }
    }

    //停止移动小球;
    private function stopMove(): void {
        if (timeoutId || hasEventListener(Event.ENTER_FRAME)) {
            clearTimeout(timeoutId);
            removeEventListener(Event.ENTER_FRAME, onEnterFrame);
            selectAnswer()
        }
    }

    //开始选择答案;
    private function selectAnswer(): void {
        var b: MoveBall;
        for (var i: int = 0; i < _balls.length; i++) {
            b = _balls[i] as MoveBall;
            b.rotation = 0;
            b.drawRect();
            b.addEventListener(MouseEvent.CLICK, onBallClick, false, 0, true);
        }
        _selTimer = getTimer();
    }

    private function getSelectedBall(isBallindex: Boolean = false): Array {
        var arr: Array = new Array();
        var b: MoveBall;
        for (var i: int = 0; i < _balls.length; i++) {
            b = _balls[i] as MoveBall;
            if (b.selected && arr.length < _selNum) {
                if (!isBallindex) {
                    arr.push(b);
                } else {
                    arr.push(b.ballIndex);
                }
            }
        }
        return arr;
    }

    private function getResultStr(): String {
        var s: Array = [];
//			for(var i:int=0;i<_selectHistory.length;i++){
//				s[i]=_selectHistory[i].toString();
//			}

        //return getSelectedBall(true).join("||")+"##"+s.join("|@|");
        return getSelectedBall(true).join("||");
    }

    //小球点击响应;
    private function onBallClick(e: MouseEvent): void {
        var b: MoveBall = e.target as MoveBall;
        var selectball: Array = getSelectedBall();
        var n: Number = -1;
        if (selectball.length >= _selNum && selectball.indexOf(b) == -1) {
            //(selectball.pop() as MoveBall).selected=false;
        } else {
            b.selected = !b.selected;
//				if(_selectHistory&&_selectHistory.length<100&&b.selected){
//					_selectHistory.push({ballIndex:b.ballIndex,t:getTimer()-_selTimer,toString:function(){return this.ballIndex+":"+this.t}});
//				}
            if (b.selected) {
                n = b.ballIndex;
            }
        }
        //trace(getResultStr()+"##"+(n==-1?"":n.toString())+":"+(getTimer()-_selTimer));
        if (ExternalInterface.available) {
            ExternalInterface.call(SAVE_RESULT, getResultStr() + "##" + (n == -1 ? "" : n.toString()) + ":" + (getTimer() - _selTimer));
        }
    }

}
}