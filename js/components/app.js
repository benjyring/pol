// _Constants/Variables
var vph = app.viewport.h,
	vpw = app.viewport.w,
	map = document.getElementById('map'),
	ctx = map.getContext('2d');

var minZoom = Math.max(Math.ceil(vpw/(app.totalX*sideLen)), Math.ceil(vph/(app.totalY*sideLen)));

//
// +++++++++++++++++++++++++++++++++++++++++++
//

function cellOffset(d){
	return ({
		x: Math.round(app.viewport._offset.x/d),
		y: Math.round(app.viewport._offset.y/d)
	});
}

function setAnimalSpecies(el, env, carnivore, herbivore){
	if (el.location.env.type === env){
		if (el.type === 'carnivore'){
			el.species = carnivore;
		} else {
			el.species = herbivore;
		}
	}
}

function drawAvailable(elX, elY, d, callback){
	// Limits the portion of the map drawn to only what's
	// within the viewport. Greatly improves performance.
	// var _elx = elX;
	// var _ely = elY;
	var _elx = elX - cellOffset(d).x;
	var _ely = elY - cellOffset(d).y;

	if ((_elx-1) < Math.ceil(vpw/d) && (_ely-1) < Math.ceil(vph/d) ){
		callback();
	}
}

function drawOffset(elX, elY, d, callback){
	if ((elX) > cellOffset(d).x){
		if ((elY) > cellOffset(d).y){
			callback();
		}
	}
}

function drawCurrentWithOffset(context, id, locationX, locationY, d, width, height){
	context.imageSmoothingEnabled = false;

	context.drawImage(
		document.getElementById(id),
		Math.round(d*((locationX - cellOffset(d).x)-1)),
		Math.round(d*((locationY - cellOffset(d).y)-1)),
		width,
		height
	);
}

// function ifInPreviousArray(iteration, el){
// 	var iteration = 0;

// 	if (el.env.type === previousArray[i].)
// }

function displayGrid(d){
	app.displayGrids = false;

	$.each(cellArray, function(i, el){
		drawOffset(el.x, el.y, d, function(){
			drawAvailable(el.x, el.y, d, function(){

				var tPlus = checkPlus(el);

				drawCurrentWithOffset(ctx,el.env.type,el.x,el.y,d,d,d);

				if (!isEmpty(tPlus[3]) && tPlus[3].env.type != el.env.type){
					var blendLeft = '1-' + tPlus[3].env.type  + '-' + el.env.type;

					if (document.getElementById(blendLeft)){
						drawCurrentWithOffset(ctx,blendLeft,(el.x-0.5),el.y,d,d,d);
					}
				}

				if (!isEmpty(tPlus[0]) && tPlus[0].env.type != el.env.type){
					var blendTop = '2-' + tPlus[0].env.type  + '-' + el.env.type;

					if (document.getElementById(blendTop)){
						drawCurrentWithOffset(ctx,blendTop,el.x,(el.y-0.5),d,d,d);
					}
				}

			});
		});

		if (i === cellArray.length-1){
			app.displayGridCompleted = true;
		}
	});
}

function displayPops(d){
	app.displayPopsCompleted = false;

	$.each(popArray, function(i, el){
		var img;

		// Determine which icon to draw
		if (el.myPop === true || el.species === 'human'){
			img = document.getElementById('human');
		} else {
			if (el.species === undefined){

				if (el.location.env.type === 'water'){
					// TEMPORARY - will remove when all environment types
					// are accounted for
				} else {
					// TEMPORARY: this section needs some debugging work
					setAnimalSpecies(el, 'river', 'fish', 'fish');
					setAnimalSpecies(el, 'prairie', 'sabretooth', 'mammoth');
					setAnimalSpecies(el, 'beach', 'seal', 'seal');
					setAnimalSpecies(el, 'lightforest', 'wolf', 'elk');
					setAnimalSpecies(el, 'thickforest', 'wolf', 'elk');
					setAnimalSpecies(el, 'evergreenforest', 'wolf', 'elk');
					setAnimalSpecies(el, 'deciduousforest', 'bear', 'elk');
					setAnimalSpecies(el, 'shrubland', 'grouse', 'grouse');
					setAnimalSpecies(el, 'rockyforest', 'bear', 'bighorn');

					img = document.getElementById(el.species);
				}

			} else {
				img = document.getElementById(el.species);
			}
		}

		drawOffset(el.location.x, el.location.y, d, function(){
			drawAvailable(el.location.x, el.location.y, d, function(){
				drawCurrentWithOffset(ctx, img.id, el.location.x, el.location.y, d, img.width, img.height);
			});
		});

		if (i === popArray.length-1){
			app.displayPopsCompleted = true;
		}
	});
}


(function($){

"use strict";

// Custom code goes here.
$(function(){

	window.mapVis = function(d){
		// Visualize map
		map.width = vpw;
		map.height = vph;

		displayGrid(sideLen*d);

		fireOnCompletion(app.displayGridCompleted, function(){
			displayPops(sideLen*d);
		});
	};

	// _GAME
	function Game(turn, nextMajorEvent, suddenDeath, endGameTurn){
		this.turn = turn;
		this.nextMajorEvent = nextMajorEvent;
		this.suddenDeath = suddenDeath;
		this.endGameTurn = endGameTurn;
	}

	// _Update UI
	window.updateUI = function(player){
		$('.counter-population').text(player.population);
		$('.counter-health').text(player.health);
		$('.counter-morale').text(player.morale);
		$('.counter-water').text(player.water);
		$('.counter-food').text(player.food);

		$('.counter-ap').text(player.ap);
		$('.counter-turn').text(player.turn);
	};

	// ON INTERACTIONS/UI
	// _Build Map
	$('document').ready(function(){
		setTimeout(function(){
			game = new Game(1, rand(twoWeeks, Math.floor(maxTurns/twoWeeks)), (maxTurns-twoWeeks), maxTurns);

			updateUI(myPop);
			mapVis(minZoom);
		}, 1000);
		zoom = minZoom;
	});

	$('#main-menu-opener').click(function(){
		$('#ui-sidebar').toggleClass('open');

		if ($(this).text() === 'X'){
			$(this).text('MENU');
		} else {
			$(this).text('X');
		}
	});

	$('a.icon-inventory').click(function(){
		$('#inventory-modal').toggleClass('hidden');
	});

	$('#loadRebuildMap').click(function(){
		if ($(this).text() == 'Cancel'){
			$(this).text('Load Saved Game');
		} else {
			$(this).text('Cancel');
		}
	});
	// _Save Game
	$('#saveGame').click(function(){
		alert(saveGameAsString());
	});
	$('#rebuildMap').click(function(){
		rebuildGameFromSave();
	});
	// _Colors
	$('#colorPalette').click(function(){
		$('#colors').toggleClass('visible');
	});

	// _Zoom
	function zoomIn(){
		if (zoom < maxZoom && app.mouse.down === false){
			zoom = zoom+1;
			mapVis(zoom);
		}
	}
	function zoomOut(){
		if (zoom > minZoom && app.mouse.down === false){
			zoom = zoom-1;
			mapVis(zoom);
		}
	}
	$('#zoomIn').click(function(){
		zoomIn();
	});
	$('#zoomOut').click(function(){
		zoomOut();
	});
	$('#map').on('wheel', function(e){
		// Does not work in old versions of IE and Safari
		if (e.originalEvent.deltaY < 0){
			zoomIn();
		} else {
			zoomOut();
		}
	});
	$(document).bind('keypress', function(e){
		//+
		if(e.charCode==61){
			zoomIn();
		}
		//-
		if(e.charCode==45){
			zoomOut();
		}
		//W
		if(e.charCode==119){
			move(myPop, whereTo(myPop, 0, -1));
		}
		//A
		if(e.charCode==97){
			move(myPop, whereTo(myPop, -1, 0));
		}
		//S
		if(e.charCode==115){
			move(myPop, whereTo(myPop, 0, 1));
		}
		//D
		if(e.charCode==100){
			move(myPop, whereTo(myPop, 1, 0));
		}
	});

});

}(jQuery));
