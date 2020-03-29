var user_previous_move = "";
var opponent_type = "Random";
var is_grudge_enabled = 0;
var move_text_map = {"C":"cooperated", "D":"betrayed"};

set_initial_state();
$("#replay_button").on('click', function() {
    set_initial_state();
});

function set_initial_state() {
    $("#cooperate").removeClass("default_opacity");
    $("#betray").removeClass("default_opacity");
    $("#opponent_cooperate").removeClass("default_opacity");
    $("#opponent_betray").removeClass("default_opacity");

    $("#opponent_cooperate").addClass("lower_opacity");
    $("#opponent_betray").addClass("lower_opacity");
    $("#cooperate").addClass("lower_opacity");
    $("#betray").addClass("lower_opacity");
    match_result = document.getElementById("match_result");
    match_result.innerHTML = "";
    match_verdict = document.getElementById("match_verdict");
    match_verdict.innerHTML = "";
    user_move_text.innerHTML = "Click button to make your move";
    opponent_move_text.innerHTML = "Wait for your opponent's move";
    replay_button = document.getElementById("replay_button_div");
    replay_button.innerHTML = "";
}

/*
$('#dropdown-opponent-type a').on('click', function(){
    opponent_type = this.text;
    opponent_name = document.getElementById("opponent-name");
    opponent_name.innerHTML = opponent_type;
    window.is_grudge_enabled = 0;
    user_previous_move = "";
    opponent_strategy_name = document.getElementById("opponent_strategy_name");
    opponent_strategy_name.innerHTML = opponent_type;
});
*/
$('#dropdownMenuButton').on('click', function(){
    alert("Clicked !");
}

function myFunction() {
    alert("Clicked !");

}

$('#dropdownMenuButton').on('click', function(event) {
  event.preventDefault(); // To prevent following the link (optional)
    alert("Clicked !");
  
});

$('#select_opponent').on('change', function(){
    opponent_type = this.value;
    opponent_name = document.getElementById("opponent-name");
    opponent_name.innerHTML = opponent_type;
    window.is_grudge_enabled = 0;
    user_previous_move = "";
    opponent_strategy_name = document.getElementById("opponent_strategy_name");
    opponent_strategy_name.innerHTML = opponent_type;
});
selectElement("select_opponent", "Random");
function selectElement(id, valueToSelect) {
    var element = document.getElementById(id);
    element.value = valueToSelect;
}

function user_play_button_clicked(id) {
	event.preventDefault();
	//console.log(id + " Button clicked !")  // sanity check
	//var user_move = 'C';
    $("#cooperate").removeClass("lower_opacity");
    $("#cooperate").removeClass("default_opacity");
    $("#betray").removeClass("lower_opacity");
    $("#betray").removeClass("default_opacity");

    $("#opponent_cooperate").removeClass("default_opacity");
    $("#opponent_betray").removeClass("default_opacity");
    $("#opponent_cooperate").addClass("lower_opacity");
    $("#opponent_betray").addClass("lower_opacity");

    user_move_text = document.getElementById("user_move_text");

	if (id == "betray") {
		user_move = 'D';
        $("#cooperate").addClass("lower_opacity");
        $("#betray").addClass("default_opacity");
        user_move_text.innerHTML = "You betrayed";
	} else {
		user_move = 'C';
        $("#betray").addClass("lower_opacity");
        $("#cooperate").addClass("default_opacity");
        user_move_text.innerHTML = "You cooperated";
	}
	if (user_previous_move == "D") {
		window.is_grudge_enabled = 1;
	}
 
    match_result = document.getElementById("match_result");
    match_result.innerHTML = "";
    match_verdict = document.getElementById("match_verdict");
    match_verdict.innerHTML = "Waiting for opponent's move...";

    var delayToGetMove = 3000;
    setTimeout(function(){
        get_player_move_top(opponent_type, user_move, user_previous_move, window.is_grudge_enabled);
        user_previous_move = user_move;
    }, delayToGetMove);
}

function get_player_move_top(opponent_type, user_move, user_previous_move, is_grudge_enabled) {
    
    opponent_move = get_player_move(opponent_type, user_previous_move, is_grudge_enabled);
    opponent_move_text = document.getElementById("opponent_move_text");

    if (opponent_move == "D") {
        opponent_move_text.innerHTML = "Opponent betrayed";
        $("#opponent_cooperate").addClass("zero_opacity");
        $("#opponent_betray").addClass("default_opacity");
    } else {
        opponent_move_text.innerHTML = "Opponent cooperated";
        $("#opponent_betray").addClass("zero_opacity");
        $("#opponent_cooperate").addClass("default_opacity");
    }

    match_result = document.getElementById("match_result");
    match_result.innerHTML = "You " + move_text_map[user_move] + ", your opponent " + move_text_map[opponent_move];
    match_verdict = document.getElementById("match_verdict");
    if ((user_move=="C") && (opponent_move=="C")) {
        match_verdict_text = "You both serve one year in prison";
    } else if ((user_move=="C") && (opponent_move=="D")) {
        match_verdict_text = "You serve three years in prison and your partner is set free";
    } else if ((user_move=="D") && (opponent_move=="C")) {
        match_verdict_text = "You are set free and your partner gets three years in prison";
    } else if ((user_move=="D") && (opponent_move=="D")) {
        match_verdict_text = "You both serve two years in prison";
    }
    match_verdict.innerHTML = match_verdict_text;

    replay_button = document.getElementById("replay_button_div");
    replay_button.innerHTML = `<button class="btn btn-primary btn-sm replay_button_inner" onClick="set_initial_state()">Play Again<i class="fa fa-repeat" aria-hidden="true"></i></button>`;
}


function get_player_move(opponent_type, user_previous_move, is_grudge_enabled) {
    opponent_move = "C";

    if (opponent_type == "Defector") {
        opponent_move = 'D';
    } else if (opponent_type == "Cooperator") {
        opponent_move = 'C';
    } else if (opponent_type == "Tit For Tat") {
        if (user_previous_move == 'D') {
            opponent_move = 'D';
        } else {
            opponent_move = 'C';
        }
    } else if (opponent_type == "Grudger") {
        if (is_grudge_enabled == 1) {
            opponent_move = 'D';
        } else {
            opponent_move = 'C';
        }
    } else if (opponent_type == "Random") {
        opponent_move = ["C","D"][Math.round(Math.random())];
    } else {
        opponent_move = 'C';
    }
    return opponent_move;
}


function get_player_move_ajax(opponent_type, user_move, user_previous_move, is_grudge_enabled) {
	console.log("Inside get player move !");
	$.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });
	$.ajax({
        url : "get_player_move/", // the endpoint
        type : "POST", // http method
        data : { user_move:user_move, user_previous_move:user_previous_move,
        		 opponent_type:opponent_type, is_grudge_enabled:is_grudge_enabled }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            //console.log(json); // log the returned json to the console
            //console.log("success"); // another sanity check
            user_move = json["user_move"];
            opponent_move = json["opponent_move"];
            //console.log(opponent_move);
    		match_result = document.getElementById("match_result");
    		match_result.innerHTML = "You " + move_text_map[user_move] + ", your opponent " + move_text_map[opponent_move];
    		match_verdict = document.getElementById("match_verdict");
    		if ((user_move=="C") && (opponent_move=="C")) {
    			match_verdict_text = "You both serve one year in prison";
    		} else if ((user_move=="C") && (opponent_move=="D")) {
    			match_verdict_text = "You serve three years in prison and your partner is set free";
    		} else if ((user_move=="D") && (opponent_move=="C")) {
    			match_verdict_text = "You are set free and your partner gets three years in prison";
    		} else if ((user_move=="D") && (opponent_move=="D")) {
    			match_verdict_text = "You both serve two years in prison";
    		}
    		match_verdict.innerHTML = match_verdict_text;
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
}
//<!--<form action="{% url 'single_game_play' %}" method="post">-->

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}