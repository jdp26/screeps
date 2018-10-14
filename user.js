var user ={
	sell: function(resource,quantity,room){
		var highestprice=0;
		var remaining=0;
		var id;
		var gameOrders=Game.market.getAllOrders({type:ORDER_BUY,resourceType:resource})
		for(var  order of gameOrders){
			if(order.price>highestprice & order.remainingAmount>0){
				highestprice=order.price;
				remaining=order.amount;
				id=order.id;
			}
		}
		var future=remaining-quantity;
		console.log('Highest: ' + highestprice + ', Amount Remaining after this trade: ' + future);
		var Value=Math.min(remaining,quantity)*highestprice;
		console.log('Trade Value: ' + Value);
		Game.market.deal(id,Math.min(remaining,quantity),room);
	},
	
	buy: function(resource,quantity,room){
		var lowestprice=1000;
		var remaining=0;
		var id;
		var gameOrders=Game.market.getAllOrders({type:ORDER_SELL,resourceType:resource})
		for(var  order of gameOrders){
			if(order.price<lowestprice){
				lowestprice=order.price;
				remaining=order.amount;
				id=order.id;
			}
		}
		var future=remaining-quantity;
		console.log('Lowest: ' + lowestprice + ', Amount Remaining after this trade: ' + future);
		var Value=Math.min(remaining,quantity)*lowestprice;
		console.log('Trade Value: ' + Value);
		Game.market.deal(id,Math.min(remaining,quantity),room);
	},
	
	spawnkill: function(HostRoomName,TargetRoomName){
		Memory.rooms[HostRoomName].spawnkill=TargetRoomName;
	},
	
	wallMax: function(RoomName){
		console.log('Wall Max: ' + Memory.rooms[RoomName].wallMax);
	},
	
	wallMaxIncrease: function(RoomName,NewWallMax){
		Memory.rooms[RoomName].wallMax=NewWallMax;
		console.log('Wall Max: ' + Memory.rooms[RoomName].wallMax);
	},
	
	claim: function(HostRoomName,TargetRoomName){
		Memory.rooms[HostRoomName].claim=TargetRoomName;
		console.log(HostRoomName + ' will claim ' + TargetRoomName);
	}
	
	clearMarket: function(){
		for (var o in Game.market.orders){Game.market.cancelOrder(o);}
	}
};

module.exports = user;