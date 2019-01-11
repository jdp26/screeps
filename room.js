var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleEngineer = require('role.engineer');
var roleTrucker = require('role.trucker');
var roleVandle = require('role.vandle');
var roleRemoteTruck = require('role.remoteTruck');
var roleDefender = require('role.defender');
var roleDistribute = require('role.distribute');
var roleSpook = require('role.spook');
var roleCleaner=require('role.cleaner');
var claim=require('claim');
var roleReserver = require('roleReserver');
var roleLinkMan = require('role.roleLinkMan');
var roleTowerMan=require('role.roleTowerMan');
var spawnkill=require('role.spawnkill');
var roleDismantle=require('role.dismantler');
var roleBoo=require('role.Boo')

var room_control={
    maintain: function(name){
        room=Game.rooms[name];
        if(room.memory.new==undefined){
            room_control.new(room);
        }
        if(room.memory.scout){
            var scoutName='Scout' + room.name;
            if(Game.creeps[scoutName]==undefined){
                Game.spawns[0].spawnCreep([MOVE],scoutName);
            }
            if(Game.creeps[scoutName].room.name != room.name){
		        Game.creeps[scoutName].moveTo(new RoomPosition(room.name));
        	}
        	else{
        	    room_control.scout(room);
        	}
        }
        else{
			//Novice Area Code
			if(room.controller.level<4 && room.controller.safeMode==undefined) {
				if(room.controller.safeModeAvailable >0 && room.controller.safeModeCooldown==undefined){
				room.controller.activateSafeMode();}
			}
			//Normall Code
			if(room.memory.prebuild != undefined && room.memory.prebuild.length>0){
			    for(var building of room.memory.prebuild){
			        if(room.controller.level==building.level){
			            room.createConstructionSite(building.x,building.y,building.type);
			        }
			    }
			    delete room.memory.prebuild;
			}
			var structures = room.find(FIND_STRUCTURES);
			if(room.controller.level>6 && Math.floor(Game.time/100)*100==Game.time){
				spawns=_.filter(structures, (structure) => structure.structureType==STRUCTURE_SPAWN);
				if(spawns.length>room.memory.spawns.length){
				    console.log('New spawn detected');
					room.memory.spawns=[];
					for (var s of spawns){
						room.memory.spawns.push(s.id);
					}
				}
			}
			room_control.countCreeps(room);			
			room.memory.extensions=_.filter(structures,(structure) => structure.structureType == STRUCTURE_EXTENSION).length;
			room.memory.road_count=_.filter(structures,(structure) => structure.structureType == STRUCTURE_ROAD).length; 
			var container_count = _.filter(structures, (structure) => structure.structureType == STRUCTURE_CONTAINER).length;
			room.memory.container_count=container_count;
			var towers=_.filter(structures, (structure) => structure.structureType == STRUCTURE_TOWER);
			var extractor=_.filter(structures, (structure) => structure.structureType == STRUCTURE_EXTRACTOR);
			var tower_count = towers.length;
			var eExtensionSpawns= _.filter(structures,(structure) => (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity);
			if(eExtensionSpawns.length>0){room.memory.emptyExtensionSpawn=eExtensionSpawns[0].id;}
			var eTower=_.filter(towers,(s) => s.energy<s.energyCapacity);
			if(eTower.length>0){room.memory.emptyTower=eTower[0].id;}
            var host=room.memory.hostile;
			if(host>0){room_control.hostile(room);}
            if(host==0){room_control.creepCreate(room,container_count,tower_count);}
            room_control.tower(room,towers);
            var stores= _.filter(structures, (s)=> s.structureType==STRUCTURE_STORAGE);
            if(stores.length>0){room_control.store(room,stores);}
            if(room.find(FIND_DROPPED_RESOURCES).length>0 && stores.length>0){
                room_control.cleaner(room);
            }
            if(room.controller.level>4){
            	if(Math.floor(Game.time/200)*200==Game.time){
				    room_control.linklist(room);
				}
            }
			if(room.memory.link.length>1){
				room_control.links(room);
			}
			if(room.controller.level==6 && extractor.length==0){
				room_control.minerals(room);
				if(room.find(FIND_CONSTRUCTION_SITES, {filter: s => s.structureType==STRUCTURE_EXTRACTOR}).length==0){
					room.createConstructionSite(Game.getObjectById(room.memory.mineralid).pos,STRUCTURE_EXTRACTOR);
				}
			}
			else if(extractor.length==1 && (room.memory.extractor==undefined || room.memory.extractor==false)){
			    room.memory.extractor=true;
			}
        }
    },
    creepCreate: function(room,container_count,tower_count){
        if(room != undefined && room.memory.spawns.length>0){
		for (var spawnID of room.memory.spawns){
			var spawn=Game.getObjectById(spawnID);
			if(spawn != null && spawn.spawning == null){
			roleHarvester.spawn(room.memory.sources.length,room,spawn);

			if(room.memory.harvesters>0){roleUpgrader.spawn(room,spawn);}
			if(room.controller.level>1){
				if(room.memory.Boo){
					roleBoo.spawn(room,room.memory.Boo.target,room.memory.Boo.safe,spawn);
				}
			    if(room.memory.claim){
				    claim.claim(room,room.memory.claim,spawn);
			    }
				if(room.memory.dismantle){
					roleDismantle.spawn(room,room.memory.dismantle,spawn);
				}
				if(room.memory.dismantleTarget){
					roleDismantle.spawnTarget(room,room.memory.dismantleTarget.room,spawn,room.memory.dismantleTarget.id);
				}
				if(room.memory.drain){
				    roleRemoteTruck.spawnDrain(room,room.memory.drain,spawn);
				}
				if(room.controller.level>5){
					roleHarvester.Mineralspawn(room,spawn);
				}
				if(room.memory.spawnkill != undefined){
					var spawn_killers=_.filter(Game.creeps, (creep) => creep.memory.role == 'SKill').length;
					if(spawn_killers==0){spawnkill.spawn(room,room.memory.spawnkill,spawn);}
				}
				roleTrucker.spawn(container_count,room,spawn);
				var sites=room.find(FIND_CONSTRUCTION_SITES);
				roleBuilder.spawn(2*Math.min(sites.length,2),room,spawn);			
				if((tower_count==0 || tower_count==undefined || room.controller.level<4) && (room.memory.road_count>0 || room.memory.container_count>0)){roleEngineer.spawn(2,room,room.name,spawn);}
				if(room.memory.reserve==undefined){
					room.memory.reserve=[];
				}
				else if(room.memory.reserve.length>0){
					var k=0;
					while(k<room.memory.reserve.length){
					    if(Memory.hostile[room.memory.reserve[k]]==undefined){
					        Memory.hostile[room.memory.reserve[k]]={};
					    }
					    else{
						if(Game.rooms[room.memory.reserve[k]]!=undefined){
						var hostile_list=Game.rooms[room.memory.reserve[k]].find(FIND_HOSTILE_CREEPS);
						Memory.hostile[room.memory.reserve[k]].hostileCount=hostile_list.length;
						if(hostile_list.length>0){
								roleDefender.spawn(room.name,room.memory.reserve[k],spawn);
						}
						else{
						roleReserver.spawn(room,room.memory.reserve[k],spawn);}
						    
						}
						else{
						    if(Memory.hostile[room.memory.reserve[k]].hostileCount>0){
						        roleDefender.spawn(room.name,room.memory.reserve[k],spawn);
						    }
						    else{
							if(_.filter(Game.creeps, (creep) => creep.memory.role == 'spooker' && creep.memory.spook==room.memory.reserve[k]).length==0){
							roleSpook.spawn(room,room.memory.reserve[k],spawn);}}
						}
					    }
						k=k+1;		
					}
				}
				if(room.memory.mine.length>0){
					var i=0;
					while(i<room.memory.mine.length){
						if(Memory.hostile[room.memory.mine[i]]==undefined){
							Memory.hostile[room.memory.mine[i]]={};
						}
						else{
							if(Game.rooms[room.memory.mine[i]] != undefined){
							var hostile_list=Game.rooms[room.memory.mine[i]].find(FIND_HOSTILE_CREEPS);
							Memory.hostile[room.memory.mine[i]].hostileCount=hostile_list.length;
							if(hostile_list.length>0){
								roleDefender.spawn(room.name,room.memory.mine[i],spawn);
								var host=false;
								for(var hostile of hostile_list){
								var damage=false;
								var heal=false;
									for(var part of hostile.body){
										if(part.type==ATTACK || part.type == RANGED_ATTACK){
											damageParts=true;
											if(part.hits>0){
												host=true;
											}
										}
										else if(part.type=='HEAL' && part.hits>0){
											heal=true;
										}			
									}
									if(host==false && heal==true && damageParts==true){
										host=true;
									}
								}
								if(host==true){
									Memory.hostile[room.memory.mine[i]].evacuate=true;
								}
								if(host==false){
									Memory.hostile[room.memory.mine[i]].evacuate=false;
									Memory.hostile[room.memory.mine[i]].nonhostile=true;
								}
							}
							else{
								Memory.hostile[room.memory.mine[i]].evacuate=false;
								Memory.hostile[room.memory.mine[i]].nonhostile=false;
							}
						}
						else{
								Memory.hostile[room.memory.mine[i]].evacuate=false;
								Memory.hostile[room.memory.mine[i]].nonhostile=false;
							}
						}
						roleVandle.spawn(room,room.memory.mine[i],spawn);
						roleRemoteTruck.spawn(room,room.memory.mine[i],spawn);
						roleReserver.spawn(room,room.memory.mine[i],spawn);
						i=i+1;
					}
				}
				var spk=room.memory.spook.length;
				var pass=0;
				while(pass<spk){
					roleSpook.spawn(room,room.memory.spook[pass],spawn);
					pass=pass+1;
				}
				
				if(room.controller.level>6 && room.terminal!=null && room.terminal!=undefined){
					if(room.storage.store[room.memory.mineral]>10000 && room.memory.mineralGofer==0){
						gofer.spawn(room.name,room.memory.mineral,room.storage.id,room.terminal.id,spawn);
					}
                }
            }
            var spk=room.memory.spook.length;
            var pass=0;
            while(pass<spk){
                roleSpook.spawn(room,room.memory.spook[pass],spawn);
                pass=pass+1;
            }
			
			if(room.controller.level>5 && room.terminal!=null && room.terminal!=undefined){
				if(room.storage.store[room.memory.mineral]>10000 && room.memory.mineralGofer==0){
					gofer.spawn(room.name,room.memory.mineral,room.storage.id,room.terminal.id,spawn);
					room.memory.mineralGofer=1;
				}
				
				if(room.terminal.store[RESOURCE_ENERGY]>10000 && room.storage.store[RESOURCE_ENERGY]<450000 && room.memory.miniGofer==0){
				    gofer.spawnMini(room.name,RESOURCE_ENERGY,room.terminal.id,room.storage.id,spawn);
				}
			}
			
			if(room.controller.level>5 && room.memory.extractor==true){
				roleHarvester.Mineralspawn(room,spawn);
			}
			
        }

    }
	}},  

    
    tower: function(room,t){      
        if(t.length>0) {
		roleTowerMan.spawn(room);
        var count =0;		
        while(count<t.length){
            var tid= t[count].id; // Tower.id
            tower=Game.getObjectById(tid);
				if(tower.energy>0){
					var structures=room.find(FIND_STRUCTURES);
					var DamagedStructure = _.filter(structures,(structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART);
					var allWalls = _.filter(structures, (structure) =>  (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits<(Math.min(structure.hitsMax,5000000)));
					var walls = _.filter(allWalls, (structure) =>  structure.hits < room.memory.wallMax);
					var wall_hits=1000;
					if(room.memory.hostile>0) {
						var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
						tower.attack(closestHostile);
					}
					else if(DamagedStructure.length>0) {
    					tower.repair(DamagedStructure[0]);
    			    }
					else if(walls.length>0){
						var wall_check=false;
						var wall2;
						while(wall_check==false){
							wall2= _.filter(walls,(structure) => structure.hits < wall_hits);
							if(wall2.length>0){
								wall_check=true;
							}
							wall_hits=wall_hits+1000;
							if(wall_hits>room.memory.wallMax){
								wall_check=true;
							}
						}
						
						if(wall2.length>0){
							tower.repair(wall2[0]);
						}
					}
					else if(allWalls.length>0 && room.storage != undefined && room.storage.store[RESOURCE_ENERGY]>300000){
					    room.memory.wallMax=room.memory.wallMax+10000;
					}
				}
            count=count+1;
		}
        }
    },
    
    new: function(room){
        room.memory = {};
        room.memory.new=true;
        room.memory.scout=true;
        room.memory.wallMax=3000;
        room.memory.link=[];
		room.memory.spook=[];
        for(var r in Game.rooms){
    		if(Game.rooms[r].name==room.name){
    			room.memory.scout=false;
    		}
	    }
	    if(!room.memory.scout){
	        room_control.scout(room);
	    }
	    else if(room.memory.sources==undefined){
	        var source = room.find(FIND_SOURCES)
	        var count=0;
            while(count<source.length){
            room.memory.sources.push(source[count].id);
            count=count+1;
        }  
	    }
	    if(room.memory.scout){
	        var newName='Scout' + room.name;
			if(Game.spawns[0].spawning == null){
				Game.spawns[0].spawnCreep([MOVE],newName);
				if(Game.creeps[newName].room.name != room.name){
					Game.creeps[newName].moveToRoom(room.name);
				}
				else{
					room_control.scout(room);
				}
			}
	    }
    },
    scout: function(room){
        room.memory.scout=false;
        room.memory.spawns= [];
	    room.memory.sources=[];
	    room.memory.mine=[];
	    for(var s in Game.spawns){
	        if(Game.spawns[s].room.name==room.name){
	            room.memory.spawns.push(Game.spawns[s].id);
	        }
	    }
	    var source = room.find(FIND_SOURCES)
	    var count=0;
        while(count<source.length){
            room.memory.sources.push(source[count].id);
            count=count+1;
        }  
    },
    hostile: function(room){   
            if(Memory.hostile[room.name]==undefined){
                Memory.hostile[room.name]={};
                Memory.hostile[room.name].nonhostile=false;
            }
            Memory.hostile[room.name].hostileCount=room.memory.hostile;
            roleDefender.spawn(room.name,room.name,Game.getObjectById(room.memory.spawns[0]));
            /*var name='Defender' +Game.time;
			if(Game.getObjectById(room.memory.spawns[0]).spawning == null){
				if(room.energyAvailable<380)Game.getObjectById(room.memory.spawns[0]).spawnCreep([TOUGH,TOUGH,MOVE,ATTACK,ATTACK,MOVE],name, {memory: {role: 'defender'}});
				else{Game.getObjectById(room.memory.spawns[0]).spawnCreep([TOUGH,TOUGH,MOVE,ATTACK,ATTACK,MOVE,MOVE,MOVE],name, {memory: {role: 'defender'}});}
			}*/
    },
    store: function(room){
        var distribute = _.filter(Game.creeps, (creep) => creep.memory.role == 'distribute' && creep.room.name==room.name);
        if(distribute.length<2 && Game.getObjectById(room.memory.spawns[0]).spawning == null){
            var newName='Distribute'+Game.time;
			var parts= Math.floor(room.energyAvailable/100);
			if(parts>1){
				var distBody=[];
				var counting=0;
				while(counting<parts){
					distBody.push(CARRY);
					distBody.push(MOVE);
					counting=counting+1;
					if(counting==20){
						break;
					}
				}
				if(Game.getObjectById(room.memory.spawns[0]).spawning == null){
					Game.getObjectById(room.memory.spawns[0]).spawnCreep(distBody,newName, {memory: {role: 'distribute' , home: room.name}});
				}
			}
        }
    },
    cleaner: function(room){
        var cleaners =  _.filter(Game.creeps, (creep) => creep.memory.role == 'cleaner' && creep.room.name==room.name);
        if(cleaners.length==0 && Game.getObjectById(room.memory.spawns[0]).spawning == null){
            var newName = 'Cleaner'+Game.time;
			if(Game.getObjectById(room.memory.spawns[0]).spawning == null){
				Game.getObjectById(room.memory.spawns[0]).spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],newName, {memory: {role: 'cleaner'}});
			}
        }
    },
	links: function(room){
		roleLinkMan.spawn(room);
		var reciever;
		for(var output of room.memory.link){
			if(output.type=='output'){
				reciever = Game.getObjectById(output.name);
			}
		}
		if(reciever != undefined && reciever.energy<reciever.energyCapacity){
		for(var input of room.memory.link){
			if(input.type=='input'){
				var transmitter = Game.getObjectById(input.name);
				if(transmitter.energy>0 && transmitter.cooldown==0){
					transmitter.transferEnergy(reciever);
				}
			}
		}}
	},
	linklist: function(room){
	    var Link=room.find(FIND_STRUCTURES,{filter: s=> s.structureType==STRUCTURE_LINK});
	    if(Link.length != room.memory.link.length){
	        delete room.memory.link;
	        room.memory.link = [];
	        for(var l of Link){
	            var store = l.pos.findInRange(FIND_STRUCTURES,3,{filter: s=> s.structureType==STRUCTURE_STORAGE});
	            if(store.length>0){
	                var pushOb={name:l.id, type:'output'};
	            }
	            else{
	                var pushOb={name:l.id, type:'input'};
	            }
	            room.memory.link.push(pushOb);
	        }
	    }
	},
	countCreeps: function(room){
		room.memory.hostile=room.find(FIND_HOSTILE_CREEPS).length;
		if(Math.floor(Game.time/(2*CREEP_SPAWN_TIME))*2*CREEP_SPAWN_TIME==Game.time){
		var creepsInRoom= _.filter(Game.creeps, (creep) => creep.room.name==room.name);
		room.memory.harvesters = _.filter(creepsInRoom, (creep) => creep.memory.role == 'harvester').length;
		room.memory.engineer = _.filter(creepsInRoom, (creep) => creep.memory.role == 'engineer').length;
		room.memory.upgraders= _.filter(creepsInRoom, (creep) => creep.memory.role == 'upgrader').length;
		room.memory.trucker=_.filter(creepsInRoom, (creep) => creep.memory.role == 'trucker').length;
		room.memory.distribute=_.filter(creepsInRoom, (creep) => creep.memory.role == 'distribute').length;
		room.memory.builders = _.filter(creepsInRoom, (creep) => creep.memory.role == 'builder').length;
		room.memory.mineralHarvest = _.filter(creepsInRoom, (creep) => creep.memory.role == 'mineralharvester').length;
		if(room.memory.mineral != undefined){
			room.memory.mineralGofer = _.filter(creepsInRoom, (creep) => creep.memory.role == 'gofer' && creep.body.length>2 && creep.memory.resource == room.memory.mineral).length;
			room.memory.miniGofer = _.filter(creepsInRoom, (creep) => creep.memory.role == 'gofer' && creep.body.length==2).length;
		}
		}
	},
	minerals: function(room){
		if(room.memory.mineral==undefined){
			var m = room.find(FIND_MINERALS);
			room.memory.mineral=m[0].mineralType;
			room.memory.mineralid=m[0].id;
		}
	},
    
}
module.exports = room_control;
