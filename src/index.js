'use strict';

/* exported setup draw windowResized */

var presets = new PresetsManager(),
		eventBus = new EventBus();

var sketch = new Sketch({
	colors: [
		[ '#000000', '#FFFFFF' ],
		[ '#152B3C', '#E32D40' ],
		[ '#11644D', '#F2C94E' ],
		[ '#C02942', '#ECD078' ],
		[ '#FAFCD9', '#FC4416' ]
	]
});

sketch.setup(function() {
	createCanvas(windowWidth, windowHeight);

	// SETUP VARIABLES
	this.SAMPLE_AMOUNT = 128;

	this.setNewColorScheme();

	// SETUP PEAKDETECT
	this.peakDetect = new p5.PeakDetect(20, 4000, 0.05);

	// SETUP MIC
	this.mic = new p5.AudioIn();
	this.mic.start();

	// TEMPO
	this.detector = new BPMDetector(eventBus, sampleRate());
	this.masterClock = new MasterClock(eventBus, getAudioContext());

	eventBus.on('bpm-detector.tempo', function(payload) {
		var tempo = payload.tempo;

		if (!this.masterClock.isRunning) {
			this.masterClock.start(tempo);
		}
	}, this);

	eventBus.on('bpm-detector.reset', function() {
		this.masterClock.stop();
	}, this);

	eventBus.on('bpm-detector.sync', function(payload) {
		this.masterClock.sync(payload.interval, payload.time);
	}, this);

	eventBus.on('master-clock.tick', function(payload) {
		if (payload.tick === 0) {
			presets.selectRandom();
		}
	});

	// SETUP PRESETS
	presets.register('simple', {});

	presets.setup([ 'simple' ], function(defaults) {
		// SETUP FFT ANALYSIS
		this.fft = new p5.FFT(defaults.smoothing, this.SAMPLE_AMOUNT);

		this.fft.setInput(this.mic);

		this.detector.begin();
	}, this);

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

	var fft = this.fft;

	fft.analyze();

	// PEAKDETECT ANALYSIS
	this.peakDetect.update(fft);

	if (this.peakDetect.isDetected) {
		this.detector.controlPeakThreshold(this.peakDetect);

		this.detector.trackPeak();
	}

	// VISUALS
	background(backgroundColor);
	noStroke();

	presets.draw('simple', function() {
		var bassEnergy = fft.getEnergy('bass'),
				midEnergy = fft.getEnergy('mid'),
				trebleEnergy = fft.getEnergy('treble');

		fill(this.toRGB(fillColor, bassEnergy));

		rect(0, 0, halfWidth, windowHeight);

		fill(this.toRGB(fillColor, trebleEnergy));

		rect(halfWidth, 0, windowWidth, windowHeight);

		fill(this.toRGB(fillColor, midEnergy));

		rect(halfWidth / 2, halfHeight / 2, windowWidth - halfWidth, windowHeight - halfHeight);
	}, this);
});

function setup() {
	sketch.setup();
}

function draw() {
	sketch.draw();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
