var roleDistribute = {
    /** @param {Creep} creep **/
    run: function(creep) {
		if(creep.ticksToLive<30){
			if(_.sum(creep.carry)>0){
			//	console.log('Distributor near death');
				creep.truck();
			}
			else{
				creep.suicide();
			}
		}
		else{
			var structures=creep.room.find(FIND_STRUCTURES);
			if(creep.memory.truck && creep.carry.energy==0){
				creep.memory.truck = false;
			}
			if(!creep.memory.truck && creep.carry.energy==creep.carryCapacity){
				creep.memory.truck = true;
			}
			
			if(creep.memory.truck){
				if(creep.memory.home != undefined && creep.memory.home != creep.room.name){
					creep.moveToRoom(creep.memory.home);
				}
				else if(creep.memory.target==undefined){
					var targets = _.filter(structures, (structure) => {
							return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
									structure.energy < structure.energyCapacity;
							}
					);
					var targets2 = _.filter(structures, (s)=> s.structureType==STRUCTURE_TOWER && s.energy<s.energyCapacity);
					if(targets.length>0 && creep.room.memory.hostile==0){
						if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveToObject(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
						creep.memory.target=targets[0].id;
						}
					}
					else if (targets2.length>0){
						if(creep.transfer(targets2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveToObject(targets2[0], {visualizePathStyle: {stroke: '#ffffff'}});
						creep.memory.target=targets2[0].id;
						}
					}
					else if (creep.room.storage.store[RESOURCE_ENERGY]>800000 && creep.room.terminal != undefined){
						if(creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveToObject(creep.room.terminal, {visualizePathStyle: {stroke: '#ffffff'}});
							creep.memory.target=creep.room.terminal.id;
						}
					}
				}
				else{				
					var tar = Game.getObjectById(creep.memory.target);
					if(tar.energy !=tar.energyCapacity){
						if(creep.transfer(tar, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
							creep.moveToObject(tar, {visualizePathStyle: {stroke: '#ffffff'}});
						}
						else{
							delete creep.memory.target;
						}
					}
					else{
						delete creep.memory.target;
					}
				}
			}
			
			if(!creep.memory.truck){
				if(creep.memory.home != undefined && creep.memory.home != creep.room.name){
					creep.moveToRoom(creep.memory.home);
				}
				else{
					c=creep.room.storage;
					if(c!=null && c.store[RESOURCE_ENERGY]>0){
						if(creep.withdraw(c,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
						creep.moveToObject(c, {visualizePathStyle: {stroke: '#ffaa00'}});}
					}
					else{creep.moveToCenter(creep.room.name);}

				}
			}
		}
    }
    
};

module.exports = roleDistribute;
