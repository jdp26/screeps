var network={
	report: function(room){
		if(Memory.network == undefined){
			Memory.network={};
		}
		
		if(Memory.network[room]==undefined){
			Memory.network[room]={};
		}
		
		var mnr=Memory.network[room];
		if(Game.rooms[room].terminal!= null &&Game.rooms[room].terminal!=undefined){
			mnr.terminalEnergy=Game.rooms[room].terminal.store[RESOURCE_ENERGY];
			mnr.energyinRoom=Game.rooms[room].terminal.store[RESOURCE_ENERGY];
			mnr.freeCapacity=Game.rooms[room].terminal.storeCapacity-_.sum(Game.rooms[room].terminal.store);			
		}
		if(Game.rooms[room].storage!= null &&Game.rooms[room].storage!=undefined){
			mnr.energyinRoom=mnr.energyinRoom+Game.rooms[room].storage.store[RESOURCE_ENERGY];
		}
		
		if(mnr.energyinRoom>550000 && mnr.terminalEnergy>50000){
				network.shareEnergy(room);
		}

		
		if(mnr.terminalEnergy>50000 && (_.sum(Game.rooms[room].terminal.store)-mnr.terminalEnergy)>20000){
			network.sellResources(room);
		}
	},
	
	shareEnergy: function(room){
		if(network.terminalFree(room)){
			var min=550000;
			var receiver=room;
			for(var partner in Memory.network){
				var check=Memory.network[partner];
				if(check.energyinRoom<min){
					min=check.energyinRoom;
					receiver=partner;
				}
			}
			if(receiver!=room){
				if(Game.rooms[room].terminal.send(RESOURCE_ENERGY,Math.min(25000,Memory.network[receiver].freeCapacity),receiver)==0){
					Memory.network[receiver].terminalEnergy=Memory.network[receiver].terminalEnergy+Math.min(25000,Memory.network[receiver].freeCapacity);
					Memory.network[receiver].energyinRoom=Memory.network[receiver].energyinRoom+Math.min(25000,Memory.network[receiver].freeCapacity);
					Memory.network[room].terminalEnergy=Memory.network[room].terminalEnergy-Math.min(25000,Memory.network[receiver].freeCapacity);
					Memory.network[room].energyinRoom=Memory.network[room].energyinRoom-Math.min(25000,Memory.network[receiver].freeCapacity);
					console.log(room + ' Send ' + Math.min(25000,Memory.network[receiver].freeCapacity)+ ' to '+ receiver);
				}
				else{
				    if(Game.rooms[receiver]==undefined || Game.rooms[receiver].terminal==undefined){
				        delete Memory.network[receiver];
				    }
				}
			}
		}

	},
	
	sellResources: function(room){
		if(network.terminalFree(room)){
			for(var resource in Game.rooms[room].terminal.store){
				if(resource != RESOURCE_ENERGY){
					user.sell(resource,Math.min(Game.rooms[room].terminal.store[resource],1000),room);
				    break;
				}
			}
		}
	},
	
	terminalFree: function(room){
		if(Game.rooms[room].terminal.cooldown===0){
			return true;
		}
		else{
			return false;
		}
	}
}
module.exports = network;