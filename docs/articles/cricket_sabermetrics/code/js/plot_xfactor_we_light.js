/*
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
*/

var width_scale_factor = 0.95;
var height_scale_factor = 0.75;
var margin = {right:10, left:40, top:20, bottom:30};

var bb = d3.select('#batting_xfactor').node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;


////////// Batting xfactor ////////////
idname = "#batting_xfactor";
filename = "data/xfactor/m655_de Villiers.csv";
plot_xfactor_we(idname, filename, base_width, base_height, margin, "DD", "RCB", "RCB", 123, 234);
//////////////////////////////////////

////////// Bowling xfactor ////////////
idname = "#bowling_xfactor";
filename = "data/xfactor/m695_Rashid Khan.csv";
plot_xfactor_we(idname, filename, base_width, base_height, margin, "SRH", "KKR", "SRH", 124, 244);
//////////////////////////////////////

////////// Top and bottom xfactor ////////////
var width_scale_factor = 0.95;
var margin = {right:30, left:30, top:20, bottom:30};
idname = "#xfactor_top_bottom";
var bb = d3.select(idname).node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
var height_scale_factor = wpaListHeightScale(base_width);
base_height = bb*height_scale_factor - margin.top - margin.bottom;

filename = "data/xfactor/top_bottom_xfactor.csv";
xname = "overall_wpa";
yname = "name";
plot_type = 0;
plot_xfactor_top_bottom(idname, filename, base_width, base_height, margin, xname, yname, plot_type);
//////////////////////////////////////


////////// Team xfactor batting ////////////
var width_scale_factor = 0.98;
//var height_scale_factor = 0.60;
var margin = {right:1, left:1, top:20, bottom:30};
idname = "#xfactor_team_batting";
var bb = d3.select(idname).node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
var height_scale_factor = wpaListHeightScale(base_width);
base_height = bb*height_scale_factor - margin.top - margin.bottom;

filename = "data/xfactor/team_xfactor.csv";
xname = "bat_wpa";
yname = "team";
plot_type = 1;
plot_xfactor_top_bottom(idname, filename, base_width, base_height, margin, xname, yname, plot_type);
//////////////////////////////////////

////////// Team xfactor bowling ////////////
var width_scale_factor = 0.95;
//var height_scale_factor = 0.60;
var margin = {right:30, left:30, top:20, bottom:30};
idname = "#xfactor_team_bowling";
var bb = d3.select(idname).node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
var height_scale_factor = wpaListHeightScale(base_width);
base_height = bb*height_scale_factor - margin.top - margin.bottom;

filename = "data/xfactor/team_xfactor.csv";
xname = "bowl_wpa";
yname = "team";
plot_type = 2;
plot_xfactor_top_bottom(idname, filename, base_width, base_height, margin, xname, yname, plot_type);
//////////////////////////////////////


function get_team_colors() {
    team_colors = d3.scaleOrdinal()
        .domain(['Chennai Super Kings', 'Delhi Daredevils', 'Kings XI Punjab',
           'Kolkata Knight Riders', 'Mumbai Indians', 'Rajasthan Royals',
           'Royal Challengers Bangalore', 'Sunrisers Hyderabad'])
        .range(["#FFFF3C", "#E32A26", "#A7A9AC", "#533791", "#004BA0", "#D1AB3E", "#4c4c4c", "#FF822A"]);

    return team_colors;
}

function plot_xfactor_we(idname, filename, width, height, margin, team1, team2, win_team, first_inn_balls, match_balls) {

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(idname).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
      var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv(filename, function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.ball_id = +d.ball_id;
        d.we = +d.we;
        d.bat_impact = +d.bat_impact;
        d.bowl_impact = +d.bowl_impact;
    });

    // set the ranges
    var x = d3.scaleLinear().domain([d3.min(data, function(d) { return d.ball_id;}), d3.max(data, function(d) { return d.ball_id;}) ]).range([margin.left+10, width - margin.right]);
    var y = d3.scaleLinear().range([height- margin.bottom, margin.top]);

    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.ball_id); })
        .y(function(d) { return y(d.we); });

    // Scale the range of the data
    //x.domain([d3.min(data, function(d) { return d.ball_id;}), d3.max(data, function(d) { return d.ball_id;}) ]);
    y.domain([0, d3.max(data, function(d) { return d.we;}) ]);

    svg.append("rect")
        .attr("x", function(d) { return x(0); })
        .attr("y", function(d) { return y(1); })
        .attr("width", function(d) { return x(first_inn_balls) - x(0); })
        .attr("height", function(d) { return y(0) - y(1); })
        .style("fill", function(d) { return "#F1E0D6"; })
        .style("opacity", 0.45)
        .style("stroke", "black");

    svg.append("text")
        .attr("x", function(d) { return x(0); } )
        .attr("y", function(d) { return y(0.90); })
        .text(function(d) { return team1 +" Batting";})
        .style("font-weight", "normal")
        .style("font-size", wpaAxisTickLabelFontSize(width));

    svg.append("rect")
        .attr("x", function(d) { return x(first_inn_balls); })
        .attr("y", function(d) { return y(1); })
        .attr("width", function(d) { return x(match_balls+9) - x(first_inn_balls); })
        .attr("height", function(d) { return y(0) - y(1); })
        .style("fill", function(d) { return "#BF988F"; })
        .style("opacity", 0.45)
        .style("stroke", "black");

    svg.append("text")
        .attr("x", function(d) { return x(first_inn_balls); } )
        .attr("y", function(d) { return y(0.90); })
        .text(function(d) { return team2 +" Batting";})
        .style("font-weight", "normal")
        .style("font-size", wpaAxisTickLabelFontSize(width));

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "xfactor_line")
        .attr("d", valueline);

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .filter(function(d) {  return ( (d.bat_impact === 1) || (d.bowl_impact===1) ); })
        .attr("class", "dot")
        .attr("r", function(d) { return 2.5; })
        .attr("cx", function(d) { return x(d.ball_id); })
        .attr("cy", function(d) { return y(d.we); })
        .style("fill", "red")
        .style("stroke", "black")
        .style("stroke-width", "1.0px")
        .style("opacity", 1.0);


    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .attr("class", "xfactor_xaxis")
        //.call(d3.axisBottom(x))
        .call(d3.axisBottom(x)
              .tickValues(d3.range(240))
              .tickFormat( (d,i) => {
                  if(d%30 === 0) return d;
                })
              .tickSize(0)
              .tickPadding(6))
        .style("font-size", wpaAxisTickLabelFontSize(width))
      .append("text")
        .attr("class", "label")
        .attr("x", width - margin.right)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Balls")
        .attr("fill", "black")
        .style("font-size", wpaAxisLabelFontSize(width));

    // Add the Y Axis
    svg.append("g")
        .attr("transform", "translate("+ (margin.left +10) +",0)")
        .call(d3.axisLeft(y)
          .tickFormat( (d,i) => {
            if ([0.2, 0.4, 0.6, 0.8, 1.0].includes(d)) return d;
          })
          )
        .style("font-size", wpaAxisTickLabelFontSize(width))
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -20)
        .attr("y", -45)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(win_team + " Winning Probability")
        .attr("fill", "black")
        .style("font-size", wpaAxisLabelFontSize(width));


    if (win_team=="SRH") {

      svg.append("text")
        .attr("x", function(d) { return x(105); } )
        .attr("y", function(d) { return y(0.5); })
        .text(function(d) { return "34 of 10 balls";})
        .style("font-size", "10px")
        .style("font-weight", "bold");

      svg.append("text")
        .attr("x", function(d) { return x(198); } )
        .attr("y", function(d) { return y(0.4); })
        .text(function(d) { return "Lynn LBW";})
        .style("font-size", "10px")
        .style("font-weight", "bold");

      svg.append("text")
        .attr("x", function(d) { return x(212); } )
        .attr("y", function(d) { return y(0.6); })
        .text(function(d) { return "Russell Caught";})
        .style("font-size", "10px")
        .style("font-weight", "bold");
    }

  });
}


function plot_xfactor_top_bottom(idname, filename, width, height, margin, xname, yname, plot_type) {
  // Add svg to
  /*
  var svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  */
  team_colors = get_team_colors();

  var svg = d3.select(idname).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
      var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // set the ranges
  var y = d3.scaleBand()
      .range([height, 0])
      .padding(0.1);

  var x = d3.scaleLinear()
      .range([0, width]);


  var xaxis_text = "";
  if (plot_type===0) {
    xaxis_text = "Player WPA";
  } else if (plot_type===1) {
    xaxis_text = "Batting WPA";
  } else if (plot_type==2) {
    xaxis_text = "Bowling WPA";
  }

  d3.csv(filename, function(error, data) {

      // format the data
      data.forEach(function(d) {
          d[xname] = +d[xname];
      });

      data.sort(function(a, b){
        return a[xname]-b[xname];
      });

      x.domain(d3.extent(data, function(d) { return d[xname]; })); //.nice();
      y.domain(data.map(function(d) { return d[yname]; }));

      // append the rectangles for the bar chart
      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", function (d) {
              return "bar xfactor-bar--" + (d[xname] < 0 ? "negative" : "positive");
          })
          .attr("x", function (d) {
              return x(Math.min(0, d[xname]));
          })
          .attr("y", function (d) {
              return y(d[yname]);
          })
          .attr("width", function (d) {
              return Math.abs(x(d[xname]) - x(0));
          })
          //.style("fill", function(d) { console.log(team_colors(d["team"])); return team_colors(d["team"]); })
          .attr("height", y.bandwidth()*0.60);

      svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
          .attr("x", function (d) {
              //return d[xname]<0 ? x(-0.2) : x(0.2);
              //return x(Math.min(0, d[xname]));
              //return x(d[xname]);
              return d[xname]<0 ? x(d[xname]) : x(d[xname])-25;
          })
          .attr("y", function (d) {
              return y(d[yname])+y.bandwidth()/2;
          })
          .text(function (d) { return d[xname].toFixed(2); })
          .attr("fill", "black")
          .style("font-size", wpaListAxisTickLabelFontSize(width));
          //.style("font-weight", "bold");
          //.text(function (d) { return Math.abs(x(d[xname]) - x(0)); });

      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
            .tickFormat( (d,i) => {
              if ([-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2].includes(d)) {
                return d;
              }
            }))
          .style("font-size", wpaListAxisTickLabelFontSize(width))
        .append("text")
          .attr("class", "impact_label")
          .attr("x", width)
          .attr("y", 30)
          .style("text-anchor", "end")
          .text(xaxis_text)
          .attr("fill", "black")
          .style("font-size", wpaListTeamNameFontSize(width));

      // add the y Axis
      let yAxisGroup = svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + x(0) + ",0)")
          .call(d3.axisRight(y));

      yAxisGroup.selectAll('.tick')
        .data(data)
        .select('text')
        .attr('x', function(d,i){return d[xname]<0?9:-9;})
        .style('text-anchor', function(d,i){return d[xname]<0?'start':'end';})
        .attr("class", "xfactor_label")
        .style("font-size", wpaListTeamNameFontSize(width));

  });
}


function plot_xfactor_test(idname, filename, base_width, base_height, margin) {

  /*
  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  */

  var svg = d3.select(idname).append("svg")
            .attr("width", base_width + margin.left + margin.right)
            .attr("height", base_height + margin.top + margin.bottom);
      var width = +svg.attr("width") - margin.left - margin.right;
      var height = +svg.attr("height") - margin.top - margin.bottom;
      var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // parse the date / time
  var parseTime = d3.timeParse("%d-%b-%y");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the line
  var valueline = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });


  // Get the data
  d3.csv(filename, function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.close = +d.close;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

  });
}
