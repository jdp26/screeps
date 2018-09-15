var jobs ={
   /* mine: function(creep){
		if(creep.memory.source==undefined){
			var inRoom= _.filter(Game.creeps, (creep) => creep.memory.role == 'vandle' && creep.room.name==room.name).length;
			var sources = creep.room.find(FIND_SOURCES);
			sources.forEach(function(srs){
                var tmp = creep.room.find(FIND_MY_CREEPS, {filter: (s) => s.memory.source == srs.id})
                if(inRoom>2){
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
		else{
			if(creep.memory.source != undefined){
			var source = Game.getObjectById(creep.memory.source); 
			if(source.energy == undefined && creep.memory.extractor == undefined){
				creep.memory.extractor=creep.room.find(FIND_STRUCTURES, {filter: s => s.structureType==STRUCTURE_EXTRACTOR})[0].id;				
			}
			if(source.energy!=undefined || (Game.getObjectById(creep.memory.extractor).cooldown==0 && source.mineralAmount>0)){
			if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveToObject(source, {visualizePathStyle: {stroke: '#ffaa00'}});
			}}}
			else{jobs.harvest(creep);}
		}
    },*/
    
   /* harvest: function(creep){
		if (creep.memory.harvesttarget==undefined || creep.memory.harvesttarget=='empty'){
		var structures=creep.room.find(FIND_STRUCTURES);
        var container = _.filter(structures, (structure) => (structure.structureType == STRUCTURE_CONTAINER) && (creep.carryCapacity-_.sum(creep.carry)-1) < _.sum(structure.store));
		var storage = _.filter(structures, (s) => s.structureType==STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY]>50000);
        if(creep.memory.role != 'harvest' && creep.memory.role != 'vandle' && (container.length>0 || storage.length>0) && (room.memory.harvesters>1  || creep.memory.role == 'trucker' || creep.memory.role == 'remoteTruck')){
			var c;
			if(storage.length>0 && creep.memory.role != 'trucker' && creep.memory.role != 'remoteTruck' && creep.memory.role != 'towerfill'){
				c=storage[0];
				if(creep.withdraw(c,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
				creep.moveToObject(c);
				creep.memory.harvesttarget=c.id;
				}
				else{creep.memory.harvesttarget='empty'}
				}
			else{
				c = creep.pos.findClosestByPath(container);
				if(c!=null || c!=undefined){
				for(var resourceType in c.store){
						if(_.sum(creep.carry)<creep.carryCapacity){
						if(creep.withdraw(c,resourceType)==ERR_NOT_IN_RANGE){
						creep.moveToObject(c);
						creep.memory.harvesttarget=c.id;
						}}
					}
				}
			}
			

        }
        else{
            var sources = creep.pos.findClosestByPath(FIND_SOURCES, {filter: s => s.energy>0});
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveToObject(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
				creep.memory.harvesttarget=sources.id;
            }
			else if (_.sum(creep.carry==creep.carryCapacity)){creep.memory.harvesttarget='empty';}
        }}
		else{
			target=Game.getObjectById(creep.memory.harvesttarget);
			if(target != null && target.ticksToRegeneration != undefined){
				if(creep.harvest(target) == ERR_NOT_IN_RANGE && target.energy>0) {
                creep.moveToObject(target, {visualizePathStyle: {stroke: '#ffaa00'}});
				creep.memory.harvesttarget=target.id;
				}
				else if (_.sum(creep.carry==creep.carryCapacity)){creep.memory.harvesttarget='empty';}
			}
			else{
				if(target != null){
				if(creep.memory.role=='trucker'){
				for(var resourceType in target.store){					
						if(_.sum(creep.carry)<creep.carryCapacity && target.store[resourceType]>0){
						if(creep.withdraw(target,resourceType)==ERR_NOT_IN_RANGE){
						creep.moveToObject(target);
						break;
						}}
				}}
				else{
					if(creep.withdraw(target,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
						creep.moveToObject(target);
					}
				}
				
				if(_.sum(target.store)==0){
					creep.memory.harvesttarget='empty';
				}}
				else{creep.memory.harvesttarget='empty';}
			}
		}
    },*/
    
    /*build: function(creep){
		var target = creep.memory.buildTarget;
		if(target==undefined){
			var targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
			if(targets){
				creep.memory.buildTarget=targets.id;
			}
			else{
				if(creep.memory.role != 'remotebuilder'){
				creep.suicide();}
			}
		}
		else{		
			var b2 = Game.getObjectById(target);
			if(b2 != null){
			if(creep.build(b2) == ERR_NOT_IN_RANGE){
                    creep.moveToObject(b2);
            }}
			else{creep.memory.buildTarget=undefined;}
		}       

    },*/
    
    /*repair: function(creep){
		var target = creep.memory.repairTarget;
		if (target=='empty' || target==undefined){
			var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL});
			if(closestDamagedStructure){creep.memory.repairTarget=closestDamagedStructure.id;}
			else{
				creep.memory.repairTarget='empty';
				creep.moveToCenter();
			}
		}
        else {
			var t2=Game.getObjectById(target);
			if(t2 != null){
            if(creep.repair(t2)== ERR_NOT_IN_RANGE){
                creep.moveToObject(t2);
            }
			else if(t2.hits==t2.hitsMax){
				creep.memory.repairTarget='empty';
			}}
			else{creep.memory.repairTarget='empty';}
        }
    },*/
    
  /*  upgrade: function(creep){
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveToObject(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },*/
    
    /*truck: function(creep){
		var truckTarget=creep.memory.truckTarget;
		var truckType=creep.memory.truckType;
		if(truckTarget=='empty' || truckTarget==undefined){
			if(creep.room.memory.hostile>0){
				var towerTarget=Game.getObjectById(room.memory.emptyTower);
				if(towerTarget==null){
				var targets = Game.getObjectById(room.memory.emptyExtensionSpawn);				
				if(targets!=null){
					creep.memory.truckTarget=targets.id;
					creep.memory.truckType='normal';}
				}
				else{					
					creep.memory.truckTarget=towerTarget.id;
					creep.memory.truckType='normal';
				}
			}
			var storage = creep.room.storage;
			if(storage==null || creep.memory.role=='distribute' || creep.room.memory.distrubute==0){
				var targets = Game.getObjectById(room.memory.emptyExtensionSpawn);				
				if(targets!=null){
					creep.memory.truckTarget=targets.id;
					creep.memory.truckType='normal';
				}
				else{
				targets = Game.getObjectById(room.memory.emptyTower);
				if(targets!=null){
					creep.memory.truckTarget=targets.id;
					creep.memory.truckType='normal';
				}
			}}
			else{
				creep.memory.truckTarget=storage.id;
				creep.memory.truckType='store';
			}
		}			
		else{
			var id=Game.getObjectById(truckTarget);
			if(id.energy != undefined && id.energy==id.energyCapacity){
				creep.memory.truckTarget='empty';
			}
			else{
			for(var resourceType in creep.carry){
                if(creep.transfer(id,resourceType)==ERR_NOT_IN_RANGE){
                    creep.moveToObject(id);
                }}
				
			if(_.sum(creep.carry)==0){
				creep.memory.truckTarget='empty';
			}}

		}        
    },*/
    
   /* destroy: function(creep){
        var sites=creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(sites.length>0){
            if(creep.dismantle(sites[0])==ERR_NOT_IN_RANGE){
                creep.moveToObject(sites[0]);
            }
        }
        else{creep.memory.end=true;}
    },  */ 

};

module.exports = jobs;