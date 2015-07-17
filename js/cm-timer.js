/**************************************************************************
*
*  Chairman'S Timer
*  written by Takenosato (kamaitachi)
*  July, 2015
* 
*  (c) 2015, takenosato(kamaitachi)
*   License: MIT
* 
**************************************************************************/
/*
  Using: jQuery, Pure-css
    Sound files are from Sawada's Chairman's Timer for Windows 95(Visual Basic).
  
  This Program is running on Web Browser such as Firefox, Chrome and so on.
  (using HTML5 and Javascript)

  Please change js/cm-config.js file.

*/
/*

  Count Timer and Bells

  start1  --->  bell 1  --->  bell 2  --->  bell 3
  |----------count down--------|---count up---------->

**************************************************************************/


$(document).ready(function(){

	var resize_timer;	// resize event timeout
	var current_time;
	
	var base_d_s = "2015/07/03";
	var base_dt = new Date(base_d_s+" "+"00:00:00");
	var start_dt, last_ms, chk_time;
	var target_ms = new Array(); 
	var isRun;

	var count_ms;  // counter [ms]
	
	var tm0, tm1;
	
	var label02s = new Array("Stop","Start","", "" );
	label02s[3] = qainfo;
	
	// read config file
	var t01,t02,t03;
	t01 = timer1.split(":");
	t02 = timer2.split(":");
	t03 = timer3.split(":");
	belltime = new Array();
	belltime[0] = new Array();
	belltime[1] = new Array();
	belltime[2] = new Array();
	belltime[0][0] = parseInt(t01[0]);
	belltime[0][1] = parseInt(t01[1]);
	belltime[1][0] = parseInt(t02[0]);
	belltime[1][1] = parseInt(t02[1]);
	belltime[2][0] = parseInt(t03[0]);
	belltime[2][1] = parseInt(t03[1]);
	
	$('#bell1m').val(belltime[0][0]);
	$('#bell1s').val(belltime[0][1]);
	$('#bell2m').val(belltime[1][0]);
	$('#bell2s').val(belltime[1][1]);
	$('#bell3m').val(belltime[2][0]);
	$('#bell3s').val(belltime[2][1]);


	// Check: can play file type 
	var myAudio = new Array();
	myAudio[0] = new Audio();
	myAudio[1] = new Audio();
	myAudio[2] = new Audio();
	var canPlayOgg = ("" != myAudio[0].canPlayType("audio/ogg"));
	var canPlayMp3 = ("" != myAudio[0].canPlayType("audio/mpeg"));
	// Set Audio files
	if(canPlayOgg == true){
		myAudio[0].src=file01o;
		myAudio[1].src=file02o;
		myAudio[2].src=file03o;
	}else if(canPlayMp3 == true){
		myAudio[0].src=file01m;
		myAudio[1].src=file02m;
		myAudio[2].src=file03m;	
	}
	
	// interval
	var interval = 100; 	// ms
	
	function startTimer() {
		chk_dt = new Date();
		start_dt = new Date(chk_dt.getTime() - count_ms);
		last_ms  = count_ms;
		
		$('#label02').html(label02s[1]);
	
		isRun = true;
		tm1 = setInterval(timer, interval);
	}

	function stopTimer(){
		$('#label02').html(label02s[0]);
		isRun = false;
		clearInterval(tm1);
	}
	

	function changeTargetTime(){
		for( var i=0; i<3; i++){
			target_ms[i] = (belltime[i][0]*60+belltime[i][1])*1000;
		}
	}


	function getSec(count,min) {
		return Math.floor( (count/1000) - (min*60) );
	}
	
	function getMin(count) {
		return Math.floor( (count / 1000) / 60 );
	}
	
	function get00Str(str){
		return  ( '00' +  str ).slice(-2);
	}	
	
	function timer(){	// Timer
		chk_dt = new Date();
		count_ms = chk_dt.getTime() - start_dt.getTime();
		
		dispTimer();

		//check_bell
		for( var i=0; i<3; i++ ){
			if( last_ms <= target_ms[i] && target_ms[i] <= count_ms) { myAudio[i].play(); }
		}
		last_ms = count_ms;
	}
		
	function dispTimer(){
		var tmp;
		var min = getMin(count_ms);
		
		$('#t02m').html(get00Str(min));
		$('#t02s').html(get00Str(getSec(count_ms,min)));
	
		if( count_ms <= target_ms[1] ){
			// count down 
			tmp = target_ms[1] - count_ms;
			if( isRun == true ){ tmp=tmp+1000; }	// reguration for countdown
			min = getMin(tmp);
			$('#t01m').html(get00Str(min));
			$('#t01s').html(get00Str(getSec(tmp,min)));
			$('#timer01').removeClass('cation');
			
		} else {
			// count up 
			tmp = count_ms - target_ms[1]; 	//+1000;
			min = getMin(tmp);
			$('#t01m').html(get00Str(min));
			$('#t01s').html(get00Str(getSec(tmp,min)));
			$('#timer01').addClass('cation');
			$('#label02').html(label02s[3]);

		}
		
	}

	function resetTimer(){
		count_ms = 0;
		
		//show
		chk_dt = new Date();
		start_dt = new Date(chk_dt.getTime() - count_ms);
		last_dt  = null;
		if( isRun == false ){ $('#label02').html(label02s[0]); }
		else { $('#label02').html(label02s[1]); }
		
		dispTimer();		
	}
	
	// Show time now
	
	function startTimeNow(){
		tm0 = setInterval(timenow, 200);  // update time now par 200ms 
	}
	
	function timenow(){
		// set time now
		current_time=new Date();
		var time_str= 
		          ( '00' +  current_time.getHours()   ).slice(-2) + ':'
			+ ( '00' +  current_time.getMinutes() ).slice(-2) + ':'
			+ ( '00' +  current_time.getSeconds() ).slice(-2);
		$('#nowtime01').html(time_str);
	}
	
	
	/* Sample */
	/*
	myAudio2.play();
	 $(this).delay(5000).queue(function() {
		myAudio2.play();
   		$(this).dequeue();
 	});
	*/
	
	
	$(window).on('resize', function(){
		if(resize_timer != false){
			clearTimeout(resize_timer); // now resizing
		}
		resize_timer = setTimeout( function(){ resize_window() } , 200 );	
	});

	$(window).on('load', function(){
		changeTargetTime();
		resetTimer();
		resize_window();
		startTimeNow();
		$('#info').html(info);
		isRun = false;		
		
		// for debug
		//$('#info').html(target_ms[1]/1000);	
		
	});
	
	
	function resize_window(){
		// get size
		var width  = window.innerWidth;
		var height = window.innerHeight;
		
		var h_tmp1 = height / 480 ;  // Design:  height:480, 1.6em
		
		
		$('.b-menu').css('font-size',h_tmp1*2+'em');
		$('#label01').css('font-size',h_tmp1*1.6+'em');
		$('#nowtime01').css('font-size',h_tmp1*1.6+'em');
		$('#timer01').css('font-size',h_tmp1*18+'em');
		$('#label02').css('font-size',h_tmp1*3+'em');
		$('#label03').css('font-size',h_tmp1*1.6+'em');
		$('#timer02').css('font-size',h_tmp1*8+'em');
		$('#info').css('font-size',h_tmp1*5+'em');
		

		// for debug
		//$('#info').html(width+':'+height);
		
	}

	
	// Setting Dialog Initialize
	$('#dialog1').dialog({
  		autoOpen: false,
		width: 300,
  		title: 'Time Settings',
  		//closeText:"",
  		dialogClass: 'classDialog1',	// dialog class for CSS
  		closeOnEscape: true,	// ESC ok ?
  		modal: false,
  		buttons: {
    			//"OK": function(){
      			//$(this).dialog('close');
    			//}
  		},
		close: function(){
			// close event
			belltime[0][0]=parseInt($('#bell1m').val());
			belltime[0][1]=parseInt($('#bell1s').val());
			belltime[1][0]=parseInt($('#bell2m').val());
			belltime[1][1]=parseInt($('#bell2s').val());
			belltime[2][0]=parseInt($('#bell3m').val());
			belltime[2][1]=parseInt($('#bell3s').val());
			changeTargetTime();
			dispTimer();

		}
	});
  	$('#bell1m').spinner({
    		max: 99,
    		min: 0,
    		step: 1
  	});
  	$('#bell1s').spinner({
    		max: 59,
    		min: 0,
    		step: 1
  	});
  	$('#bell2m').spinner({
    		max: 99,
    		min: 0,
    		step: 1
  	});
  	$('#bell2s').spinner({
    		max: 59,
    		min: 0,
    		step: 1
  	});
  	$('#bell3m').spinner({
    		max: 99,
    		min: 0,
    		step: 1
  	});
  	$('#bell3s').spinner({
    		max: 59,
    		min: 0,
    		step: 1
  	});



	// Setting Dialog Open
	$('#setting').click(function(){
		$('#dialog1').dialog('open');
	});



	// Button Click Play bell
	$('#bell1').click(function(){
		myAudio[0].play();
	});
	$('#bell2').click(function(){
		myAudio[1].play();
	});
	$('#bell3').click(function(){
		myAudio[2].play();
	});


	// Button Click
	$('#start').click(function(){
		startTimer();
	});
	$('#stop').click(function(){
		stopTimer();
	});
	$('#reset').click(function(){
		resetTimer();
	});



});
