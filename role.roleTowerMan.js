var roleTowerMan = {
	run: function(creep){
		if(creep.memory.towers==undefined){
			creep.memory.towers=[];
			var t=creep.room.find(FIND_STRUCTURES,{filter: s => s.structureType==STRUCTURE_TOWER});
			for(var id of t){
				creep.memory.towers.push(id.id);
			}
		}
		if(creep.memory.load==undefined){
			creep.memory.load=true;
		}
		if(creep.carry.energy==0 && creep.memory.load==false){
			creep.memory.load=true;
		}
		if(creep.carry.energy>0 && creep.memory.load==true){
			creep.memory.load=false;
		}
		
		if(creep.memory.load){
			if(room.storage != null){
				if(creep.room.storage.store[RESOURCE_ENERGY]>10000){
					if(creep.withdraw(creep.room.storage,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
					creep.moveToObject(creep.room.storage);
				}
				}			
				else{creep.moveToCenter(creep.room.name);}
			}
			else{
				creep.fill(creep);
			}
		}
		else{
			if(creep.memory.towers!=undefined){
				if(creep.memory.current == undefined){
				for(var tid of creep.memory.towers){
					var tower=Game.getObjectById(tid);
					if(tower.energy<(tower.energyCapacity-creep.carryCapacity)){
						if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveToObject(tower,{visualizePathStyle: {stroke: '#ffffff'}});
							creep.memory.current=tower.id;
						}
						break;
					}
				}}
				else{
					var tower=Game.getObjectById(creep.memory.current);
					if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveToObject(tower,{visualizePathStyle: {stroke: '#ffffff'}});
					}
					else{
						delete creep.memory.current;
					}
				}
			}
		}
	},
	
	spawn: function(room){
		var linkers= _.filter(Game.creeps, (creep) => creep.memory.role == 'towerfill' && creep.room.name==room.name).length;
		if(linkers==0){
			var name = 'TowerFiller'+Game.time;
			Game.getObjectById(room.memory.spawns).spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],name,{memory: {role: 'towerfill'}});
		}
	},
};
module.exports = roleTowerMan;