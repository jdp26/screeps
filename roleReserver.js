var roleReserver ={
	run: function(creep){
		if(creep.room.name != creep.memory.reserve){
			creep.moveToRoom(creep.memory.reserve);
		}
		else{
		    if(creep.room.controller.owner != undefined && creep.room.controller.owner.username != 'jodape'){
		        if(creep.attackController(creep.room.controller)==ERR_NOT_IN_RANGE){
    				creep.moveToObject(creep.room.controller);
    			}
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
		}
	},
	
    spawn: function(room,reserveRoom,spawn){
		var skip =false;
		if(Memory.hostile[reserveRoom] == undefined || Memory.hostile[reserveRoom].hostileCount==undefined || Memory.hostile[reserveRoom].hostileCount>0){skip=true;}
        if(skip==false){			
		var extensions = room.memory.extensions;
		if(extensions>19){
		var Reservers=_.filter(Game.creeps, (creep) => creep.memory.role == 'reserve' && creep.memory.reserve==reserveRoom).length;
		if(Reservers==0){
			if(Game.rooms[reserveRoom]!= undefined){
				if(Game.rooms[reserveRoom].controller.reservation == undefined || Game.rooms[reserveRoom].controller.reservation.ticksToEnd<2500){
					var name = 'Reserve'+Game.time;
					spawn.spawnCreep([CLAIM,CLAIM,MOVE,MOVE],name,{memory: {role: 'reserve', reserve: reserveRoom}})
				}
			}
		}}
		}
	},
};
module.exports = roleReserver;