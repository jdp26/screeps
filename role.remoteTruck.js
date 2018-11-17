var roleRemoteTruck ={
    run: function(creep){
		var home=creep.memory.home;
		var mine=creep.memory.mine;
		var currentRoom=creep.room.name;
        if(creep.memory.hostile==true){
            if(Memory.hostile[mine].evacuate==false){
				creep.memory.hostile=false;
            }
            if(currentRoom != home){
                creep.moveToRoom(home);
                if(creep.memory.harvesttarget != undefined){
                    delete creep.memory.harvesttarget;
                }
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
			if(Memory.hostile[mine]==undefined){
				Memory.hostile[mine]={};
				Memory.hostile[mine].evacuate=false;
			}
			if(Memory.hostile[mine].evacuate==true){
				creep.memory.hostile=true;
			}
            
			
			if(creep.memory.hostile==undefined || creep.memory.hostile==false){
			    creep.memory.hostile=false;
			    if(creep.memory.building == undefined){
			        creep.memory.building =false;
			    }
			    
				if(!creep.memory.building && creep.carry.energy==creep.carryCapacity){
						creep.memory.building = true;						
					}
				if(creep.memory.building && creep.carry.energy==0){
						creep.memory.building = false;
				}
					
				if(!creep.memory.building){
					if(currentRoom == mine){
					    if(creep.memory.drain===undefined || creep.memory.drain===false){
						if(creep.room.storage==undefined || creep.room.storage.owner.username!='jodape'){
					    var container = creep.room.find(FIND_STRUCTURES, {
						filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER && (creep.carryCapacity-creep.carry.energy) < structure.store[RESOURCE_ENERGY] )}});
						if(container.length>0 && creep.body.length!=5){creep.fill();}
						else{creep.moveToCenter();}}
						else{
							if(creep.withdraw(creep.room.storage,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
								creep.moveToObject(creep.room.storage);
							}
						}
					}
					 else{
					       if(creep.memory.target===undefined || creep.memory.target===null && creep.memory.drain===true){
					            var t=creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: s => (s.energy!== undefined && s.energy>0) || (s.store !== undefined && s.store[RESOURCE_ENERGY]>0)});
					            if(t !== null){
					                creep.memory.target=t.id;
					            }
					            else if (creep.room.name==mine){
					                Game.notify('Clear room drain',5);
					                try{delete Game.rooms[home].memory.drain;}catch(err){creep.suicide();}
					                creep.suicide();
					            }
					        }
					        var target = Game.getObjectById(creep.memory.target);
					        if(creep.withdraw(target,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
								creep.moveToObject(target);
							}
							else{
							    creep.memory.target=null;
							}
					    }
					}
					else{
					    if(creep.memory.harvesttarget==undefined || creep.memory.harvesttarget =='empty'){
						    creep.moveToRoom(mine);
					    }
					    else{
					        var target = Game.getObjectById(creep.memory.harvesttarget);
					        if(target!=null){
					            creep.moveToObject(target);
					        }
					        else{
					            creep.memory.harvesttarget='empty';
					        }
					    }
					}
				}
				
				if(creep.memory.building){
					if(currentRoom == mine){
                        creep.memory.linkcheckcount=0;
							creep.moveToRoom(home);
						}
						else if(currentRoom == home){
							var linkcheckcounter=creep.memory.linkcheckcount;
								if((creep.memory.linkcheck==false && linkcheckcounter<15) || creep.memory.linkcheck==undefined){
									var link=creep.pos.findInRange(FIND_STRUCTURES, 2, {filter: (s) => s.structureType==STRUCTURE_LINK && s.energy<s.energyCapacity});
									if(link.length>0){
										creep.memory.link=true;
										var link_found=link[0];
									}
									else{
										creep.memory.link=false;
										creep.memory.linkcheckcount=linkcheckcounter+1;
									}
								}
								if(creep.memory.link){									
									if(creep.transfer(link_found, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
										creep.moveToObject(link_found, {visualizePathStyle: {stroke: '#ffffff'}});
									}
									else{
										creep.memory.link=false;
										creep.memory.linkcheck=false;
									}
								}
							    else{creep.truck();}				      
						}
						else{
							creep.memory.linkcheckcount=0;
							creep.moveToRoom(home);
						}
				}
			}
        }
     
    },
    spawn: function(room,mineRoom,spawn){
		var num;
        var skip =false;
		if(Memory.hostile[mineRoom].evacuate==true){skip=true;}
		
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteTruck' && creep.memory.mine==mineRoom);
        var remoteMiners= _.filter(Game.creeps, (creep) => creep.memory.role == 'vandle' && creep.memory.mine==mineRoom);
		
        if(remoteMiners.length<1 || remoteMiners.length == undefined){
            skip=true;
        }
        if(skip==false || harvesters.length==0){
		    var energyNeeded;
            var newName='RTruck'+Game.time;
            var Body;
            var extensions = room.memory.extensions;
            if(extensions<5){Body=[CARRY,MOVE];num=4;energyNeeded=100;}
            else if (extensions<10){Body=[CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];num=4;energyNeeded=300;}
            else if (extensions<15){Body=[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];num=3;energyNeeded=600;}
            else {Body=[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];num=3;energyNeeded=1000;}

			if(Memory.mine[mineRoom]!= undefined && Memory.mine[mineRoom].source==1){
				num=num/2;
			}
			
            if(harvesters.length<num && room.energyAvailable>energyNeeded-1){
                spawn.spawnCreep(Body, newName, {memory: {role: 'remoteTruck', home: room.name, mine: mineRoom}})

            }
        }
    },
    
    spawnDrain: function(room,mineRoom,spawn){
        var num=2;
        var skip =false;
		
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteTruck' && creep.memory.mine==mineRoom);
        if(skip==false || harvesters.length==0){
		    var energyNeeded;
            var newName='RTruck'+Game.time;
            var Body;
            var extensions = room.memory.extensions;
            if(extensions<5){Body=[CARRY,MOVE];energyNeeded=100;}
            else if (extensions<11){Body=[CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];energyNeeded=300;}
            else if (extensions<15){Body=[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];energyNeeded=600;}
            else {Body=[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];energyNeeded=1000;}

			
            if(harvesters.length<num && room.energyAvailable>energyNeeded-1){
                spawn.spawnCreep(Body, newName, {memory: {role: 'remoteTruck', home: room.name, mine: mineRoom, drain: true}})

            }
        }
    },
}

module.exports = roleRemoteTruck;