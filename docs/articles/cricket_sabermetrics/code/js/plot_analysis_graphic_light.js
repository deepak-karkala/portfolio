setup_analysis_league_buttons();
setup_analysis_team_buttons();
redraw_analysis_chart("ipl", "Chennai");

function redraw_analysis_chart(league, team_id) {

    d3.select("#analysis_batting_metric").selectAll("svg").remove();
    d3.select("#analysis_bowling_metric").selectAll("svg").remove();
    d3.select("#analysis_batting_impact").selectAll("svg").remove();
    d3.select("#analysis_bowling_impact").selectAll("svg").remove();
    d3.select("#analysis_team_button_bar").selectAll(".btn").remove();

    var team_names = get_team_names(league);
    var team_ids = get_team_ids(league);
    // Mapping from team id to team name
    var team_name = team_names[team_ids.indexOf(team_id)];
    //var league_winner = get_winner_name(league);
    var team_short_names = get_team_short_names(league);
    var team_short_name = team_short_names[team_ids.indexOf(team_id)];

    var r = [];

    for(var i=0; i<team_names.length; i++) {
      if (team_ids[i]==team_id) {
        r= $('<button type="button" id='+team_ids[i]+' class="btn btn-dark btn-sm active" style="margin-right:5px;">'+team_names[i]+'</button>');
      } else {
        r= $('<button type="button" id='+team_ids[i]+' class="btn btn-dark btn-sm" style="margin-right:5px;">'+team_names[i]+'</button>');
      }
      $("#analysis_team_button_bar").append(r);
    }
    setup_analysis_league_buttons();
    setup_analysis_team_buttons();


    ///////////////////////////////////////////////////////////////
    ///////////// Plot player types ///////////////////////////////
    ///////////////////////////////////////////////////////////////
    var width_scale_factor = 0.95;
    var height_scale_factor = 0.90;
    var margin = {right:20, left:20, top:30, bottom:20};

    var bb = d3.select('#analysis_batting_metric').node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    //league = "ipl";
    //team_name = "Chennai Super Kings";
    // Plot IPL batting chart
    var team_opacity = 1;
    var other_opacity = 0.0;
    var player_type_opacity = 0.40;
    var show_player_name = 1;

    plot_team_batting_chart("#analysis_batting_metric",
        "data/team_composition/"+league+"_2018_batting.csv", league,
        base_width, base_height, team_name, team_opacity, other_opacity, player_type_opacity, show_player_name);

    bb = d3.select('#analysis_bowling_metric').node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    // Plot IPL batting chart
    plot_team_bowling_chart("#analysis_bowling_metric",
        "data/team_composition/"+league+"_2018_bowling.csv", league,
        base_width, base_height, team_name, team_opacity, other_opacity, player_type_opacity, show_player_name);
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////
    ///////////// Plot player impact //////////////////////////////
    ///////////////////////////////////////////////////////////////
    var width_scale_factor = 0.95;
    var height_scale_factor = 0.60;
    var margin = {right:30, left:25, top:20, bottom:30};
    var show_impact_legend = 1;


    var bb = d3.select('#analysis_batting_impact').node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor;// - margin.top - margin.bottom;
    id = "#analysis_batting_impact";
    plot_impact_chart(id, "bat", league, team_name, base_width,
        base_height, margin, show_impact_legend, 1);

    var bb = d3.select('#analysis_bowling_impact').node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor; // - margin.top - margin.bottom;
    id = "#analysis_bowling_impact";
    plot_impact_chart(id, "ball", league, team_name, base_width,
        base_height, margin, show_impact_legend, 1);
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////

    write_team_shortcomings(team_short_name);
}


function write_team_shortcomings(team_short_name) {
    var div = document.getElementById("analysis_batting_metric_title");
    div.innerHTML = team_short_name + " Batsmen Types";

    div = document.getElementById("analysis_batting_impact_title");
    div.innerHTML = team_short_name + " Batting Impact";

    div = document.getElementById("analysis_batting_team_title");
    div.innerHTML = team_short_name + " Batting: What is missing ?";

    var div = document.getElementById("analysis_bowling_metric_title");
    div.innerHTML = team_short_name + " Bowlers Types";

    div = document.getElementById("analysis_bowling_impact_title");
    div.innerHTML = team_short_name + " Bowling Impact";

    div = document.getElementById("analysis_bowling_team_title");
    div.innerHTML = team_short_name + " Bowling: What is missing ?";

    if(team_short_name=="RCB") {
        div = document.getElementById("batting_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Top order aggressor</td></tr><tr class='table-danger'><td>Death overs hitter</td></tr>";
        div = document.getElementById("bowling_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Middle overs striker</td></tr><tr class='table-danger'><td>Death overs container</td></tr>";
    } else if (team_short_name=="CSK") {
        div = document.getElementById("batting_shortcoming");
        div.innerHTML = "<tr class='table-success'><td>All bases covered</td></tr>";
        div = document.getElementById("bowling_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Powerplay striker</td></tr><tr class='table-danger'><td>Death overs container</td></tr>";
    } else if(team_short_name=="DD") {
        div = document.getElementById("batting_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Middle overs accumulator</td></tr><tr class='table-danger'><td>Death overs hitter</td></tr>";
        div = document.getElementById("bowling_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Powerplay striker</td></tr><tr class='table-danger'><td>Middle overs striker</td></tr><tr class='table-danger'><td>Death overs container</td></tr>";
    } else if(team_short_name=="KXIP") {
        div = document.getElementById("batting_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Middle overs accumulator</td></tr><tr class='table-danger'><td>Death overs hitter</td></tr>";
        div = document.getElementById("bowling_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Middle overs striker</td></tr><tr class='table-danger'><td>Death overs container</td></tr>";
    } else if(team_short_name=="KKR") {
        div = document.getElementById("batting_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Middle overs accumulator</td></tr><tr class='table-danger'><td>Death overs hitter</td></tr>";
        div = document.getElementById("bowling_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Powerplay striker</td></tr><tr class='table-danger'><td>Death overs container</td></tr>";
    } else if(team_short_name=="MI") {
        div = document.getElementById("batting_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Middle overs accumulator</td></tr><tr class='table-danger'><td>Death overs hitter</td></tr>";
        div = document.getElementById("bowling_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Powerplay striker</td></tr><tr class='table-danger'><td>Middle overs container</td></tr>";
    } else if(team_short_name=="RR") {
        div = document.getElementById("batting_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Top order aggressor</td></tr><tr class='table-danger'><td>Death overs hitter</td></tr>";
        div = document.getElementById("bowling_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Powerplay striker</td></tr><tr class='table-danger'><td>Death overs striker</td></tr>";
    } else if(team_short_name=="SRH") {
        div = document.getElementById("batting_shortcoming");
        div.innerHTML = "<tr class='table-danger'><td>Death overs hitter</td></tr>";
        div = document.getElementById("bowling_shortcoming");
        div.innerHTML = "<tr class='table-success'><td>All bases covered</td></tr>";
    }
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setup_analysis_league_buttons() {
  d3.select('#analysis_league_button_bar')
    .selectAll('.btn')
    .on('click', function () {
      // Remove active class from all buttons
      d3.select('#analysis_league_button_bar').selectAll('.btn').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var league = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      var team_id = get_winner_id(league);
      redraw_analysis_chart(league, team_id);
    });
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setup_analysis_team_buttons() {
  d3.select('#analysis_team_button_bar')
    .selectAll('.btn')
    .on('click', function () {
      // Remove active class from all buttons
      d3.select('#analysis_team_button_bar').selectAll('.btn').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var team_id = button.attr('id');

      // Determine the selected league
      var league = d3.selectAll("#analysis_league_button_bar .btn.btn-primary.active").attr('id');

      redraw_analysis_chart(league, team_id);
    });
}

function get_team_short_names(league) {
  var teams = [];
  if (league=="ipl") {
    teams = ['CSK', 'DD', 'KXIP',
           'KKR', 'MI', 'RR',
           'RCB', 'SRH'];
  } else if (league=="bbl") {
    teams = ['Adelaide Strikers', 'Brisbane Heat', 'Hobart Hurricanes',
       'Melbourne Renegades', 'Melbourne Stars', 'Perth Scorchers',
       'Sydney Sixers', 'Sydney Thunder'];
  } else if (league=="blast") {
    teams = ['Derbyshire', 'Durham', 'Essex', 'Glamorgan', 'Gloucestershire',
       'Hampshire', 'Kent', 'Lancashire', 'Leicestershire', 'Middlesex',
       'Northamptonshire', 'Nottinghamshire', 'Somerset', 'Surrey',
       'Sussex', 'Warwickshire', 'Worcestershire', 'Yorkshire'];
  } else if (league=="cpl") {
    teams = ['Barbados Tridents', 'Guyana Amazon Warriors', 'Jamaica Tallawahs',
       'St Kitts and Nevis Patriots', 'St Lucia Stars',
       'Trinbago Knight Riders'];
  } else if (league=="bpl") {
    teams = ['Chittagong Vikings', 'Comilla Victorians', 'Dhaka Dynamites',
       'Khulna Titans', 'Rajshahi Kings', 'Rangpur Riders',
       'Sylhet Sixers'];
  } else if (league=="psl") {
    teams = ['Islamabad United', 'Karachi Kings', 'Lahore Qalandars',
       'Multan Sultans', 'Peshawar Zalmi', 'Quetta Gladiators'];
  }
  return teams;
}

