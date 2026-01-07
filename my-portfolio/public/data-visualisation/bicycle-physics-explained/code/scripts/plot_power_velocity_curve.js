var minDeviceWidth = 375;
var maxDeviceWidth = 1024;
var power_velocity_plot_height_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.7, 0.4]);

var power_velocity_arr = [];
for (var j=0; j<50; j++) {

	v = j*1000/3600;
	W = 80;
	G = 0; //0.2 * 100;
	Crr = 0.005;
	Cd = 0.63;
	A = 0.509;
	Rho = 1.22601;
	power = ((9.8067 * W * ( Math.sin(Math.atan(G/100)) + Crr * Math.cos(Math.atan(G/100)) )) + (0.5*Cd*A*Rho*v*v))*v;
	power = (0.5*Cd*A*Rho*v*v)*v;

	power_velocity_arr.push({
		"velocity" : j,
		"power" : power
	})
}

idname = "#plot_power_velocity_curve";
data = power_velocity_arr;
var width_scale_factor = 0.80;
var margin = {right:15, left:55, top:20, bottom:50};
var bb = d3.select(idname).node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
var height_scale_factor = power_velocity_plot_height_factor(bb);
base_height = bb*height_scale_factor - margin.top - margin.bottom;
filename = "data/power_velocity.csv";
plot_power_velocity_curve_tooltip(idname, filename, base_width, base_height);

function plot_power_velocity_curve_tooltip(idname, filename, width, height) {


    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_histogram")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);
          
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(idname).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    d3.csv(filename, function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
        d.power = +d.power;
        d.bins = +d.bins;
      });

      // Scale the range of the data in the domains
      x.domain(data.map(function(d) { return d.bins; }));
      y.domain([0, d3.max(data, function(d) { return d.power; })]);

      var g = svg.selectAll(".bars")
                .data(data)
                .enter().append("g");

      // append the rectangles for the bar chart

      // Europe
      g.append("rect")
          .attr("class", "bar_power")
          .attr("x", function(d) { return x(d.bins); })
          .attr("width", x.bandwidth())
          //.attr("y", function(d) { return y(d.num_listings_eu); })
          //.attr("height", function(d) { return height - y(d.num_listings_eu); })
          .attr("y", function(d) { return height; })
          .attr("height", function(d) { return 0; })
          .style("fill", "lightsteelblue")
          .on("mouseover", function(d){
            //return tooltip.text(d.city).style("visibility", "visible");
            d3.select(this).style('stroke', "blue").style("opacity", 0.5);
            //return tooltip.html("<div class='well'>"+d.num_listings_eu+" homes are listed on Airbnb in Europe that cost around USD "+Math.floor(d.bins)+"</span></div>" ).style("visibility", "visible");
            return tooltip.html("In order to ride at <b>"+Math.round(d.bins)+" km/h</b>, you need to generate power of <b>"+Math.round(d.power)+" Watts</b>.").style("visibility", "visible");
          })
          .on("mousemove", function(){
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
          })
          .on("mouseout", function(){
            d3.select(this).style('stroke', "none").style("opacity", 1.0);
            return tooltip.style("visibility", "hidden");
          });

      d3.selectAll(".bar_power").transition()
        .delay(function(d, i) { return i * 5; })
        .attr("y", function(d) { return y(d.power); })
        .attr("height", function(d) { return height - y(d.power); });


      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "label_histogram")
          .call(d3.axisBottom(x)
          		.tickFormat( (d,i) => {
                  if (d%5 === 0) return d;
                })
          	)
          .style("font-size", "0.75rem")
        .append("text")
          .attr("class", "label_histogram")
          .attr("x", width)
          .attr("y", 40)
          .style("text-anchor", "end")
          .text("Velocity (km/h)")
          .style("fill", "black")
          .style("font-size", "1.0rem");

      // add the y Axis
      svg.append("g")
          .attr("class", "label_histogram axis--y")
          .call(d3.axisLeft(y)
          		.tickFormat( (d,i) => {
                  if (d%100 === 0) return d;
                })
          	)
          .style("font-size", "0.75rem")
        .append("text")
          .attr("class", "label_histogram")
          .attr("transform", "rotate(-90)")
          .attr("x", 0)
          .attr("y", -40)
          .style("text-anchor", "end")
          .text("Power (Watts)")
          .style("fill", "black")
          .style("font-size", "1.0rem");


    if (width>=500) {

      var line = d3.line()
    		.x(function(d, i) { return x(i); }) // set the x values for the line generator
    		.y(function(d) { return y(d.y); }) // set the y values for the line generator 
    		.curve(d3.curveMonotoneX) // apply smoothing to the line

      var line1data = d3.range(50).map(function(d) { return {"y": 100 } })
      var line2data = d3.range(50).map(function(d) { return {"y": 250 } })
      var line3data = d3.range(50).map(function(d) { return {"y": 400 } })
      var line4data = d3.range(50).map(function(d) { return {"y": 510 } })


      svg.append("path")
      		.datum(line1data)
      		.attr("class", "line")
      		.attr("d", line)
      		.attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .style("stroke-dasharray", ("3, 3"));

      svg.append("path")
      		.datum(line2data)
      		.attr("class", "line")
      		.attr("d", line)
      		.attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .style("stroke-dasharray", ("3, 3"));

      svg.append("path")
      		.datum(line3data)
      		.attr("class", "line")
      		.attr("d", line)
      		.attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .style("stroke-dasharray", ("3, 3"));

      svg.append("path")
      		.datum(line4data)
      		.attr("class", "line")
      		.attr("d", line)
      		.attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .style("stroke-dasharray", ("3, 3"));


      svg.append("text")
      		.attr("x", x(0))
      		.attr("y", y(105))
      		.text("Adult with good fitness over an hour of vigorous exercise")
      		.style("stroke-width", "0.75px")
      		.style('fill', 'red')
      		.style('stroke', 'red')
      		.style("font-size", "0.75rem");

      svg.append("text")
      		.attr("class", "text")
      		.attr("x", x(0))
      		.attr("y", y(255))
      		.text("Average power by Tour de France rider over 4 hour stage")
      		.style("stroke-width", "0.75px")
      		.style('fill', 'red')
      		.style('stroke', 'red')
      		.style("font-size", "0.75rem");

      svg.append("text")
      		.attr("class", "text")
      		.attr("x", x(0))
      		.attr("y", y(405))
      		.text("Tour de France rider pushing hard over a steep climb")
      		.style("stroke-width", "0.75px")
      		.style('fill', 'red')
      		.style('stroke', 'red')
      		.style("font-size", "0.75rem");

      svg.append("text")
      		.attr("class", "text")
      		.attr("x", x(0))
      		.attr("y", y(515))
      		.text("Only sustainable by trained cyclists for short bursts of few mintues")
      		.style("stroke-width", "0.75px")
      		.style('fill', 'red')
      		.style('stroke', 'red')
      		.style("font-size", "0.75rem");
      }
/*
      svg.selectAll("text")
        .attr("class", "label")
        .style("fill", "black")
        .style("shape-rendering", "crispEdges");

      svg.selectAll("path")
        .style("stroke", "black")
        .style("font-size", "0.75rem");
*/

      svg.selectAll("line")
        .style("stroke", "black")
        .style("font-size", "0.75rem")
        .style("visibility", "hidden");
    });

}
