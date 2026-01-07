var width_scale_factor = 0.95;
var height_scale_factor = 0.60;
var margin = {right:40, left:40, top:50, bottom:30};

var bb = d3.select('#csk_batting_impact').node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;

var show_impact_legend = 1;
var is_init = 1;

////////// Batting impact ////////////
id = "#csk_batting_impact";
plot_impact_chart(id, "bat", "ipl", "Chennai Super Kings", base_width, base_height, margin, show_impact_legend, is_init);
id = "#rcb_batting_impact";
plot_impact_chart(id, "bat", "ipl", "Royal Challengers Bangalore", base_width, base_height, margin, show_impact_legend, is_init);
id = "#kxip_batting_impact";
plot_impact_chart(id, "bat", "ipl", "Kings XI Punjab", base_width, base_height, margin, show_impact_legend, is_init);
///////////////////////////////////////


////////// Bowling impact ////////////
id = "#srh_bowling_impact";
plot_impact_chart(id, "ball", "ipl", "Sunrisers Hyderabad", base_width, base_height, margin, show_impact_legend, is_init);
id = "#mi_bowling_impact";
plot_impact_chart(id, "ball", "ipl", "Mumbai Indians", base_width, base_height, margin, show_impact_legend, is_init);
id = "#rcb_bowling_impact";
plot_impact_chart(id, "ball", "ipl", "Royal Challengers Bangalore", base_width, base_height, margin, show_impact_legend, is_init);
///////////////////////////////////////


//var player_color_list = [d3.schemeCategory20c[1], d3.schemeCategory20c[4],
//                 d3.schemeCategory20c[8], "black", d3.schemeCategory10[4], d3.schemeCategory10[8]];
//var player_color_list = ["#F3CD05", "#F49F05", "#F18904", "#BDA589"];
var player_color_list = [d3.schemeCategory20[0], d3.schemeCategory20[4], d3.schemeCategory20[6],
                         d3.schemeCategory20[16], d3.schemeCategory20[10], d3.schemeCategory20[8]];

redraw_impactperiod_chart("ipl", "Chennai", is_init);

// Handle tournament button clicks
function redraw_impactperiod_chart(league, team_id, is_init) {

    d3.select("#impact_batting").selectAll("svg rect").remove();
    d3.select("#impact_bowling").selectAll("svg rect").remove();
    d3.select("#impact_team_button_bar").selectAll(".btn").remove();

    var team_names = get_team_names(league);
    var team_ids = get_team_ids(league);
    // Mapping from team id to team name
    var team_name = team_names[team_ids.indexOf(team_id)];
    //var league_winner = get_winner_name(league);

    var r = [];

    for(var i=0; i<team_names.length; i++) {
      if (team_ids[i]==team_id) {
        r= $('<button type="button" id='+team_ids[i]+' class="btn btn-dark btn-sm active" style="margin-right:5px;">'+team_names[i]+'</button>');
      } else {
        r= $('<button type="button" id='+team_ids[i]+' class="btn btn-dark btn-sm" style="margin-right:5px;">'+team_names[i]+'</button>');
      }
      $("#impact_team_button_bar").append(r);
    }
    setup_league_buttons();
    setup_team_buttons();

    var width_scale_factor = 0.80;
    var height_scale_factor = 0.45;
    var bb = d3.select('#impact_batting').node().offsetWidth;

    var margin = {right:50, left:50, top:50, bottom:30};
    base_width = bb*width_scale_factor; // - margin.left - margin.right;
    base_height = bb*height_scale_factor; // - margin.top - margin.bottom;
    // Plot IPL batting chart
    plot_impact_chart("#impact_batting", "bat", league, team_name, base_width, base_height, margin, show_impact_legend, is_init);

    bb = d3.select('#impact_bowling').node().offsetWidth;
    base_width = bb*width_scale_factor;
    base_height = bb*height_scale_factor;
    // Plot IPL bowling chart
    plot_impact_chart("#impact_bowling", "ball", league, team_name, base_width, base_height, margin, show_impact_legend, is_init);

    var div = document.getElementById("team_batting_impact");
    div.innerHTML = "<h6 class='plot_sub_title plot_padding'>" + team_name + " Batsmen Impact" + "</h6>";

    div = document.getElementById("team_bowling_impact");
    div.innerHTML = "<h6 class='plot_sub_title plot_padding'>" + team_name + " Bowlers Impact" + "</h6>";
}


function plot_impact_chart(idname, batting_bowling_type, league, team, width, height, margin, show_impact_legend, is_init) {

  d3.json("data/impact_period/"+league+"_"+batting_bowling_type+"_impact.json", function(data) {
  //d3.json("data/impact_period/bat_impact.json", function(data) {
    //var result = data.filter(d => d["team"]=="Chennai Super Kings");
    var team_data = data.filter(function(value) {
        if (batting_bowling_type=="bat") {
          return value.team == team && value.runs_scored > 200;
        } else {
          if (league=="blast") {
            return value.team == team && value.wickets >= 12;
          } else {
            return value.team == team && value.wickets >= 8;
          }
        }
    });

    var arr = [];
    var i = 0;
    for (var player in data) {
      arr[i] = [];
      for (var ball=0; ball<120; ball++) {
        arr[i][ball] = data[player][ball];
      }
      i+=1;
    }
    

    var team_arr = [];
    player_name_list = [];
    i = 0;
    for (var player in team_data) {
      team_arr[i] = [];
      if (batting_bowling_type=="bat") {
        player_name_list[i] = team_data[player]["batsman"];
      } else {
        player_name_list[i] = team_data[player]["bowler"];
      }
      for (j=0; j<120; j++) {
        team_arr[i][j] = Math.max(team_data[player][j], 0);
      }
      i+=1;
    }

    var n = 4, // The number of series.
        m = 120; // The number of values per series.

    // Set max values for axis
    var xz = d3.range(m),
        yz = arr, //d3.range(n).map(function() { return bumps(m); }),
        y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz)),
        yMax = d3.max(yz, function(y) { return d3.max(y); });
        //y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });
    if (batting_bowling_type == "bat") {
      y1Max = 100; //16000;
    } else {
      y1Max = 100; //300;
    }

    // The xz array has m elements, representing the x-values shared by all series.
    // The yz array has n elements, representing the y-values of each of the n series.
    // Each yz[i] is an array of m non-negative numbers representing a y-value for xz[i].
    // The y01z array has the same structure as yz, but with stacked [y₀, y₁] instead of y.
    xz = d3.range(m);
    yz = team_arr; //d3.range(n).map(function() { return bumps(m); }),
    y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz));
    //yMax = d3.max(yz, function(y) { return d3.max(y); });
    //y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });

    if (is_init===1) {
      svg = d3.select(idname).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height +  margin.top + margin.bottom);
      //var width = +svg.attr("width") - margin.left - margin.right;
      //var height = +svg.attr("height") - margin.top - margin.bottom;
    } else {
      svg = d3.select(idname).select("svg");
    }
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .domain(xz)
        .range([0, width]);
        //.rangeRound([0, width]);
        //.padding(0.08);

    var y = d3.scaleLinear()
        .domain([0, y1Max])
        .range([height, 0]);

    var color = d3.scaleOrdinal()
        .domain(d3.range(n))
        //.range(d3.schemeCategory10);
        .range(player_color_list);

    var series = g.selectAll(".series")
      .data(y01z)
      .enter().append("g")
        .attr("fill", function(d, i) { return color(i); });

    var rect = series.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d, i) { return x(i); })
        .attr("y", height)
        //.attr("width", x.bandwidth())
        .attr("width", 3)
        .attr("height", 0);

    rect.transition()
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); });
        //.attr("height", function(d) { return y(d[1]); });
        //.attr("height", function(d) { return y(d[0]); });

    if (is_init === 1) {
      var xaxis = g.append("g")
          .attr("class", "impact_axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
              //.tickValues(format_axis(x.domain()).filter(function(d,i){ return !(i%6); }))
              .tickFormat( (d,i) => {
                  if(i%6 === 0) {
                    if ([3,6,9,12,15,18].includes(d/6+1))
                    return d/6+1;
                  }
                })
              .tickSize(0)
              .tickPadding(6))
          //.call(d3.axisBottom(x))
          .style("font-size", axisTickLabelFontSize(width))
          .append("text")
            .attr("class", "impact_label")
            .attr("x", width)
            .attr("y", 30)
            .style("text-anchor", "end")
            .text("Overs")
            .attr("fill", "black")
            .style("font-size", axisLabelFontSize(width));

      if (batting_bowling_type=="bat") {
        var yaxis = g.append("g")
            .attr("class", "impact_axis axis--y")
            //.style("font-size", "12px")
            //.style("font-family", "'Lora', 'Helvetica Neue', Helvetica, Arial, sans-serif")
            .call(d3.axisLeft(y)
                .tickFormat( (d,i) => {
                  if (d%20 === 0) return d;
                })
                .tickSize(0))
                //.tickPadding(6))
            .style("font-size", axisTickLabelFontSize(width))
           .append("text")
              .attr("class", "impact_label")
              .attr("transform", "rotate(-90)")
              .attr("y", -40)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Batting Impact")
              .attr("fill", "black")
              .style("font-size", axisLabelFontSize(width));
      } else {
        var yaxis = g.append("g")
            .attr("class", "impact_axis axis--y")
            .call(d3.axisLeft(y)
                .tickFormat( (d,i) => {
                  if (d%20 === 0) return d;
                })
                .tickSize(0))
                //.tickPadding(6))
              .style("font-size", axisTickLabelFontSize(width))
            .append("text")
              .attr("class", "impact_label")
              .attr("transform", "rotate(-90)")
              .attr("y", -40)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Bowling Impact")
              .attr("fill", "black")
              .style("font-size", axisLabelFontSize(width));
      }
    }


    //transitionStacked();
    transitionGrouped();
    if (show_impact_legend == 1) {
      add_player_legend(player_name_list, player_color_list);
    }

    function transitionGrouped() {
      y.domain([0, yMax]);

      rect.transition()
          .duration(1000)
          .delay(function(d, i) { return i * 10; })
          .attr("x", function(d, i) { return x(i) + x.bandwidth() / n * this.parentNode.__data__.key; })
          .attr("width", x.bandwidth() / n )
          //.attr("fill", function(d, i) { return color(i); })
        .transition()
          .attr("y", function(d) { return y(d[1] - d[0]); })
          .attr("height", function(d) { return y(0) - y(d[1] - d[0]); });
          //.attr("height", function(d) { return y(0) + y(d[0]); });
/*
      d3.timeout(function(){
        transitionStacked();
      }, 5000);
*/
    }

    function transitionStacked() {
      y.domain([0, y1Max]);

      rect.transition()
          .duration(500)
          .delay(function(d, i) { return i * 10; })
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          //.attr("height", function(d) { return y(d[0]); })
        .transition()
          .attr("x", function(d, i) { return x(i); })
          .attr("width", x.bandwidth());
          //.attr("fill", "black");

      d3.timeout(function(){
        transitionGrouped();
      }, 5000);
    }


    function add_player_legend(player_name_list, player_color_list) {
      var ordinal = d3.scaleOrdinal()
        .domain(player_name_list)
        //.range([ "rgb(153, 107, 195)", "rgb(56, 106, 197)", "rgb(93, 199, 76)", "rgb(223, 199, 31)", "rgb(234, 118, 47)"]);
        .range(player_color_list);

      svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate("+impactLegendShapeOffsetSize(width)+",40)");

      var legendOrdinal = d3.legendColor()
        //d3 symbol creates a path-string, for example
        //"M0,-8.059274488676564L9.306048591020996,
        //8.059274488676564 -9.306048591020996,8.059274488676564Z"
        .shape("path", d3.symbol().type(d3.symbolSquare).size(impactLegendShapeSize(width))())
        .shapePadding(impactLegendShapePaddingSize(width))
        //use cellFilter to hide the "e" cell
        .cellFilter(function(d){ return d.label !== "e"; })
        .scale(ordinal)
        .orient("horizontal");

      svg.select(".legendOrdinal")
        .call(legendOrdinal)
        .style("font-size", impactLegendFontSize(width));
    }


  });

}

/*
// Returns an array of m psuedorandom, smoothly-varying non-negative numbers.
// Inspired by Lee Byron’s test data generator.
// http://leebyron.com/streamgraph/
function bumps(m) {
  var values = [], i, j, w, x, y, z;

  // Initialize with uniform random values in [0.1, 0.2).
  for (i = 0; i < m; ++i) {
    values[i] = 0.1 + 0.1 * Math.random();
  }

  // Add five random bumps.
  for (j = 0; j < 5; ++j) {
    x = 1 / (0.1 + Math.random());
    y = 2 * Math.random() - 0.5;
    z = 10 / (0.1 + Math.random());
    for (i = 0; i < m; i++) {
      w = (i / m - y) * z;
      values[i] += x * Math.exp(-w * w);
    }
  }

  // Ensure all values are positive.
  for (i = 0; i < m; ++i) {
    values[i] = Math.max(0, values[i]);
  }

  return values;
}
*/

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setup_league_buttons() {
  d3.select('#impact_league_button_bar')
    .selectAll('.btn')
    .on('click', function () {
      // Remove active class from all buttons
      d3.select('#impact_league_button_bar').selectAll('.btn').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var league = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      var team_id = get_winner_id(league);
      is_init = 0;
      redraw_impactperiod_chart(league, team_id, is_init);
    });
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setup_team_buttons() {
  d3.select('#impact_team_button_bar')
    .selectAll('.btn')
    .on('click', function () {
      // Remove active class from all buttons
      d3.select('#impact_team_button_bar').selectAll('.btn').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var team_id = button.attr('id');

      // Determine the selected league
      var league = d3.selectAll("#impact_league_button_bar .btn.btn-primary.active").attr('id');

      is_init = 0;
      redraw_impactperiod_chart(league, team_id, is_init);
    });
}

setup_team_buttons();
setup_league_buttons();


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

