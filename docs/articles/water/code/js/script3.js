(function() {
	// using d3 for convenience
	var container = d3.select('#scroll3');
	var graphic = container.select('.scroll__graphic3');
	var text = container.select('.scroll__text3');
	var step = text.selectAll('.step3');
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
	function handleStepProgress(response) {
		//console.log(response);
		var el = d3.select(response.element);
		
		var val = el.attr('data-step');
		var rgba = 'rgba(' + val + ', ' + response.progress + ')';
		el.style('background-color', rgba);
		el.select('.progress').text(d3.format('.1%')(response.progress));

	}
	function handleStepTransition(data_step_id) {
		if (data_step_id==1) {
			idname = "#population_matrix";
			d3.select(idname).select("svg").remove();
			div = document.getElementById("data_source2");
            div.innerHTML = "";

		} else if (data_step_id==2) {
			var width_scale_factor = 0.80;
			var height_scale_factor = 1.20;
			var margin = {right:10, left:10, top:100, bottom:10};

			idname = "#country_water_scarcity";
			var bb = d3.select(idname).node().offsetWidth;

			//base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			base_width = viewport_width*width_scale_factor - margin.left - margin.right;
			var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			base_height = viewport_height*height_scale_factor - margin.top - margin.bottom;
			file = "data/water_scarcity_score.csv";

			d3.select(idname).select("svg").remove();
			plot_country_water_scarcity(idname, file, base_width, base_height);
			//plot_country_water_scarcity_mapbox("country_water_scarcity");

		} else if (data_step_id==2) {

		}
		if (data_step_id > 1) {
			div = document.getElementById("data_source3");
			div.innerHTML = '<a href="https://www.wri.org/blog/2015/08/ranking-world-s-most-water-stressed-countries-2040"><span class="data_source_link">Ranking the World’s Most Water-Stressed Countries in 2040</span></a>';
		}
	}

	function init() {
		// 1. force a resize on load to ensure proper dimensions are sent to scrollama
		handleResize();
		// 2. setup the scroller passing options
		// this will also initialize trigger observations
		// 3. bind scrollama event handlers (this can be chained like below)
		scroller.setup({
			container: '#scroll3',
			graphic: '.scroll__graphic3',
			text: '.scroll__text3',
			step: '.scroll__text3 .step3',
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