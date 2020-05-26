(function() {

	var small_screen_thresh = 768;

	// using d3 for convenience
	var container = d3.select('#scroll1');
	var graphic = container.select('.scroll__graphic1');
	var text = container.select('.scroll__text1');
	var step = text.selectAll('.step1');
	var step_bkg = text.selectAll('.step_bkg');
	// initialize the scrollama
	var scroller = scrollama();
	// generic window resize listener event
	function handleResize() {
		// 1. update height of step elements
		var stepHeight = Math.floor(window.innerHeight * 0.35);
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

		if (data_step_id <= 7) {
			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;
		}

		//if ((data_step_id == 1) || (data_step_id >= 37)) {
		if ((data_step_id == 1) || (data_step_id >= 39)) {
			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;
		}

		if ((data_step_id == 9) || (data_step_id==7)) {
			idname = "#scroll1_chart";
			d3.select(idname).selectAll(".countries").remove();
			d3.select(idname).selectAll(".country_focus").remove();
			d3.select(idname).selectAll(".network_arc").remove();
			d3.select(idname).selectAll(".cluster_map_date_label").remove();
			d3.select(idname).selectAll(".cluster_map_casecount_label").remove();
		}

		if (data_step_id >= 13) {
			//for (var i=0; i<outbreak_spread_timeouts.length; i++) {
		 	//	clearTimeout(outbreak_spread_timeouts[i]);
			//}
			idname = "#scroll1_chart";
			d3.select(idname).selectAll(".outbreak_spread_date_label").remove();
			d3.select(idname).selectAll(".outbreak_spread_map_casecount_label").remove();
			d3.select(idname).selectAll(".outbreak_spread_map_recovercount_label").remove();
			d3.select(idname).selectAll(".outbreak_spread_map_deathcount_label").remove();
		}

		if ((data_step_id<=11) || (data_step_id>=15)) {
			idname = "#scroll1_chart";
			hide_scroll_map(idname);
		}

		if ((data_step_id == 18) || (data_step_id == 19) || (data_step_id == 23) || (data_step_id==33) ) {
			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
		}
		

		//if ((data_step_id == 30) || (data_step_id == 31) || (data_step_id >= 35)) {
		if ((data_step_id == 30) || (data_step_id == 31) || (data_step_id == 33)) {
			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();

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
					.style('top', 0)
					.style('left', '40%');

				if (data_step_id>=33) {
					var stepHeight = Math.floor(window.innerHeight * 0.25);
					text.style('width', '100%')
						.style('max-width', '100rem');
					container.style('background-color', '#000')
							.style('color', '#fff');
					step.style('background-color', '#000')
						//.style('height', stepHeight + 'px')
						.style('text-align', 'center');
				} else {
					var stepHeight = Math.floor(window.innerHeight * 0.35);
					text.style('width', '33%')
						.style('max-width', '30rem');
					container.style('background-color', '#dadada')
							.style('color', '#000');
					step.style('background-color', '#fff')
						.style('height', stepHeight + 'px')
						.style('text-align', 'left');
				}

			} else {
				if (data_step_id == 8) {
					var graphicWidth = container.node().offsetWidth;
					var graphicHeight = Math.floor(window.innerHeight * 0.5);
					var graphicMarginTop = Math.floor(graphicHeight / 2);
					graphic
						.style('width', graphicWidth + 'px')
						.style('height', graphicHeight + 'px')
						.style('left', '15%')
						.style('top', '10%');
				} else if (data_step_id == 9) {
					
					var graphicWidth = container.node().offsetWidth;
					var graphicHeight = Math.floor(window.innerHeight * 0.5);
					var graphicMarginTop = Math.floor(graphicHeight / 2);
					graphic
						.style('width', graphicWidth + 'px')
						.style('height', graphicHeight + 'px')
						.style('top', 0)
						.style('left', 0);
					
				} else if (data_step_id == 11) {
					
					var graphicWidth = container.node().offsetWidth;
					var graphicHeight = Math.floor(window.innerHeight * 0.5);
					var graphicMarginTop = Math.floor(graphicHeight / 2);
					graphic
						.style('width', graphicWidth + 'px')
						.style('height', graphicHeight + 'px')
						.style('top', '15%')
						.style('left', '10%');
					
				} else {
					var graphicWidth = container.node().offsetWidth;
					var graphicHeight = Math.floor(window.innerHeight * 0.5);
					var graphicMarginTop = Math.floor(graphicHeight / 2);
					graphic
						.style('width', graphicWidth + 'px')
						.style('height', graphicHeight + 'px')
						.style('top', 0);
				}
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

			if (data_step_id >= 33) {
				var graphicWidth = container.node().offsetWidth;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('top', 0)
					.style('left', 0);
			}

			if ((data_step_id == 31) || (data_step_id == 32)) {
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('top', '10%')
					.style('left', '40%');
			}

		} else {
			var stepHeight = Math.floor(window.innerHeight * 0.25);
			step.style('height', stepHeight + 'px');

			if (data_step_id <= 10) {
				var textWidth = text.node().offsetWidth;
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth; //- textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 1);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('top', '0');
			} 

			if (data_step_id >= 11) {
				//var stepHeight = Math.floor(window.innerHeight * 0.20);
				//step.style('height', stepHeight + 'px');
				
				var textWidth = text.node().offsetWidth;
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth; //- textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('top', '35%');
			}

			if (data_step_id == 8) {
				//var stepHeight = Math.floor(window.innerHeight * 0.20);
				//step.style('height', stepHeight + 'px');
				
				var textWidth = text.node().offsetWidth;
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth; //- textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('top', '35%');
			}

			if (data_step_id == 9) {
				var textWidth = text.node().offsetWidth;
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth; //- textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('top', '0')
					.style('left', '0');
			}

			if ((data_step_id == 12) || (data_step_id == 13) || (data_step_id == 14)) {
				//var stepHeight = Math.floor(window.innerHeight * 0.20);
				//step.style('height', stepHeight + 'px');
				
				var textWidth = text.node().offsetWidth;
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth; //- textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 0.75);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('top', '25%');
			}

			if ((data_step_id == 20) || (data_step_id == 21) || (data_step_id == 22)) {
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth; //- textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('top', '30%')
					//.style('left', '40px');
			}

			if (data_step_id >= 23) {
				//var stepHeight = Math.floor(window.innerHeight * 0.30);
				//step.style('height', stepHeight + 'px');
				
				var textWidth = text.node().offsetWidth;
				var graphicMargin = 16 * 4;
				var graphicWidth = container.node().offsetWidth; //- textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 0.5);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('top', '40%')
					.style('left', 0);
			}

			if (data_step_id>=33) {
				var graphicWidth = container.node().offsetWidth; //- textWidth - graphicMargin;
				var graphicHeight = Math.floor(window.innerHeight * 1);
				var graphicMarginTop = Math.floor(graphicHeight / 2);
				graphic
					.style('width', graphicWidth + 'px')
					.style('height', graphicHeight + 'px')
					.style('top', 0)
					.style('left', 0);

				var stepHeight = Math.floor(window.innerHeight * 0.5);
				text.style('width', '100%')
					.style('max-width', '100rem');
				container.style('background-color', '#000')
						.style('color', '#fff');
				step.style('background-color', 'transparent')
					//.style('height', stepHeight + 'px')
					.style('text-align', 'center');
			} else {
				//var stepHeight = Math.floor(window.innerHeight * 0.35);
				text.style('width', '100%')
					.style('max-width', '40rem');
				container.style('background-color', '#dadada')
						.style('color', '#000');
				step.style('background-color', '#fff')
					//.style('height', stepHeight + 'px')
					.style('text-align', 'left');
			} 


		}

		if (data_step_id>=33) {
			container.style('background-color', '#000')
			step.style('background-color', 'transparent')
		} else {
			container.style('background-color', '#dadada')
			step.style('background-color', '#fff')
		}
		step_bkg.style('background-color', '#dadada');

		if (data_step_id==2) {
			//filename = "data/scroll/scroll_data.csv";
			//daily_stats_file = "data/overall_and_daily_cases_deaths.csv";
			//load_outbreak_spread_data(filename, daily_stats_file);

		} else if (data_step_id==5) {
			
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
			idname = "#scroll1_chart";
			hide_existing_cases(idname, opacity);

		}  else if (data_step_id==8) {

			/*
			var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
			var graphicHeight = Math.floor(window.innerHeight * 0.5);
			var graphicMarginTop = Math.floor(graphicHeight / 2);
			graphic
				.style('width', graphicWidth + 'px')
				.style('height', graphicHeight + 'px')
				.style('top', '10%')
				.style('left', '20%');

			text.style('width', '10%');
			*/
			
			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			filename = "data/cluster_network_map.csv";
			width_scale_factor = 0.7;
			height_scale_factor = 0.40;
			var bb = d3.select(idname).node().offsetWidth;
			//var margin = {right:20, left:40, top:10, bottom:60};
			var margin = {right:0, left:30, top:50, bottom:30};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;

			chart_title_idname = "scroll1_chart_title";
			chart_titl_id = document.getElementById(chart_title_idname);
			chart_titl_id.innerHTML = `<div class="row text-center justify-content-center cluster_map_legend"><div class="col-lg-12 col-12">
						<svg height="20" width="20"><circle cx="10" cy="13" r="5" stroke="black" fill="#f58231" /></svg>
		                  Travel History
		                  &nbsp &nbsp
		                  <svg height="20" width="20"><circle cx="10" cy="13" r="5" stroke="black" fill="#3cb44b" /></svg>
		                  Italian tourists in Rajasthan
		                  &nbsp &nbsp
		                  <svg height="20" width="20"><circle cx="10" cy="13" r="5" stroke="black" fill="#911eb4" /></svg>
		                  Iran evacuees
		                  &nbsp &nbsp
		                  <svg height="20" width="20"><circle cx="10" cy="13" r="5" stroke="black" fill="#ff0000" /></svg>
		                  Family member
		                  &nbsp &nbsp
		                  <svg height="20" width="20"><circle cx="10" cy="13" r="5" stroke="black" fill="#4363d8" /></svg>
		                  Delhi Religious conference
		                  &nbsp &nbsp
		                  <svg height="20" width="20"><circle cx="10" cy="13" r="5" stroke="black" fill="#f032e6" /></svg>
		                  Mysuru Pharma company</div></div>`;

			if (window.innerWidth >= 768) {

				base_height = Math.floor(window.innerHeight * 0.750);
			    //draw_cluster_map_transition(idname, filename, base_width, base_height);
				chart_id.innerHTML = `<div class="row"><div class="col-lg-10 col-12 cluster_video"><video id="cluster_animation_video" controls preload="auto" loop="loop" muted="muted" autoplay="true">
							          <source src="docs/cluster_animation_without_legend_compressed.mp4" type="video/mp4">
							          Your browser does not support the video tag.
							        </video></div></div>`;
				
			} else{
				base_height = Math.floor(window.innerHeight * 0.50);
				chart_id.innerHTML = `<div class="row"><div class="col-lg-12 col-12 cluster_video"><video id="cluster_animation_video" preload="auto" loop="loop" muted="muted" autoplay="true">
							          <source src="docs/cluster_animation_without_legend_compressed_mobile.mp4" type="video/mp4">
							          Your browser does not support the video tag.
							        </video></div></div>`;
			}
			//draw_cluster_map_transition(idname, filename, base_width, base_height);
			
			//playVid();
			function playVid() {
				var vid = document.getElementById("cluster_animation_video");
			    vid.play();
			}

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
			width_scale_factor = 0.8;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:0, left:20, top:30, bottom:20};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = Math.floor(window.innerHeight * 0.70); 
			if (window.innerWidth >= small_screen_thresh) {
				base_height = Math.floor(window.innerHeight * 0.7); 
			} else {
				base_height = Math.floor(window.innerHeight * 0.50); 
			}
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
			var margin = {right:20, left:20, top:30, bottom:20};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			if (window.innerWidth >= small_screen_thresh) {
				base_height = Math.floor(window.innerHeight * 1); 
			} else {
				base_height = Math.floor(window.innerHeight * 0.80); 
			}
			daily_stats_file = "data/overall_and_daily_cases_deaths.csv";
			draw_scroll_outbreak_spread_map_transition(idname, filename, base_width, base_height, margin, daily_stats_file);
			//draw_scroll_outbreak_spread_map(idname, filename, base_width, base_height, margin, daily_stats_file);

		} else if (data_step_id==13) {
			idname = "#scroll1_chart";
			d3.select(idname).selectAll(".outbreak_spread_date_label").remove();
			d3.select(idname).selectAll(".outbreak_spread_map_casecount_label").remove();
			d3.select(idname).selectAll(".outbreak_spread_map_recovercount_label").remove();
			d3.select(idname).selectAll(".outbreak_spread_map_deathcount_label").remove();
			district_to_state_transition(idname);

		} else if (data_step_id==14) {
			idname = "#scroll1_chart";
			width_scale_factor = 0.9;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:20, top:0, bottom:20};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = Math.floor(window.innerHeight * 1);
			if (window.innerWidth >= small_screen_thresh) {
				base_height = Math.floor(window.innerHeight * 1); 
			} else {
				base_height = Math.floor(window.innerHeight * 0.50); 
			} 
			filename = "data/scroll/scroll_state_data.csv";
			state_circles_to_state_center(idname, filename, base_width, base_height);
		
		} else if (data_step_id==15) {

			idname = "#scroll1_chart";
			width_scale_factor = 0.9;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:10, left:20, top:20, bottom:20};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = Math.floor(window.innerHeight * 0.6);
			if (window.innerWidth >= small_screen_thresh) {
				base_height = Math.floor(window.innerHeight * 0.6); 
			} else {
				base_height = Math.floor(window.innerHeight * 0.40); 
			}
			sort_state_circles_by_test_count(idname, base_width, base_height, margin);
			//sort_state_circles_by_test_count_forcecollide(idname, base_width, base_height);
		
		} else if (data_step_id==16) {

			idname = "#scroll1_chart";
			width_scale_factor = 0.9;
			//height_scale_factor = 0.60;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:10, left:20, top:20, bottom:20};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			//base_height = Math.floor(window.innerHeight * 0.6);
			if (window.innerWidth >= small_screen_thresh) {
				base_height = Math.floor(window.innerHeight * 0.6); 
			} else {
				base_height = Math.floor(window.innerHeight * 0.40); 
			}
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
			var margin = {right:10, left:30, top:20, bottom:40};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			//base_height = Math.floor(window.innerHeight * 0.6);
			if (window.innerWidth >= small_screen_thresh) {
				base_height = Math.floor(window.innerHeight * 0.6); 
			} else {
				base_height = Math.floor(window.innerHeight * 0.40); 
			}
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
			//height_scale_factor = 0.60;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:5, left:50, top:20, bottom:50};
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			//base_height = Math.floor(window.innerHeight * 0.6);
			if (window.innerWidth >= small_screen_thresh) {
				base_height = Math.floor(window.innerHeight * 0.6);
				width_scale_factor = 0.85;
				base_width = bb*width_scale_factor - margin.left - margin.right;
			} else {
				base_height = Math.floor(window.innerHeight * 0.40); 
				width_scale_factor = 0.9;
				base_width = bb*width_scale_factor - margin.left - margin.right;
			}
			filename = "data/scroll/country_testing_rate.csv";
			show_countries_testing_low(idname, filename, base_width, base_height, margin);
		
		} else if (data_step_id==21) {

			idname = "#scroll1_chart";
			//width_scale_factor = 0.75;
			//height_scale_factor = 0.60;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:5, left:50, top:20, bottom:50};
			//base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			//base_height = Math.floor(window.innerHeight * 0.6);
			if (window.innerWidth >= small_screen_thresh) {
				base_height = Math.floor(window.innerHeight * 0.6);
				width_scale_factor = 0.85;
				base_width = bb*width_scale_factor - margin.left - margin.right;
			} else {
				base_height = Math.floor(window.innerHeight * 0.40); 
				width_scale_factor = 0.9;
				base_width = bb*width_scale_factor - margin.left - margin.right;
			}
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
										`<img src="data/scroll/scenario1.jpg">`+
									`</div>`+
								`</div>`;

		} else if (data_step_id==27) {
		
			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = `<div class="row text-center justify-content-center"><div class="col-lg-10 scenario_title"> Lockdown lifted but with Social Distancing</div></div>`+
					`<div class="row text-center justify-content-center">`+
						`<div class="col-lg-10">Estimated ~<span class="prediction_cases">5,30,000 total cases</span> and ~<span class="prediction_deaths">30,000 total deaths</span></div></div>`;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;
			chart_id.innerHTML = `<div class="row text-center justify-content-center">`+
									`<div class="col-lg-12 prediction_model_img">`+
										`<img src="data/scroll/scenario2.jpg">`+
									`</div>`+
								`</div>`;

		} else if (data_step_id==28) {
		
			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = `<div class="row text-center justify-content-center"><div class="col-lg-12 scenario_title">Lockdown lifted, no Social Distancing</div></div>`+
					`<div class="row text-center justify-content-center">`+
						`<div class="col-lg-10">Estimated ~<span class="prediction_cases">9,20,000 total cases</span> and ~<span class="prediction_deaths">43,000 total deaths</span></div></div>`;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;
			chart_id.innerHTML = `<div class="row text-center justify-content-center">`+
									`<div class="col-lg-12 prediction_model_img">`+
										`<img src="data/scroll/scenario3.jpg">`+
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

		/*
		} else if ((data_step_id==31) || (data_step_id==32)) {

			
			title_idname = "scroll1_chart_title";
			per_virus_free_districts = 100;
			num_virus_free_districts = 725;
			num_virus_free_people = 1.3e9;
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = `
				<div class="progress" style="height: 20px;">`+
	  				`<div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuemin="0" aria-valuemax="100">`+
	  				//`<span class="num_virus_free_districts">`+ num_virus_free_districts +`</span>/725 districts, <span class="num_virus_free_people">` +num_virus_free_people+`</span> people free of virus risk</div>`+
	  				num_virus_free_districts +` / 725 districts free of virus risk</div>`+
				`</div>`;

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			filename = "";
			width_scale_factor = 0.90;
			//height_scale_factor = 0.50;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:20, left:20, top:20, bottom:20};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			//base_height = bb*height_scale_factor - margin.top - margin.bottom;
			//base_height = Math.floor(window.innerHeight * 1); 
			if (window.innerWidth >= small_screen_thresh) {
				base_height = Math.floor(window.innerHeight * 0.85); 
			} else {
				base_height = Math.floor(window.innerHeight * 0.60); 
			}
			var show_virus_states;
			if (data_step_id==31) {
				show_virus_states = 0;
			} else {
				show_virus_states = 1;
			}
			draw_scroll_outbreak_free_districts(idname, filename, base_width, base_height, margin, show_virus_states);
		}	
		*/

		} else if (data_step_id==31) {

			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();

		} else if (data_step_id==32) {

			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;

			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;

			idname = "#scroll1_chart";
			d3.select(idname).select("svg").remove();
			width_scale_factor = 0.7;
			height_scale_factor = 0.40;
			var bb = d3.select(idname).node().offsetWidth;
			//var margin = {right:20, left:40, top:10, bottom:60};
			var margin = {right:0, left:30, top:50, bottom:30};
			base_width = bb*width_scale_factor - margin.left - margin.right;

			if (window.innerWidth >= 768) {
				base_height = Math.floor(window.innerHeight * 0.750);
			    //draw_cluster_map_transition(idname, filename, base_width, base_height);
				chart_id.innerHTML = `<div class="row"><div class="col-lg-10 col-12 cluster_video"><video id="cluster_animation_video" preload="auto" loop="loop" muted="muted" autoplay="true">
							          <source src="docs/outbreak_free_animation_compressed.mp4" type="video/mp4">
							          Your browser does not support the video tag.
							        </video></div></div>`;
				
			} else{
				base_height = Math.floor(window.innerHeight * 0.50);
				chart_id.innerHTML = `<div class="row"><div class="col-lg-12 col-12 cluster_video"><video id="cluster_animation_video" preload="auto" loop="loop" muted="muted" autoplay="true">
							          <source src="docs/outbreak_free_animation_compressed.mp4" type="video/mp4">
							          Your browser does not support the video tag.
							        </video></div></div>`;
			}


		} else if (data_step_id==33) {
			for (var j=0; j<outbreak_free_timeouts.length; j++) {
              clearTimeout(outbreak_free_timeouts[j]);
            }
            outbreak_free_timeouts = [];

			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;
			//document.getElementById(title_idname).remove();

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
			if (window.innerWidth >= small_screen_thresh) {
				base_height = Math.floor(window.innerHeight * 1); 
			} else {
				base_height = Math.floor(window.innerHeight * 1); 
			}
			show_random_points(idname, base_width, base_height, margin);
			//show_individual_cases(idname, base_width, base_height, margin, opacity);

		} else if ((data_step_id>=34) && (data_step_id<=37)) {
			idname = "#scroll1_chart";
			width_scale_factor = 1;
			//height_scale_factor = 0.3;
			var bb = d3.select(idname).node().offsetWidth;
			var margin = {right:0, left:0, top:0, bottom:30};
			base_width = bb*width_scale_factor - margin.left - margin.right;
			if (window.innerWidth >= small_screen_thresh) {
				base_height = Math.floor(window.innerHeight * 1); 
			} else {
				base_height = Math.floor(window.innerHeight * 1); 
			}
			move_random_points(base_width, base_height);
			
		} else if (data_step_id>=38) {

			title_idname = "scroll1_chart_title";
			title_id = document.getElementById(title_idname);
			title_id.innerHTML = ``;
			//document.getElementById(title_idname).remove();
			chart_idname = "scroll1_chart";
			chart_id = document.getElementById(chart_idname);
			chart_id.innerHTML = ``;
			d3.select(idname).select("svg").remove();

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