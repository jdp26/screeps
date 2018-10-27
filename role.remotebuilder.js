var roleremBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
		if(creep.room.name != creep.memory.buildRoom){
			creep.moveToRoom(creep.memory.buildRoom);
		}
		else{
        if(creep.memory.building && creep.carry.energy==0){
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy==creep.carryCapacity){
            creep.memory.building = true;
        }
        
        if(creep.memory.building){
            creep.builder();
        }
        
        if(!creep.memory.building){
           creep.fill();
        }}
        
    },
    
    spawn: function(num,room,target,spawn){
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'remotebuilder');
        var extensions = room.memory.extensions;
		var energyReq;
        if(extensions<5){
            Body=[WORK,CARRY,MOVE];
            energyReq=200;
        }
        else{
            Body=[WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
            energyReq=1100;
        }
        if(builders.length<num && room.energyAvailable>(energyReq-1)){
            var newName='Builder'+Game.time;

            spawn.spawnCreep(Body, newName, {memory: {role: 'remotebuilder', buildRoom: target}});

            
        }
    }
};

module.exports = roleremBuilder;