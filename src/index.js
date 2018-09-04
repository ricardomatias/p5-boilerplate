'use strict';

/* exported preload setup draw windowResized */

function test() {
	var fourByfour = new Uint8ClampedArray(16),
			num = 0;

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			fourByfour[num] = num;
			num++;
		}
	}
	console.log(fourByfour);

	var table = new Tabelle(fourByfour, 1);

	table.shiftRow(3, -0.5);

	console.log(fourByfour);
}

test();

var presets = new PresetsManager();

var sketch = new Sketch({
	colors: [
		[ '#000000', '#FFFFFF' ],
		[ '#152B3C', '#E32D40' ],
		[ '#11644D', '#F2C94E' ],
		[ '#C02942', '#ECD078' ],
		[ '#FAFCD9', '#FC4416' ]
	]
});

sketch.preload(function() {
	// REGISTER PRESETS
	presets.register('simple', {
		image: loadImage('assets/img/space-odyssey.jpg')
	});
});

sketch.setup(function() {
	createCanvas(windowWidth, windowHeight);

	// SETUP VARIABLES
	this.setNewColorScheme();

	presets.setup('simple', function(defaults) {
		var img = defaults.image,
				imageWidth = img.width,
				imageHeight = img.height;

		img.loadPixels();

		var halfImage = Math.floor(4 * img.width * img.height/2);

		for (var i = 0; i < halfImage; i++) {
			img.pixels[i + halfImage] = img.pixels[i];
		}

		img.updatePixels();


		defaults.imageWidth = imageWidth;
		defaults.imageHeight = imageHeight;

		console.log(defaults);
	});

	presets.select('simple');

	// SHORTCUTS
	this.registerShortcuts([
		{
			key: 'w',
			action: function() {
				redraw();

				presets.selectPrevious();
			}
		},
		{
			key: 's',
			action: function() {
				redraw();

				presets.selectNext();
			}
		},
		{
			key: 'r',
			action: function() {
				redraw();

				presets.selectRandom();
			}
		},
		{
			key: 'h',
			action: function() {
				Helpers.hideClutter();
			}
		},
		{
			key: 'Space',
			action: function() {
				this.setNewColorScheme();
			}
		},
		{
			key: 'Enter',
			action: function() {
				this.takeScreenshot(presets.getActiveName());
			}
		}]);
	});

	sketch.draw(function()  {
		var halfWidth = windowWidth / 2,
				halfHeight = windowHeight / 2,
				backgroundColor = this.backgroundColor,
				fillColor = this.fillColor;

		// VISUALS
		// background(fillColor);
		// noStroke();

		presets.draw('simple', function(defaults) {
			image(defaults.image, 10, 10);
		}, this);
	});

	function preload() {
		sketch.preload();
	}

	function setup() {
		sketch.setup();
	}

	function draw() {
		sketch.draw();
	}

	function windowResized() {
		resizeCanvas(windowWidth, windowHeight);
	}
