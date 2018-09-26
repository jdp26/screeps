module.exports = function () {
	//Count Body Parts
	Creep.prototype.countWork=
		function(){
			if(this.memory.workParts==undefined){
				var count=0;
				for(var part of this.body){
					if(part.type==WORK){
						count=count+1;
					}
				}
				this.memory.workParts=count;
				return count;
			}
			else{
				return this.memory.workParts;
			}
		};
	//Creep Movement prototypes.
	Creep.prototype.moveToRoom =
		function(room){
			if(this.fatigue==0){
			if(this.memory._move!=undefined){
					if(this.memory.previous_pos!=undefined && this.memory.previous_pos.x==this.pos.x && this.memory.previous_pos.x==this.pos.x){
						delete this.memory._move;
						return this.moveTo(new RoomPosition(25,25, room));
					}
					else if(this.memory._move.path.length==0){						
						delete this.memory._move;
						this.memory.previous_pos=this.pos;
						return this.moveTo(new RoomPosition(25,25, room));
					}
					else if(this.memory._move.dest.room==room && this.room.name == this.memory._move.room){
						this.memory.previous_pos=this.pos;
						return this.moveByPath(this.memory._move.path);
					}
					else{
						this.memory.previous_pos=this.pos;
						return this.moveTo(new RoomPosition(25,25, room));
					}
				}
				else{
					this.memory.previous_pos=this.pos;
					return this.moveTo(new RoomPosition(25,25, room));
				}
			}
		};
		
	Creep.prototype.moveToObject =
		function(object,options){	
			if(this.fatigue==0){				
				if(this.memory._move!=undefined){
					if(this.memory.previous_pos!=undefined && this.memory.previous_pos.x==this.pos.x && this.memory.previous_pos.x==this.pos.x){
						delete this.memory._move;
						return this.moveTo(object,options);
					}
					else if(this.memory.previous_pos!=undefined && object.pos.x==this.memory._move.dest.x && object.pos.y==this.memory._move.dest.y && this.memory._move.room==this.room.name){
						this.memory.previous_pos=this.pos;
						if(this.memory._move.path.length==0){
							return this.moveTo(object,options);
						}
						else{
							return this.moveByPath(this.memory._move.path);
						}							
					}
					else{
						this.memory.previous_pos=this.pos;
						return this.moveTo(object,options);						
					}
				}				
				else{
					this.memory.previous_pos=this.pos;
					return this.moveTo(object,options);					
				}
			}
		};
	Creep.prototype.moveToCenter = 
		function(){
			if(this.fatigue==0){
				if(this.memory._move!=undefined){
					if(this.memory.previous_pos!=undefined && this.memory.previous_pos.x==this.pos.x && this.memory.previous_pos.x==this.pos.x){
						if(!this.pos.isNearTo(25,25,2)){
							delete this.memory._move;
							return this.moveTo(new RoomPosition(25,25, this.room.name));
						}
					}
					else if(this.memory._move.dest.x==25 && this.memory._move.dest.y==25 && this.memory._move.room==this.room.name){
						this.memory.previous_pos=this.pos;
						return this.moveByPath(this.memory._move.path);						
					}
					else{
						this.memory.previous_pos=this.pos;
						return this.moveTo(new RoomPosition(25,25, this.room.name));
					}
				}				
				else{
					this.memory.previous_pos=this.pos;
					return this.moveTo(new RoomPosition(25,25, this.room.name));
				}
			}
		};
	
	//Creep job prototypes
	
	Creep.prototype.destroy=
		function(){
			var sites=this.room.find(FIND_HOSTILE_STRUCTURES);
			if(sites.length>0){
				if(this.dismantle(sites[0])==ERR_NOT_IN_RANGE){
					this.moveToObject(sites[0]);
				}
			}
			else{this.memory.end=true;}
		};
		
	Creep.prototype.upgrade=
		function(){
			var controller=this.room.controller;
			if(this.upgradeController(controller) == ERR_NOT_IN_RANGE) {
				this.moveToObject(controller, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		};
		
	Creep.prototype.repairStuff=
		function(){
			var target = this.memory.repairTarget;
			if (target=='empty' || target==undefined){
				var closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL});
				if(closestDamagedStructure){this.memory.repairTarget=closestDamagedStructure.id;}
				else{
					this.memory.repairTarget='empty';
					this.moveToCenter();
				}
			}
			else {
				var target2=Game.getObjectById(target);
				if(target2 != null){
					if(this.repair(target2)== ERR_NOT_IN_RANGE){
						this.moveToObject(target2);
					}
					else if(target2.hits==target2.hitsMax){
						this.memory.repairTarget='empty';
					}
				}
				else{this.memory.repairTarget='empty';}
			}
		};
		
	Creep.prototype.builder=
		function(){
			var target = this.memory.buildTarget;
			if(target==undefined){
				var targets = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
				if(targets){
					this.memory.buildTarget=targets.id;
				}
				else{
					if(this.memory.role != 'remotebuilder'){
						this.suicide();
					}
				}
			}
			else{		
				var buildTarget = Game.getObjectById(target);
				if(buildTarget != null){
					if(this.build(buildTarget) == ERR_NOT_IN_RANGE){
						this.moveToObject(buildTarget);
					}
				}
				else{
					this.memory.buildTarget=undefined;
				}
			}    
		};
		
	Creep.prototype.mine=
		function(){
			if(this.memory.source==undefined){
				var inRoom= _.filter(Game.creeps, (creep) => creep.memory.role == 'vandle' && creep.room.name==room.name).length;
				var sources = this.room.find(FIND_SOURCES);
				for(var srs of sources){
				    var tmp = this.room.find(FIND_MY_CREEPS, {filter: (s) => s.memory.source == srs.id});
					if(inRoom>2){
						if(tmp.length == 0 || tmp.length == 1){
							this.memory.source = srs.id;
						}
					}
					else{
						if(tmp.length == 0){
						    this.memory.source = srs.id;
						}
					}
				 }
			}
			else{
					var source = Game.getObjectById(this.memory.source); 
					if(source.energy == undefined && this.memory.extractor == undefined){
						var extract=this.room.find(FIND_STRUCTURES, {filter: s => s.structureType==STRUCTURE_EXTRACTOR});
						if(extract.length>0){
							this.memory.extractor=extract[0].id;
						}
					}
					if(source.energy!=undefined || (Game.getObjectById(this.memory.extractor) != null && Game.getObjectById(this.memory.extractor).cooldown==0 && source.mineralAmount>0)){
						if(this.harvest(source) == ERR_NOT_IN_RANGE) {
							this.moveToObject(source, {visualizePathStyle: {stroke: '#ffaa00'}});
						}
					}
			}
		};
		
	//NOTE OLD JOBS.HARVEST NOW FILL	
	Creep.prototype.fill=
		function(){
			if (this.memory.harvesttarget==undefined || this.memory.harvesttarget=='empty'){
				var structures=this.room.find(FIND_STRUCTURES);
				var container = _.filter(structures, (structure) => (structure.structureType == STRUCTURE_CONTAINER) && (this.carryCapacity-_.sum(this.carry)-1) < _.sum(structure.store));
				var storage = _.filter(structures, (s) => s.structureType==STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY]>50000);
				if(this.memory.role != 'harvest' && this.memory.role != 'vandle' && (container.length>0 || storage.length>0)){
					var c;
					if(storage.length>0 && this.memory.role != 'trucker' && this.memory.role != 'remoteTruck' && this.memory.role != 'towerfill'){
						c=storage[0];
						if(this.withdraw(c,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
							this.moveToObject(c);
							this.memory.harvesttarget=c.id;
						}
						else{this.memory.harvesttarget='empty'}
					}
					else{
						c = this.pos.findClosestByPath(container);
						if(c!=null || c!=undefined){
							for(var resourceType in c.store){
									if(_.sum(this.carry)<this.carryCapacity){
										if(this.withdraw(c,resourceType)==ERR_NOT_IN_RANGE){
											this.moveToObject(c);
											this.memory.harvesttarget=c.id;
										}
									}
							}
						}
					}				
				}
				else{
					var sources = this.pos.findClosestByPath(FIND_SOURCES, {filter: s => s.energy>0});
					if(this.harvest(sources) == ERR_NOT_IN_RANGE) {
						this.moveToObject(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
						this.memory.harvesttarget=sources.id;
					}
					else if (_.sum(this.carry==this.carryCapacity)){this.memory.harvesttarget='empty';}
				}
			}
			else{
				target=Game.getObjectById(this.memory.harvesttarget);
				if(target != null && target.ticksToRegeneration != undefined){
					if(this.harvest(target) == ERR_NOT_IN_RANGE && target.energy>0) {
						this.moveToObject(target, {visualizePathStyle: {stroke: '#ffaa00'}});
						this.memory.harvesttarget=target.id;
					}
					else if (_.sum(this.carry==this.carryCapacity)){this.memory.harvesttarget='empty';}
				}
				else{
					if(target != null){
					if(target.structureType!= undefined && target.structureType == STRUCTURE_CONTAINER){
					for(var resourceType in target.store){					
							if(_.sum(this.carry)<this.carryCapacity && target.store[resourceType]>0){
							if(this.withdraw(target,resourceType)==ERR_NOT_IN_RANGE){
							this.moveToObject(target);
							break;
							}}
					}
					}
					else{
					    if(this.withdraw(target,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
					        this.moveToObject(target);
					    }
					}

					
					if(_.sum(target.store)==0){
						this.memory.harvesttarget='empty';
					}}
					else{this.memory.harvesttarget='empty';}
				}
			}
		};
		
	Creep.prototype.truck=
		function(){
			var truckTarget=this.memory.truckTarget;
			var truckType=this.memory.truckType;
			if(truckTarget=='empty' || truckTarget==undefined){
				if(this.room.memory.hostile>0){
					var towerTarget=Game.getObjectById(room.memory.emptyTower);
					if(towerTarget==null){
						var targets = Game.getObjectById(room.memory.emptyExtensionSpawn);				
						if(targets!=null){
							this.memory.truckTarget=targets.id;
							this.memory.truckType='normal';
						}
					}
					else{					
						this.memory.truckTarget=towerTarget.id;
						this.memory.truckType='normal';
					}
				}
				var storage = this.room.storage;
				if(storage==null || this.memory.role=='distribute' || this.room.memory.distrubute==0){
					var targets = Game.getObjectById(room.memory.emptyExtensionSpawn);				
					if(targets!=null){
						this.memory.truckTarget=targets.id;
						this.memory.truckType='normal';
					}
					else{
						targets = Game.getObjectById(room.memory.emptyTower);
						if(targets!=null){
							this.memory.truckTarget=targets.id;
							this.memory.truckType='normal';
						}
					}
				}
				else{
					this.memory.truckTarget=storage.id;
					this.memory.truckType='store';
				}
			}			
			else{
				var id=Game.getObjectById(truckTarget);
				if(id.energy != undefined && id.energy==id.energyCapacity){
					this.memory.truckTarget='empty';
				}
				else{
					for(var resourceType in this.carry){
						if(this.transfer(id,resourceType)==ERR_NOT_IN_RANGE){
							this.moveToObject(id);
						}
					}						
					if(_.sum(this.carry)==0){
						this.memory.truckTarget='empty';
					}
				}

			}        
		};
};