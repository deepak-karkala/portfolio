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
		var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
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
		if (data_step_id==1) {
			div = document.getElementById("blank_title");
			div.innerHTML = "</br></br></br></br>";

			var width_scale_factor = 1.0;
			var height_scale_factor = 0.80;
			var margin = {right:10, left:10, top:10, bottom:10};

			idname = "#circle_pack_water";
			d3.select(idname).select("svg").remove();

			var bb = d3.select(idname).node().offsetWidth;
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = bb*height_scale_factor - margin.top - margin.bottom;
			file = "data/water_circle_pack.csv";
			var fill_color = "#a2d0ff";
			var stroke_color = "#0481ff";
			var init_opacity = 1.0;
			draw_circles_pack(idname, file, base_width, base_height, fill_color, stroke_color, water_radius_factor, init_opacity);

		} else if (data_step_id==6) {

			var width_scale_factor = 1.0;
			var height_scale_factor = 1.0;
			var margin = {right:10, left:10, top:10, bottom:10};
			idname = "#circle_pack_population";
			d3.select(idname).select("svg").remove();
			
			var bb = d3.select(idname).node().offsetWidth;
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = bb*height_scale_factor - margin.top - margin.bottom;
			file = "data/population_circle_pack.csv";
			var fill_color = "#a2d0ff";
			var stroke_color = "#0481ff";
			var init_opacity = 0;
			draw_circles_pack(idname, file, base_width, base_height, fill_color, stroke_color, population_radius_factor, init_opacity);

		}
	}
	function handleProgressTransition(data_step_id, progress) {

		if (data_step_id==1) {


		} else if (data_step_id == 2) {
			if (1) {
				let water_opacity = Math.max(0.20, 1.0-progress);

				d3.select("#circle_pack_water").selectAll("circle")
					.attr("opacity", function(d,i) {
						if (d.type=="sea") {
							return water_opacity;
						} else{
							return 1;
						}
					});
			}

		} else if (data_step_id == 3) {
			if (1) { 
				water_opacity = Math.max(0.60, 1.0-progress);

				d3.select("#circle_pack_water").selectAll("circle")
					.attr("opacity", function(d,i) {
						if (d.type=="fresh_nonaccessible") {
							return water_opacity;
						} else if (d.type=="fresh_accessible") {
							return 1;
						} else if (d.type=="sea") {
							return 0.20;
						}
					});
			}
			prev_progress_water_opacity = progress;
		} else if ((data_step_id >= 7) && (data_step_id <= 10)) {

			year_values = [-8000, -6500, -5000, -4000, -3000, -2000, -1000,  -500,     1,
		1000,  1500,  1600,  1700,  1750,  1800,  1850,  1900,  1950,
		1955,  1960,  1965,  1970,  1975,  1980,  1985,  1990,  1995,
		2000,  2005,  2010,  2015,  2020,  2025,  2030,  2035,  2040,
		2045,  2050,  2055,  2060,  2065,  2070,  2075,  2080,  2085,
		2090,  2095,  2100];

			year_range = d3.scaleLinear().domain([7.083333333333333,
 7.166666666666667,
 7.25,
 7.333333333333333,
 7.416666666666667,
 7.5,
 7.583333333333333,
 7.666666666666667,
 7.75,
 7.833333333333333,
 7.916666666666667,
 8.0,
 8.083333333333334,
 8.166666666666666,
 8.25,
 8.333333333333334,
 8.416666666666666,
 8.5,
 8.583333333333334,
 8.666666666666666,
 8.75,
 8.833333333333334,
 8.916666666666666,
 9.0,
 9.083333333333334,
 9.166666666666666,
 9.25,
 9.333333333333334,
 9.416666666666666,
 9.5,
 9.583333333333334,
 9.666666666666666,
 9.75,
 9.833333333333334,
 9.916666666666666,
 10.0,
 10.083333333333334,
 10.166666666666666,
 10.25,
 10.333333333333334,
 10.416666666666666,
 10.5,
 10.583333333333334,
 10.666666666666666,
 10.75,
 10.833333333333334,
 10.916666666666666,
 11.0]).range(year_values);

			population_values = [    1,     1,     1,     3,    10,    23,    46,    96,   196,
		 396,   454,   576,   678,   787,   996,  1258,  1646,  2521,
		2754,  3014,  3318,  3678,  4057,  4436,  4849,  5306,  5731,
		6123,  6516,  6926,  7345,  7713,  8079,  8421,  8739,  9035,
		9304,  9547,  9762,  9953, 10123, 10273, 10405, 10520, 10622,
	   10713, 10790, 10850];

			population_range = d3.scaleLinear().domain(year_values).range(population_values);

			div = document.getElementById("year_title");
			current_year = Math.floor(year_range(parseInt(data_step_id)+parseFloat(progress)));
			//current_population = population_values[year_values.indexOf(current_year)];
			current_population = Math.floor(population_range(current_year));

			if (current_population<1000) {
				population_text = current_population + " Million";
			} else {
				population_text = current_population/1000 + " Billion";
			}

			if (current_year<=0) {
				year_text = "<span class='red_text'>" + Math.abs(current_year) + " BC</span>" + "<br/>Population: : <span class='red_text'>" + population_text + "</span>";
			} else {
				year_text = "<span class='red_text'>" + current_year + "</span><br/>Population: <span class='red_text'>" + population_text + "</span>";
			}
			div.innerHTML = "Year: " + year_text;

			d3.select("#circle_pack_population").selectAll("circle")
				//.transition()
				.attr("opacity", function(d,i) {
					if (d.type <= current_year) {
						return 1;
					} else {
						return 0;
					}
				});
		} else if (data_step_id == 13) {
			idname = "#circle_pack_water";
            d3.select(idname).select("svg").remove();
            idname = "#circle_pack_population";
            d3.select(idname).select("svg").remove();
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