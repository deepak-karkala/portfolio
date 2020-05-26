var minDeviceWidth = 375;
var maxDeviceWidth = 1024;

width_scale_factor = 1.0;
idname = "#airbnb_hotel_comparison";
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:30, left:40, top:15, bottom:60};
base_width = bb*width_scale_factor - margin.left - margin.right;

var heightScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.9, 0.45]);
height_scale_factor = heightScale(base_width);
base_height = bb*height_scale_factor - margin.top - margin.bottom;

plot_airbnbHotelDiff(idname, "data/airbnb_hotel_diff.csv", base_width, base_height);

function plot_airbnbHotelDiff(id, file, width, height) {

  var x = d3.scaleLinear()
      .range([0, width]);

  var y = d3.scaleLinear()
      .range([height, 0]);

  var theme_font_color = "black";
  var airbnb_color = "#FF5A60";

  // Scale for maximum radius based on screen width
  var maxRadiusScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 16]);
  var r = d3.scaleLinear().range([2, maxRadiusScale(width)]);

  // Scale for label font size
  var labelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 20]);

  // Scale for axis label font size
  var axisLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([8, 16]);

  // Scale for tick label font size
  var tickLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 20]);

  // Scale for label font size
  var typeLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([12, 18]);

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
        .attr("class", "tooltip_hotel")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

  // Player bubbles
  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.median_entirehome = +d.median_entirehome;
      d.avg_hotel_price = +d.avg_hotel_price;
      d.airbnb_hotel_diff = +d.airbnb_hotel_diff;
      d.num_listings = +d.num_listings;
      d.city = d.city;
      d.us_eu = +d.us_eu;
    });

    x.domain([d3.min(data, function(d) { return d.airbnb_hotel_diff;})-20, d3.max(data, function(d) { return d.airbnb_hotel_diff;})+20 ]);
    y.domain([d3.min(data, function(d) { return d.median_entirehome;})-30, d3.max(data, function(d) { return d.median_entirehome;})+10 ]);
  });

  var type_colors = d3.scaleOrdinal()
                      .domain([0, 1, 2, 3])
                      .range(["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9"]);

  // types boxes
  d3.csv("data/airbnb_hotel_diff_types.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.start_diff = +d.start_diff;
      d.end_diff = +d.end_diff;
      d.start_med = +d.start_med;
      d.end_med = +d.end_med;
      d.color_id = +d.color_id;
    });

    svg.selectAll(".rect")
       .data(data)
      .enter().append("rect")
        .attr("x", function(d) { return x(d.start_diff); })
        .attr("y", function(d) { return y(d.end_med); })
        .attr("width", function(d) { return x(d.end_diff) - x(d.start_diff); })
        .attr("height", function(d) { return y(d.start_med) - y(d.end_med); })
        .style("fill", function(d) { return type_colors(d.color_id); })
        .style("opacity", 0.45)
        .style("stroke", "black")
        .style("z-index", 100);

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
        .attr("x", function(d) { return x(d.start_diff-5); } )
        .attr("y", function(d) { return y(d.end_med+1); })
        .text(function(d) { return d.type_text;})
        .style("font-weight", "bold")
        .style("font-size", typeLabelFontSizeScale(width));

  });

  // City bubbles
  d3.csv(file, function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.median_entirehome = +d.median_entirehome;
      d.avg_hotel_price = +d.avg_hotel_price;
      d.airbnb_hotel_diff = +d.airbnb_hotel_diff;
      d.num_listings = +d.num_listings;
      d.city = d.city;
      d.us_eu = +d.us_eu;
    });

    x.domain([d3.min(data, function(d) { return d.airbnb_hotel_diff;})-20, d3.max(data, function(d) { return d.airbnb_hotel_diff;})+20 ]);
    y.domain([d3.min(data, function(d) { return d.median_entirehome;})-30, d3.max(data, function(d) { return d.median_entirehome;})+10 ]);
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
        .text("Price difference [USD] between Airbnb and hotel")
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
        .text("Average price [USD] of entire home on Airbnb")
        .attr("fill", "black")
        .style("font-size", axisLabelFontSizeScale(width));

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
      //.filter(function(d) { return d.runs_scored > 200; })
        .attr("class", "dot")
        //.attr("r", function(d) { return 0.25 * d.num_listings/(width*8) + 4; })
        .attr("r", function(d) { return r(d.num_listings); })
        .attr("cx", function(d) { return x(d.airbnb_hotel_diff); })
        .attr("cy", function(d) { return y(d.median_entirehome); })
        .style("fill", function(d) { return us_eu_color[d.us_eu]; })
        .style("stroke", theme_font_color)
        .style("stroke-width", "1.0px")
        .style("z-index", 1)
        .on("mouseover", function(d){
          //return tooltip.text(d.city).style("visibility", "visible");
          d3.select(this).style('stroke', theme_font_color).style("stroke-width", 2).style("stroke-opacity", 1.0);
          return tooltip.html("<div class='well'><span class='city_name'><b>"+d.city+"</b></span><br/>" + "<span class='tooltip_stats'>Average price of Airbnb home: <b>USD "  + Math.round(d.median_entirehome) + "</b><br/>" + " Average price of a hotel room: <b>USD " + Math.round(d.avg_hotel_price) + "</b><br />" +"</span></div>" ).style("visibility", "visible");
        })
        .on("mousemove", function(){
          if (event.pageX >= window.innerWidth/2) {
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-100)+"px");
          } else {
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
          }
          //return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(){
          d3.select(this).style('stroke', theme_font_color).style("stroke-width", 1).style("stroke-opacity", 1.0);
          return tooltip.style("visibility", "hidden");
        });

    svg.selectAll(".text")
        .data(data)
      .enter().append("text")
      .filter(function(d) { return (d.num_listings>=7000); })
        .attr("x", function(d) { return x(d.airbnb_hotel_diff)+8; })
        .attr("y", function(d) { return y(d.median_entirehome); })
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

    // Labels: Hotel vs Airbnb cheaper

    //Hotels cheaper              
    svg.append("line")
      .attr("x1", x(10))
      .attr("y1", y(arrowYPosScale(width)))
      .attr("x2", x(80))
      .attr("y2", y(arrowYPosScale(width)))
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .attr("marker-end", "url(#triangle)");

    svg.append("svg:defs").append("svg:marker")
      .attr("id", "triangle")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", markerSizeScale(width))
      .attr("markerHeight", markerSizeScale(width))
      //.attr("markerWidth", 20)
      //.attr("markerHeight", 20)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "black");

    svg.append("text")
        .attr("x", x(20))
        .attr("y", y(textYPosScale(width)))
        .text("Hotels Cheaper")
        .style("font-size", typeLabelFontSizeScale(width))
        .style("fill", airbnb_color)
        .style("font-weight", "bold");

    //Airbnb cheaper              
    svg.append("line")
      .attr("x1", x(-10))
      .attr("y1", y(arrowYPosScale(width)))
      .attr("x2", x(-140))
      .attr("y2", y(arrowYPosScale(width)))
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .attr("marker-end", "url(#triangle)");

    svg.append("svg:defs").append("svg:marker")
      .attr("id", "triangle")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", markerSizeScale(width))
      .attr("markerHeight", markerSizeScale(width))
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "black");

    svg.append("text")
        .attr("x", x(-110))
        .attr("y", y(textYPosScale(width)))
        .text("Airbnb Cheaper")
        .style("font-size", typeLabelFontSizeScale(width))
        .style("fill", airbnb_color)
        .style("font-weight", "bolder");
  });

}