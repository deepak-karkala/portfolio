// District wise growth rate
idname = "#state_streamgraph"
d3.select(idname).select("svg").remove();
filename = "data/state_streamgraph_data.csv";
//type = "cases";
width_scale_factor = 0.95;
height_scale_factor = 0.60;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:80, left:30, top:20, bottom:60};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
plot_state_streamgraph(idname, filename, base_width, base_height);



function plot_state_streamgraph(idname, filename, width, height) {
	//https://www.d3-graph-gallery.com/graph/streamgraph_basic.html
	//http://bl.ocks.org/WillTurman/4631136
	//https://bl.ocks.org/HarryStevens/c893c7b441298b36f4568bc09df71a1e
	var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_state_streamgraph")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    var state_streamgraph_bg_color = "#c0c0c0";
    var state_streamgraph_colors_list = []
    state_streamgraph_colors_list["MH"] = "#F8C471";
    state_streamgraph_colors_list["DL"] = "#76D7C4";
    state_streamgraph_colors_list["MP"] = "#ffe119";
    state_streamgraph_colors_list["GJ"] = "#F1948A";
    state_streamgraph_colors_list["RJ"] = "#2ECC71";
    state_streamgraph_colors_list["TN"] = "#4363d8";
    state_streamgraph_colors_list["AP"] = "#C39BD3";
    state_streamgraph_colors_list["UP"] = "#fabebe";
    state_streamgraph_colors_list["KA"] = "#ffd8b1";
    state_streamgraph_colors_list["KL"] = "#fffac8";
    state_streamgraph_colors_list["TG"] = "#e6beff";
    state_streamgraph_colors_list["WB"] = "#85C1E9";


   	var svg = d3.select(idname).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
	    .range([ 0, width ]);

	// parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

	var y = d3.scaleLinear()
	    .domain([-1000, 1000])
	    .range([ height, 0 ]);

    d3.csv(filename, function(error, data) {
		if (error) throw error;

		// List of groups = header of the csv files
		var keys = data.columns.slice(1);

		data.forEach(function(d,i) {
			d.date = parseTime(d.date);
		});
	    x.domain(d3.extent(data, function(d) { return d.date; }))
  		//x.domain(data.map(function(d) {
			//console.log(d.date);
		//	return d.date;
		//}));

	  //stack the data?
	  var stackedData = d3.stack()
	    .offset(d3.stackOffsetSilhouette)
	    .keys(keys)
	    (data)

	  // Show the areas
	  svg
	    .selectAll("layers")
	    .data(stackedData)
	    .enter()
	    .append("path")
	      .attr("class", function(d) { return "layers layers_"+d.key })
	      .style("fill", function(d) {
	      	if (d.key in state_streamgraph_colors_list) {
		      	return state_streamgraph_colors_list[d.key];
		    } else {
		    	return state_streamgraph_bg_color;
		    }
	      })
	      .attr("d", d3.area()
	        .x(function(d, i) { return x(d.data.date); })
	        .y0(function(d) { return y(d[0]); })
	        .y1(function(d) { return y(d[1]); })
	    )
	    .on("mouseover", function(d, i) {
	      //console.log(this.getAttribute("class").split("layers_")[1]);
	      svg.selectAll(".layers").transition()
	        .duration(250)
	        .attr("opacity", function(d, j) {
	          return j != i ? 0.6 : 1;
	          });
	    })
	    .on("mousemove", function(d, i){
	        mousex = d3.mouse(this);
	        mousex = mousex[0];
	        var invertedx = x.invert(mousex);
	        var date = new Date(invertedx);
	        var month = month_abbrv_list[date.getMonth()];
	        var day = date.getDate();

	        var count = 0;
	        for (var j=0; j<d.length; j++) {
	        	dt = d[j].data["date"]
	            if ((dt.getMonth()==date.getMonth())  && (dt.getDate()==date.getDate())) {
	              count = +d[j].data[d.key];
	            }
	        }

			console.log(date);

	        /*
	        d3.select(this)
	          .classed("hover", true)
	          .attr("stroke", strokecolor)
	          .attr("stroke-width", "0.5px");
			*/

	        return tooltip.html(`<div class='well'>`+
	                          `<span class="state_name_streamgraph text-center">`+state_code_name_mapping[d.key]+`</span></br>` +
	                        month +` ` +day+`: ` +`<span class="case_count_info">`+count +` cases</span></div>` )
	                        .style("top", (event.pageY-10)+"px")
	                        .style("left",(event.pageX+10)+"px")
	                        .style("visibility", "visible");
	        
	    })
	    .on("mouseout", function(d,i) {
	      svg.selectAll(".layers")
	        .transition()
	        .duration(250)
	        .attr("opacity", "1");
	      
	      d3.select(this)
	        .classed("hover", false)
	        .attr("stroke-width", "0px");

	      return tooltip.style("visibility", "hidden");
	    });

	    var xAxis = d3.axisBottom()
                    .scale(x)
                    .tickFormat(d3.timeFormat("%B %e"));
                    //.tickValues(x.domain().filter(function(d,i){ return !(i%1)}));

		// Add X axis
    	svg.append("g")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis);
		
		// Add Y axis
		//svg.append("g")
    	//	.call(d3.axisLeft(y).tickValues([]));


	});


}