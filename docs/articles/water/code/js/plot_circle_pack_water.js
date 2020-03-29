var minDeviceWidth = 375;
var maxDeviceWidth = 1024;

var water_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([3, 5]);
//var water_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([25, 20]);
var population_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([4, 6]);


//var prev_progress_water_opacity = 0;
//var min_change_water_opacity = 0.01;


function draw_circles_pack(idname, file, width, height, fill_color, stroke_color, radius_factor, init_opacity) {

  var svg3 = d3.select(idname).append("svg")
          .attr("width", width)
          .attr("height", height),

  width = +svg3.attr("width"),
  height = +svg3.attr("height");

  var format = d3.format(",d");

  var pack = d3.pack()
      .size([width, height])
      .padding(1.5);

  d3.csv(file, function(d) {
    d.value = +d.value;
    //d.region = +d.region;
    if (d.value) return d;
  }, function(error, classes) {
    if (error) throw error;

    var root = d3.hierarchy({children: classes})
        .sum(function(d) { return d.value; })
        .each(function(d) {
          if (id = d.data.id) {
            var id, i = id.lastIndexOf(".");
            d.id = id;
            d.package = id.slice(0, i);
            d.class = id.slice(i + 1);
            //d.colorid = d.data.colorid;
            d.value = d.data.value;
            d.type = d.data.type;
          }
        });

    leaves = pack(root).leaves();

    var node = svg3.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    var circles1 = node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        //.attr("r", function(d) { return radius_factor(width); })
        //.attr("r", function(d) { return d.value/water_radius_factor(width); })
        .text(function(d) { return d.value; })
        .style("fill", fill_color)
        .style("stroke", stroke_color)
        .attr("opacity", 0)
          .transition()
          .attr("opacity", init_opacity);

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });
  
  });

}



function draw_india_circles_pack(idname, file, width, height, fill_color, stroke_color, radius_factor, init_opacity, duration) {

  //var india_colors = ["#3cb44b", "#a9a9a9"];
  var india_colors = ["#3cb44b", "white"];

  d3.select(idname).select("svg").remove();

  var svg3 = d3.select(idname).append("svg")
          .attr("width", width)
          .attr("height", height),

  width = +svg3.attr("width"),
  height = +svg3.attr("height");

  var format = d3.format(",d");

  var pack = d3.pack()
      .size([width, height])
      .padding(1.5);

  d3.csv(file, function(d) {
    d.value = +d.value;
    d.type = +d.type;
    //d.region = +d.region;
    if (d.value) return d;
  }, function(error, classes) {
    if (error) throw error;

    var root = d3.hierarchy({children: classes})
        .sum(function(d) { return d.value; })
        .each(function(d) {
          if (id = d.data.id) {
            var id, i = id.lastIndexOf(".");
            d.id = id;
            d.package = id.slice(0, i);
            d.class = id.slice(i + 1);
            //d.colorid = d.data.colorid;
            d.value = d.data.value;
            d.type = d.data.type;
          }
        });

    leaves = pack(root).leaves();

    var node = svg3.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    /*
    d3.select(idname).selectAll("circle")
      .transition(1000)
        .attr("opacity", 0);
    */

    var circles1 = node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        //.attr("r", function(d) { return radius_factor(width); })
        //.attr("r", function(d) { return d.value/water_radius_factor(width); })
        .text(function(d) { return d.value; })
        .style("fill", function(d) { return india_colors[d.type]; })
        //.style("stroke", stroke_color)
        .attr("opacity", 0)
        .transition()
          .duration(duration)
          .attr("opacity", init_opacity);

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });
  
  });

}

//var div = document.getElementById("analysis_batting_metric_title");
//div.innerHTML = team_short_name + " Batsmen Types";