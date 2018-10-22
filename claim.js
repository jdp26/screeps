var roleDefender = require('role.defender');
var roleremBuilder = require('role.remotebuilder');
var roleVandle = require('role.vandle');

var claim={
	claim: function(room,claimRoom,spawn){
		if(Memory.hostile[claimRoom]==undefined){
			Memory.hostile[claimRoom]={};
			Memory.hostile[claimRoom].evacuate=false;
			Memory.hostile[claimRoom].nonhostile=false;			
		}
		
		if(spawn.spawning == null){
		roleDefender.spawn(room.name,claimRoom,spawn);
		var claimers=_.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
		if(claimers.length<1 && (Game.rooms[claimRoom]==undefined || Game.rooms[claimRoom].controller.owner==undefined)){
			claim.spawn(room,claimRoom,spawn);
		}
		roleremBuilder.spawn(6,room,claimRoom,spawn);
		roleVandle.spawn(room,claimRoom,spawn);
		}
		
		if(Game.rooms[claimRoom]!=undefined){
		var spawner=Game.rooms[claimRoom].find(FIND_STRUCTURES, {filter: (s) => s.structureType==STRUCTURE_SPAWN});
		if(spawner.length>0){
			delete room.memory.claim;
			Game.notify('Claim Complete',5);
			Memory.rooms[claimRoom]={};
			Memory.rooms[claimRoom].spawns=[];
			Memory.rooms[claimRoom].spawns.push(spawner[0].id);
		}}
	},
	
	run: function(creep){
		if(creep.room.name != creep.memory.claimRoom){
			creep.moveToRoom(creep.memory.claimRoom);
		}
		else{
			if(creep.claimController(creep.room.controller)==ERR_NOT_IN_RANGE){
				creep.moveToObject(creep.room.controller);
			}
		}
	},
	
	spawn: function(room,claimRoomname,spawn){
		var newName='Claimer'+Game.time;
		spawn.spawnCreep([CLAIM,MOVE,MOVE], newName, {memory: {role: 'claimer', claimRoom: claimRoomname}});
	},
};

module.exports = claim;