module.exports = function () {
	Creep.prototype.moveToRoom =
		function(room){
			if(this.fatigue==0){
			if(this.memory._move!=undefined){
					if(this.memory.previous_pos!=undefined && this.memory.previous_pos.x==this.pos.x && this.memory.previous_pos.x==this.pos.x){
						delete this.memory._move;
						return this.moveTo(new RoomPosition(25,25, room));
					}
					else if(this.memory._move.path.length==0){						
						delete this.memory._move;
						this.memory.previous_pos=this.pos;
						return this.moveTo(new RoomPosition(25,25, room));
					}
					else if(this.memory._move.dest.room==room && this.room.name == this.memory._move.room){
						this.memory.previous_pos=this.pos;
						return this.moveByPath(this.memory._move.path);
					}
					else{
						this.memory.previous_pos=this.pos;
						return this.moveTo(new RoomPosition(25,25, room));
					}
				}
				else{
					this.memory.previous_pos=this.pos;
					return this.moveTo(new RoomPosition(25,25, room));
				}
			}
		};
		
	Creep.prototype.moveToObject =
		function(object,options){	
			if(this.fatigue==0){				
				if(this.memory._move!=undefined){
					if(this.memory.previous_pos!=undefined && this.memory.previous_pos.x==this.pos.x && this.memory.previous_pos.x==this.pos.x){
						delete this.memory._move;
						return this.moveTo(object,options);
					}
					else if(this.memory.previous_pos!=undefined && object.pos.x==this.memory._move.dest.x && object.pos.y==this.memory._move.dest.y && this.memory._move.room==this.room.name){
						this.memory.previous_pos=this.pos;
						if(this.memory._move.path.length==0){
							return this.moveTo(object,options);
						}
						else{
							return this.moveByPath(this.memory._move.path);
						}							
					}
					else{
						this.memory.previous_pos=this.pos;
						return this.moveTo(object,options);						
					}
				}				
				else{
					this.memory.previous_pos=this.pos;
					return this.moveTo(object,options);					
				}
			}
		};
	Creep.prototype.moveToCenter = 
		function(){
			if(this.fatigue==0){
				if(this.memory._move!=undefined){
					if(this.memory.previous_pos!=undefined && this.memory.previous_pos.x==this.pos.x && this.memory.previous_pos.x==this.pos.x){
						delete this.memory._move;
						return this.moveTo(new RoomPosition(25,25, this.room.name));
					}
					else if(this.memory._move.dest.x==25 && this.memory._move.dest.y==25 && this.memory._move.room==this.room.name){
						this.memory.previous_pos=this.pos;
						return this.moveByPath(this.memory._move.path);						
					}
					else{
						this.memory.previous_pos=this.pos;
						return this.moveTo(new RoomPosition(25,25, this.room.name));
					}
				}				
				else{
					this.memory.previous_pos=this.pos;
					return this.moveTo(new RoomPosition(25,25, this.room.name));
				}
			}
		};
};