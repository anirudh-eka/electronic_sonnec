var electronicSonnec = {
	init: function() {
		var self = this;
		$("nav").toggle();
		
		var audio = document.getElementsByTagName("audio")[0]
		var video = document.getElementsByTagName("video")[0]
		var stanzaOne = Transit.getScenes(".stanza-one")
		var transitionToVideo = Transit.getScenes(".transition-to-video")
		var stanzaOneRepeat = Transit.getScenes(".stanza-one-repeat")
		var stanzaTwo = Transit.getScenes(".stanza-two")
		stanzaOneRepeat.addScenes(stanzaTwo);
		var transitionTwo = Transit.getScenes(".transitionTwo")
		var stanzaThreeLineOne = Transit.getScenes(".stanza-three-line-one")
		var stanzaThreeLineTwo = Transit.getScenes(".stanza-three-line-two")
		var stanzaThreeLineThree = Transit.getScenes(".stanza-three-line-three")
		var transitionThree = Transit.getScenes(".transitionThree")
		var title = Transit.getScenes(".title")
		var transitionFour = Transit.getScenes(".transitionFour")
		var fullPoem = Transit.getScenes(".stanza-one-final")
		fullPoem.addScenes(Transit.getScenes(".stanza-two-final"))
		fullPoem.addScenes(Transit.getScenes(".stanza-three-final"))
		fullPoem.addScenes(Transit.getScenes(".stanza-four-final"))
		fullPoem.addScenes(Transit.getScenes(".stanza-five-final"))

	    audio.play();
	    window.setTimeout(function(){stanzaOne.play(function(){
	    	window.setTimeout(function(){transitionToVideo.play(function(){
	    		stanzaOneRepeat.play();
	    		video.play();
	    	})}, 3500);
	    })}, 0);

	    var transitionEvent = whichTransitionEvent();

	    $(stanzaOneRepeat.last()).on(transitionEvent, function(e){
	    	transitionTwo.play();
	    });

	    $(transitionTwo.last()).on(transitionEvent, function(e){
	    	if(e.target == transitionTwo.last()) {
	    		$("video").empty();
		    	window.setTimeout(function(){stanzaThreeLineOne.play(function(){
		    		window.setTimeout(function(){
		    			stanzaThreeLineTwo.play(function(){
		    				window.setTimeout(function(){
		    					stanzaThreeLineThree.play(function(){
		    						window.setTimeout(function(){
		    							transitionThree.play(function(){
		    								title.play(function(){
		    									window/setTimeout(function(){
		    										transitionFour.play();
		    									},6000);
		    								});	
		    							});
		    						}, 11800);
		    					});
		    				}, 11000);
		    			});
		    		}, 11000);
		    	});}, 6000);
	    	}
	    });


	    $(transitionFour.last()).on(transitionEvent, function(e) {
	    	if(e.target == transitionFour.last()) {
	    		fullPoem.play();
	    	}
	    })
	}
}


	/* From Modernizr */
function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}