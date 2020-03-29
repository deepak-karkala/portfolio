
var width_scale_factor = 1.0;
var height_scale_factor = 0.80;
var margin = {right:30, left:30, top:10, bottom:40};

var bb = d3.select('#ipl_batting').node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
// Plot IPL batting chart
plot_batting_chart("#ipl_batting", "data/ipl_2018_batting.csv", "ipl", base_width, base_height);

var bb = d3.select('#ipl_bowling').node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
// Plot IPL batting chart
plot_bowling_chart("#ipl_bowling", "data/ipl_2018_bowling.csv", "ipl", base_width, base_height);

function team_color_mapping(league) {
  var team_colors = [];

  if (league=="ipl") {
    team_colors = d3.scaleOrdinal()
        .domain(['Chennai Super Kings', 'Delhi Daredevils', 'Kings XI Punjab',
           'Kolkata Knight Riders', 'Mumbai Indians', 'Rajasthan Royals',
           'Royal Challengers Bangalore', 'Sunrisers Hyderabad'])
        .range(["#FFFF3C", "#E32A26", "#A7A9AC", "#3A225D", "#004BA0", "#D1AB3E", "#2B2A29", "#FF822A"]);
    }

  return team_colors;
}

var batsman_type_colors = d3.scaleOrdinal()
  .domain([0, 1, 2, 3, 4])
  .range(["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"]);
//console.log(ipl_team_color_map(""));

function plot_batting_chart(id, file, league, width, height) {
/*
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
*/
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
  

  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.bat_avg = +d.bat_avg;
      d.bat_sr = +d.bat_sr;
      d.runs_scored = +d.runs_scored;
      d.player = d.player;
    });

    //x.domain(d3.extent(data, function(d) { return d.bat_avg; })); //.nice();
    //y.domain(d3.extent(data, function(d) { return d.bat_sr; })).nice();

    x.domain([d3.min(data, function(d) { return d.bat_avg;})-3, d3.max(data, function(d) { return d.bat_avg;})+3 ]);
    y.domain([d3.min(data, function(d) { return d.bat_sr;})-3, d3.max(data, function(d) { return d.bat_sr;})+3 ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Average")
        .attr("fill", "white");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Strike Rate")
        .attr("fill", "white");

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
      //.filter(function(d) { return d.runs_scored > 200; })
        .attr("class", "dot")
        .attr("r", function(d) { return d.runs_scored/40; })
        .attr("cx", function(d) { return x(d.bat_avg); })
        .attr("cy", function(d) { return y(d.bat_sr); })
        .style("fill", function(d) { return team_colors(d.team); })
        .style("stroke", "black")
        .style("stroke-width", "0.5px");

    svg.selectAll("text")
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
        .text(function(d) { return d.player; });
*/
    svg.selectAll("path")
        .style("stroke", "white");

    svg.selectAll("line")
        .style("stroke", "white");

    svg.selectAll("tick")
        .style("fill", "white");

    svg.selectAll("text")
        .style("fill", "black")
        .style("shape-rendering", "crispEdges");

  });

  d3.csv("data/batsman_types.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.start_avg = +d.start_avg;
      d.end_avg = +d.end_avg;
      d.start_sr = +d.start_sr;
      d.end_sr = +d.end_sr;
    });

    //x.domain([d3.min(data, function(d) { return d.start_avg;})-3, d3.max(data, function(d) { return d.end_avg;})+3 ]);
    //y.domain([d3.min(data, function(d) { return d.start_sr;})-3, d3.max(data, function(d) { return d.end_sr;})+3 ]);

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

  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.bowl_econ = +d.bowl_econ;
      d.bowl_sr = +d.bowl_sr;
      d.wickets = +d.wickets;
      d.player = d.player;
    });

    //x.domain(d3.extent(data, function(d) { return d.bat_avg; })); //.nice();
    //y.domain(d3.extent(data, function(d) { return d.bat_sr; })).nice();

    x.domain([d3.min(data, function(d) { return d.bowl_econ;})-0.5, d3.max(data, function(d) { return d.bowl_econ;})+0.5 ]);
    y.domain([d3.min(data, function(d) { return d.bowl_sr;})-2, d3.max(data, function(d) { return d.bowl_sr;})+2 ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Economy Rate")
        .attr("fill", "white");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Strike Rate")
        .attr("fill", "white");

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
      //.filter(function(d) { return d.runs_scored > 200; })
        .attr("class", "dot")
        .attr("r", function(d) { return d.wickets/2; })
        .attr("cx", function(d) { return x(d.bowl_econ); })
        .attr("cy", function(d) { return y(d.bowl_sr); })
        .style("fill", function(d) { return team_colors(d.team); });

    var legend = svg.selectAll(".legend")
        .data(color.domain())
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
        .text(function(d) { return d.player; });

  });
}
