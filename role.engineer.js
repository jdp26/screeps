var roleEngineer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.room.name != creep.memory.workroom){
            creep.moveToRoom(creep.memory.workroom);
        }
        else{
        if(creep.memory.building && creep.carry.energy==0){
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy==creep.carryCapacity){
            creep.memory.building = true;
        }
        
        if(creep.memory.building){
            creep.repairStuff();
        }
        if(!creep.memory.building){
            creep.fill();
        }}
    },
    
    spawn: function(num,room,targetroom){
        var engineers = room.memory.engineer;
        //console.log('Engineers: ' + engineers);
        if(engineers<num){
            var newName='Engineer'+Game.time;
			if(room.energyAvailable>200){
				Game.getObjectById(room.memory.spawns).spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'engineer', workroom: targetroom}});
			}

        }
    }
        
};
module.exports = roleEngineer;