var roleCleaner={
  run:function(creep){
        if(creep.memory.truck && _.sum(creep.carry)==0){
            creep.memory.truck = false;
        }
        if(!creep.memory.truck && _.sum(creep.carry)==creep.carryCapacity){
            creep.memory.truck = true;
        }
        if(creep.memory.truck){
			if(creep.memory.storage==undefined){
            var store=creep.room.storage;
            if(store!=null){
				creep.memory.storage=store.id;
                for(var resourceType in creep.carry){
                if(creep.transfer(store,resourceType)==ERR_NOT_IN_RANGE){
                    creep.moveToObject(store);
                }}
            }}
			else{
				var store=Game.getObjectById(creep.memory.storage);
				for(var resourceType in creep.carry){
                if(creep.transfer(store,resourceType)==ERR_NOT_IN_RANGE){
                    creep.moveToObject(store);
                }}
			}
        }
        
        if(!creep.memory.truck){
            var dropped = creep.room.find(FIND_DROPPED_RESOURCES);
            if(dropped.length>0){
                if(creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE){
                    creep.moveToObject(dropped[0]);
                }
            }
			else{
				creep.memory.truck=true;
			}
        }
  }  
};
module.exports = roleCleaner;