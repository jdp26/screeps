var roleReserver ={
	run: function(creep){
		if(creep.room.name != creep.memory.reserve){
			creep.moveToRoom(creep.memory.reserve);
		}
		else{
			if(creep.reserveController(creep.room.controller)==ERR_NOT_IN_RANGE){
				creep.moveToObject(creep.room.controller);
			}
			else if (creep.room.controller.sign== undefined || creep.room.controller.sign.username != 'jodape'){
			    console.log('Signing Controller');
			    creep.signController(creep.room.controller,'Claimed by Jodape');
			}
		}
	},
	
	spawn: function(room,reserveRoom){
		var extensions = room.memory.extensions;
		if(extensions>19){
		var Reservers=_.filter(Game.creeps, (creep) => creep.memory.role == 'reserve' && creep.memory.reserve==reserveRoom).length;
		if(Reservers==0){
			if(Game.rooms[reserveRoom]!= undefined){
				if(Game.rooms[reserveRoom].controller.reservation == undefined || Game.rooms[reserveRoom].controller.reservation.ticksToEnd<2500){
					var name = 'Reserve'+Game.time;
					Game.getObjectById(room.memory.spawns).spawnCreep([CLAIM,CLAIM,MOVE,MOVE],name,{memory: {role: 'reserve', reserve: reserveRoom}})
				}
			}
		}}
	},
};
module.exports = roleReserver;