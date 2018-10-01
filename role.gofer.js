var gofer = {
	run: function(creep){
	    //console.log('run gofer' + ' ' + creep.memory.active);
	    if(creep.memory.active==undefined){
			creep.memory.active=false;
	    }
		
		if(_.sum(creep.carry)==creep.carryCapacity && creep.memory.active==false){
			creep.memory.active=true;
		}
		
		if(_.sum(creep.carry)==0 && creep.memory.active==true){
			creep.memory.active=false;
		}
		
		if(creep.memory.active==true){
			var target=Game.getObjectById(creep.memory.target);
			if(creep.transfer(target,creep.memory.resource)== ERR_NOT_IN_RANGE){
				creep.moveToObject(target);
			}
		}
		else{
			var source=Game.getObjectById(creep.memory.source);
			if(source.store[creep.memory.resource]>0){
			if(creep.withdraw(source,creep.memory.resource)== ERR_NOT_IN_RANGE){
				creep.moveToObject(source);
			}}
			else{creep.suicide();}
		}
	},
	spawn: function(roomName,resource,source,target,spawn){
	    var room=Game.rooms[roomName]
		var name = 'Gofer'+Game.time;
		if(room.energyAvailable>400){
		if(Game.getObjectById(room.memory.spawns).spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],name,{memory: {role: 'gofer'}})==0){
			var creep =Game.creeps[name];
			creep.memory.resource=resource;
			creep.memory.source=source;
			creep.memory.target=target;
		}
		}
	}
};

module.exports = gofer;