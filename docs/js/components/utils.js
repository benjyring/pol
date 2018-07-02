function isOdd(num) {
	return num % 2;
}

function rand(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

Array.prototype.min = function() {
	return Math.min.apply(null, this);
};

function isEmpty(data){
	if(typeof(data) == 'number' || typeof(data) == 'boolean'){
		return false;
	}
	if(typeof(data) == 'undefined' || data === null){
		return true;
	}
	if(typeof(data.length) != 'undefined'){
		return data.length == 0;
	}
	var count = 0;
	for(var i in data){
		if(data.hasOwnProperty(i)){
			count ++;
		}
	}
	return count == 0;
}

function containsAnObject(obj, list){
	for (var i = 0; i < list.length; i++) {
		if (list[i] === obj) {
			return true;
		}
	}

	return false;
}

function findOnce(arr1, arr2){
	return arr1.some(r => arr2.includes(r));
}

function fireOnCompletion(completion, functionToRun){
	if (completion === true){
		functionToRun();
	} else {
		fireOnCompletion(completion, functionToRun);
	}
}

function diffXY(cell1, cell2){
	return {
		diffX: Math.abs(cell2.x - cell1.x),
		diffY: Math.abs(cell2.y - cell1.y)
	}
}
