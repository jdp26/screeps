var room_control = require('room');
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
var roleremBuilder = require('role.remotebuilder');
var roleReserver = require('roleReserver');
var roleLinkMan = require('role.roleLinkMan');
var roleTowerMan=require('role.roleTowerMan');
var spawnkill=require('role.spawnkill');
require('prototype.creep')();
global.gofer=require('role.gofer');
global.user=require('user');
const profiler = require('screeps-profiler');
profiler.enable();

module.exports.loop = function () {
 

    profiler.wrap(function() {
	if(Game.cpu.bucket>100){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
	

    for(var r in Memory.rooms){
        room_control.maintain(r);
    }
	
	for(var name in Game.creeps) {
            var creep = Game.creeps[name];
			if(creep.spawning==false){
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role== 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role== 'engineer') {
                roleEngineer.run(creep);
            }
            if(creep.memory.role== 'trucker'){
                roleTrucker.run(creep);
            }
            if(creep.memory.role=='defender'){
                var hostile=creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                if(hostile){
                if(creep.attack(hostile)==ERR_NOT_IN_RANGE){
                    creep.moveTo(hostile);
                }}
            }
            if(creep.memory.role=='vandle'){
                roleVandle.run(creep);
            }
            if(creep.memory.role=='remoteTruck'){
                roleRemoteTruck.run(creep);
            }
            if(creep.memory.role=='rdefend'){
                roleDefender.run(creep);
            }
            if(creep.memory.role=='distribute'){
                roleDistribute.run(creep);
            }
            if(creep.memory.role=='spooker'){
                roleSpook.run(creep);
            }
            if(creep.memory.role=='cleaner'){
                roleCleaner.run(creep);
            }
			if(creep.memory.role=='claimer'){
				claim.run(creep);
			}
			if(creep.memory.role=='remotebuilder'){
				roleremBuilder.run(creep);
			}
			if(creep.memory.role=='reserve'){
				roleReserver.run(creep);
			}
			if(creep.memory.role=='linker'){
				roleLinkMan.run(creep);
			}
			if(creep.memory.role=='towerfill'){
				roleTowerMan.run(creep);
			}
			if(creep.memory.role=='gofer'){
				gofer.run(creep);
			}
			if(creep.memory.role=='SKill'){
			    spawnkill.run(creep);
			}
			}
        }
    
	}});


}