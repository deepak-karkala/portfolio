var idname = "#plot_eco_results";
d3.select(idname).select("svg").remove();
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 1.0;
//var height_scale_factor = 0.50;
var margin = {top: 20, right: 10, bottom: 50, left: 60};
base_width = bb*width_scale_factor - margin.left - margin.right;
file = "data/eco_results_initial_rounds.csv";
var minDeviceWidth = 375;
var maxDeviceWidth = 1024;
var height_scale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.8, 0.25]);
var height_scale_factor = height_scale(base_width);
base_height = bb*height_scale_factor - margin.top - margin.bottom;
var colorScale = d3.scaleLinear().domain([0, 5])
                    .range([d3.interpolateOrRd(0), d3.interpolateOrRd(1)]);
                    //.range([d3.interpolateBuPu(0), d3.interpolateBuPu(1)]);
                    //.range([d3.interpolateGnBu(0), d3.interpolateGnBu(1)]);

plot_eco_results(idname, file, base_width, base_height, margin);

/*
var idname = "#plot_eco_results_legend";
d3.select(idname).select("svg").remove();
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 1.0;
//var height_scale_factor = 0.50;
var margin = {top: 20, right: 10, bottom: 20, left: 20};
base_width = bb*width_scale_factor - margin.left - margin.right;
var height_scale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.8, 0.3]);
var height_scale_factor = height_scale(base_width);
base_height = bb*height_scale_factor - margin.top - margin.bottom;
plot_eco_results_legend(idname, file, base_width, base_height, margin);
*/

function plot_eco_results(idname, file, width, height, margin) {
	var svg = d3.select(idname).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        /*
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
		*/
    var x = d3.scaleLinear().range([0, width]),
    	y = d3.scaleLinear().range([height, 0]),
    	z = d3.scaleOrdinal(d3.schemeCategory10);
    	//["#E74C3C", "#9B59B6", "#3498DB", "#2ECC71", "#F1C40F"];
    	colorCat = {"Defector":"#E74C3C" , "Cooperator":"#9B59B6", "Grudger":"#2ECC71", "Tit For Tat":"#F1C40F", "Random":"#3498DB"};

	var stack = d3.stack();

	var area = d3.area()
	    .x(function(d, i) {
	    	return x(d.data.round);
	    })
	    .y0(function(d) {
	    	return y(d[0]);
	    })
	    .y1(function(d) {
	    	return y(d[1]);
	    });

	var g = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv(file, function(error, data) {
	  if (error) throw error;

	  var keys = data.columns.slice(1);

	  //x.domain(d3.extent(data, function(d) { return d.round; }));
	  x.domain([0, 20]);
	  y.domain([0, 1000]);
	  z.domain(keys);
	  stack.keys(keys);


	  var layer = g.selectAll(".layer")
	    .data(stack(data))
	    .enter().append("g")
	      .attr("class", "layer");

	  layer.append("path")
	      .attr("class", "area")
	      //.style("fill", function(d) { return z(d.key); })
	      .style("fill", function(d) { return colorCat[d.key]; })
	      .attr("d", area);

	/*
	  layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
	    .append("text")
	      .attr("x", width - 6)
	      .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
	      .attr("dy", ".35em")
	      .style("font", "10px sans-serif")
	      .style("text-anchor", "end")
	      .text(function(d) { return d.key; });
	*/


		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))
            .style("font-size", "0.75rem")
		.append("text")
			.attr("class", "label")
			.attr("x", width)
			.attr("y", 40)
			.style("text-anchor", "end")
			.text("Tournament round #")
			.attr("fill", "black")
			.style("font-size", "1rem");

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y)
					.tickFormat( (d,i) => {
						if (d%200 == 0) return d;
					})) //.ticks(10, "%"));
            .style("font-size", "0.75rem")
	     .append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("x", -10)
			.attr("y", -40)
			.style("text-anchor", "end")
			.text("Number of individuals")
			.attr("fill", "black")
			.style("font-size", "1rem");

		

	});

	function type(d, i, columns) {
	  d.date = parseDate(d.date);
	  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] / 100;
	  return d;
	}
}


function plot_eco_results_legend(idname, file, width, height, margin) {
	var svg = d3.select(idname).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

	var ordinal = d3.scaleOrdinal()
	  .domain(["Cooperator", "Defector", "Tit For Tat", "Grudger", "Random"])
	  .range([ "rgb(153, 107, 195)", "rgb(56, 106, 197)", "rgb(93, 199, 76)", "rgb(223, 199, 31)", "rgb(234, 118, 47)"]);

	svg.append("g")
	  .attr("class", "legendOrdinal")
	  .attr("transform", "translate(80,20)");

	var legendOrdinal = d3.legendColor()
	  //d3 symbol creates a path-string, for example
	  //"M0,-8.059274488676564L9.306048591020996,
	  //8.059274488676564 -9.306048591020996,8.059274488676564Z"
	  .shape("path", d3.symbol().type(d3.symbolSquare).size(350)())
	  .shapePadding(70)
	  //use cellFilter to hide the "e" cell
	  .cellFilter(function(d){ return d.label !== "e" })
	  .scale(ordinal)
	  .orient("horizontal");

	svg.select(".legendOrdinal")
	  .call(legendOrdinal);
}
/*
function plot_eco_results(idname, file, width, height, margin) {

	// create the svg
	var svg = d3.select(idname).append("svg")
			.attr("width", width + margin.left + margin.right)
            .attr("height", height) // + margin.top + margin.bottom)
	    //width = width - margin.left - margin.right,
	    //height = height - margin.top - margin.bottom,
	    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// set x scale
	var x = d3.scaleBand()
	    .rangeRound([0, width]);
	    //.paddingInner(0.05)
	    //.align(0.1);

	// set y scale
	var y = d3.scaleLinear()
	    .rangeRound([height, 0]);

	// set the colors
	var z = d3.scaleOrdinal()
	    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	// load the csv and create the chart
	d3.csv(file, function(d, i, columns) {
		for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
			d.total = t;
			return d;
		}, function(error, data) {
			  if (error) throw error;

			  var keys = data.columns.slice(1);

			  data.sort(function(a, b) { return b.total - a.total; });
			  x.domain(data.map(function(d) { return d.round; }));
			  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
			  z.domain(keys);

			  g.append("g")
			    .selectAll("g")
			    .data(d3.stack().keys(keys)(data))
			    .enter().append("g")
			      .attr("fill", function(d) { return z(d.key); })
			    .selectAll("rect")
			    .data(function(d) { return d; })
			    .enter().append("rect")
			      .attr("x", function(d) { return x(d.data.round); })
			      .attr("y", function(d) { return y(d[1]); })
			      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
			      .attr("width", x.bandwidth())
			    .on("mouseover", function() { tooltip.style("display", null); })
			    .on("mouseout", function() { tooltip.style("display", "none"); })
			    .on("mousemove", function(d) {
			      console.log(d);
			      var xPosition = d3.mouse(this)[0] - 5;
			      var yPosition = d3.mouse(this)[1] - 5;
			      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
			      tooltip.select("text").text(d[1]-d[0]);
			});

		  g.append("g")
		      .attr("class", "axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(d3.axisBottom(x));

		  g.append("g")
		      .attr("class", "axis")
		      .call(d3.axisLeft(y).ticks(null, "s"))
		    .append("text")
		      .attr("x", 2)
		      .attr("y", y(y.ticks().pop()) + 0.5)
		      .attr("dy", "0.32em")
		      .attr("fill", "#000")
		      .attr("font-weight", "bold")
		      .attr("text-anchor", "start");

		  var legend = g.append("g")
		      .attr("font-family", "sans-serif")
		      .attr("font-size", 10)
		      .attr("text-anchor", "end")
		    .selectAll("g")
		    .data(keys.slice().reverse())
		    .enter().append("g")
		      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		  legend.append("rect")
		      .attr("x", width - 19)
		      .attr("width", 19)
		      .attr("height", 19)
		      .attr("fill", z);

		  legend.append("text")
		      .attr("x", width - 24)
		      .attr("y", 9.5)
		      .attr("dy", "0.32em")
		      .text(function(d) { return d; });
		});

	  // Prep the tooltip bits, initial display is hidden
	  var tooltip = svg.append("g")
	    .attr("class", "tooltip")
	    .style("display", "none");
	      
	  tooltip.append("rect")
	    .attr("width", 60)
	    .attr("height", 20)
	    .attr("fill", "white")
	    .style("opacity", 0.5);

	  tooltip.append("text")
	    .attr("x", 30)
	    .attr("dy", "1.2em")
	    .style("text-anchor", "middle")
	    .attr("font-size", "12px")
	    .attr("font-weight", "bold");
	}
*/