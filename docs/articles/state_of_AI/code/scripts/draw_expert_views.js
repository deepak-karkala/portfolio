var width_scale_factor = 0.90;
var margin = {right:40, left:50, top:30, bottom:25};

var bb = d3.select('#expert_views').node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
if (window.innerWidth >= 768) {
	var height_scale_factor = 0.6;
	radius = "0.6rem";
	expert_name_font_size = "0.8rem";
} else if(window.innerWidth <= 350) {
	var height_scale_factor = 0.75;
	radius = "0.25rem";
	expert_name_font_size = "0.5rem";
} else {
	var height_scale_factor = 0.75;
	radius = "0.4rem";
	expert_name_font_size = "0.5rem";
}
base_height = bb*height_scale_factor - margin.top - margin.bottom;
// Plot expert views
plot_expert_views("#expert_views", "images/fig18/expert_views.csv", base_width, base_height);


function plot_expert_views(id, file, width, height) {

	var x = d3.scaleLinear()
    	  .range([0, width]);
  	var y = d3.scaleLinear()
    	  .range([height, 0]);

   	var xAxis = d3.axisBottom(x);
   	var yAxis = d3.axisLeft(y);

   	var svg = d3.select(id).append("svg")
      		.attr("width", width + margin.left + margin.right)
      		.attr("height", height + margin.top + margin.bottom)
    	.append("g")
      		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var colorScale = d3.scaleSequential(d3.interpolateYlOrRd);

    // Tooltip
  	var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip1")
        /*.style("position", "absolute")*/
        //.style("z-index", "10")
        .style("visibility", "hidden");


  	// Expert bubbles
  	d3.csv(file, function(error, data) {
  	 	if (error) throw error;

	    data.forEach(function(d) {
	   		d.promising = +d.promising;
	    	d.dangerous = +d.dangerous;
	    	d.name = d.name;
	    });

	    x.domain([0, 10]);
	    y.domain([0, 10]);

	    
	    // x-axis
		svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .style("font-size", "0.65rem")
	        .call(xAxis)
	      .append("text")
	        .attr("class", "label")
	        .attr("x", width)
	        .attr("y", -6)
	        .style("text-anchor", "end")
	        .text("Dangerous")
	        .attr("fill", "white")
	        .style("font-size", "0.75rem");

	    // y-axis
	    svg.append("g")
	        .attr("class", "y axis")
	        .style("font-size", "0.65rem")
	        .call(yAxis)
	      .append("text")
	        .attr("class", "label")
	        .attr("transform", "rotate(-90)")
	        .attr("y", -45)
	        .attr("dy", ".71em")
	        .style("text-anchor", "end")
	        .text("Promising")
	        .attr("fill", "white")
	        .style("font-size", "0.75rem");

		svg.selectAll(".dot")
	        .data(data)
	      .enter().append("circle")
	        .attr("class", "dot")
	        .attr("r", function(d) { return radius; })
	        .attr("cx", function(d) { return x(d.dangerous); })
	        .attr("cy", function(d) { return y(d.promising); })
	        .style("fill", function(d) { return "orange" })
	        /*
	        .style("fill", function(d) { 
	        	console.log(d);
	        	return colorScale(d.dangerous*0.75/10);
	        })
	        */
	        .style("stroke", "white")
	        .style("stroke-width", "1.0px")
	        .style("opacity", 1.0)
	        .style("z-index", "10")
	        .on("mouseover", function(d){
	          //return tooltip.text(d.city).style("visibility", "visible");
	          d3.select(this).style('stroke', 'white').style("opacity", 1.0).style("stroke-width", 3).style("stroke-opacity", 1.0);
	          return tooltip.html(
	          	'<div class="row flex-container">' +
	          		'<div class="col-lg-12 col-12">' +
			          	'<div class="row mx-auto text-center">' +
			          		'<div class="col-lg-4 col-4 profile_image">' + 
			          			'<img src="images/fig18/profile_pics/' + d.name + '.jpg">' +
			          		'</div>' +
			          		'<div class="col-lg-8 col-8">' + 
			          			'<div class="row">' +
			          				'<div class="col-lg-12 col-12 profile_name">' + d.name +
			          				'</div>' +
			          			'</div>' +
			          			'<div class="row">' +
			          				'<div class="col-lg-12 col-12 profile_position">' + d.position +
			          				'</div>' +
			          			'</div>' +
			          		'</div>' +
			          	'</div>' +
			          	'<hr/>' +
			          	'<div class="row profile_view_row">' +
			          		'<div class="col-lg-12 col-12 profile_view">' +
			          			'<blockquote>' + d.view +
			          			'</blockquote>' +
			          		'</div>' +
			          	'</div>' + 
			          	'<hr/>' +
			          	'<div class="row profile_source">' +
			          		'<div class="col-lg-4 col-4">' + d.date +
			          		'</div>' +
			          		'<div class="col-lg-8 col-8"><a href="'+ d.link +'">' + d.media + '</a>' +
			          		'</div>' +
			          	'</div>' +
			        '</div>' +
			    '</div>'
	          	)
	          .style("visibility", "visible");
	        })
	        .on("mousemove", function(){
		      if (event.pageX >= window.innerWidth/2) {
	            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-230)+"px");
	          } else {
	            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-100)+"px");
	          }
	          //return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
	        })
	        .on("mouseout", function(){
	          d3.select(this).style('stroke', 'white').style("opacity", 1.0).style("stroke-width", 1).style("stroke-opacity", 1.0);
	          return tooltip.style("visibility", "hidden");
	        });
	        /*
	      .append("svg:image")
      		.attr("xlink:href", "https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/ce2ece60-9b32-11e6-95ab-00163ed833e7/260663710/the-test-fun-for-friends-screenshot.jpg")
      		.attr("x", function(d) { return x(d.dangerous);})
	        .attr("y", function(d) { return y(d.promising);})
	        .attr("height", 50)
	        .attr("width", 50);
*/
		svg.selectAll(".text")
	        .data(data)
	      .enter().append("text")
	        .attr("x", function(d) { return x(d.dangerous+0.15); })
	        .attr("y", function(d) { return y(d.promising+0.1); })
	        .text(function(d) { return d.name;})
	        .style("fill", "white")
	        .style("font-size", expert_name_font_size);

		svg.selectAll("path")
	        .style("stroke", "white");

	    svg.selectAll("line")
	        .style("stroke", "white");

	    svg.selectAll("tick")
	        .style("fill", "white");

	    svg.selectAll("text")
	        .style("fill", "white")
	        .style("shape-rendering", "crispEdges");
	   
	});
}



