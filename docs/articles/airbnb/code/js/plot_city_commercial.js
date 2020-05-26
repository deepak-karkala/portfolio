var minDeviceWidth = 375;
var maxDeviceWidth = 1024;

width_scale_factor = 1.0;
idname = "#city_commercial_plot";
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:30, left:40, top:20, bottom:30};
base_width = bb*width_scale_factor - margin.left - margin.right;

var heightScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.8, 0.45]);
height_scale_factor = heightScale(base_width);
base_height = bb*height_scale_factor - margin.top - margin.bottom;

plot_city_commercial(idname, "data/city_commercial.csv", base_width, base_height);

function plot_city_commercial(id, file, width, height) {

  var x = d3.scaleLinear()
      .range([0, width]);

  var y = d3.scaleLinear()
      .range([height, 0]);

  var theme_font_color = "black";
  var airbnb_color = "#FF5A60";

  // Scale for maximum radius based on screen width
  var maxRadiusScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 30]);
  var r = d3.scaleLinear().range([2, maxRadiusScale(width)]);

  // Scale for label font size
  var labelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 20]);

  // Scale for axis label font size
  var axisLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([8, 16]);

  // Scale for tick label font size
  var tickLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 20]);

  // Scale for label font size
  var typeLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 28]);

  // Scale for marker size
  var markerSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([14, 30]);

  // Scale for arrow y pos
  var arrowYPosScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([20, 45]);

  // Scale for text y pos
  var textYPosScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 35]);

  // Colors for US/EU cities
  //var us_eu_color = ["#be302b", "#51a2d9"]; //d3.scaleOrdinal(d3.schemeCategory10);
  //var us_eu_color = ["#0444bf", "#f05837"]; //d3.scaleOrdinal(d3.schemeCategory10);
  var us_eu_color = ["#d72f01", "#0444bf"]; //d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y);

  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Tooltip
  var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_commercial")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

  // Player bubbles
  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.frac_of_users_more_than_one = +d.frac_of_users_more_than_one;
      d.frac_entireapt = +d.frac_entireapt;
      d.num_listings = +d.num_listings;
      d.city = d.city;
      d.us_eu = +d.us_eu;
    });

    x.domain([d3.min(data, function(d) { return d.frac_of_users_more_than_one;})-5, d3.max(data, function(d) { return d.frac_of_users_more_than_one;})+5 ]);
    y.domain([d3.min(data, function(d) { return d.frac_entireapt;})-10, d3.max(data, function(d) { return d.frac_entireapt;})+10 ]);
  });

  var type_colors = d3.scaleOrdinal()
                      .domain([0, 1, 2, 3])
                      .range(["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9"]);

  // types boxes
  d3.csv("data/city_commercial_types.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.start_frac_user = +d.start_frac_user;
      d.end_frac_user = +d.end_frac_user;
      d.start_frac_apt = +d.start_frac_apt;
      d.end_frac_apt = +d.end_frac_apt;
      d.color_id = +d.color_id;
    });

    svg.selectAll(".rect")
       .data(data)
      .enter().append("rect")
        .attr("x", function(d) { return x(d.start_frac_user); })
        .attr("y", function(d) { return y(d.end_frac_apt); })
        .attr("width", function(d) { return x(d.end_frac_user) - x(d.start_frac_user); })
        .attr("height", function(d) { return y(d.start_frac_apt) - y(d.end_frac_apt); })
        .style("fill", function(d) { return type_colors(d.color_id); })
        .style("opacity", 0.45)
        .style("stroke", "black")
        .style("z-index", 100);

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
        .attr("x", function(d) { return x(d.start_frac_user+2); } )
        .attr("y", function(d) { return y(d.end_frac_apt+1); })
        .text(function(d) { return d.type_text;})
        .style("font-weight", "bold")
        .style("font-size", typeLabelFontSizeScale(width));

  });

  // City bubbles
  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.frac_of_users_more_than_one = +d.frac_of_users_more_than_one;
      d.frac_entireapt = +d.frac_entireapt;
      d.num_listings = +d.num_listings;
      d.city = d.city;
      d.us_eu = +d.us_eu;
    });

    x.domain([d3.min(data, function(d) { return d.frac_of_users_more_than_one;})-5, d3.max(data, function(d) { return d.frac_of_users_more_than_one;})+5 ]);
    y.domain([d3.min(data, function(d) { return d.frac_entireapt;})-10, d3.max(data, function(d) { return d.frac_entireapt;})+10 ]);
    r.domain([d3.min(data, function(d) { return d.num_listings;}), d3.max(data, function(d) { return d.num_listings;}) ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .style("font-size", tickLabelFontSizeScale(width))
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("% of hosts offering more than one Airbnb listing")
        .attr("fill", "black")
        .style("font-size", axisLabelFontSizeScale(width));

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .style("font-size", tickLabelFontSizeScale(width))
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("% of all offers listed as Entire home ")
        .attr("fill", "black")
        .style("font-size", axisLabelFontSizeScale(width));

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
      //.filter(function(d) { return d.runs_scored > 200; })
        .attr("class", "dot")
        //.attr("r", function(d) { return 0.25 * d.num_listings/(width*8) + 4; })
        .attr("r", function(d) { return r(d.num_listings); })
        .attr("cx", function(d) { return x(d.frac_of_users_more_than_one); })
        .attr("cy", function(d) { return y(d.frac_entireapt); })
        .style("fill", function(d) { return us_eu_color[d.us_eu]; })
        .style("stroke", theme_font_color)
        .style("stroke-width", "1.0px")
        .style("z-index", 1)
        .on("mouseover", function(d){
          //return tooltip.text(d.city).style("visibility", "visible");
          d3.select(this).style('stroke', theme_font_color).style("stroke-width", 2).style("stroke-opacity", 1.0);
          return tooltip.html("<div class='well'><span class='city_name'><b>"+d.city+"</b></span><br/>" + "<span class='tooltip_stats'> <b>"  + Math.round(d.frac_of_users_more_than_one) + "</b>% of all the hosts offer more than one listings. </b><br/>" + " <b>" + Math.round(d.frac_entireapt) + "</b>% of all the listings are entire homes</b><br />" +"</span></div>" ).style("visibility", "visible");
        })
        .on("mousemove", function(){
          if (event.pageX >= window.innerWidth/2) {
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-200)+"px");
          } else {
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
          }
          //return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(){
          d3.select(this).style('stroke', theme_font_color).style("stroke-width", 1).style("stroke-opacity", 1.0);
          return tooltip.style("visibility", "hidden");
        });

    var cities_nolabels = ["Antwerp", "Denver", "Santa Cruz County", "Asheville", "Portland", "Seattle"];

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
      .filter(function(d) { if ((d.num_listings>=7000) && (!cities_nolabels.includes(d.city))) {return d;} })
        .attr("x", function(d) { return x(d.frac_of_users_more_than_one)+8; })
        .attr("y", function(d) { return y(d.frac_entireapt); })
        .text(function(d) { return d.city;})
        .style("fill", theme_font_color)
        .style("font-size", labelFontSizeScale(width));

    svg.selectAll("path")
        .style("stroke", theme_font_color);

    svg.selectAll("line")
        .style("stroke", theme_font_color);

    svg.selectAll("tick")
        .style("fill", theme_font_color)
        .style("font-size", labelFontSizeScale(width));

    svg.selectAll("text")
        .attr("class", "label")
        .style("fill", theme_font_color)
        .style("shape-rendering", "crispEdges");

  });

}