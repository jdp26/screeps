var roleDefender ={
    run: function(creep){
        if(creep.room.name != creep.memory.mine && creep.memory.hostile_target == undefined){
          creep.moveToRoom(creep.memory.mine);  
        }
        else{
                if(Memory.hostile[creep.room.name].hostileCount>0){
    				var hostile;
    				if(creep.memory.hostile_target==undefined){
    					hostile=creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    					if(hostile!=null){creep.memory.hostile_target=hostile.id;}
    				}
    				else{
    					hostile=Game.getObjectById(creep.memory.hostile_target);
    					if(hostile==null||hostile==undefined){
    						hostile=creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    						if(hostile!=null){creep.memory.hostile_target=hostile.id;}
    					}					
    				}
                    if(hostile!=null){					
                    if(creep.attack(hostile)==ERR_NOT_IN_RANGE){
                        creep.moveToObject(hostile);
                    }}
                    
                }
				else{
					if(Memory.hostile[creep.room.name].hostilecheck == undefined || Memory.hostile[creep.room.name].hostilecheck!=Game.time){
						Memory.hostile[creep.room.name].hostilecheck=Game.time;
						Memory.hostile[creep.room.name].hostileCount=creep.room.find(FIND_HOSTILE_CREEPS).length;
					}
					if(creep.pos.x== 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49){
						creep.moveTo(new RoomPosition(25,25, creep.memory.mine));
					}
				}
        }
    },
	spawn: function(roomname,mineRoom,spawn){
		var room= Game.rooms[roomname];
			var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'rdefend' && creep.memory.mine==mineRoom);
            var Body;
			var energyReq;
            var extensions = room.memory.extensions;
            if(Memory.hostile[mineRoom].nonhostile==true && Memory.hostile[mineRoom].hostileCount==1){
                Body=[TOUGH,ATTACK,MOVE,MOVE];
                energyReq=190;
            }
            else{
            if(extensions==0){
                Body=[TOUGH,ATTACK,MOVE,MOVE];
                energyReq=190;
            }
            else if(extensions<12){
				Body=[TOUGH,TOUGH,MOVE,ATTACK,ATTACK,MOVE,MOVE,MOVE];
				energyReq=380;
			}
            else {
				//12 extensions
				Body = [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
				energyReq=890;
			}}
            if(defenders.length<3 && room.energyAvailable>(energyReq-1)){
                var newName= 'RemoteDefend' + Game.time;
                spawn.spawnCreep(Body, newName, {memory: {role: 'rdefend', mine: mineRoom}})
            }
	}
};

module.exports = roleDefender;
