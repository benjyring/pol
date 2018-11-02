app.viewport = new Object;
app.viewport.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
app.viewport.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

app.viewport._offset = new Object;
app.viewport._offset.x = 0;
app.viewport._offset.y = 0;
app.viewport._offset.startX = app.viewport._offset.x;
app.viewport._offset.startY = app.viewport._offset.y;
app.mouse = new Object;
app.mouse.down = false;


addEvent(window, 'resize', function(){
	app.viewport.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	app.viewport.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
});


addEvent(document, 'mousemove', function(e){
	var dot,
		eventDoc,
		doc,
		body,
		pageX,
		pageY;

	e = e || window.event; // IE-ism

	// If pageX/Y aren't available and clientX/Y are,
	// calculate pageX/Y - logic taken from jQuery.
	// (This is to support old IE)
	if (e.pageX == null && e.clientX != null) {
		eventDoc = (e.target && e.target.ownerDocument) || document;
		doc = eventDoc.documentElement;
		body = eventDoc.body;

		e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
		e.pageY = e.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0 );
	}

	app.mouse.x = e.pageX;
	app.mouse.y = e.pageY;

	//Do stuff with app.mouse from here on
	if (app.mouse.down === true){
		var endMouseX = app.mouse.x/zoom,
			endMouseY = app.mouse.y/zoom,
			tempOffsetX = app.viewport._offset.startX - endMouseX,
			tempOffsetY = app.viewport._offset.startY - endMouseY,
			potentialOffsetX = app.viewport._offset.x + tempOffsetX,
			potentialOffsetY = app.viewport._offset.y + tempOffsetY,
			availableOffsetX = (app.totalX * sideLen * zoom) - app.viewport.w,
			availableOffsetY = (app.totalY * sideLen * zoom) - app.viewport.h;

		if (potentialOffsetX >= 0){
			if (potentialOffsetX >= availableOffsetX){
				app.viewport._offset.x = availableOffsetX;
			} else {
				app.viewport._offset.x = potentialOffsetX;
			}
		} else {
			app.viewport._offset.x = 0;
		}

		if (potentialOffsetY >= 0){
			if (potentialOffsetY >= availableOffsetY){
				app.viewport._offset.y = availableOffsetY;
			} else {
				app.viewport._offset.y = potentialOffsetY;
			}
		} else {
			app.viewport._offset.y = 0;
		}

		mapVis(zoom);
	}
});

addEvent(document, 'mousedown', function(e){
	app.viewport._offset.startX = app.mouse.x/zoom;
	app.viewport._offset.startY = app.mouse.y/zoom;

	app.mouse.down = true;
});

addEvent(document, 'mouseup', function(e){
	app.mouse.down = false;
});
