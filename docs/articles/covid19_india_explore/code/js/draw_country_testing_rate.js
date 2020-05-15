idname = "#country_testing_rate";
d3.select(idname).select("svg").remove();
filename = "data/country_testing_rate.csv";
width_scale_factor = 0.80;
height_scale_factor = 0.40;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:40, left:40, top:10, bottom:60};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_country_testing_rate(idname, filename, base_width, base_height);


function draw_country_testing_rate(idname, file, width, height) {

	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    //var x = d3.scaleLog().range([0, width]).base(10);
    var y = d3.scaleLinear().range([height, 0]);

    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_country_testing_rate")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    var svg = d3.select(idname).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    // Get the data
    d3.csv(file, function(error, data) {
		if (error) throw error;

		var columns = d3.keys(data[0]);

		// Read last data to set domains
		data.forEach(function(d, i) {
			d.country = d.country;
			d.total_cases = +d.total_cases;
			d.total_cases_per_million = +d.total_cases_per_million;
			d.total_tests_per_thousand = +d.total_tests_per_thousand;
		});
		//console.log(data);

		//Set domains
      	x.domain([-5, d3.max(data, function(d) { return +d.total_tests_per_thousand; })+5]);
      	y.domain([0, d3.max(data, function(d) { return +d.total_cases_per_million; })+200]);


      	//Append type rectangles
		svg.append("rect")
			.attr("class", "country_type_rect")
	        .attr("x", function(d) { return x(-2); })
	        .attr("y", function(d) { return y(1500); })
	        .attr("width", function(d) { return x(7) - x(-2); })
	        .attr("height", function(d) { return y(0) - y(1500); })
	        .style("fill", function(d) { return "#FADBD8"; })
	        .style("opacity", 1)
	        .style("stroke", "black");
	    svg.append("text")
			.attr("class", "country_type_rect_text")
			.attr("x", function(d) { return x(-5); })
			.attr("y", function(d) { return y(1550); })
			.text("India is in this low testing rate group")
			.style("font-size", "0.85rem")
			.style("font-weight", "bold")
			.style("fill", "#E74C3C")
	        .style("opacity", 1);


	    //Append type rectangles
		svg.append("rect")
			.attr("class", "country_type_rect")
	        .attr("x", function(d) { return x(15); })
	        .attr("y", function(d) { return y(2500); })
	        .attr("width", function(d) { return x(45) - x(15); })
	        .attr("height", function(d) { return y(500) - y(2500); })
	        .style("fill", function(d) { return "#ABEBC6"; })
	        .style("opacity", 1)
	        .style("stroke", "black");
	    svg.append("text")
			.attr("class", "country_type_rect_text")
			.attr("x", function(d) { return x(20); })
			.attr("y", function(d) { return y(2550); })
			.text("Successful containment with good testing rate")
			.style("font-size", "0.85rem")
			.style("font-weight", "bold")
			.style("fill", "#1D8348")
	        .style("opacity", 1);


	    //Append type rectangles
		svg.append("rect")
			.attr("class", "country_type_rect")
	        .attr("x", function(d) { return x(18); })
	        .attr("y", function(d) { return y(4600); })
	        .attr("width", function(d) { return x(38) - x(18); })
	        .attr("height", function(d) { return y(3000) - y(4600); })
	        .style("fill", function(d) { return "#D6EAF8"; })
	        .style("opacity", 1)
	        .style("stroke", "black");
	    svg.append("text")
			.attr("class", "country_type_rect_text")
			.attr("x", function(d) { return x(18); })
			.attr("y", function(d) { return y(4650); })
			.text("Good testing rate but high cases per million")
			.style("font-size", "0.85rem")
			.style("font-weight", "bold")
			.style("fill", "#2E86C1")
	        .style("opacity", 1);



	    svg.selectAll(".dot")
			.data(data)
        .enter().append("circle")
			.attr("class", "country_testing_circles circles")
			.attr("r", function(d,i) {
				//console.log(d.growth/10);
				return Math.log10(d.total_cases)/10+"rem";
			})
			.attr("cx", function(d,i) {
				//console.log(d.cases);
				return x(d.total_tests_per_thousand);
			})
			.attr("cy", function(d,i) {
				//console.log(d.deaths);
				//return y(d.deaths);
				return y(d.total_cases_per_million);
			})
			.style("z-index", 0)
			.attr("fill", function(d,i) {
				//console.log(state_fatality_rate_color_scale(growth_rate_normalised(d.growth)));
				//return "black";
				return continent_color_mapping(country_continent_mapping[d.country]);
			})
			.attr("stroke", "#000")
			.attr("stroke-width", "0.25px")
			.attr("opacity", 1)
			.on("mouseover", function(d, i) {
			    d3.selectAll(".country_testing_circles").style("opacity", 0.5);
			    d3.select(this).style('stroke-width', '2px').style("opacity", 1.0);
			    return tooltip.html(`<div class='well'>`+
                                      `<span class="state_name text-center">`+d.country+`</span></br>` +
                                    `Confirmed Cases: <span class="case_count_info">`+ numberWithCommas(d.total_cases) +`</span></br>`+
                                    `Tests per thousand: <span class="case_count_info">`+ d.total_tests_per_thousand.toFixed(0) +`</span></br>`+
                                    `Cases per million: <span class="case_count_info">`+ d.total_cases_per_million.toFixed(0) +`</span></br>`+
                                    `</div>` )
                              .style("visibility", "visible");
			  }
			)
			.on("mousemove", function(){
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
			})
			.on("mouseout", function(d, i){
				//d3.select(this).style('stroke-width', "1px").style("opacity", 1.0);
			    d3.selectAll(".country_testing_circles").style("opacity", 1.0);
			    d3.select(this).style('stroke-width', '0.25px').style("opacity", 1.0);
				return tooltip.style("visibility", "hidden");
			});

			svg.selectAll(".text")
	      		.data(data)
	      	.enter().append("text")
				.attr("class", "country_testing_text")
	      		.attr("x", function(d,i) {
					return x(d.total_tests_per_thousand);
				})
	      		.attr("y", function(d,i) {
					return y(d.total_cases_per_million);
					//return y(d.deaths);
				})
				.text(function(d,i) {
					if (["Indonesia", "Mexico", "Pakistan"].includes(d.country)) {
						return "";
					} else{
						return d.country;
					}
				})
				.style("z-index", 10)
				.style("font-size", "0.75rem");

			var xAxis = d3.axisBottom(x)
						.tickFormat( (d,i) => {
				          if (d%10 === 0) return d;
				      	}).tickPadding(2);
		        //.scale(x);
		        //.tickFormat(d3.timeFormat("%B %e"))
		        //.tickValues(x.domain().filter(function(d,i){ return !(i%10)}));

		    var yAxis = d3.axisLeft(y)
				      	.tickFormat( (d,i) => {
				          if (d%10 === 0) return d;
				      	}).tickPadding(2);

			// Add the X Axis
			svg.append("g")
				.attr("transform", "translate(0," + (height+20)+ ")")
				.call(xAxis)
				.attr("class", "country_testing_xaxis")
				.style("font-size", "0.75rem")
			.append("text")
				.attr("class", "country_testing_label")
				.attr("x", width)
				.attr("y", -10)
				.style("text-anchor", "end")
				.text(function(){
					return "Tests per thousand people";
				})
				.style("fill", "black")
				.style("stroke", "none")
				.style("font-weight", "bold")
				.style("font-size", "0.75rem");

			// Add the Y Axis
			svg.append("g")
				//.attr("transform", "translate("+(width)+",0)")
				//.call(d3.axisLeft(y))
				.call(yAxis)
				.attr("class", "country_testing_yaxis")
				.style("font-size", "0.75rem")
			.append("text")
				.attr("class", "state_fatality_label")
				.attr("transform", "rotate(-90)")
				.attr("x", 0)
				.attr("y", 15)
				.style("text-anchor", "end")
				.text(function(){
				  return "Cases per million";
				})
				.style("fill", "black")
				.style("stroke", "none")
				.style("font-weight", "bold")
				.style("font-size", "0.75rem");


	});

}