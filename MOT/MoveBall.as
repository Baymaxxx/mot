﻿package  {
	import flash.geom.Rectangle;
	
	public class MoveBall extends Ball {
		
		private var _maxForce:Number = 1;
		private var _steeringForce:Vector2D;
		private var _arrivalThreshold:Number = 100;
		private var _wanderAngle:Number = 0;
		private var _wanderDistance:Number = 10;
		private var _wanderRadius:Number = 5;
		private var _wanderRange:Number = 1;
		private var _pathIndex:int = 0;
		private var _pathThreshold:Number = 20;
		private var _avoidDistance:Number = 300;
		private var _avoidBuffer:Number = 20;
		private var _inSightDist:Number = 200;
		private var _tooCloseDist:Number = 60;
		
		public function MoveBall(radius:Number,ballColor:uint,rect:Rectangle) {
			_steeringForce = new Vector2D();
			super(rect,radius,ballColor);
		}
		public function set maxForce(value:Number):void
		{
			_maxForce = value;
		}
		public function get maxForce():Number
		{
			return _maxForce;
		}
		
		public function set arriveThreshold(value:Number):void
		{
			_arrivalThreshold = value;
		}
		public function get arriveThreshold():Number
		{
			return _arrivalThreshold;
		}
		
		public function set wanderDistance(value:Number):void
		{
			_wanderDistance = value;
		}
		public function get wanderDistance():Number
		{
			return _wanderDistance;
		}
		
		public function set wanderRadius(value:Number):void
		{
			_wanderRadius = value;
		}
		public function get wanderRadius():Number
		{
			return _wanderRadius;
		}
		
		public function set wanderRange(value:Number):void
		{
			_wanderRange = value;
		}
		public function get wanderRange():Number
		{
			return _wanderRange;
		}
		
		public function set pathIndex(value:int):void
		{
			_pathIndex = value;
		}
		public function get pathIndex():int
		{
			return _pathIndex;
		}
		
		public function set pathThreshold(value:Number):void
		{
			_pathThreshold = value;
		}
		public function get pathThreshold():Number
		{
			return _pathThreshold;
		}
		
		public function set avoidDistance(value:Number):void
		{
			_avoidDistance = value;
		}
		public function get avoidDistance():Number
		{
			return _avoidDistance;
		}
		
		public function set avoidBuffer(value:Number):void
		{
			_avoidBuffer = value;
		}
		public function get avoidBuffer():Number
		{
			return _avoidBuffer;
		}
		
		public function set inSightDist(value:Number):void
		{
			_inSightDist = value;
		}
		public function get inSightDist():Number
		{
			return _inSightDist;
		}
		
		public function set tooCloseDist(value:Number):void
		{
			_tooCloseDist = value;
		}
		public function get tooCloseDist():Number
		{
			return _tooCloseDist;
		}
		
		override public function update():void
		{
			_steeringForce.truncate(_maxForce);
			_steeringForce = _steeringForce.divide(_mass);
			_velocity = _velocity.add(_steeringForce);
			_steeringForce = new Vector2D();
			super.update();
		}
		
		public function seek(target:Vector2D):void
		{
			var desiredVelocity:Vector2D = target.subtract(_position);
			desiredVelocity.normalize();
			desiredVelocity = desiredVelocity.multiply(_maxSpeed);
			var force:Vector2D = desiredVelocity.subtract(_velocity);
			_steeringForce = _steeringForce.add(force);
		}
		
		public function flee(target:Vector2D):void
		{
			var desiredVelocity:Vector2D = target.subtract(_position);
			desiredVelocity.normalize();
			desiredVelocity = desiredVelocity.multiply(_maxSpeed);
			var force:Vector2D = desiredVelocity.subtract(_velocity);
			_steeringForce = _steeringForce.subtract(force);
		}
		
		public function arrive(target:Vector2D):void
		{
			var desiredVelocity:Vector2D = target.subtract(_position);
			desiredVelocity.normalize();
			
			var dist:Number = _position.dist(target);
			if(dist > _arrivalThreshold)
			{
				desiredVelocity = desiredVelocity.multiply(_maxSpeed);
			}
			else
			{
				desiredVelocity = desiredVelocity.multiply(_maxSpeed * dist / _arrivalThreshold);
			}
			
			var force:Vector2D = desiredVelocity.subtract(_velocity);
			_steeringForce = _steeringForce.add(force);
		}
		
		public function pursue(target:Ball):void
		{
			var lookAheadTime:Number = position.dist(target.position) / _maxSpeed;
			var predictedTarget:Vector2D = target.position.add(target.velocity.multiply(lookAheadTime));
			seek(predictedTarget);
		}
		
		public function evade(target:Ball):void
		{
			var lookAheadTime:Number = position.dist(target.position) / _maxSpeed;
			var predictedTarget:Vector2D = target.position.subtract(target.velocity.multiply(lookAheadTime));
			flee(predictedTarget);
		}
        // public function add(v2:Vector2D):Vector2D
        // {
        //     return new Vector2D(_x + v2.x, _y + v2.y);
        // }
		public function wander():void
		{
			var center:Vector2D = velocity.clone().normalize().multiply(_wanderDistance);
			var offset:Vector2D = new Vector2D(0);
			offset.length = _wanderRadius;
			offset.angle = _wanderAngle;
			_wanderAngle += Math.random() * _wanderRange - _wanderRange * .5;
			var force:Vector2D = center.add(offset);
			_steeringForce = _steeringForce.add(force);
		}
		
		
		public function followPath(path:Array, loop:Boolean = false):void
		{
			var wayPoint:Vector2D = path[_pathIndex];
			if(wayPoint == null) return;
			if(_position.dist(wayPoint) < _pathThreshold)
			{
				if(_pathIndex >= path.length - 1)
				{
					if(loop)
					{
						_pathIndex = 0;
					}
				}
				else
				{
					_pathIndex++;
				}
			}
			if(_pathIndex >= path.length - 1 && !loop)
			{
				arrive(wayPoint);
			}
			else
			{
				seek(wayPoint);
			}
		}
		
		public function flock(balls:Array):void
		{
			var averageVelocity:Vector2D = _velocity.clone();
			var averagePosition:Vector2D = new Vector2D();
			var inSightCount:int = 0;
			for(var i:int = 0; i < balls.length; i++)
			{
				var ball:Ball = balls[i] as Ball;
				if(ball != this && inSight(ball))
				{
					averageVelocity = averageVelocity.add(ball.velocity);
					averagePosition = averagePosition.add(ball.position);
					if(tooClose(ball)) flee(ball.position);
					inSightCount++;
				}
			}
			if(inSightCount > 0)
			{
				averageVelocity = averageVelocity.divide(inSightCount);
				averagePosition = averagePosition.divide(inSightCount);
				seek(averagePosition);
				_steeringForce.add(averageVelocity.subtract(_velocity));
			}
		}
		public function inSight(ball:Ball):Boolean		
		{
			if(_position.dist(ball.position) > _inSightDist) return false;
			var heading:Vector2D = _velocity.clone().normalize();
			var difference:Vector2D = ball.position.subtract(_position);
			var dotProd:Number = difference.dotProd(heading);
			
			if(dotProd < 0) return false;
			return true;
		}
		
		public function tooClose(ball:Ball):Boolean
		{
			return _position.dist(ball.position) < _tooCloseDist;
		}

	}
	
}
