$(document).ready(function() {
	$('body').on('touchmove', false);
	build_board();
});

$(document).on('keyup keydown', function(e){shifted = e.shiftKey} );

function check_win() {
	var row1 = ($('#sq0').data('value')+$('#sq1').data('value')+$('#sq2').data('value')+$('#sq3').data('value')+$('#sq4').data('value'));
	var row2 = ($('#sq5').data('value')+$('#sq6').data('value')+$('#sq7').data('value')+$('#sq8').data('value')+$('#sq9').data('value'));
	var row3 = ($('#sq10').data('value')+$('#sq11').data('value')+$('#sq12').data('value')+$('#sq13').data('value')+$('#sq14').data('value'));
	var row4 = ($('#sq15').data('value')+$('#sq16').data('value')+$('#sq17').data('value')+$('#sq18').data('value')+$('#sq19').data('value'));	
	var row5 = ($('#sq20').data('value')+$('#sq21').data('value')+$('#sq22').data('value')+$('#sq23').data('value')+$('#sq24').data('value'));			

	var col1 = ($('#sq0').data('value')+$('#sq5').data('value')+$('#sq10').data('value')+$('#sq15').data('value')+$('#sq20').data('value'));
	var col2 = ($('#sq1').data('value')+$('#sq6').data('value')+$('#sq11').data('value')+$('#sq16').data('value')+$('#sq21').data('value'));
	var col3 = ($('#sq2').data('value')+$('#sq7').data('value')+$('#sq12').data('value')+$('#sq17').data('value')+$('#sq22').data('value'));
	var col4 = ($('#sq3').data('value')+$('#sq8').data('value')+$('#sq13').data('value')+$('#sq18').data('value')+$('#sq23').data('value'));	
	var col5 = ($('#sq4').data('value')+$('#sq9').data('value')+$('#sq14').data('value')+$('#sq19').data('value')+$('#sq24').data('value'));			

	var diag1 = ($('#sq0').data('value')+$('#sq6').data('value')+$('#sq12').data('value')+$('#sq18').data('value')+$('#sq24').data('value'));	
	var diag2 = ($('#sq4').data('value')+$('#sq8').data('value')+$('#sq12').data('value')+$('#sq16').data('value')+$('#sq20').data('value'));	

	if (row1 == 5 || row2 == 5 || row3 == 5 || row4 == 5 || row5 == 5 || col1 == 5 || col2 == 5 || col3 == 5  || col4 == 5  || col5 == 5 || diag1 == 5 || diag2 == 5) {
		$('#header').html(winText);
		$('#header').addClass("win");
		winSnd.play();
	} else {
		$('#header').html(headerText);
		$('#header').removeClass("win");
	}
}

function button_click() {
	build_board();
}

function build_board() {
	var shuffled = shuffle($('#inputCode').val());
	var board = "";

	for (var i = 0; i < 25; i++) {
		if (i == 12) {
			board += "<div data-value='0' class='square' id='sq" + i + "'>";
			board += "<img src='img/girls/girl_" + shuffled[i] + ".png' style='margin-top:5px' />";
			board += girls[shuffled[i]] + "<div class='text'>&#8217s Photo" + "</div></div>";
		} else {
			board += "<div data-value='0' class='square' id='sq" + i + "'><div class='text'><br/>" + shuffled[i] + "</div></div>";
		}
	}
	$('#board').html(board);

	$('div.square').tappable(function () {
		if (shifted) { //holding shift while clicking
			$(this).data('value', 0);
			$(this).removeClass('selected');
			if ($(this).hasClass('good')) {
				$(this).removeClass('good');
				$(this).addClass('bad');
			} else {
				$(this).removeClass('bad');
				$(this).addClass('good');
			}
		} else {
			if ($(this).hasClass('good') || $(this).hasClass('bad')) {
				$(this).addClass('selected');
				$(this).data('value', 1);
			}
			$(this).removeClass('good').removeClass('bad');
			$(this).toggleClass('selected');
			if ($(this).data('value') == 1) {
				$(this).data('value', 0);
			} else {
				$(this).data('value', 1);
			}
			clickSnd.play();
			check_win();
		}
	});
}

function shuffle(code) {
	var new_bingo = [];
	var bingo_simple_copy = bingo_simple.slice(0);
	var bingo_complex_copy = bingo_complex.slice(0);
	var random_girl = 0;

	//Marriage Squares include center "marriage" square in at least one line
	var marriageSquares = [0, 2, 4, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18, 20, 22, 24];

	if (code == undefined || code == "") {
		// true random if code input is blank
		// code variable is set to a random number and item arrays are shuffled
		bingo_simple_copy = knuth_shuffle(bingo_simple.slice(0));
		bingo_complex_copy = knuth_shuffle(bingo_complex.slice(0));
		code = Math.floor(Math.random() * 999999 + 123456).toString();
	}

	var hash = MD5(code).toLowerCase();
	var cur_index = 0;

	for (var i = 0; i < hash.length; i++) {
		cur_index += hash.charCodeAt(i);
	}

	random_girl = cur_index % 5;
	for (var i = 0; i < 5; i++) {
		if (i != random_girl) {
			bingo_complex_copy.push(guys[i] + " Marries " + girls[i]);
		}
	}

	for (var i = 0; i < 25; i++) {
		new_bingo.push(
			marriageSquares.includes(i) ? bingo_simple_copy.splice(cur_index % bingo_simple_copy.length, 1) : bingo_complex_copy.splice(cur_index % bingo_complex_copy.length, 1)
		);
		cur_index += hash.charCodeAt(i % hash.length);
	}
	new_bingo[12] = random_girl;
	return new_bingo;
}

function knuth_shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

/*! Normalized address bar hiding for iOS & Android (c) @scottjehl MIT License */
(function( win ){
	var doc = win.document;
	
	// If there's a hash, or addEventListener is undefined, stop here
	if( !location.hash && win.addEventListener ){
		
		//scroll to 1
		window.scrollTo( 0, 1 );
		var scrollTop = 1,
			getScrollTop = function(){
				return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
			},
		
			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function(){
				if( doc.body ){
					clearInterval( bodycheck );
					scrollTop = getScrollTop();
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}	
			}, 15 );
		
		win.addEventListener( "load", function(){
			setTimeout(function(){
				//at load, if user hasn't scrolled more than 20 or so...
				if( getScrollTop() < 20 ){
					//reset to hide addr bar at onload
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}
			}, 0);
		} );
	}
})( this );
