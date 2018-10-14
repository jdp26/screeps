var roleLinkMan = {
	run: function(creep){
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
			var link=Game.getObjectById(creep.memory.link);
			if(link.energy>0){
			if(creep.withdraw(link,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
				creep.moveToObject(link);
			}}else{creep.moveToObject(link);}			
		}
		else{
			var storage=creep.room.storage;
			var terminal=creep.room.terminal;
			if(Game.getObjectById(storage.id).store[RESOURCE_ENERGY]>850000 && terminal != undefined){				
				if(creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveToObject(terminal, {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
			else{
				if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveToObject(storage, {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
		}
	},
	
	spawn: function(room){
		var linkers= _.filter(Game.creeps, (creep) => creep.memory.role == 'linker' && creep.room.name==room.name).length;
		if(linkers==0){
			var name = 'Linker'+Game.time;
			if(Game.getObjectById(room.memory.spawns[0]).spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],name,{memory: {role: 'linker'}})==0){
			for(var output of room.memory.link){
				if(output.type=='output'){
				reciever = Game.getObjectById(output.name);
				}
			}
			Game.creeps[name].memory.link=reciever.id;
			
			Game.creeps[name].memory.storage=room.storage.id;			
			}
		}
	},
};
module.exports = roleLinkMan;