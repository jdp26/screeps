var roleVandle ={
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
			if(Memory.hostile[mine].evacuate==true){
				creep.memory.hostile=true;
            }
		
        if(creep.memory.hostile==undefined || creep.memory.hostile==false){if(creep.memory.building && creep.carry.energy==creep.carryCapacity){
                    creep.memory.building = false;
                }
                if(!creep.memory.building && creep.carry.energy==0){
                    creep.memory.building = true;
					creep.memory.job=='empty';
                }
                
                if(creep.memory.building){
                    if(currentRoom==mine){
                        if(Memory.mine[mine]==undefined){
                            Memory.mine[mine]={};
                            Memory.mine[mine].source=creep.room.find(FIND_SOURCES).length;
                        }
                        creep.mine();
                    }
                    else{
                        creep.moveToRoom(mine);
                    }
                }
                if(!creep.memory.building){
					if(currentRoom==mine && creep.memory.count==0){
                    var targets = creep.pos.findInRange(FIND_CONSTRUCTION_SITES,3);
					var structures_in_5=creep.pos.findInRange(FIND_STRUCTURES,1);
					var container = _.filter(structures_in_5, (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)); 
					var container_repair = _.filter(structures_in_5, (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)); 
					
					if(container_repair.length > 0){
						creep.memory.repairTarget=container_repair[0].id;				
                        creep.repairStuff();
						creep.memory.job='repair';
						creep.memory.count=10;
                    }
                    else if(targets.length>0) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE){
                                creep.moveToObject(targets[0]);
                            }
                        creep.memory.buildTarget=targets[0].id;
						creep.memory.job='build';
						creep.memory.count=10;
                    }
                    else if (container.length > 0){						
							var dump = creep.pos.findClosestByRange(container);
							if(creep.transfer(dump, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveToObject(dump, {visualizePathStyle: {stroke: '#ffffff'}});
							}
							creep.memory.job='dump';
							creep.memory.count=10;
					}
					else{
					    creep.room.createConstructionSite(creep.pos,STRUCTURE_CONTAINER);
					}}
					else if(creep.memory.job=='repair' &&creep.memory.count>0){
						creep.repairStuff();
						creep.memory.count=creep.memory.count-1;	
					}
					else if(creep.memory.job=='build' && creep.memory.count>0){
						creep.builder();
						creep.memory.count=creep.memory.count-1;
					}
					else{
						var container = creep.room.find(FIND_STRUCTURES, {
						filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)}});
						var dump = creep.pos.findClosestByRange(container);
						if(creep.transfer(dump, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveToObject(dump, {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
                    
                }
			}
        }
     
    },
    spawn: function(room,mineRoom){
		var num;
        var skip =false;
		if(Memory.hostile[mineRoom].evacuate==true){skip=true;}
        if(skip==false)
        {  	var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'vandle' && creep.memory.mine== mineRoom);
            //console.log('Vandles(?): ' + harvesters.length);
            var newName='Vandle'+Game.time;
            var Body;
            var extensions = room.memory.extensions;
            if(extensions<5){
                Body=[WORK,CARRY,MOVE];
                if(Memory.mine[mineRoom]!=undefined){
                    num=Memory.mine[mineRoom].source*2;
                }
                else{num=2;}
                
            }
            else if(extensions<10){
                Body=[WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE];
                if(Memory.mine[mineRoom]!=undefined){
                    num=Memory.mine[mineRoom].source*2;
                }
                else{num=2;}
                
            }
			else{
			    Body=[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE];
			    if(Memory.mine[mineRoom]!=undefined){
                    num=Memory.mine[mineRoom].source;
                }
                else{num=1;}
			    
			}
            if(harvesters.length<num){
                Game.getObjectById(room.memory.spawns).spawnCreep(Body, newName, {memory: {role: 'vandle', home: room.name, mine: mineRoom}})
            }
            
        }
    },
}

module.exports = roleVandle;