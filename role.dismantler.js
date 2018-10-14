var roleDismantle ={
    run: function(creep){
        if(creep.memory.count == undefined){
            creep.memory.count=0;
        }
		var home=creep.memory.home;
		var mine=creep.memory.mine;
		var currentRoom=creep.room.name;
        if(creep.memory.hostile==true){
            if(Memory.hostile[mine].evacuate==false){
				creep.memory.hostile=false;
            }
            creep.memory.building=true;
            if(currentRoom != home){
                creep.moveToRoom(home);
            }
            else{
                if(creep.carry.energy>0){
                    creep.truck();
                }
                else{
                    creep.moveToObject(creep.room.controller);
                }
                if(Memory.hostile[mine].evacuate==false){
					creep.memory.hostile=false;
				}
            }
        }
		else{
			if(currentRoom!=mine){
				creep.moveToRoom(mine);
			}
			else{
				if(creep.memory.target==null || creep.memory.target==undefined){
					roleDismantle.target(creep);
				}
				var tar=Game.getObjectById(creep.memory.target);
				if(tar==null || tar ==undefined){
					roleDismantle.target(creep);
				}
				if(creep.dismantle(tar)==ERR_NOT_IN_RANGE){
					creep.moveToObject(tar);
				}
			}
		}
	},

	target: function(creep){
		var list=creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: s=> s.structureType != STRUCTURE_WALL && s. structureType!= STRUCTURE_RAMPART && s.structureType!=STRUCTURE_CONTROLLER});
		if(list.length>0){
			creep.memory.target=list[0].id;
		}
		else{
		delete Game.rooms(creep.memory.home).memory.dismantle;
			creep.suicide()
		}
	},
    spawn: function(room,mineRoom,spawn){
		var num;
        var skip =false;
        if(skip==false)
        {  	var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'dismantler' && creep.memory.mine== mineRoom);
            var newName='Dismantler'+Game.time;
            var Body;
            var extensions = room.memory.extensions;
            if(extensions<5){
                Body=[WORK,WORK,MOVE,MOVE];
                if(Memory.mine[mineRoom]!=undefined){
                    num=Memory.mine[mineRoom].source*2;
                }
                else{num=2;}
                
            }
            else if(extensions<10){
                Body=[WORK,WORK,WORK,MOVE,MOVE,MOVE];
                if(Memory.mine[mineRoom]!=undefined){
                    num=Memory.mine[mineRoom].source*2;
                }
                else{num=2;}
                
            }
			else{
			    Body=[WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
			    if(Memory.mine[mineRoom]!=undefined){
                    num=Memory.mine[mineRoom].source;
                }
                else{num=1;}
			    
			}
            if(harvesters.length<num){
                spawn.spawnCreep(Body, newName, {memory: {role: 'dismantler', home: room.name, mine: mineRoom}})
            }
            
        }
    },
}

module.exports = roleDismantle;