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
		var stepHeight = Math.floor(window.innerHeight * 0.25);
		step.style('height', stepHeight + 'px');
		// 2. update width/height of graphic element
		var bodyWidth = d3.select('body').node().offsetWidth;
		var graphicMargin = 16 * 4;
		var textWidth = text.node().offsetWidth;
		var graphicWidth = container.node().offsetWidth; // - textWidth - graphicMargin;
		var graphicHeight = Math.floor(window.innerHeight * 0.5);
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

		title_idname = "scroll1_chart_title";
		title_id = document.getElementById(title_idname);
		title_id.innerHTML = ``;

		//chart_idname = "scroll1_chart";
		//chart_id = document.getElementById(chart_idname);
		//chart_id.innerHTML = ``;
		// Hide layers //
		if (data_step_id >= 13) {
			for (var i=0; i<outbreak_spread_timeouts.length; i++) {
		 		clearTimeout(outbreak_spread_timeouts[i]);
			}
		}
		if (data_step_id >= 15) {
			idname = "#scroll1_chart";
			hide_scroll_map(idname);
		}
		if (data_step_id >= 20) {
			hide_state_testing_plot_circles(idname);
		}
		if (data_step_id >= 23) {
			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
		}

		if (data_step_id >= 30) {
			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();

			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;
		}

		if (container.node().offsetWidth>=768) {
			if (data_step_id >= 12) {
				var textWidth = text.node().offsetWidth;
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('left', '40%');
			} else {
				var graphicWidth = container.node().offsetWidth;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px');
			}

			if (data_step_id >= 15) {
				var textWidth = text.node().offsetWidth;
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('left', '40%')
					.style('top', '10%');
			}

			if (data_step_id >= 23) {
				var textWidth = text.node().offsetWidth;
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('left', '35%')
					.style('top', '20%');
			}

			if (data_step_id >= 30) {
				var textWidth = text.node().offsetWidth;
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('left', '40%')
					.style('top', '5%');
			}
		}


		if (data_step_id==5) {
			
			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			filename = "data/scroll/scroll_data.csv";
			width_scale_factor = 1;
			//height_scale_factor = 0.25;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:0, left:0, top:0, bottom:30};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = Math.floor(window.innerHeight * 1); //bb*height_scale_factor - margin.top - margin.bottom;
			load_data(idname, filename, base_width, base_height, margin);

			//scroll_script1(idname, filename, base_width, base_height);
			//var title_id = document.getElementById("scroll1_chart_title");
			//title_id.innerHTML = `Each dot is a confirmed case of India`;

		}  else if (data_step_id==7) {
			
			var opacity = 0;
			hide_existing_cases(idname, opacity);

		}  else if (data_step_id==8) {

			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			filename = "data/cluster_network_map.csv";
			width_scale_factor = 0.90;
			height_scale_factor = 0.40;
			var bb = d3.select(idname).node().offsetWidth;
			//var margin = {right:20, left:40, top:10, bottom:60};
			var margin = {right:0, left:0, top:0, bottom:30};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			base_height = Math.floor(window.innerHeight * 0.90); 
			//draw_cluster_map(idname, filename, base_width, base_height);

		} else if (data_step_id==9) {

			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;

			d3.select(idname).select("svg").remove();
			var opacity = 1;
			idname = "#scroll1_chart";
			width_scale_factor = 1;
			//height_scale_factor = 0.3;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:0, left:0, top:0, bottom:30};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = Math.floor(window.innerHeight * 1);
			show_individual_cases(idname, base_width, base_height, margin, opacity);

		} else if (data_step_id==10) {
			
			color_case_by_status(idname);

		} else if (data_step_id==11) {
			idname = "#scroll1_chart";
			width_scale_factor = 1;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:0, left:0, top:0, bottom:30};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = Math.floor(window.innerHeight * 0.70); 
			var margin = {right:0, left:0, top:0, bottom:30};
			plot_over_time(idname, base_width, base_height, margin);

		} else if (data_step_id==12) {

			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			filename = "data/scroll/scroll_data.csv";
			width_scale_factor = 0.90;
			//height_scale_factor = 0.50;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:20, top:0, bottom:20};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			base_height = Math.floor(window.innerHeight * 1); 
			draw_scroll_outbreak_spread_map(idname, filename, base_width, base_height, margin);

		} else if (data_step_id==13) {
			district_to_state_transition(idname);

		} else if (data_step_id==14) {
			idname = "#scroll1_chart";
			width_scale_factor = 0.9;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:20, top:0, bottom:20};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = Math.floor(window.innerHeight * 1); 
			filename = "data/scroll/scroll_state_data.csv";
			state_circles_to_state_center(idname, filename, base_width, base_height);
		
		} else if (data_step_id==15) {

			idname = "#scroll1_chart";
			width_scale_factor = 0.9;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:20, top:20, bottom:20};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = Math.floor(window.innerHeight * 0.6);
			sort_state_circles_by_test_count(idname, base_width, base_height, margin);
			//sort_state_circles_by_test_count_forcecollide(idname, base_width, base_height);
		
		} else if (data_step_id==16) {

			idname = "#scroll1_chart";
			width_scale_factor = 0.9;
			//height_scale_factor = 0.60;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:20, top:20, bottom:20};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			base_height = Math.floor(window.innerHeight * 0.6);
			plot_state_testspm_vs_casespm(idname, base_width, base_height);
		
			//var title_id = document.getElementById("scroll1_chart_title");
			//title_id.innerHTML = `Tests per million vs Cases per million`;

		} else if (data_step_id==17) {

			draw_state_testing_group_rect();

		} else if (data_step_id==18) {

			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			filename = "data/scroll/state_case_death_testpm_ntod.csv";
			width_scale_factor = 0.9;
			//height_scale_factor = 0.60;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:30, top:20, bottom:40};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			base_height = Math.floor(window.innerHeight * 0.6);
			draw_scroll_state_ntod_animate(idname, filename, base_width, base_height, margin);

		} else if (data_step_id==19) {
			d3.select(idname).select("svg").remove();

		} else if (data_step_id==20) {

			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			width_scale_factor = 0.75;
			//height_scale_factor = 0.60;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:70, top:20, bottom:50};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			base_height = Math.floor(window.innerHeight * 0.6);
			filename = "data/scroll/country_testing_rate.csv";
			show_countries_testing_low(idname, filename, base_width, base_height, margin);
		
		} else if (data_step_id==21) {

			idname = "#scroll1_chart";
			width_scale_factor = 0.75;
			//height_scale_factor = 0.60;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:70, top:20, bottom:50};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			base_height = Math.floor(window.innerHeight * 0.6);
			show_countries_testing_all(idname, base_width, base_height);
		
		} else if (data_step_id==22) {

			idname = "#scroll1_chart";
			show_countries_test_type_rect(idname);

		} else if (data_step_id==23) {

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();

			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;

		} else if (data_step_id==26) {
		
			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = `<div class="row text-center justify-content-center"><div class="col-lg-10 scenario_title"> Strict Lockdown continued</div></div>`+
					`<div class="row text-center justify-content-center">`+
						`<div class="col-lg-10">Estimated ~<span class="prediction_cases">3,80,000 total cases</span> and ~<span class="prediction_deaths">22,000 total deaths</span></div></div>`;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;
			chart_id.innerHTML = `<div class="row text-center justify-content-center">`+
									`<div class="col-lg-12 prediction_model_img">`+
										`<img src="data/scroll/scenario1.png">`+
									`</div>`+
								`</div>`;

		} else if (data_step_id==27) {
		
			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = `<div class="row text-center justify-content-center"><div class="col-lg-10 scenario_title"> Strict Lockdown continued</div></div>`+
					`<div class="row text-center justify-content-center">`+
						`<div class="col-lg-10">Estimated ~<span class="prediction_cases">5,30,000 total cases</span> and ~<span class="prediction_deaths">30,000 total deaths</span></div></div>`;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;
			chart_id.innerHTML = `<div class="row text-center justify-content-center">`+
									`<div class="col-lg-12 prediction_model_img">`+
										`<img src="data/scroll/scenario2.png">`+
									`</div>`+
								`</div>`;

		} else if (data_step_id==28) {
		
			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = `<div class="row text-center justify-content-center"><div class="col-lg-12 scenario_title">Lockdown lifted but with Social Distancing</div></div>`+
					`<div class="row text-center justify-content-center">`+
						`<div class="col-lg-10">Estimated ~<span class="prediction_cases">9,20,000 total cases</span> and ~<span class="prediction_deaths">43,000 total deaths</span></div></div>`;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;
			chart_id.innerHTML = `<div class="row text-center justify-content-center">`+
									`<div class="col-lg-12 prediction_model_img">`+
										`<img src="data/scroll/scenario3.png">`+
									`</div>`+
								`</div>`;

		} else if (data_step_id==29) {
		
			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;
			chart_id.innerHTML = `<div class="row text-center justify-content-center">`+
									`<div class="col-lg-12 prediction_model_img">`+
										`<img src="data/scroll/prediction_models.gif">`+
									`</div>`+
								`</div>`;

		} else if (data_step_id==31) {


			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			filename = "";
			width_scale_factor = 0.90;
			//height_scale_factor = 0.50;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:20, top:0, bottom:20};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			base_height = Math.floor(window.innerHeight * 1); 
			draw_scroll_outbreak_free_districts(idname, filename, base_width, base_height, margin);


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



/*
		} else if (data_step_id==16) {
			idname = "#scroll1_chart";
			width_scale_factor = 0.60;
			height_scale_factor = 0.60;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:40, top:10, bottom:60};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			base_height = bb*height_scale_factor - margin.top - margin.bottom;
			sort_state_circles_by_case_count(idname, base_width, base_height);
		*/