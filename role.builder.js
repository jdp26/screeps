var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && _.sum(creep.carry)==0){
            creep.memory.building = false;
        }
        if(!creep.memory.building && _.sum(creep.carry)==creep.carryCapacity){
            creep.memory.building = true;
        }
        
        if(creep.memory.building){
            if(creep.carry.energy>0){creep.builder();}
            else{creep.truck();}
        }
        
        if(!creep.memory.building){
           creep.fill();
        }
        
    },
    
    spawn: function(num,room){      
		var extensions = room.memory.extensions;
        if(extensions<5){
            Body=[WORK,CARRY,MOVE];            
        }
        else{
            Body=[WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE];            
        }
        if(room.memory.builders<num){
            var newName='Builder'+Game.time;
            Game.getObjectById(room.memory.spawns).spawnCreep(Body, newName, {memory: {role: 'builder'}});            
        }
    }
};

module.exports = roleBuilder;