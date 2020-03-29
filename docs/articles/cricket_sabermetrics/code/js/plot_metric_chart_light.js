var minDeviceWidth = 375;
var maxDeviceWidth = 1024;

var runs_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([80, 35]);
var wickets_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([3.5, 1.25]);
//var axisLabelFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 18]);
//var axisTickLabelFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 18]);
//var playerTypeFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 18]);
var axisLabelFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 18]);
var axisTickLabelFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 18]);
var playerTypeFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([14, 18]);

var wpaListAxisTickLabelFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 14]);
var wpaAxisLabelFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 16]);
var wpaAxisTickLabelFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 18]);
var wpaListTeamNameFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 16]);

var heightScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.80, 0.30]);
var typeInteractiveHeightScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.70, 0.25]);
var wpaListHeightScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.60, 0.60]);

var impactLegendFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 18]);
var impactLegendShapeSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([200, 450]);
var impactLegendShapePaddingSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([35, 75]);
var impactLegendShapeOffsetSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([100, 180]);

/* For screenshot images */
/*
var runs_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([25, 25]);
var wickets_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([1.05, 1.05]);
var typeInteractiveHeightScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.80, 0.80]);
var axisLabelFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([18, 18]);
var axisTickLabelFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 18]);
*/
/*
var axisLabelFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([16, 18]);
var axisTickLabelFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([14, 18]);
var impactLegendFontSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 18]);
var impactLegendShapeSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([300, 550]);
var impactLegendShapePaddingSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([45, 85]);
var impactLegendShapeOffsetSize = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([100, 180]);
*/

var width_scale_factor = 0.90;
var margin = {right:35, left:35, top:30, bottom:25};
tournament = "ipl";

var bb = d3.select('#ipl_batting').node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
var height_scale_factor = heightScale(base_width);
base_height = bb*height_scale_factor - margin.top - margin.bottom;
// Plot IPL batting chart
plot_batting_chart("#ipl_batting", "data/team_composition/"+tournament+"_2018_batting.csv", "ipl", base_width, base_height);

var bb = d3.select('#ipl_bowling').node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
// Plot IPL batting chart
plot_bowling_chart("#ipl_bowling", "data/team_composition/"+tournament+"_2018_bowling.csv", "ipl", base_width, base_height);



function get_team_names(league) {
  var teams = [];
  if (league=="ipl") {
    teams = ['Chennai Super Kings', 'Delhi Daredevils', 'Kings XI Punjab',
           'Kolkata Knight Riders', 'Mumbai Indians', 'Rajasthan Royals',
           'Royal Challengers Bangalore', 'Sunrisers Hyderabad'];
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

function get_team_ids(league) {
  var teams = [];
  if (league=="ipl") {
    teams = ['Chennai', 'Delhi', 'Punjab',
           'Kolkata', 'Mumbai', 'Rajasthan',
           'Bangalore', 'Hyderabad'];
  } else if (league=="bbl") {
    teams = ['Adelaide', 'Brisbane', 'Hobart',
       'MelbourneR', 'MelbourneS', 'Perth',
       'SydneyS', 'SydneyT'];
  } else if (league=="blast") {
    teams = ['Derbyshire', 'Durham', 'Essex', 'Glamorgan', 'Gloucestershire',
       'Hampshire', 'Kent', 'Lancashire', 'Leicestershire', 'Middlesex',
       'Northamptonshire', 'Nottinghamshire', 'Somerset', 'Surrey',
       'Sussex', 'Warwickshire', 'Worcestershire', 'Yorkshire'];
  } else if (league=="cpl") {
    teams = ['Barbados', 'Guyana', 'Jamaica',
       'Kitts', 'Lucia',
       'Trinbago'];
  } else if (league=="bpl") {
    teams = ['Chittagong', 'Comilla', 'Dhaka',
       'Khulna', 'Rajshahi', 'Rangpur',
       'Sylhet'];
  } else if (league=="psl") {
    teams = ['Islamabad', 'Karachi', 'Lahore',
       'Multan', 'Peshawar', 'Quetta'];
  }
  return teams;
}

function get_winner_id(league) {
  var winner = [];
  if (league=="ipl") {
    winner = 'Chennai';
  } else if (league=="bbl") {
    winner = 'Adelaide';
  } else if (league=="blast") {
    winner = 'Worcestershire';
  } else if (league=="cpl") {
    winner = 'Trinbago';
  } else if (league=="bpl") {
    winner = 'Rangpur';
  } else if (league=="psl") {
    winner = 'Islamabad';
  }
  return winner;
}

function get_winner_name(league) {
  var winner = [];
  if (league=="ipl") {
    winner = 'Chennai Super Kings';
  } else if (league=="bbl") {
    winner = 'Adelaide Strikers';
  } else if (league=="blast") {
    winner = 'Worcestershire';
  } else if (league=="cpl") {
    winner = 'Trinbago Knight Riders';
  } else if (league=="bpl") {
    winner = 'Rangpur Riders';
  } else if (league=="psl") {
    winner = 'Islamabad United';
  }
  return winner;
}

function team_color_mapping(league) {
  var team_colors = [];

  if (league=="ipl") {
    team_colors = d3.scaleOrdinal()
        .domain(['Chennai Super Kings', 'Delhi Daredevils', 'Kings XI Punjab',
           'Kolkata Knight Riders', 'Mumbai Indians', 'Rajasthan Royals',
           'Royal Challengers Bangalore', 'Sunrisers Hyderabad'])
        //.range(["#FFFF3C", "#E32A26", "#A7A9AC", "#3A225D", "#004BA0", "#D1AB3E", "#2B2A29", "#FF822A"]);
        .range(["#FFFF3C", "#E32A26", "#A7A9AC", "#533791", "#004BA0", "#D1AB3E", "#4c4c4c", "#FF822A"]);

  } else if (league=="bbl") {
    team_colors = d3.scaleOrdinal()
        .domain(['Adelaide Strikers', 'Brisbane Heat', 'Hobart Hurricanes',
       'Melbourne Renegades', 'Melbourne Stars', 'Perth Scorchers',
       'Sydney Sixers', 'Sydney Thunder'])
        .range(["blue", "teal", "purple", "red", "green", "orange", "pink", "#00FE00"]);

  } else if (league=="blast") {

    team_names_array = ['Derbyshire', 'Durham', 'Essex', 'Glamorgan', 'Gloucestershire',
       'Hampshire', 'Kent', 'Lancashire', 'Leicestershire', 'Middlesex',
       'Northamptonshire', 'Nottinghamshire', 'Somerset', 'Surrey',
       'Sussex', 'Warwickshire', 'Worcestershire', 'Yorkshire'];

    var team_colors_array = [];
    var colors = d3.scaleOrdinal(d3.schemeCategory20b);
    for (var i=0; i<team_names_array.length; i++) {
      team_colors_array.push(colors(i));
    }

    team_colors = d3.scaleOrdinal()
        .domain(team_names_array)
        .range(team_colors_array);

  } else if (league=="cpl") {
    team_names_array = ['Barbados Tridents', 'Guyana Amazon Warriors', 'Jamaica Tallawahs',
       'St Kitts and Nevis Patriots', 'St Lucia Stars',
       'Trinbago Knight Riders'];

    var team_colors_array = [];
    var colors = d3.scaleOrdinal(d3.schemeCategory10);
    for (var i=0; i<team_names_array.length; i++) {
      team_colors_array.push(colors(i));
    }

    team_colors = d3.scaleOrdinal()
        .domain(team_names_array)
        .range(team_colors_array);

  } else if (league=="bpl") {
    team_names_array = ['Chittagong Vikings', 'Comilla Victorians', 'Dhaka Dynamites',
       'Khulna Titans', 'Rajshahi Kings', 'Rangpur Riders',
       'Sylhet Sixers'];

    var team_colors_array = [];
    var colors = d3.scaleOrdinal(d3.schemeCategory10);
    for (var i=0; i<team_names_array.length; i++) {
      team_colors_array.push(colors(i));
    }

    team_colors = d3.scaleOrdinal()
        .domain(team_names_array)
        .range(team_colors_array);

  } else if (league=="psl") {
    team_names_array = ['Islamabad United', 'Karachi Kings', 'Lahore Qalandars',
       'Multan Sultans', 'Peshawar Zalmi', 'Quetta Gladiators'];

    var team_colors_array = [];
    var colors = d3.scaleOrdinal(d3.schemeCategory10);
    for (var i=0; i<team_names_array.length; i++) {
      team_colors_array.push(colors(i));
    }

    team_colors = d3.scaleOrdinal()
        .domain(team_names_array)
        .range(team_colors_array);
  }

  return team_colors;
}

var batsman_type_colors = d3.scaleOrdinal()
  .domain([0, 1, 2, 3, 4])
  .range(["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"]);
//console.log(ipl_team_color_map(""));

var bowler_type_colors = d3.scaleOrdinal()
  .domain([0, 1, 2, 3, 4])
  .range(["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"]);

redraw_playertype_chart("ipl", "Chennai");

// Handle tournament button clicks
function redraw_playertype_chart(league, team_id, winner) {

    d3.select("#interactive_batting").selectAll("svg").remove();
    d3.select("#interactive_bowling").selectAll("svg").remove();
    d3.select("#metric_team_button_bar").selectAll(".btn").remove();

    var team_names = get_team_names(league);
    var team_ids = get_team_ids(league);
    // Mapping from team id to team name
    var team_name = team_names[team_ids.indexOf(team_id)];
    //var league_winner = get_winner_name(league);
    var show_player_name = 1;

    var r = [];

    for(var i=0; i<team_names.length; i++) {
      if (team_ids[i]==team_id) {
        r= $('<button type="button" id='+team_ids[i]+' class="btn btn-dark btn-sm active" style="margin-right:5px;">'+team_names[i]+'</button>');
      } else {
        r= $('<button type="button" id='+team_ids[i]+' class="btn btn-dark btn-sm" style="margin-right:5px;">'+team_names[i]+'</button>');
      }
      $("#metric_team_button_bar").append(r);
    }
    setup_metric_league_buttons();
    setup_metric_team_buttons();

    var width_scale_factor = 0.90;
    var margin = {right:15, left:20, top:30, bottom:20};
    //var margin = {right:0, left:0, top:30, bottom:20};

    var bb = d3.select('#interactive_batting').node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    var height_scale_factor = typeInteractiveHeightScale(base_width);
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    // Plot IPL batting chart
    var team_opacity = 1;
    var other_opacity = 0.15;
    var player_type_opacity = 1;
    plot_team_batting_chart("#interactive_batting", "data/team_composition/"+league+"_2018_batting.csv", league, base_width, base_height, team_name, team_opacity, other_opacity, player_type_opacity, show_player_name);

    bb = d3.select('#interactive_bowling').node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    // Plot IPL batting chart
    plot_team_bowling_chart("#interactive_bowling", "data/team_composition/"+league+"_2018_bowling.csv", league, base_width, base_height, team_name, team_opacity, other_opacity, player_type_opacity, show_player_name);

    var div = document.getElementById("team_batting_type");
    div.innerHTML = "<h6 class='plot_sub_title plot_padding'>" + team_name + " Batsmen Types" + "</h6>";

    div = document.getElementById("team_bowling_type");
    div.innerHTML = "<h6 class='plot_sub_title plot_padding'>" + team_name + " Bowler Types" + "</h6>";
}



function plot_batting_chart(id, file, league, width, height) {

  var x = d3.scaleLinear()
      .range([0, width]);

  var y = d3.scaleLinear()
      .range([height, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y);
  var team_colors = team_color_mapping(league);

/*
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
*/

  // Set up x and y domains
  //svg.remove();

  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Tooltip
  var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip1")
        /*.style("position", "absolute")*/
        //.style("z-index", "10")
        .style("visibility", "hidden");

  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.bat_avg = +d.bat_avg;
      d.bat_sr = +d.bat_sr;
      d.runs_scored = +d.runs_scored;
      d.player = d.player;
    });

    x.domain([d3.min(data, function(d) { return d.bat_avg;})-3, d3.max(data, function(d) { return d.bat_avg;})+3 ]);
    y.domain([d3.min(data, function(d) { return d.bat_sr;})-3, d3.max(data, function(d) { return d.bat_sr;})+3 ]);
  });


  // Batsman types boxes
  d3.csv("data/player_types/"+league+"_batsman_types.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.start_avg = +d.start_avg;
      d.end_avg = +d.end_avg;
      d.start_sr = +d.start_sr;
      d.end_sr = +d.end_sr;
    });

    svg.selectAll(".rect")
       .data(data)
      .enter().append("rect")
        .attr("x", function(d) { return x(d.start_avg); })
        .attr("y", function(d) { return y(d.end_sr); })
        .attr("width", function(d) { return x(d.end_avg) - x(d.start_avg); })
        .attr("height", function(d) { return y(d.start_sr) - y(d.end_sr); })
        .style("fill", function(d) { return batsman_type_colors(d.color_id); })
        .style("opacity", 0.45)
        .style("z-index", "2")
        .style("stroke", "black");

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
        .attr("x", function(d) { return x(d.start_avg); } )
        .attr("y", function(d) { return y(d.end_sr+1); })
        .text(function(d) { return d.type;})
        .style("font-weight", "bold");
        //.style("z-index", "4");

  });

  // Player bubbles
  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.bat_avg = +d.bat_avg;
      d.bat_sr = +d.bat_sr;
      d.runs_scored = +d.runs_scored;
      d.player = d.player;
    });

    x.domain([d3.min(data, function(d) { return d.bat_avg;})-3, d3.max(data, function(d) { return d.bat_avg;})+3 ]);
    y.domain([d3.min(data, function(d) { return d.bat_sr;})-3, d3.max(data, function(d) { return d.bat_sr;})+3 ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
              .tickFormat( (d,i) => {
                if(d%10 === 0) return d;
              })
            .tickSize(4)
            .tickPadding(6))
        .style("font-size", axisTickLabelFontSize(width))
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Average")
        .attr("fill", "black")
        .style("font-size", axisLabelFontSize(width));

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y)
              .tickFormat( (d,i) => {
                if(d%20 === 0) return d;
              })
            .tickSize(4)
            .tickPadding(6))
        .style("font-size", axisTickLabelFontSize(width))
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Strike Rate")
        .attr("fill", "black")
        .style("font-size", axisLabelFontSize(width));

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
      //.filter(function(d) { return d.runs_scored > 200; })
      //.filter(function(d) { return (d.runs_scored>=400) || (d.bat_avg>=35) || (d.bat_avg<=25 && d.bat_sr<=120) || (d.bat_sr>=170) || (d.bat_avg<=17); })
        .attr("class", "dot")
        .attr("r", function(d) { return d.runs_scored/runs_radius_factor(width); })
        .attr("cx", function(d) { return x(d.bat_avg); })
        .attr("cy", function(d) { return y(d.bat_sr); })
        .style("fill", function(d) { return team_colors(d.team); })
        .style("stroke", "black")
        .style("stroke-width", "1.0px")
        .style("opacity", 0.40)
        /*.style("position", "relative")*/
        .style("z-index", "10")
        .on("mouseover", function(d){
          //return tooltip.text(d.city).style("visibility", "visible");
          d3.select(this).style('stroke', 'black').style("opacity", 1.0).style("stroke-width", 2).style("stroke-opacity", 1.0);
          return tooltip.html("<div class='well'><b>"+d.player+"</b>" + "<br/> <span class='tooltip_team'>"+ d.team + "</span><br/>" + "<span class='tooltip_stats'>Runs: "  + Math.round(d.runs_scored) + "<br/>" + "Average: " + parseFloat(d.bat_avg).toFixed(1) + "<br />" + " Strike Rate: " +  parseFloat(d.bat_sr).toFixed(1) +"</span></div>" ).style("visibility", "visible");
        })
        .on("mousemove", function(){
          return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(){
          d3.select(this).style('stroke', 'black').style("opacity", 0.40).style("stroke-width", 1).style("stroke-opacity", 1.0);
          return tooltip.style("visibility", "hidden");
        });

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
      .filter(function(d) { return (d.runs_scored>=400) || (d.bat_avg>=35) || (d.bat_avg<=25 && d.bat_sr<=120) || (d.bat_sr>=170) || (d.bat_avg<=17); })
        .attr("x", function(d) { return x(d.bat_avg)+8; })
        .attr("y", function(d) { return y(d.bat_sr); })
        .text(function(d) { return d.player;})
        .style("fill", "black")
        .style("font-size", "10px");
/*
    var legend = svg.selectAll(".legend")
        .data(team_colors.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 0)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.team; });
*/
    svg.selectAll("path")
        .style("stroke", "black");

    svg.selectAll("line")
        .style("stroke", "black");

    svg.selectAll("tick")
        .style("fill", "black");

    svg.selectAll("text")
        .style("fill", "black")
        .style("shape-rendering", "crispEdges");

  });

}


function plot_bowling_chart(id, file, league, width, height) {

  var x = d3.scaleLinear()
      .range([0, width]);

  var y = d3.scaleLinear()
      .range([height, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y);
  var team_colors = team_color_mapping(league);

  // Set up x and y domains
  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Tooltip
  var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip1")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.bowl_econ = +d.bowl_econ;
      d.bowl_sr = +d.bowl_sr;
      d.wickets = +d.wickets;
      d.player = d.player;
    });

    x.domain([d3.min(data, function(d) { return d.bowl_econ;})-0.5, d3.max(data, function(d) { return d.bowl_econ;})+0.5 ]);
    y.domain([d3.min(data, function(d) { return d.bowl_sr;})-1, d3.max(data, function(d) { return d.bowl_sr;})+1 ]);
  });

  // Batsman types boxes
  d3.csv("data/player_types/"+league+"_bowler_types.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.start_econ = +d.start_econ;
      d.end_econ = +d.end_econ;
      d.start_sr = +d.start_sr;
      d.end_sr = +d.end_sr;
    });

    svg.selectAll(".rect")
       .data(data)
      .enter().append("rect")
        .attr("x", function(d) { return x(d.start_econ); })
        .attr("y", function(d) { return y(d.end_sr); })
        .attr("width", function(d) { return x(d.end_econ) - x(d.start_econ); })
        .attr("height", function(d) { return y(d.start_sr) - y(d.end_sr); })
        .style("fill", function(d) { return bowler_type_colors(d.color_id); })
        .style("opacity", 0.45)
        .style("stroke", "black");

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
        .attr("x", function(d) { return x(d.start_econ+0.5); } )
        .attr("y", function(d) { return y(d.end_sr+0.25); })
        .text(function(d) { return d.type;})
        .style("font-weight", "bold");

  });

  // Player bubbles
  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.bowl_econ = +d.bowl_econ;
      d.bowl_sr = +d.bowl_sr;
      d.wickets = +d.wickets;
      d.player = d.player;
    });

    //x.domain([d3.min(data, function(d) { return d.bat_avg;})-3, d3.max(data, function(d) { return d.bat_avg;})+3 ]);
    //y.domain([d3.min(data, function(d) { return d.bat_sr;})-3, d3.max(data, function(d) { return d.bat_sr;})+3 ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
              .tickFormat( (d,i) => {
                if((d*10)%10 === 0) return d;
              })
            .tickSize(4)
            .tickPadding(6))
        .style("font-size", axisTickLabelFontSize(width))
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Economy Rate")
        .attr("fill", "black")
        .style("font-size", axisLabelFontSize(width));

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y)
              .tickFormat( (d,i) => {
                if(d%4 === 0) return d;
              })
            .tickSize(4)
            .tickPadding(6))
        .style("font-size", axisTickLabelFontSize(width))
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Strike Rate")
        .attr("fill", "black")
        .style("font-size", axisLabelFontSize(width));

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
      //.filter(function(d) { return (d.wickets>15) || (d.bowl_econ>9.5) || (d.bowl_sr<16); })
        .attr("class", "dot")
        .attr("r", function(d) { return d.wickets/wickets_radius_factor(width); })
        .attr("cx", function(d) { return x(d.bowl_econ); })
        .attr("cy", function(d) { return y(d.bowl_sr); })
        .style("fill", function(d) { return team_colors(d.team); })
        .style("stroke", "black")
        .style("opacity", 0.40)
        .style("stroke-width", "1.0px")
        .on("mouseover", function(d){
          //return tooltip.text(d.city).style("visibility", "visible");
          d3.select(this).style('stroke', 'black').style("opacity", 1.0).style("stroke-width", 2).style("stroke-opacity", 1.0);
          return tooltip.html("<div class='well'><b>"+d.player+"</b>" + "<br/> <span class='tooltip_team'>"+ d.team + "</span><br/>" + "<span class='tooltip_stats'>Wickets: "  + Math.round(d.wickets) + "<br/>" + "Economy Rate: " + parseFloat(d.bowl_econ).toFixed(1) + "<br />" + " Strike Rate: " +  parseFloat(d.bowl_sr).toFixed(1) +"</span></div>" ).style("visibility", "visible");
        })
        .on("mousemove", function(){
          return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(){
          d3.select(this).style('stroke', 'black').style("opacity", 0.40).style("stroke-width", 1).style("stroke-opacity", 1.0);
          return tooltip.style("visibility", "hidden");
        });

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
      .filter(function(d) { return (d.wickets>=16) || (d.bowl_sr>=24) || (d.bowl_econ>=9.5) || (d.bowl_econ<=7) || (d.bowl_econ<=9 && d.bowl_sr>=26 && d.wickets>=22); })
        .attr("x", function(d) { return x(d.bowl_econ)+0.25; })
        .attr("y", function(d) { return y(d.bowl_sr); })
        .text(function(d) { return d.player;})
        .style("fill", "black")
        .style("font-size", "10px");
/*
    var legend = svg.selectAll(".legend")
        .data(team_colors.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 0)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.team; });
*/
    svg.selectAll("path")
        .style("stroke", "black");

    svg.selectAll("line")
        .style("stroke", "black");

    svg.selectAll("tick")
        .style("fill", "black");

    svg.selectAll("text")
        .style("fill", "black")
        .style("shape-rendering", "crispEdges");

  });

}


function plot_team_batting_chart (id, file, league, width, height, team, team_opacity, other_opacity, player_type_opacity, show_player_name) {
    var x = d3.scaleLinear()
      .range([0, width]);

  var y = d3.scaleLinear()
      .range([height, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y);
  var team_colors = team_color_mapping(league);

/*
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
*/

  // Set up x and y domains
  //svg.remove();

  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Tooltip
  var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip1")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.bat_avg = +d.bat_avg;
      d.bat_sr = +d.bat_sr;
      d.runs_scored = +d.runs_scored;
      d.player = d.player;
    });

    x.domain([d3.min(data, function(d) { return d.bat_avg;})-3, d3.max(data, function(d) { return d.bat_avg;})+3 ]);
    y.domain([d3.min(data, function(d) { return d.bat_sr;})-3, d3.max(data, function(d) { return d.bat_sr;})+3 ]);
  });


  // Batsman types boxes
  d3.csv("data/player_types/"+league+"_batsman_types.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.start_avg = +d.start_avg;
      d.end_avg = +d.end_avg;
      d.start_sr = +d.start_sr;
      d.end_sr = +d.end_sr;
    });

    svg.selectAll(".rect")
       .data(data)
      .enter().append("rect")
        .attr("x", function(d) { return x(d.start_avg); })
        .attr("y", function(d) { return y(d.end_sr); })
        .attr("width", function(d) { return x(d.end_avg) - x(d.start_avg); })
        .attr("height", function(d) { return y(d.start_sr) - y(d.end_sr); })
        .style("fill", function(d) { return batsman_type_colors(d.color_id); })
        .style("opacity", 0.35)
        .style("stroke", "black");

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
        .attr("x", function(d) { return x(d.start_avg); } )
        .attr("y", function(d) { return y(d.end_sr+1); })
        .text(function(d) { return d.type;})
        .style("font-weight", "bold")
        .style("opacity", player_type_opacity)
        .style("font-size", playerTypeFontSize(width));

  });

  // Player bubbles
  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.bat_avg = +d.bat_avg;
      d.bat_sr = +d.bat_sr;
      d.runs_scored = +d.runs_scored;
      d.player = d.player;
    });

    x.domain([d3.min(data, function(d) { return d.bat_avg;})-3, d3.max(data, function(d) { return d.bat_avg;})+3 ]);
    y.domain([d3.min(data, function(d) { return d.bat_sr;})-3, d3.max(data, function(d) { return d.bat_sr;})+3 ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
              .tickFormat( (d,i) => {
                if(d%10 === 0) return d;
              })
            .tickSize(4)
            .tickPadding(6))
        .style("font-size", axisTickLabelFontSize(width))
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Average")
        .attr("fill", "black")
        .style("font-size", axisLabelFontSize(width));

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y)
              .tickFormat( (d,i) => {
                if(d%20 === 0) return d;
              })
            .tickSize(4)
            .tickPadding(6))
        .style("font-size", axisTickLabelFontSize(width))
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Strike Rate")
        .attr("fill", "black")
        .style("font-size", axisLabelFontSize(width));

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
      //.filter(function(d) {  return d.runs_scored > 0; })
        .attr("class", "dot")
        .attr("r", function(d) { return d.runs_scored/runs_radius_factor(width); })
        .attr("cx", function(d) { return x(d.bat_avg); })
        .attr("cy", function(d) { return y(d.bat_sr); })
        .style("fill", function(d) {
          if (d.team == team) {
            return team_colors(d.team);
          } else {
            return "#d3d3d3"; //Gray
          }
          //return team_colors(d.team); 
        })
        .style("stroke", "black")
        .style("stroke-width", "1.0px")
        .style("opacity", function(d) {
          if (d.team == team) {
            return team_opacity;
          } else {
            return other_opacity;
          }
          //return team_colors(d.team); 
        })
        .on("mouseover", function(d){
          //return tooltip.text(d.city).style("visibility", "visible");
          d3.select(this).style('stroke', 'black').style("stroke-width", 2).style("stroke-opacity", 1.0);
          return tooltip.html("<div class='well'><b>"+d.player+"</b>" + "<br/> <span class='tooltip_team'>"+ d.team + "</span><br/>" + "<span class='tooltip_stats'>Runs: "  + Math.round(d.runs_scored) + "<br/>" + "Average: " + parseFloat(d.bat_avg).toFixed(1) + "<br />" + " Strike Rate: " +  parseFloat(d.bat_sr).toFixed(1) +"</span></div>" ).style("visibility", "visible");
        })
        .on("mousemove", function(){
          return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(){
          d3.select(this).style('stroke', 'black').style("stroke-width", 1).style("stroke-opacity", 1.0);
          return tooltip.style("visibility", "hidden");
        });

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
      .filter(function(d) { return d.team == team; })
        .attr("x", function(d) { return x(d.bat_avg)+8; })
        .attr("y", function(d) { return y(d.bat_sr); })
        .text(function(d) {
          if (show_player_name) {
            return d.player;
          } else {
            return "";
          }})
        .style("fill", "black")
        .style("font-size", "10px");

    svg.selectAll("path")
        .style("stroke", "black");

    svg.selectAll("line")
        .style("stroke", "black");

    svg.selectAll("tick")
        .style("fill", "black");

    svg.selectAll("text")
        .style("fill", "black")
        .style("shape-rendering", "crispEdges");

  });
}


function plot_team_bowling_chart (id, file, league, width, height, team, team_opacity, other_opacity, player_type_opacity, show_player_name) {
  var x = d3.scaleLinear()
      .range([0, width]);

  var y = d3.scaleLinear()
      .range([height, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y);
  var team_colors = team_color_mapping(league);

/*
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
*/

  // Set up x and y domains
  //svg.remove();

  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Tooltip
  var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip1")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.bowl_econ = +d.bowl_econ;
      d.bowl_sr = +d.bowl_sr;
      d.wickets = +d.wickets;
      d.player = d.player;
    });

    x.domain([d3.min(data, function(d) { return d.bowl_econ;})-0.5, d3.max(data, function(d) { return d.bowl_econ;})+0.5 ]);
    y.domain([d3.min(data, function(d) { return d.bowl_sr;})-1, d3.max(data, function(d) { return d.bowl_sr;})+1 ]);
  });


  // Batsman types boxes
  d3.csv("data/player_types/"+league+"_bowler_types.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.start_econ = +d.start_econ;
      d.end_econ = +d.end_econ;
      d.start_sr = +d.start_sr;
      d.end_sr = +d.end_sr;
    });

    svg.selectAll(".rect")
       .data(data)
      .enter().append("rect")
        .attr("x", function(d) { return x(d.start_econ); })
        .attr("y", function(d) { return y(d.end_sr); })
        .attr("width", function(d) { return x(d.end_econ) - x(d.start_econ); })
        .attr("height", function(d) { return y(d.start_sr) - y(d.end_sr); })
        .style("fill", function(d) { return bowler_type_colors(d.color_id); })
        .style("opacity", 0.35)
        .style("stroke", "black");

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
        .attr("x", function(d) { return x(d.start_econ+0.5); } )
        .attr("y", function(d) { return y(d.end_sr+0.25); })
        .text(function(d) { return d.type;})
        .style("font-weight", "bold")
        .style("opacity", player_type_opacity)
        .style("font-size", playerTypeFontSize(width));

  });

  // Player bubbles
  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.bowl_econ = +d.bowl_econ;
      d.bowl_sr = +d.bowl_sr;
      d.wickets = +d.wickets;
      d.player = d.player;
    });

    x.domain([d3.min(data, function(d) { return d.bowl_econ;})-0.5, d3.max(data, function(d) { return d.bowl_econ;})+0.5 ]);
    y.domain([d3.min(data, function(d) { return d.bowl_sr;})-1, d3.max(data, function(d) { return d.bowl_sr;})+1 ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
              .tickFormat( (d,i) => {
                if((d*10)%10 === 0) return d;
              })
            .tickSize(4)
            .tickPadding(6))
        .style("font-size", axisTickLabelFontSize(width))
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Economy Rate")
        .attr("fill", "black")
        .style("font-size", axisLabelFontSize(width));

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y)
              .tickFormat( (d,i) => {
                if(d%4 === 0) return d;
              })
            .tickSize(4)
            .tickPadding(6))
        .style("font-size", axisTickLabelFontSize(width))
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Strike Rate")
        .attr("fill", "black")
        .style("font-size", axisLabelFontSize(width));

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
      //.filter(function(d) {  return d.runs_scored > 0; })
        .attr("class", "dot")
        .attr("r", function(d) { return d.wickets/wickets_radius_factor(width); })
        .attr("cx", function(d) { return x(d.bowl_econ); })
        .attr("cy", function(d) { return y(d.bowl_sr); })
        .style("fill", function(d) {
          if (d.team == team) {
            return team_colors(d.team);
          } else {
            return "#d3d3d3"; //Gray
          }
          //return team_colors(d.team); 
        })
        .style("stroke", "black")
        .style("stroke-width", "1.0px")
        .style("opacity", function(d) {
          if (d.team == team) {
            return team_opacity;
          } else {
            return other_opacity;
          }
          //return team_colors(d.team); 
        })
        .on("mouseover", function(d){
          //return tooltip.text(d.city).style("visibility", "visible");
          d3.select(this).style('stroke', 'black').style("stroke-width", 2).style("stroke-opacity", 1.0);
          return tooltip.html("<div class='well'><b>"+d.player+"</b>" + "<br/> <span class='tooltip_team'>"+ d.team + "</span><br/>" + "<span class='tooltip_stats'>Wickets: "  + Math.round(d.wickets) + "<br/>" + "Economy Rate: " + parseFloat(d.bowl_econ).toFixed(1) + "<br />" + " Strike Rate: " +  parseFloat(d.bowl_sr).toFixed(1) +"</span></div>" ).style("visibility", "visible");
        })
        .on("mousemove", function(){
          return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(){
          d3.select(this).style('stroke', 'black').style("stroke-width", 1).style("stroke-opacity", 1.0);
          return tooltip.style("visibility", "hidden");
        });

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
      .filter(function(d) { return d.team == team; })
        .attr("x", function(d) { return x(d.bowl_econ)+0.25; })
        .attr("y", function(d) { return y(d.bowl_sr); })
        .text(function(d) {
          if (show_player_name) {
            return d.player;
          } else {
            return "";
          }})
        .style("fill", "black")
        .style("font-size", "10px");

    svg.selectAll("path")
        .style("stroke", "black");

    svg.selectAll("line")
        .style("stroke", "black");

    svg.selectAll("tick")
        .style("fill", "black");

    svg.selectAll("text")
        .style("fill", "black")
        .style("shape-rendering", "crispEdges");

  });
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setup_metric_league_buttons() {
  d3.select('#metric_league_button_bar')
    .selectAll('.btn')
    .on('click', function () {
      // Remove active class from all buttons
      d3.select('#metric_league_button_bar').selectAll('.btn').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var league = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      var team_id = get_winner_id(league);
      redraw_playertype_chart(league, team_id);
    });
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setup_metric_team_buttons() {
  d3.select('#metric_team_button_bar')
    .selectAll('.btn')
    .on('click', function () {
      // Remove active class from all buttons
      d3.select('#metric_team_button_bar').selectAll('.btn').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var team_id = button.attr('id');

      // Determine the selected league
      var league = d3.selectAll("#metric_league_button_bar .btn.btn-primary.active").attr('id');

      redraw_playertype_chart(league, team_id);
    });
}

setup_metric_team_buttons();
setup_metric_league_buttons();
