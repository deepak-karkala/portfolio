//https://bl.ocks.org/piwodlaiwo/90777c94b0cd9b6543d9dfb8b5aefeef
//svg
	//    .call(zoom)
	//    .call(zoom.event);

	/* Zoom */
	var zoom = d3.zoom()
	    //.translate([width / 2, height / 2])
	    //.scale(scale0)
	    .scaleExtent([scale0, 8 * scale0])
	    .on("zoom", zoomed);
function clicked(d) {
		if (active.node() === this) return reset();
		active.classed("active", false);
		active = d3.select(this).classed("active", true);

		var bounds = path.bounds(d),
		  dx = bounds[1][0] - bounds[0][0],
		  dy = bounds[1][1] - bounds[0][1],
		  x = (bounds[0][0] + bounds[1][0]) / 2,
		  y = (bounds[0][1] + bounds[1][1]) / 2,
		  scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
		  translate = [width / 2 - scale * x, height / 2 - scale * y];

		svg.transition()
		  .duration(750)
		  // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
		  .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
	}


	function reset() {
	  active.classed("active", false);
	  active = d3.select(null);

	  svg.transition()
	      .duration(750)
	      // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
	      .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
	}


    function zoomed() {

    	g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  		// g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
  		g.attr("transform", d3.event.transform); // updated for d3 v4

  		/*
    	svg.transition()
	      	.duration(750)
    	  	//.call(zoom.translate(translate).scale(scale).event); // not in d3 v4
      		.call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
		*/

    	//const currentTransform = d3.event.transform;
        //g.attr("transform", currentTransform);

        /*
		projection
		  .translate(zoom.translate())
		  .scale(zoom.scale());

		g.selectAll("path")
		  .attr("d", path);
		*/
	}


	// Zoom - https://bl.ocks.org/mbostock/eec4a6cda2f573574a11


    // --- Helper functions (for tweening the path)
    // http://bl.ocks.org/erikhazzard/6201948
    var lineTransition = function lineTransition(path) {
        path.transition()
            //NOTE: Change this number (in ms) to make lines draw faster or slower
            .duration(5500)
            .attrTween("stroke-dasharray", tweenDash);
            //.each("end", function(d,i) { 
                ////Uncomment following line to re-transition
                //d3.select(this).call(transition); 
                
                //We might want to do stuff when the line reaches the target,
                //  like start the pulsating or add a new point or tell the
                //  NSA to listen to this guy's phone calls
                //doStuffWhenLineFinishes(d,i);
            //});
    };
    var tweenDash = function tweenDash() {
        //This function is used to animate the dash-array property, which is a
        //  nice hack that gives us animation along some arbitrary path (in this
        //  case, makes it look like a line is being drawn from point A to B)
        var len = this.getTotalLength(),
            interpolate = d3.interpolateString("0," + len, len + "," + len);

        return function(t) { return interpolate(t); };
    };

    /*
				.attr("stroke-dasharray", function(d) {
					totalLength = d3.select(".network_arc_"+d.index).node().getTotalLength();
					return totalLength + " " + totalLength;
				})
                .attr("stroke-dashoffset", function(d) {
					totalLength = d3.select(".network_arc_"+d.index).node().getTotalLength();
                	return totalLength;
                })
                .transition()
                  .duration(3000)
                  .ease(d3.easeLinear)
                  .attr("stroke-dashoffset", 0);
                */
				//.call(lineTransition);

//zoom_to_country_focus();
		function zoom_to_country_focus () {
			console.log(d3.select(".country_focus")["_groups"][0][0]);
			var bounds = path.bounds(d3.select(".country_focus")),
			      dx = bounds[1][0] - bounds[0][0],
			      dy = bounds[1][1] - bounds[0][1],
			      x = (bounds[0][0] + bounds[1][0]) / 2,
			      y = (bounds[0][1] + bounds[1][1]) / 2,
			      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
			      translate = [width / 2 - scale * x, height / 2 - scale * y];

			  svg.transition()
			      .duration(750)
			      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
  		}
