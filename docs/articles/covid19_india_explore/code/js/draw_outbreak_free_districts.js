idname = "#outbreak_free_districts";
d3.select(idname).select("svg").remove();
filename = "data/outbreak_free_districts.csv";
width_scale_factor = 0.60;
height_scale_factor = 0.60;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:20, left:40, top:10, bottom:60};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_outbreak_free_districts(idname, filename, base_width, base_height);


function draw_outbreak_free_districts(idname, file, width, height) {

	var per_outbreak_free_population;
	var per_outbreak_free_districts;

	var color_scale = function(d) {
		if (d==1) {
			console.log("Zero");
			return "#32cd32";
		} else {
			if (d<=10) {
				return "#ffbf00";
			} else {
				return "#FA8072";
			}
		}
	}

	var svg3 = d3.select(idname).append("svg")
		.attr("width", width)
		.attr("height", height),
		/*
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
		*/
	width = +svg3.attr("width"),
	height = +svg3.attr("height");

	var format = d3.format(",d");

	var pack = d3.pack()
	  .size([width, height])
	  .padding(1.5);

	d3.csv(file, function(d) {
		d.value = +d.value;
		per_outbreak_free_population = +d.per_outbreak_free_population;
		per_outbreak_free_districts = +d.per_outbreak_free_districts;
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
		        d.value = d.data.value;
		        d.district = d.data.district;
		      }
		    });

		leaves = pack(root).leaves();

		var node = svg3.selectAll(".node")
			.data(pack(root).leaves())
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


		var tooltip = d3.select("body")
		    .append("div")
		    .attr("class", "tooltip_outbreak_free_districts")
		    .style("position", "absolute")
		    .style("z-index", "10")
		    .style("visibility", "hidden");


		var circles1 = node.append("circle")
		    .attr("id", function(d) { return d.id; })
		    .attr("r", function(d) { return d.r; })
		    .text(function(d) { return d.value; })
		    .style("fill", function(d) {
		        return color_scale(d.value);
		    })
		    .on("mouseover", function(d){
		      //return tooltip.text(d.city).style("visibility", "visible");
		      d3.select(this).style('stroke', 'black').style("stroke-width", 2).style("stroke-opacity", 1.0);
		        return tooltip.html("<b>"+d.district+"</b>" + "<br/><span class='case_count_info'>"  + Math.round(d.value-1) + "</span> total cases" + "<br/>").style("visibility", "visible");
		    })
		    .on("mousemove", function(){
		      return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
		    })
		    .on("mouseout", function(){
		      d3.select(this).style('stroke', 'black').style("stroke-opacity", 0);
		      return tooltip.style("visibility", "hidden");
		    })
		    .attr("opacity", 0)
		    .transition()
		      .duration(1000)
		      .attr("opacity", 1);

		node.append("clipPath")
		    .attr("id", function(d) { return "clip-" + d.id; })
		  .append("use")
		    .attr("xlink:href", function(d) { return "#" + d.id; });

		/*
		node.append("text")
		    .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
		  .selectAll("tspan")
		  	.data(function(d) {
		    	var dsplit = d.class.split(/(?=[A-Z][^A-Z]) /g);
		     	if(dsplit[0]=="Paris" || dsplit[0]=="London" || dsplit[0]=="Sydney" || dsplit[0]=="Rome" || dsplit[0]=="Berlin")
		        	return dsplit;
		      
		  })
		  .enter().append("tspan")
		    .attr("x", listings_type===0 ? -15: -20)
		    .attr("y", 0) 
		    .text(function(d) { return d; })
		    .style("font-size", 7*width/200+"px");
		*/

		// Update key takeaway
		var id = document.getElementById("takeaway_container_outbreak_free_districts");
		id.innerHTML = `<span class="takeaway_title">Key takeaways</span>: `+
			+per_outbreak_free_districts+`% of India's districts having `+per_outbreak_free_population+`% of India's population are still free of the virus.`+
			` Tracking the number of virus free districts will be key in coming weeks since `+
			`letting the pandemic spread to India's hinterland will turn this crisis into an `+ 
			`outright catastrophe.`;

	});

	

}