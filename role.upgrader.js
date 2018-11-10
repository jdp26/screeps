var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.home!= undefined && creep.room.name != creep.memory.home){
            creep.moveToRoom(creep.memory.home);
        }
        else{
            if(creep.ticksToLive<30){
    			if(_.sum(creep.carry)>0){
    				creep.truck();
    			}
    			else{
    				creep.suicide();
    			}
    		}
    		else{
                if(_.sum(creep.carry)== 0 && creep.memory.upgrader){
                    creep.memory.upgrader = false;
                }
                
                if(_.sum(creep.carry) == creep.carryCapacity && !creep.memory.upgrader){
                    creep.memory.upgrader = true;
                }
                
        	    if(!creep.memory.upgrader) {
                    creep.fill();
                }
                
                if(creep.memory.upgrader){
                    if(creep.carry.energy>0){
        				creep.upgrade();}
                    else{
        				//if picked up minerals ...
        				creep.truck();
        			}
                }
    		}
        }
        
	},
	
	spawn: function(room,spawn){
	    var upgraders = room.memory.upgraders;
        //console.log('Upgraders: ' + upgraders);
        var Body;
        var extensions = room.memory.extensions;
		var energyReq;
        if(extensions<3){
			Body=[WORK,CARRY,MOVE,MOVE];
			energyReq=250;
		}
        else if (extensions<10){
			Body=[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE];
			energyReq=450;
		}
        else if (extensions<15) {
			Body=[WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE];
			energyReq=650;
		}
		else{
		    Body=[WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
			energyReq=1000;
		}
		var num=8;
		if(room.memory.sources.length==1){num=4};
		if(room.controller.level>4){
		    num=3;
			Body=[];
			var parts=Math.floor(room.energyAvailable/250);
			energyReq=Math.min(250*parts,250*3000);
			var count =0;
			while(count<parts){
				Body.push(WORK);
				Body.push(MOVE);
				Body.push(CARRY);
				Body.push(MOVE);
				count=count+1;
				if(Body.length>47){break;}
			}
		}
		if(room.controller.level==7){num=2;}
		if(room.controller.level==8){num=1;}
        if(upgraders==0){
            Body=[WORK,CARRY,MOVE,MOVE];
			energyReq=250;
        }
        if(room.storage!=null && room.storage.store[RESOURCE_ENERGY]>300000 && room.controller.level!=8){
            num=num*2;
        }
        if(upgraders<num && room.energyAvailable>(energyReq-1)){
	        var newName='Upgrader'+Game.time;
             spawn.spawnCreep(Body, newName, {memory: {role: 'upgrader', home:room.name}});           
        }
	}
};

module.exports = roleUpgrader;