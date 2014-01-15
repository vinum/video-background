(function(undefined) {
	$.fn.video_background = function( parameters ){
		var loop = true;
		var autoplay = true;
		var muted = false;
		var format = "16:9";
		
		var video;
		var isHtml5 = false;
		
		var mp4 = false;
		var webm = false;
		var flv = false;
		var ogg = false;
		
		var ismobile=navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
		
		var $element = $(this);
		
		//PARSE PARAMETERS
		
		//loop
		if ( parameters.loop != undefined  ){
			if(parameters.loop == "true")
				loop = true;
			else if(parameters.loop == "false")
				loop = false;
		}
		
		//autoplay
		if ( parameters.autoplay != undefined  ){
			if(parameters.autoplay == "true")
				autoplay = true;
			else if(parameters.autoplay == "false")
				autoplay = false;
		}
		
		//mute
		if ( parameters.muted != undefined  ){
			if(parameters.muted == "true")
				muted = true;
			else if(parameters.muted == "false")
				muted = false;
		}
		
		//Formats
		var formatTemp = (ismobile) ? parameters.formatMobile : parameters.format;
		if ( formatTemp != undefined  ){
			var re = new RegExp("[0-9][0-9]*:[0-9][0-9]*");
			if(formatTemp.match(re))
				format = formatTemp;
			else
				alert("INVALID FORMAT")
		}
		var formWstr = "";
		var formHstr = "";
		var formW;
		var formH;
		var i=0;
		while(format[i] != ':'){
			formWstr += format[i];
			i++;
		}
		formW = parseFloat(formWstr, 10);
		
		i++;
		while(i < format.length){
			formHstr += format[i];
			i++;
		}
		formH = parseFloat(formHstr, 10);
		
		//videos
		if(!ismobile){
			if ( parameters.mp4 != undefined  )
				mp4 = true;
			if ( parameters.webm != undefined  )
				webm = true;
			if ( parameters.flv != undefined  )
				flv = true;
			if ( parameters.ogg != undefined  )
				ogg = true;
		}
		else{
			//mobileVideos
			if ( parameters.mp4Mobile != undefined  )
				mp4 = true;
			if ( parameters.webmMobile != undefined  )
				webm = true;
			if ( parameters.flvMobile != undefined  )
				flv = true;
			if ( parameters.oggMobile != undefined  )
				ogg = true;
		}
		
		
		//video background div holder
		var $div_holder = $("<div id='background-video'></div>");
		var $div_mask = $("<div id='background-video-mask'></div>");
		
		//video background div holder css properties
		$div_mask.css("position", "fixed");
		$div_mask.css("width", "100%");
		$div_mask.css("height", "100%");
		$div_mask.css("margin", "0");
		$div_mask.css("padding", "0");
		$div_mask.css("left", "0");
		$div_mask.css("top", "0");
		$div_mask.css("overflow", "hidden");
		$div_mask.css("z-index", "-5");
		
		$div_holder.css("position", "absolute");
		$div_holder.css("margin", "0");
		$div_holder.css("padding", "0");
		
		$div_mask.append($div_holder);
		$element.append($div_mask);
		
		$(window).resize(function() {
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			var width;
			var height;
			
			//size
			width = windowWidth;
			height = width*formH/formW;
			if(height<windowHeight){
				height = windowHeight;
				width = formW*height/formH;
			}
			
			$div_holder.css("width", width);
			$div_holder.css("height", height);
			
			$div_holder.css("left", windowWidth/2-width/2);
			$div_holder.css("top", windowHeight/2-height/2);
			
		});
		$(window).trigger('resize');
		
		function callbackFn(e) {
			video = document.getElementById(e.id);
		}
		
		var html5Fallback = function(){
			var strSrc = "";
			var strType = "";
			var str1 = "";
			var erro = false;
			
			
			// let's play some video! but what kind?
			if (Modernizr.video.h264 && mp4){
				if(ismobile)
					strSrc = parameters.mp4Mobile; 
				else
					strSrc = parameters.mp4; 
				strType = "video/mp4";
			}
			else if (Modernizr.video.ogg && ogg){
				if(ismobile)
					strSrc = parameters.oggMobile; 
				else
					strSrc = parameters.ogg; 
				strType = "video/ogg";
			}
			else if (Modernizr.video.webm && webm){
				if(ismobile)
					strSrc = parameters.webmMobile; 
				else
					strSrc = parameters.webm; 
				strType = "video/webm";
			}
			else
				erro = true;
			
			
			
			if(!erro){
				var myElement = document.createElement('video');
				
				//video = $('<video id="background-video-id" width="100%" height="100%" '+str1+'>'+str+'</video>');
				//$div_holder.append(video);
				myElement.setAttribute('id', 'background-video-id');
				myElement.setAttribute('width', '100%');
				myElement.setAttribute('height', '100%');
				myElement.setAttribute('src', strSrc);
				myElement.setAttribute('type', strType);
				
				if(ismobile)
					myElement.setAttribute('preload', "auto");
				else
					myElement.setAttribute('preload', "metadata");
				
				if(autoplay)
					myElement.setAttribute('autoplay', 'autoplay');
				if(loop)
					myElement.setAttribute('loop', 'loop');
   
				document.getElementById("background-video").appendChild(myElement);
				video = document.getElementById("background-video-id");
				video.load();
				isHtml5 = true;
				
				if(muted)
					background_mute();
			}
		}
		
		var flashFallback = function(){
			$div_holder.append('<h1>You need at least Flash Player 9.0</h1>');
			
			var flashvars = { url:"" };	
			var erro = false;
			
			if(mp4){
				if(ismobile)
					flashvars.url = parameters.mp4Mobile; 
				else
					flashvars.url = parameters.mp4; 
			}
			else if(flv){
				if(ismobile)
					flashvars.url = parameters.flvMobile; 
				else
					flashvars.url = parameters.flv; 
			}
			else
				erro = true;
			
			if(!erro){
				flashvars.loop = loop;
				flashvars.autoplay = autoplay;
				flashvars.muted = muted;
				flashvars.formW = formW;
				flashvars.formH = formH;
				swfobject.embedSWF("flash/video.swf", "background-video", "100%", "100%", "9.0", null, flashvars, {allowfullscreen:true, allowScriptAccess:"always", wmode:"transparent"}, { name:"background-video-swf" }, callbackFn);
			}
			else
				html5Fallback();
		}
		
		var playerVersion = swfobject.getFlashPlayerVersion(); 
			
		if(playerVersion.major > 9) {
			// FLASH FALLBACK
			flashFallback();
		}
		else if (Modernizr.video) {
			// HTML5 VIDEO TAG SUPPORTED
			html5Fallback();
		}
		
		
		
		// PLAY / PAUSE  ---------------------------
		function isPlaying(){
			if(isHtml5)
				return !video.paused;
			else
				return video.isPlaying();
		}
		background_play = function(){
			if(isHtml5)
				video.play();
			else
				video.resume();
		};
		background_pause = function(){
			video.pause();
		};
		background_toggle_play = function(){
			if(isPlaying())
				background_pause();
			else
				background_play();
		};
		//-------------------------------------------
		
		
		// MUTE / UNMUTE  ---------------------------
		function isMuted(){
			if(isHtml5)
				return !(video.volume);
			else
				return video.isMute();
		}
		background_mute = function(){
			if(isHtml5)
				video.volume = 0;
			else
				video.mute();
		};
		background_unmute = function(){
			if(isHtml5)
				video.volume = 1;
			else
				video.unmute();
		};
		background_toggle_sound = function(){
			if(isMuted())
				background_unmute();
			else
				background_mute();
		};
		//-------------------------------------------
		
		
		// HIDE / SHOW  ---------------------------
		var hidden = false;
		background_hide = function(){
			background_pause();
			$div_mask.stop().fadeTo(700, 0);
			hidden = true;
		};
		background_show = function(){
			background_play();
			$div_mask.stop().fadeTo(700, 1);
			hidden = false;
		};
		background_toggle_hide = function(){
			if(hidden)
				background_show();
			else
				background_hide();
		};
		//-------------------------------------------
		
		background_rewind = function(){
			if(isHtml5)
				video.currentTime = 0;
			else
				video.rewind();
		}
	};
}());