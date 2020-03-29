(function() {
	// using d3 for convenience
	var container = d3.select('#scroll6');
	var graphic = container.select('.scroll__graphic6');
	var text = container.select('.scroll__text6');
	var step = text.selectAll('.step6');
	// initialize the scrollama
	var scroller = scrollama();
	var prev_progress_zoom_out_circle = 1;
	var min_change_zoom_out_circle = 0.01;
	// generic window resize listener event
	function handleResize() {
		// 1. update height of step elements
		var stepHeight = Math.floor(window.innerHeight * 0.75);
		step.style('height', stepHeight + 'px');
		// 2. update width/height of graphic element
		var bodyWidth = d3.select('body').node().offsetWidth;
		var graphicMargin = 16 * 4;
		var textWidth = text.node().offsetWidth;
		var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
		var graphicHeight = Math.floor(window.innerHeight * 0.95)
		var graphicMarginTop = Math.floor(graphicHeight / 2)
		graphic
			.style('width', graphicWidth + 'px')
			.style('height', graphicHeight + 'px')
		// 3. tell scrollama to update new element dimensions
		scroller.resize();
	}
	// scrollama event handlers
	function handleStepEnter(response) {
		var el = d3.select(response.element);
		var val = el.attr('data-step');
		// response = { element, direction, index }
		// add color to current step only
		step.classed('is-active', function (d, i) {
			return i === response.index;
		});
		// update graphic based on step
		graphic.select('p').text(response.index + 1);
		handleStepTransition(val);
	}
	function handleContainerEnter(response) {
		// response = { direction }
		// old school
		// sticky the graphic
		graphic.classed('is-fixed', true);
		graphic.classed('is-bottom', false);
	}
	function handleContainerExit(response) {
		// response = { direction }
		// old school
		// un-sticky the graphic, and pin to top/bottom of container
		graphic.classed('is-fixed', false);
		graphic.classed('is-bottom', response.direction === 'down');
	}
	
	function handleStepTransition(data_step_id) {
		if (data_step_id==1) {
			plot_zoom_out_circle();
		}
	}

	function handleStepProgress(response) {
		//console.log(response);
		var el = d3.select(response.element);
		
		var val = el.attr('data-step');
		var rgba = 'rgba(' + val + ', ' + response.progress + ')';
		el.style('background-color', rgba);
		el.select('.progress').text(d3.format('.1%')(response.progress));

		handleProgressTransition(val, response.progress);
	}

	function handleProgressTransition(data_step_id, progress) {
		if (data_step_id==1) {
			if (1) { //(Math.abs(data_step_id+progress-prev_progress_zoom_out_circle) >= min_change_zoom_out_circle) {
				update_zoom_out_circle_radius(parseInt(data_step_id) + parseFloat(progress));
				prev_progress_zoom_out_circle = parseInt(data_step_id)+parseFloat(progress);
			}
		} 
	}

	function init() {
		// 1. force a resize on load to ensure proper dimensions are sent to scrollama
		handleResize();
		// 2. setup the scroller passing options
		// this will also initialize trigger observations
		// 3. bind scrollama event handlers (this can be chained like below)
		scroller.setup({
			container: '#scroll6',
			graphic: '.scroll__graphic6',
			text: '.scroll__text6',
			step: '.scroll__text6 .step6',
			progress: 'true',
			debug: false,
			offset: 0.30,
		})
			.onStepEnter(handleStepEnter)
			.onContainerEnter(handleContainerEnter)
			.onContainerExit(handleContainerExit)
			.onStepProgress(handleStepProgress);
		// setup resize event
		window.addEventListener('resize', handleResize);
	}
	// kick things off
	init();

	function update_zoom_out_circle_radius(progress) {
		console.log(progress);
		idname = "#circle_zoom_out";
		var width_scale_factor = 1.0;
		var height_scale_factor = 1.0;
		var margin = {right:10, left:10, top:10, bottom:10};
		var bb = d3.select(idname).node().offsetWidth;
		width = bb*width_scale_factor - margin.left - margin.right;
		height = bb*height_scale_factor - margin.top - margin.bottom;

		zoom_out_circle_radius = d3.scaleLinear().domain([1,1.5]).range([20,width]);
		idname = "#circle_zoom_out";
		d3.select(idname).selectAll("circle")
			.transition()
			.attr("r", zoom_out_circle_radius(progress));
	}

	function plot_zoom_out_circle() {
		var width_scale_factor = 1.0;
		var height_scale_factor = 1.0;
		var margin = {right:10, left:10, top:10, bottom:10};

		idname = "#circle_zoom_out";
		d3.select(idname).select("svg").remove();
		var bb = d3.select(idname).node().offsetWidth;
		width = bb*width_scale_factor - margin.left - margin.right;
		height = bb*height_scale_factor - margin.top - margin.bottom;

		var svg = d3.select(idname).append("svg")
          .attr("width", width)
          .attr("height", height);

        var circle = svg.append("circle")
                        .attr("r", 20)
                        .attr("cx", width/2)
                        .attr("cy", height/2)
                        .style("fill", "black");
	}

})();