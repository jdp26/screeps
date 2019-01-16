var roleBoo = {
	run: function(creep){
	    if(creep.memory.Boo==undefined){
	        creep.memory.Boo=true;
	    }
	    if(creep.room.name!= creep.memory.safe && creep.room.name!= creep.memory.peak && creep.memory.start==undefined){
	        creep.moveToRoom(creep.memory.safe);
	    }
		else{
		    if(creep.room.name==creep.memory.peak){
		        var towers = creep.room.find(FIND_HOSTILE_STRUCTURES,{filter: s=> s.structureType==STRUCTURE_TOWER && s.energy>20});
		        if(towers.length==0 && Memory.rooms[creep.memory.home].spawnkill==undefined){
		             Memory.rooms[creep.memory.home].spawnkill=creep.memory.peak;
		        }
		        
		        var spawns =creep.room.find(FIND_HOSTILE_STRUCTURES,{filter: s=> s.structureType==STRUCTURE_SPAWN});
		        if(spawns.length==0 && creep.memory.home!= undefined &&Memory.rooms[creep.memory.home].Boo!= undefined){
		            //Can remove the check if creep.memory.home is defined on the 15th Jan 2019
		            try{
		                delete Memory.rooms[creep.memory.home].Boo;
		            }
		            catch(err){
		                console.log('Help us, we are Boos from ' + creep.memory.peak);
		            }
		            
		        }
		    }
    		if(creep.hits==creep.hitsMax && creep.memory.Boo==false){
    			creep.memory.Boo=true;
    		}
    		
    		if(creep.hits<creep.hitsMax*2/3 && creep.memory.Boo==true){
    			creep.memory.Boo=false;
    		}
    		
    		if(creep.hits<creep.hitsMax && creep.countHeal()>0){
    			creep.heal(creep);
    		}
    		else{
    		    if(creep.countHeal()==0 && creep.room.name==creep.memory.safe){
    		        creep.suicide();
    		    }
    		}
    		
    		if(creep.memory.Boo == true && creep.room.name != creep.memory.peak){
    			creep.moveToRoom(creep.memory.peak);
    			if(creep.memory.start==undefined){
    			    creep.memory.start=true;
    			}
    		}
    		
    		if(creep.memory.Boo == false){
    			creep.moveToRoom(creep.memory.safe);
    		}
		}
	},
	
	spawn: function(room,target,safety,spawn){
		var peakBoo = _.filter(Game.creeps, (c)=> c.memory.role=='peaker' && c.memory.peak==target).length;
		if(peakBoo<12){
			var Body=[];
			var engy=room.energyAvailable;
			if(engy>1200){
				var loop= Math.min(Math.floor((engy-900)/60),5);
				var c2=0;
				while(c2<loop){
					Body.push(TOUGH);
					c2=c2+1;
				}
				var c1=0;
				while(c1<loop){
					Body.push(MOVE);
					c1=c1+1;
				}
				Body.push(HEAL,HEAL,HEAL,MOVE,MOVE,MOVE);
				var name = 'Boo' + Game.time;
				spawn.spawnCreep(Body,name,{memory: {role:'peaker', peak: target, safe: safety, home:room.name}});
			}
		}
	}
	
}
module.exports = roleBoo;