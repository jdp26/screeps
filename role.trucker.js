var roleTrucker = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.truck && _.sum(creep.carry)==0){
            creep.memory.truck = false;
        }
        if(!creep.memory.truck && _.sum(creep.carry)==creep.carryCapacity){
            creep.memory.truck = true;
        }
        
        if(creep.memory.truck){
            creep.truck();
        }
        
        if(!creep.memory.truck){
            creep.fill();
        }
    },
    
    spawn: function(num,room,spawn){
		num=Math.min(num,2);
        var truckers = room.memory.trucker;
        var extensions=room.memory.extensions;
		var Body;
		var mult;
		if(truckers==0 || extensions<10){
			Body=[CARRY,CARRY,MOVE,MOVE];
			mult=2;
		}
		else{
			Body=[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
			mult=1;
		}
		
		if(room.storage != null && room.storage.store[RESOURCE_ENERGY]>900000){
			mult=0.5;
		}
		if(room.memory.mine.length>1){
		    num=2;
		    mult=1;
		}
        if(truckers<num*mult){
            var newName='Trucker'+Game.time;                   
            spawn.spawnCreep(Body, newName, {memory: {role: 'trucker'}});
		}
    }
};
        
module.exports = roleTrucker