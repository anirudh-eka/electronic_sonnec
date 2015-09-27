// frames in css must all have an -end version to say the ending state
var movie = {};
var reset = function() {
	audio.pause();
	audio.currentTime = 0;
	movie.rewindToFirstFrame();
}

Transit = {
	__makeIndividualScenes: function(scenes, els){

		for (var i = 0; i < els.length; i++) {
			var scene = els[i];
			scene.frames = [];
			scene.nextFrame = function() {
				var startFrames = this.className.split(" ");
				for (var i = 0; i < startFrames.length; i++) {
					var endFrame = startFrames[i] + "-end"
					var re = new RegExp("(^|\\s)"+endFrame+"(\\s|$)")

					if(this.className.match(re) == null){
						this.frames.push(endFrame);
						this.className += (" " + endFrame);

						var fxEvent = new CustomEvent("fx:" + endFrame, { bubbles: true, cancelable: false });
						this.dispatchEvent(fxEvent);
					}
				};
				this.externalScenesToAffect.nextFrame();
			}
			scene.rewindToFirstFrame = function(){
				var lastFrameName = this.frames.pop()
				if (lastFrameName == undefined) { return; }
				var re = new RegExp("(^|\\s)"+lastFrameName+"(\\s|$)")
				this.className = this.className.replace(re, "");
				this.rewindToFirstFrame();
			}
			scene.addFirstFrame = function(startFrame){
				var re = new RegExp("(^|\\s)"+startFrame+"(\\s|$)")

				if(this.className.match(re) == null){
					this.frames.push(startFrame);
					if(this.className == ""){
						this.className += startFrame;
					} else {
						this.className += (" " + startFrame);	
					}
				}
			}

			scene.externalScenesToAffect = Transit.getScenes();
			
			if(scene.dataset.fxOther != undefined) {
				var externalFx = JSON.parse(scene.dataset.fxOther);			
				for (var key in externalFx) {
				    if (externalFx.hasOwnProperty(key)) {
				    	var scenesToApplyFX = Transit.getScenes(key)
				    	scenesToApplyFX.addFirstFrame(externalFx[key]);
				    	scene.externalScenesToAffect.addScenes(scenesToApplyFX);
				    }
				}
			}

			scenes[i] = scene;
			scenes.length += 1;
		}
	},

	getScenes: function(name) {
		var scenes = {}
		scenes.length = 0;

		if(name != undefined) {
			var els;
			if(name.startsWith("."))
				{ els = document.getElementsByClassName(name.replace(".", "")) }
			else if (name.startsWith("#"))
				{ els = document.getElementById(name.replace("#", ""))}
			else
				{ els = document.getElementsByTagName(name) }
			Transit.__makeIndividualScenes(scenes, els)		
		}
		
		scenes.nextFrame = function() {
			// map nextFrame on all classes
			for (var key in this) {
			    if (this.hasOwnProperty(key) && this[key].nextFrame != undefined) {
			        this[key].nextFrame();
			    }
			}
		}

		scenes.addFirstFrame = function(frameName) {
			// map nextFrame on all classes
			for (var key in this) {
			    if (this.hasOwnProperty(key) && this[key].addFirstFrame != undefined) {
			        this[key].addFirstFrame(frameName);
			    }
			}	
		}

		scenes.rewindToFirstFrame = function() {
			// map rewind on all classes
			for (var key in this) {
			    if (this.hasOwnProperty(key) && this[key].rewindToFirstFrame != undefined) {
			        this[key].rewindToFirstFrame();
			    }
			}
		}

		scenes.addScenes = function(otherScenes) {

			for (var key in otherScenes) {
			    if (otherScenes.hasOwnProperty(key)) {
			    	var value = otherScenes[key];
			    	if (isScene(value)) {
				        this[this.length] = otherScenes[key];
				        this.length += 1;
			    	}
			    }
			}
			function isScene(value) {
				return value.nextFrame != undefined
			}
		}

		scenes.last = function() {
			return this[this.length - 1]
		}

		scenes.play = function(callback) {
			__play(this, 0, callback)
		}

		var __play = function(scenes, index, callback) {
			var scene = scenes[index];
			if(scene == undefined){
				if(callback != undefined) {callback()}
				return;
			}

			scene.nextFrame()


			var pauseTime = scene.dataset.sceneStep ? scene.dataset.sceneStep : 200
			window.setTimeout(function(){__play(scenes, index + 1, callback)}, pauseTime)
		}

		return scenes;
	}
}