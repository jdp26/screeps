var roleSpook={
    run: function(creep){
        if(creep.memory.spooklength == undefined){
            creep.memory.spooklength=creep.memory.spook.length;
            creep.memory.spookindex=0;
        }
      if(creep.room.name != creep.memory.spook){
          creep.moveToRoom(creep.memory.spook);
      }
      else{
          creep.moveToObject(creep.room.controller, {reusePath: 10});
          var r=creep.room.find(FIND_STRUCTURES,{filter: (s) => s.structureType ==STRUCTURE_CONTROLLER && creep.pos.getRangeTo(s)<1});
          var hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS,5);
          var host=false;
          for(var hostile of hostiles){
					var damage=false;
					for(var part of hostile.body){
						if(part.type==ATTACK || part.type == RANGED_ATTACK){
							damageParts=true;
							if(part.hits>0){
								host=true;
							}
						}
					}
		  }
		  if(r.length>0 &&(creep.memory.count==50||creep.memory.count==0)){
			  creep.memory.count=0;
		  }
		  else if(r.length>0){
			  creep.memory.count=creep.memory.count+1;
		  }

          if(creep.memory.count==50 || host==true){
          creep.memory.spookindex=creep.memory.spookindex+1;
          if(creep.memory.spookindex==creep.memory.spooklength){
              creep.memory.spookindex=0;
          }}
        }
    },
    
    spawn: function(room,spookRooms){
        var spookers= _.filter(Game.creeps, (creep) => creep.memory.role == 'spooker' && creep.memory.spook[0]==spookRooms[0]);
        if(spookers.length<2){
            var name='Spk'+Game.time;
            Game.getObjectById(room.memory.spawns).spawnCreep([MOVE],name,{memory: {spook: spookRooms, role: 'spooker', count: 50}});
        }
        
    },
};

module.exports = roleSpook;