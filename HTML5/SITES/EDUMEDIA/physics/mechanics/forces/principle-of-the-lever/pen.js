var penCanvas;

window.addEventListener('load', function () {
	var c = document.createElement('canvas');
	c.className = 'u-pen-layer';
	document.body.appendChild(c);

	penCanvas = c;
	var penStage;

	function onMediaStage() {
		stage.on('tick', function () {
			var changedSomething = false;
			
			// Attributes
			
			var targetWidth = canvas.width;
			var oHeight = canvas.height / exportRoot.scaleX;
			var oHeightWithoutController = oHeight - 40;
			var targetHeightWithoutController = Math.round(oHeightWithoutController * exportRoot.scaleX);
			
			if (c.width !== targetWidth || c.height !== targetHeightWithoutController) {
				c.width = targetWidth;
				c.height = targetHeightWithoutController;
				changedSomething = true;
			}
			
			// Styles
			
			var styleRatio = parseInt(canvas.style.width) / canvas.width;
			var targetStyleWidth = (targetWidth * styleRatio) + 'px';
			var targetStyleHeight = (targetHeightWithoutController * styleRatio) + 'px';
			
			if (c.style.width !== targetStyleWidth || c.style.height !== targetStyleHeight) {
				c.style.width = targetStyleWidth;
				c.style.height = targetStyleHeight;
				changedSomething = true;
			}
			
			// Scale
			
			if (changedSomething && penStage) {
				// noinspection JSSuspiciousNameCombination
				penStage.scaleX = penStage.scaleY = exportRoot.scaleX;
			}
		});
		
		penStage = new createjs.Stage(c);
		createjs.Ticker.addEventListener("tick", penStage);
		createjs.Touch.enable(penStage);
		addPenEvents.apply(penStage);
	}

	var stageInterval = setInterval(function () {
		if (stage) {
			onMediaStage();
			clearInterval(stageInterval);
		}
	}, 50);

});

function addPenEvents() {
	var self = this;

	var penIsOn = false;
	var penIsLight = false;
	var penDownListener;
	var currentPenShape;
	var penShapes = [];
	var shapePoints = [];

	var penMoveListener;
	var penUpListener;

	var strokeSize = 2;
	var strokeDarkColor = 'black';
	var strokeLightColor = '#c4b520';

	this.activatePen = function (light) {
		penIsLight = light;
		if (penIsOn) {
			return;
		}
		penIsOn = true;
		this.handlePenEvents();
	};

	this.deactivatePen = function () {
		if (!penIsOn) {
			return;
		}
		penIsOn = false;
		this.handlePenEvents();
	};

	this.handlePenEvents = function () {
		penCanvas.style.pointerEvents = penIsOn ? '' : 'none';
		if (penIsOn) {
			penDownListener = this.on('stagemousedown', this.onPenDown, this);
		} else {
			this.off('stagemousedown', penDownListener);
		}
	};

	this.onPenDown = function (e) {
		penMoveListener = this.on('stagemousemove', this.onPenMove, this);
		penUpListener = this.on('stagemouseup', this.onPenUp, this);

		currentPenShape = new createjs.Shape();
		var p = this.globalToLocal(e.stageX, e.stageY);
		shapePoints = [p];

		this.addChild(currentPenShape);
		penShapes.push(currentPenShape);
	};

	this.onPenMove = function (e) {
		shapePoints.push(this.globalToLocal(e.stageX, e.stageY));
		this.redrawPolygon(currentPenShape.graphics, shapePoints);
	};

	this.onPenUp = function (e) {
		this.off('stagemousemove', penMoveListener);
		this.off('stagemouseup', penUpListener);
		this.onPenShapesChange();
	};

	this.redrawPolygon = function redrawPolygon(gr, ar) {
		var step = 2;

		if (ar.length - 1 < step) {
			return;
		}

		var firstMidPt = new createjs.Point((ar[0].x + ar[step].x) / 2, (ar[0].y + ar[step].y) / 2);

		gr.clear();
		gr.beginStroke(penIsLight ? strokeLightColor : strokeDarkColor).setStrokeStyle(strokeSize, "round", "round");
		gr.moveTo(firstMidPt.x, firstMidPt.y);

		for (var i = step; i < ar.length - 2; i += step) {
			if (ar[i + step]) {
				var midPt = new createjs.Point((ar[i].x + ar[i + step].x) / 2, (ar[i].y + ar[i + step].y) / 2);
				gr.quadraticCurveTo(ar[i].x, ar[i].y, midPt.x, midPt.y);
			}
		}

		gr.endStroke();
	};

	this.clearPenShapes = function () {
		for (var i = 0; i < penShapes.length; i++) {
			penShapes[i].parent.removeChild(penShapes[i]);
		}
		penShapes = [];
		this.onPenShapesChange();
	};

	this.clearLastPenShape = function () {
		var s = penShapes.pop();
		if (s) s.parent.removeChild(s);
		this.onPenShapesChange();
	};

	this.handlePenEvents();
	
	this.onPenShapesChange = function() {
		try {
			window.top.onPenShapesChange(penShapes);
		} catch (e) {}
	};

	try {
		window.top.activatePen = function (light) {
			self.activatePen(light);
		};

		window.top.deactivatePen = function () {
			self.deactivatePen();
		};

		window.top.clearLastPenShape = function () {
			self.clearLastPenShape();
		};

		window.top.clearPenShapes = function () {
			self.clearPenShapes();
		};
	} catch (e) {
	}
}