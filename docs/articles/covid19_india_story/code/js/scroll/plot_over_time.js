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
    y.domain([0, 4000]);
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
		.transition()
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
				return y(d.day_id); //height - margin.bottom;
			});

}