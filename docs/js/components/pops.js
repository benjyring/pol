var myPop,
	wherePops = [],
	popCount = (platesArray.filter(plate => !app.inaccessible.includes(plate.env.type)).length) * 4,
	max = 10;

function Pop(type,species,population,supplies,strength,location,territory,ap,turn){
	this.type = type;
	this.species = species;
	this.population = population;
	this.supplies = supplies;
	this.strength = strength;
	this.location = location;
	this.territory = territory;
	this.ap = ap || max;
	this.turn = turn;
}

//
// Movement
//
function whereTo(pop, modX, modY){
	return getCellByXY((pop.location.x + (modX)), (pop.location.y + (modY)));
}

function move(pop, endCell){
	var playerAlert,
		dx = diffXY(pop.location, endCell).x,
		dy = diffXY(pop.location, endCell).y;;

	if ((dx + dy) > pop.ap){
		playerAlert = 'Not enough AP to move ' + (dx + dy) + ' cells.';
	} else {
		if (app.inaccessible.includes(endCell.env.type)){
			playerAlert = 'Can\'t rest on a ' + endCell.env.type + ' cell.';
		} else {
			pop.location = endCell;
			pop.ap = pop.ap - 1;

			if (pop.ap === 0){
				playerAlert = 'Turn complete.';
				pop.turn = pop.turn + 1;
				game.turn = game.turn + 1;
				pop.ap = max;
			}
		}
	}

	mapVis(zoom);

	if (pop === myPop){
		updateUI(pop);

		if (!isEmpty(playerAlert)){
			alert(playerAlert);
		}
	}
}

//
// AI
//
function nearestOfEnv(currentCell, envType){
	var desiredCells = cellArray.filter(cell => cell.env.type === envType);

	var distances = desiredCells.map(dCell => {
		var dx = diffXY(myPop.location, dCell).diffX,
			dy = diffXY(myPop.location, dCell).diffY,
			distance = dx + dy,
			cellI = (dCell.y-1)*app.totalX + (dCell.x-1);

		return {
			cellI: cellI,
			distance: distance
		};
	});

	var shortest = Math.min(...distances.map(function(i){return i.distance})),
		closest = distances.filter(d => d.distance === shortest);

	return closest[rand(0, closest.length-1)];
}

//
// Generation
//
function generatePops(numberOfPops, callback){
	var inhabitableCells = cellArray.filter(cell => !app.inaccessible.includes(cell.env.type));

	for (var i = 0; i < numberOfPops; i++){
		var type;

		if ((i != 0) && (i % 7 === 0)){
			type = 'carnivore';
		} else {
			type = 'herbivore';
		}
		popArray.push(
			new Pop(
				type,
				undefined,
				rand(paleolithic.minGroupSize, paleolithic.maxGroupSize),
				{
					water: max,
					food: max
				},
				{
					health: max,
					morale: max
				},
				inhabitableCells[rand(1, inhabitableCells.length)],
				[],
				max,
				1
			)
		);
	}

	callback();
}

function addToWherePops(callback){
	for (i = 0; i < popArray.length; i++){
		for (n = 0; n < popArray[i].location.length; n++){
			wherePops.push(popArray[i].location[n]);
		}
	}

	callback();
}

// =============================
// Create Populations on the map
// =============================

generatePops(popCount, function(){
	// addToWherePops(function(){
		// Temporarily set myPop to random among pops
		// Eventually, will create new pop for each joined player,
		// and remove a pop from the earlier array
		myPop = popArray[rand(0, popArray.length)];
		myPop.myPop = true;
		myPop.species = 'human';
	// });
});
