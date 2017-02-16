package  {
	import flash.display.Sprite;
	import flash.geom.Rectangle;
	import flash.filters.GlowFilter;
	import flash.utils.setInterval;
	import flash.utils.clearInterval;
	import com.greensock.*; 
	import com.greensock.easing.*;


	public class Ball extends Sprite{


		protected var _edgeBehavior:String = BOUNCE;//边界处理方式
		private var _radius:Number
		private var _color:uint;
		private var _containerRect:Rectangle;
		
		private var _selected:Boolean;//是否选中;
		private var _ballIndex:uint;
		
		protected var _position:Vector2D;//位置向量
		protected var _velocity:Vector2D;//速率向量
		
		protected var _maxSpeed:Number =0.096;
		protected var _mass:Number = 1.0;
		
		public static const WRAP:String = "wrap";//遇到边界移动到另一端边界
		public static const BOUNCE:String = "bounce";//遇到边界回弹
		
		private var _flashIntervalId:Number;

		public function Ball(rect:Rectangle,radius:Number=20,ballColor:uint=0xffffff) {
			// constructor code
			_radius=radius;
			_color=ballColor;
			_containerRect=rect;
			_position = new Vector2D();
			_velocity = new Vector2D();
			drawBall();
		}
		public function drawBall():void{
			this.graphics.clear();
			this.graphics.beginFill(_color);
			this.graphics.drawCircle(0,0,_radius);
			this.graphics.endFill();
		}
		
		
		public function drawRect():void{
			this.graphics.clear();
			this.graphics.beginFill(_color);
			this.graphics.drawRect(-_radius,-_radius,_radius*2,_radius*2);
			this.graphics.endFill();
		}
		
		public function ballFlash(delay:uint=128):void{
			if(!_flashIntervalId){
				var ball:Ball=this;
				if(delay<=128){
					delay=128;
				}
				var d:Number=Math.floor(delay*0.1*0.9)*0.01;
				_flashIntervalId=setInterval(function(){TweenLite.to(ball,d,{alpha:ball.alpha<=0?1:0})},delay);
			}
		}
		public function stopBallFlash():void{
			if(_flashIntervalId){
				clearInterval(_flashIntervalId);
				TweenLite.to(this,0.1,{alpha:1})
			}
		}
		public function set ballColor(c:uint):void{
			_color=c;
		}
		public function get ballColor():uint{
			return _color;
		}
		public function set radius(r:Number):void{
			_radius=r;
		}
		public function get radius():Number{
			return _radius;
		}
		public function set selected(b:Boolean):void{
			_selected=b;
			if(_selected){
				this.filters=[new GlowFilter(0xff9900,1,6,6,255,1,false,false)];
			}else{
				this.filters=[];
			}
		}
		public function get selected():Boolean{
			return _selected;
		}
		public function set ballIndex(bIndex:uint):void{
			_ballIndex=bIndex;
		}
		public function get ballIndex():uint{
			return _ballIndex;
		}
		public function update():void
		{
			// 保持不会超过最大速度
			_velocity.truncate(_maxSpeed);
			
			// 按速度计算位置
			_position = _position.add(_velocity);
			
			//边界处理
			if(_edgeBehavior == WRAP)
			{
				wrap();
			}
			else if(_edgeBehavior == BOUNCE)
			{
				bounce();
			}
			
			// 更新小球位置
			x = position.x;
			y = position.y;
			
			// 转向
			//rotation = _velocity.angle * 180 / Math.PI;
		}
		
		/**
		 * Causes character to bounce off edge if edge is hit.
		 */
		private function bounce():void
		{
			if(stage != null)
			{
				if(position.x > (_containerRect.x+_containerRect.width-_radius))
				{
					position.x = (_containerRect.x+_containerRect.width-_radius);
					velocity.x *= -1;
				}
				else if(position.x < (_containerRect.x+_radius))
				{
					position.x = (_containerRect.x+_radius);
					velocity.x *= -1;
				}
				
				if(position.y > (_containerRect.y+_containerRect.height-_radius))
				{
					position.y = (_containerRect.y+_containerRect.height-_radius);
					velocity.y *= -1;
				}
				else if(position.y <(_containerRect.y+ _radius))
				{
					position.y = _containerRect.y+ _radius;
					velocity.y *= -1;
				}
			}
		}
		
		/**
		 * Causes character to wrap around to opposite edge if edge is hit.
		 */
		private function wrap():void
		{
//			if(stage != null)
//			{
//				if(position.x > stage.stageWidth) position.x = 0;
//				if(position.x < 0) position.x = stage.stageWidth;
//				if(position.y > stage.stageHeight) position.y = 0;
//				if(position.y < 0) position.y = stage.stageHeight;
//			}
		}
		
		/**
		 * Sets / gets what will happen if character hits edge.
		 */
		public function set edgeBehavior(value:String):void
		{
			_edgeBehavior = value;
		}
		public function get edgeBehavior():String
		{
			return _edgeBehavior;
		}
		
		/**
		 * Sets / gets mass of character.
		 */
		public function set mass(value:Number):void
		{
			_mass = value;
		}
		public function get mass():Number
		{
			return _mass;
		}
		
		/**
		 * Sets / gets maximum speed of character.
		 */
		public function set maxSpeed(value:Number):void
		{
			_maxSpeed = value;
		}
		public function get maxSpeed():Number
		{
			return _maxSpeed;
		}
		
		/**
		 * Sets / gets position of character as a Vector2D.
		 */
		public function set position(value:Vector2D):void
		{
			_position = value;
			x = _position.x;
			y = _position.y;
		}
		public function get position():Vector2D
		{
			return _position;
		}
		
		/**
		 * Sets / gets velocity of character as a Vector2D.
		 */
		public function set velocity(value:Vector2D):void
		{
			_velocity = value;
		}
		public function get velocity():Vector2D
		{
			return _velocity;
		}
		
		/**
		 * Sets x position of character. Overrides Sprite.x to set internal Vector2D position as well.
		 */
		override public function set x(value:Number):void
		{
			super.x = value;
			_position.x = x;
		}
		
		/**
		 * Sets y position of character. Overrides Sprite.y to set internal Vector2D position as well.
		 */
		override public function set y(value:Number):void
		{
			super.y = value;
			_position.y = y;
		}

	}
	
}
