var roleBoo = {
	run: function(creep){
		if(creep.memory.Boo==undefined){
	        creep.memory.Boo=true;
	    }
	    if(creep.room.name!= creep.memory.safe && creep.room.name!= creep.memory.peak){
	        creep.moveToRoom(creep.memory.safe);
	    }
		else{
    		if(creep.hits==creep.hitsMax && creep.memory.Boo==false){
    			creep.memory.Boo=true;
    		}
    		
    		if(creep.hits<creep.hitsMax*2/3 && creep.memory.Boo==true){
    			creep.memory.Boo=false;
    		}
    		
    		if(creep.hits<creep.hitsMax){
    			creep.heal(creep);
    		}
    		
    		if(creep.memory.Boo == true && creep.room.name != creep.memory.peak){
    			creep.moveToRoom(creep.memory.peak);
    		}
    		
    		if(creep.memory.Boo == false){
    			creep.moveToRoom(creep.memory.safe);
    		}
		}
	},
	
	spawn: function(room,target,safety,spawn){
		var peakBoo = _.filter(Game.creeps, (c)=> c.role=='peaker').length;
		if(peakBoo<4){
			var Body=[];
			var engy=room.energyAvailable;
			if(engy>900){				
				var loop= Math.floor((engy-600)/60);
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
				Body.push(HEAL,HEAL,MOVE,MOVE);
				var name = 'Boo'+Game.time;
				spawn.spawnCreep(Body,name,{memory: {role:'peaker', peak: target, safe: safety}});
			}
		}
	}
	
}
module.exports = roleBoo;