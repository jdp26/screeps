var roleDefender = require('role.defender');
var roleremBuilder = require('role.remotebuilder');
var roleVandle = require('role.vandle');

var claim={
	claim: function(room,claimRoom){
		if(Memory.hostile[claimRoom]==undefined){
			Memory.hostile[claimRoom]={};
			Memory.hostile[claimRoom].evacuate=false;
			Memory.hostile[claimRoom].nonhostile=false;			
		}
		
		if(Game.getObjectById(room.memory.spawns).spawning == null){
		roleDefender.defend(room,claimRoom);
		var claimers=_.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
		if(claimers.length<1 && Game.rooms[claimRoom].controller.owner==undefined){
			claim.spawn(room,claimRoom);
		}
		roleremBuilder.spawn(4,room,claimRoom);
		roleVandle.spawn(room,claimRoom);
		}
		
		if(Game.rooms[claimRoom]!=undefined){
		var spawner=Game.rooms[claimRoom].find(FIND_STRUCTURES, {filter: (s) => s.structureType==STRUCTURE_SPAWN});
		if(spawner.length>0){
			delete room.memory.claim;
			Memory.rooms[claimRoom]={};
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
	
	spawn: function(room,claimRoomname){
		var newName='Claimer'+Game.time;
		Game.getObjectById(room.memory.spawns).spawnCreep([CLAIM,MOVE,MOVE], newName, {memory: {role: 'claimer', claimRoom: claimRoomname}});
	},
};

module.exports = claim;