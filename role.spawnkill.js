var spawnkill ={
    spawn: function(room,target,spawn){
      var parts=Math.min(Math.floor(room.energyAvailable/150),4);
      var Body=[];
      var count=0;
      while(count<parts){
          Body.push(WORK);
          Body.push(MOVE);
          count=count+1;
      }
      var Name = 'SKill'+Game.time;
      spawn.spawnCreep(Body, Name, {memory: {role: 'SKill', home: room.name, targetroom: target}})
      
    },
    run: function(creep){

        if(creep.room.name==creep.memory.targetroom){
            if(creep.memory.target==undefined || creep.memory.target=='empty'){
                var spawn=creep.room.find(FIND_HOSTILE_SPAWNS);
                if(spawn.length>0){
                    creep.memory.target=spawn[0].id;
                }
                else{
                    var structure=creep.room.find(FIND_HOSTILE_STRUCTURES,{filter: s=> s.structureType != STRUCTURE_CONTROLLER});
                    if(structure.length>0){
                        creep.memory.target=structure[0].id;
                    }
                    else{
                        delete Game.rooms[creep.memory.home].memory.spawnkill;
                        creep.suicide();
                    }
                }
            }
            else{
                var target=Game.getObjectById(creep.memory.target);
                if(target!=null){
                    if(creep.dismantle(target)==ERR_NOT_IN_RANGE){
                        creep.moveToObject(target);
                    }
                }
                else{creep.memory.target='empty';}
            }
        }
        else{
            creep.moveToRoom(creep.memory.targetroom);
        }
    },
};
module.exports = spawnkill;