(function() {
	// using d3 for convenience
	var container = d3.select('#scroll1');
	var graphic = container.select('.scroll__graphic1');
	var text = container.select('.scroll__text1');
	var step = text.selectAll('.step1');
	// initialize the scrollama
	var scroller = scrollama();
	// generic window resize listener event
	function handleResize() {
		// 1. update height of step elements
		var stepHeight = Math.floor(window.innerHeight * 0.75);
		step.style('height', stepHeight + 'px');
		// 2. update width/height of graphic element
		var bodyWidth = d3.select('body').node().offsetWidth;
		var graphicMargin = 16 * 4;
		var textWidth = text.node().offsetWidth;

		containerWidth = container.node().offsetWidth;
		if (containerWidth > 770) {
			var graphicWidth = containerWidth - textWidth - graphicMargin;
		} else {
			var graphicWidth = containerWidth - graphicMargin;
		}
		var graphicHeight = Math.floor(window.innerHeight * 0.95);
		var graphicMarginTop = Math.floor(graphicHeight / 2);
		graphic
			.style('width', graphicWidth + 'px')
			.style('height', graphicHeight + 'px');
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
	function handleStepProgress(response) {
		//console.log(response);
		var el = d3.select(response.element);
		
		var val = el.attr('data-step');
		var rgba = 'rgba(' + val + ', ' + response.progress + ')';
		el.style('background-color', rgba);
		el.select('.progress').text(d3.format('.1%')(response.progress));

		handleProgressTransition(val, response.progress);
	}
	function handleStepTransition(data_step_id) {
		var width_scale_factor = 1.0;
		var height_scale_factor = 1.0;
		var margin = {right:10, left:10, top:10, bottom:20};

		idname = "#circle_pack";
		d3.select(idname).select("svg").remove();
        remove_circle_legend();

		var bb = d3.select(idname).node().offsetWidth;
		base_width = bb*width_scale_factor - margin.left - margin.right;
		base_height = bb*height_scale_factor - margin.top - margin.bottom;

		var fill_color = "#a2d0ff";
		var stroke_color = "#0481ff";
		var init_opacity = 1.0;
		//var color_types = ["#F1E0D6", "#BF988F"]; //["#4363d8", "#f58231"]; //d3.scaleSequential(d3.interpolateBlues).domain([50,250]);
		//var color_types = [twitter_logo_blue, water_blue];
		var color_types = [circle_blue, circle_purple];
		
		if (data_step_id==1) {
			div = document.getElementById("blank_title");
			div.innerHTML = "</br></br></br></br>";
			//file = "data/circle_pack_followers.csv";
			file = "data/circle_pack_followers.csv";
			draw_circles_pack(idname, file, base_width, base_height, 0, color_types);
			add_circle_legend();

		} else if (data_step_id==2) {
			div = document.getElementById("blank_title");
			div.innerHTML = "</br></br></br></br>";
			//file = "data/circle_pack_followers.csv";
			file = "data/circle_pack_friends.csv";
			draw_circles_pack(idname, file, base_width, base_height, 1, color_types);
			add_circle_legend();
			
		} else if (data_step_id==3) {
			div = document.getElementById("blank_title");
			div.innerHTML = "</br></br></br></br>";
			//file = "data/circle_pack_followers.csv";
			file = "data/circle_pack_status.csv";
			draw_circles_pack(idname, file, base_width, base_height, 2, color_types);
			add_circle_legend();
			
		} else if (data_step_id==4) {
			div = document.getElementById("blank_title");
			div.innerHTML = "</br></br></br></br>";
			//file = "data/circle_pack_followers.csv";
			file = "data/circle_pack_favourites.csv";
			draw_circles_pack(idname, file, base_width, base_height, 3, color_types);
			add_circle_legend();

		}
	}
	function handleProgressTransition(data_step_id, progress) {

		if (data_step_id==1) {
		} else if (data_step_id == 2) {
		} else if (data_step_id == 3) {
		} else if ((data_step_id >= 7) && (data_step_id <= 10)) {
		} else if (data_step_id == 13) {
		}

	}
	function init() {
		// 1. force a resize on load to ensure proper dimensions are sent to scrollama
		handleResize();
		// 2. setup the scroller passing options
		// this will also initialize trigger observations
		// 3. bind scrollama event handlers (this can be chained like below)
		scroller.setup({
			container: '#scroll1',
			graphic: '.scroll__graphic1',
			text: '.scroll__text1',
			step: '.scroll__text1 .step1',
			progress: 'true',
			debug: false,
			offset: 0.80,
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
})();