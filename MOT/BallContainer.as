package {
	import flash.geom.Rectangle;
	import flash.display.Sprite;

	public class BallContainer extends Sprite {

		private var _cWidth:Number;
		private var _cHeight:Number;
		private var _cColor:uint;
		private var _bWidth:Number;
		private var _bColor:uint;
		private var _rect:Rectangle;

		public function BallContainer(cWidth:Number,cHeight:Number,cColor:uint,bWidth:Number,bColor:uint) {
			_cWidth = cWidth;
			_cHeight = cHeight;
			_cColor = cColor;
			_bWidth = bWidth;
			_bColor = bColor;
			drawContainer();
		}

		private function drawContainer() {
			this.graphics.beginFill(_bColor);
			this.graphics.drawRect(0,0,_cWidth+2*_bWidth,_cHeight+2*_bWidth);
			this.graphics.endFill();
			this.graphics.beginFill(_cColor);
			this.graphics.drawRect(_bWidth,_bWidth,_cWidth,_cHeight);
			this.graphics.endFill();
			_rect=new Rectangle(_bWidth,_bWidth,_cWidth,_cHeight);
		}
		
		public function get rect():Rectangle{
			_rect.x=this.x+_bWidth;
			_rect.y=this.y+_bWidth;
			return _rect;
		}
		

	}

}