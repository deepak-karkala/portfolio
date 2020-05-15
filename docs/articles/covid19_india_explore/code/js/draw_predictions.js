idname = "#scroll1_test";
d3.select(idname).select("svg").remove();
filename = "data/prediction_model.csv";
width_scale_factor = 0.5;
height_scale_factor = 0.3;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:0, left:0, top:0, bottom:30};
base_width = bb*width_scale_factor - margin.left - margin.right;
//base_height = Math.floor(window.innerHeight * 0.95); //
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_predictions(idname, filename, base_width, base_height, margin);




function draw_predictions(idname, filename, width, height, margin) {

	// append the svg object to the body of the page
	var svg = d3.select(idname)
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");

	// Parse the Data
	d3.csv(filename, function(data) {

		prediction_data = data;
		// List of subgroups = header of the csv files = soil condition here
		var subgroups = data.columns.slice(2)

		// List of groups = species here = value of the first column called group -> I show them on the X axis
		var groups = d3.map(data, function(d){return(d.group)}).keys()


		data = data.filter(function(d,i){
			return ((+d.scenario==1) && (i%3==0));
		});
		//console.log(data);
		//console.log(subgroups);
		//console.log(groups);

		// Add X axis
		var x = d3.scaleBand()
		  .domain(groups)
		  .range([0, width])
		  .padding([0.05])
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x)
				.tickSizeOuter(0)
				.tickFormat(function(d,i){
						if (d%30==0) {
							return month_abbrv_list[d/30];
						}
					})
				);

		// Add Y axis
		var y = d3.scaleLinear()
			.domain([0, 15000])
			.range([ height, 0 ]);
		svg.append("g")
			.call(d3.axisLeft(y));

		// color palette = one color per subgroup
		var color = d3.scaleOrdinal()
			.domain(subgroups)
			.range(['#e41a1c','#377eb8','#4daf4a'])

		update_scenario();
		function update_scenario() {

			d3.select(idname)
				.selectAll(".prediction_model_rect")
				.transition()
					.duration(500)
					.style("opacity", 0);

			//prediction_scenario_id+=1;
			console.log(prediction_scenario_id);
			// Filter scenario data
			data = prediction_data.filter(function(d,i){
				return ((+d.scenario==prediction_scenario_id) && (i%3==0));
			});
			//if (prediction_scenario_id==3){
			//	prediction_scenario_id = 0;
			//}

			//stack the data? --> stack per subgroup
			var stackedData = d3.stack()
				.keys(subgroups)
				(data)

			// Show the bars
			svg.append("g")
				.selectAll("g")
				// Enter in the stack data = loop key per key = group per group
				.data(stackedData)
				.enter().append("g")
				  .attr("fill", function(d) { return color(d.key); })
				  .selectAll("rect")
				  // enter a second time = loop subgroup per subgroup to add all rectangles
				  .data(function(d) { return d; })
				  .enter().append("rect")
				  	.attr("class", "prediction_model_rect")
				    .attr("x", function(d) { return x(d.data.group); })
				    .attr("y", function(d) { return y(d[1]); })
				    .attr("width", x.bandwidth()*2)
					//.style("opacity", 0)
				    .transition()
				    	.duration(100)
					    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
					    //.style("opacity", 1);
					    //.call(endAll, update_scenario)
					    //.on("end", d3.interval(update_scenario(), 3000));
					    //.on("end", setTimeout(update_scenario(), 3000));
					    //.on("end", update_scenario, 3000);


			//d3.interval(function(){
			//    update_scenario();  
			//}, 3000);

			//d3.select(idname).selectAll('g').transition().on(endAll, update_scenario());

			function endAll(transition, callback) {
				  var n = 0
				  transition.each(() => ++n)
				    .each('end', () => (!--n && callback.apply(this, arguments)))
				}


				d3.interval(function(){

					prediction_scenario_id+=1;
					
				    //d3.select('#scenario_toolbar')
				    //.selectAll('.button')
				    //.on('click', function () {
				      console.log("Click handler");
				      // Remove active class from all buttons
				      d3.select('#scenario_toolbar').selectAll('.button').classed('active', false);
				      // Find the button just clicked
				      var button = d3.select("#scenario"+prediction_scenario_id);

				      // Set it as the active button
				      button.classed('active', true);

				      // Get the id of the button
				      var buttonId = button.attr('id');

				      // Toggle the bubble chart based on
				      // the currently clicked button.
				      //myBubbleChart.toggleDisplay(buttonId);
				    //});

				    update_scenario(prediction_scenario_id);

				    if (prediction_scenario_id==3){
						prediction_scenario_id = 0;
					}


				},3000);



		}





		function update_prediction_scenario() {
			prediction_scenario_id=2;

			data = prediction_data.filter(function(d,i){
				return ((+d.scenario==prediction_scenario_id) && (i%3==0));
			});
			if (prediction_scenario_id==3){
				prediction_scenario_id = 0;
			}

			//console.log(data);

			var stackedData = d3.stack()
				.keys(subgroups)
				(data)

			d3.select(idname)
				.selectAll(".prediction_model_rect")
				.transition()
					.duration(1000)
					.attr("x", function(d) {
						console.log(d.data);
						return x(d.data.group);
					})
				    .attr("y", function(d) { return y(d[1]); })
				    .attr("width", x.bandwidth()*2)
				    .attr("height", function(d) { return y(d[0]) - y(d[1]); });
		}

		//d3.interval(function(){
		//    update_prediction_scenario();  
		//}, 3000);

		//update_prediction_scenario();

	});
}






