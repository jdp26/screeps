var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if(creep.room.name == creep.memory.home || creep.memory.home == undefined){
        if(_.sum(creep.carry)==0 && !creep.memory.harvest){
            creep.memory.harvest=true;
        }
        
        if(_.sum(creep.carry) == creep.carryCapacity && creep.memory.harvest){
            creep.memory.harvest=false;
        }
        
        if(creep.memory.harvest) {
            creep.mine();
        }
        else {
        var targets = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);
		var container = creep.pos.findInRange(FIND_STRUCTURES,5,{filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store)<structure.storeCapacity)}});
            if (container.length > 0){
                var dump = creep.pos.findClosestByPath(container);
				for(var resourceType in creep.carry){
                if(creep.transfer(dump, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveToObject(dump, {visualizePathStyle: {stroke: '#ffffff'}});
                }}
            }
			else if(targets.length>0 && creep.carry[RESOURCE_ENERGY]>0){
				creep.memory.buildTarget=targets[0].id;
				creep.builder();
			}
			else{creep.truck();}			
        }
		}
		else{
			creep.moveToRoom(creep.memory.home);
		}
        
	},
	
	spawn: function(num,room){
	    var harvesters = room.memory.harvesters;
        var newName='Harvester'+Game.time;
        var Body;
        var creepsPerSource;
        var extensions = room.memory.extensions;
        if(extensions<2){
            Body=[WORK,WORK,CARRY,MOVE];
            creepsPerSource=2;
        }
        else if(extensions< 4){
            Body=[WORK,WORK,WORK,CARRY,MOVE];
            creepsPerSource=2;
        }
        else if(extensions< 10){
            Body=[WORK,WORK,WORK,WORK,CARRY,MOVE];
            creepsPerSource=1;
        }
        else{
            Body=[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE];
            creepsPerSource=1;
        }
        
        if(harvesters==0){
            Body=[WORK,WORK,CARRY,MOVE];
            creepsPerSource=2;
        }
		
		if(room.storage != null && room.storage.store[RESOURCE_ENERGY]>900000){
			creepsPerSource=0.5;
		}
        
        if(harvesters<(num*creepsPerSource)){
	         
                    if(Game.getObjectById(room.memory.spawns).spawnCreep(Body, newName, {memory: {role: 'harvester'}})==0){					
                    var creep =Game.creeps[newName];
					creep.memory.home = room.name;
                    var sources = [];
					for(var s of room.memory.sources){sources.push(Game.getObjectById(s))}
                    var check=[];
                    sources.forEach(function(srs){
                        var tmp = creep.room.find(FIND_MY_CREEPS, {filter: (s) => s.memory.source == srs.id})
                        if(creepsPerSource==2){
                            if(tmp == '' || tmp.length == 1){
                                creep.memory.source = srs.id;
                            }
                        }
                        else{
                            if(tmp == ''){
                                creep.memory.source = srs.id;
                            }
                        }
                    });

	         }

        }
    
	},
	
	Mineralspawn: function(room){
	    var harvesters = room.memory.mineralHarvest;
        var newName='Harvester'+Game.time;
        var Body;
        var creepsPerSource;
        var extensions = room.memory.extensions;
        if(extensions<2){
            Body=[WORK,WORK,CARRY,MOVE];
            creepsPerSource=2;
        }
        else if(extensions< 4){
            Body=[WORK,WORK,WORK,CARRY,MOVE];
            creepsPerSource=2;
        }
        else if(extensions< 10){
            Body=[WORK,WORK,WORK,WORK,CARRY,MOVE];
            creepsPerSource=1;
        }
        else{
            Body=[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE];
            creepsPerSource=1;
        }       
   

        if(harvesters<1 && Game.getObjectById(room.memory.mineralid).mineralAmount>0){	         
            if(Game.getObjectById(room.memory.spawns).spawnCreep(Body, newName, {memory: {role: 'mineralharvester'}})==0){					
                var creep =Game.creeps[newName];
				creep.memory.home = room.name;
				creep.memory.source=room.memory.mineralid;
	         }
        }
    
	},
	
};

module.exports = roleHarvester;