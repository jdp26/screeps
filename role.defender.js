

var roleDefender ={
    run: function(creep){
        if(creep.room.name != creep.memory.mine){
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
        }
    },
    defend: function(room,mineRoom){
		console.log('Old Code Called ' + mineRoom);
        /*var skip =false;
        for(var v in Game.creeps){
            var van=Game.creeps[v];
            if(van.memory.hostile == true && van.memory.mine==mineRoom &&(van.memory.role == 'remoteTruck' || van.memory.role == 'vandle')){skip=true;}
        }
        if(skip ==true){
            var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'rdefend' && creep.memory.mine==mineRoom);
            var Body;
            var extensions = room.memory.extensions;
            if(Memory.hostile[mineRoom].nonhostile==true){
                Body=[TOUGH,ATTACK,MOVE,MOVE];
                energyReq=190;
            }
            else{
            if(extensions==0){
                Body=[TOUGH,ATTACK,MOVE,MOVE];
                energyReq=190;
            }
            else if(extensions<2){
				Body=[TOUGH,TOUGH,MOVE,ATTACK,ATTACK,MOVE,MOVE,MOVE];
				energyReq=380;
			}
            else {
				Body = [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE];
				energyReq=640;
			}}
            if(defenders.length<3 && room.energyAvailable>(energyReq-1)){
                var newName= 'RemoteDefend' + Game.time;
                Game.getObjectById(room.memory.spawns).spawnCreep(Body, newName, {memory: {role: 'rdefend', mine: mineRoom}})
            }
        }*/
    },
	spawn: function(roomname,mineRoom){
		var room= Game.rooms[roomname];
			var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'rdefend' && creep.memory.mine==mineRoom);
            var Body;
			var energyReq;
            var extensions = room.memory.extensions;
            if(Memory.hostile[mineRoom].nonhostile==true){
                Body=[TOUGH,ATTACK,MOVE,MOVE];
                energyReq=190;
            }
            else{
            if(extensions==0){
                Body=[TOUGH,ATTACK,MOVE,MOVE];
                energyReq=190;
            }
            else if(extensions<2){
				Body=[TOUGH,TOUGH,MOVE,ATTACK,ATTACK,MOVE,MOVE,MOVE];
				energyReq=380;
			}
            else {
				Body = [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE];
				energyReq=640;
			}}
            if(defenders.length<3 && room.energyAvailable>(energyReq-1)){
                var newName= 'RemoteDefend' + Game.time;
                Game.getObjectById(room.memory.spawns).spawnCreep(Body, newName, {memory: {role: 'rdefend', mine: mineRoom}})
            }
	}
};

module.exports = roleDefender;
