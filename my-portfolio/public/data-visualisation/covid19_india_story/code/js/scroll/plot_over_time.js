function plot_over_time(idname, width, height, margin) {

	// set the ranges
    //var x = d3.scaleLinear().range([0, width]);
    var x = d3.scaleBand().rangeRound([0, width], .05).padding(10);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(scroll_data.map(function(d) {
		return d.date;
	}));
	//x.domain([0, scroll_data.length-1]);
	//x.domain([0, 60000]);
    y.domain([0, 6000]);
    //y.domain([0, 400]);

    //console.log(scroll_data);
	console.log(height - margin.bottom);

	// Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_scroll")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

	d3.select(idname)
		.selectAll(".scroll_randompos_circles")
		.attr("opacity", 0.5)
		.transition()
			.delay(2000)
			.duration(1000)
			.delay(function(d,i){
				return (Math.ceil(Math.abs(d.date - new Date(2020,2,1)) / (1000 * 60 * 60 * 24))+d.day_id)*1;
			})
			.attr("cx", function(d,i) {
				//console.log(x(d.date));
				return x(d.date)+randomNumber(0,15);
				//return x(d.id);
			})
			.attr("cy", function(d,i) {
				return y(d.day_id)+randomNumber(0,10); //height - margin.bottom;
			})
			.attr("opacity", 1);


	var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.timeFormat("%b %e"))
        .tickValues(x.domain().filter(function(d,i){ return !(i%20)}));


    var yAxis = d3.axisRight(y)
		      	.tickFormat( (d,i) => {
		          if (d%1000 === 0) return d;
		      	}).tickPadding(2);

	// add the x Axis
	svg_indv_time.append("g")
	  .attr("transform", "translate(0," + (height+20) + ")")
	  .attr("class", "label_histogram")
	  .call(xAxis)
	  .style("font-size", "0.75rem")
	.append("text")
	  .attr("class", "label_histogram")
	  .attr("x", width)
	  .attr("y", -40)
	  .style("text-anchor", "end")
	  .style("fill", "black")
	  .style("font-size", "0.75rem");

	// add the y Axis
	svg_indv_time.append("g")
	  .attr("class", "label_histogram axis--y")
	  .attr("transform", "translate("+(width)+",20)")
	  .call(yAxis)
	  .style("font-size", "0.75rem")
	.append("text")
	  .attr("class", "label_histogram")
	  .attr("transform", "rotate(-90)")
	  .attr("x", 0)
	  .attr("y", -5)
	  .style("text-anchor", "end")
	  .text(function(){
	      return "Daily cases";
	  })
	  .style("fill", "black")
	  .style("font-size", "0.75rem");

}