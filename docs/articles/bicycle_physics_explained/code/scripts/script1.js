(function() {
	// using d3 for convenience
	var main = d3.select('main')
	var scrolly = main.select('#scrolly');
	var figure = scrolly.select('figure');
	var article = scrolly.select('article');
	var step = article.selectAll('.step');

	// initialize the scrollama
	var scroller = scrollama();

	// generic window resize listener event
	function handleResize() {
		windowWidth = window.innerWidth;

		if (windowWidth >= 576) {
			// 1. update height of step elements
			var stepH = Math.floor(window.innerHeight * 0.75);
			step.style('height', stepH + 'px');

			var figureHeight = window.innerHeight * 0.85// / 2
			var figureMarginTop = Math.max((window.innerHeight - figureHeight) / 2, 60);  

		} else if (windowWidth <= 350) { 
			// 1. update height of step elements
			var stepH = Math.floor(window.innerHeight * 0.30);
			step.style('height', stepH + 'px');

			var figureHeight = window.innerHeight * 0.70// / 2
			//var figureMarginTop = Math.max((window.innerHeight - figureHeight) / 2, 60);  
			var figureMarginTop = Math.max((window.innerHeight - figureHeight), 60);  

		} else {
			// 1. update height of step elements
			var stepH = Math.floor(window.innerHeight * 0.40);
			step.style('height', stepH + 'px');

			var figureHeight = window.innerHeight * 0.55// / 2
			//var figureMarginTop = Math.max((window.innerHeight - figureHeight) / 2, 60);  
			var figureMarginTop = Math.max((window.innerHeight - figureHeight), 60);  
		}

		figure
			.style('height', figureHeight + 'px')
			//.style('top', '20px');
			.style('top', figureMarginTop + 'px');

		// 3. tell scrollama to update new element dimensions
		scroller.resize();
	}

	// scrollama event handlers
	function handleStepEnter(response) {
		//console.log(response)
		// response = { element, direction, index }

		// add color to current step only
		step.classed('is-active', function (d, i) {
			return i === response.index;
		})

		// update graphic based on step
		//figure.select('p').text(response.index);
		val = response.index;
	    handleStepTransition(val-1);

	}

	function setupStickyfill() {
		d3.selectAll('.sticky').each(function () {
			Stickyfill.add(this);
		});
	}

	function init() {
		setupStickyfill();

		// 1. force a resize on load to ensure proper dimensions are sent to scrollama
		handleResize();

		// 2. setup the scroller passing options
		// 		this will also initialize trigger observations
		// 3. bind scrollama event handlers (this can be chained like below)
		scroller.setup({
			step: '#scrolly article .step',
			offset: 0.33,
			debug: false,
		})
		.onStepEnter(handleStepEnter)


		// setup resize event
		window.addEventListener('resize', handleResize);
	}

	// kick things off
	init();


	function handleStepTransition(data_step_id) {
	    d3.select("#graphic").select("svg").remove();
	    d3.select("#graphic_container_span").remove();
	    div_graphic_container = document.getElementById("graphic_container");

		if (data_step_id == 0 || data_step_id == 1) {
	    	div_graphic_container.innerHTML = `
	    			<span class="graphic_container_span">
	    				<div class="row">
							<div class="col-lg-12 text-center slider_text" id="slider_text"></div>
						</div>
						<div class="row graphic_div">
							<div class="col-lg-12" id="graphic"></div>
						</div>
					</span>`;
		} else if (data_step_id == 8) {
			div_graphic_container.innerHTML = `
	    			<span class="graphic_container_span">
						<div class="row">
							<div class="col-lg-12 text-center slider_text" id="slider_text"></div>
						</div>
						<div class="row slider_div">
							<div class="col-lg-6 text-center mx-auto">
								<div class="row">
									<div class="col-lg-12 slider_tag" id="slider_tag"></div>
								</div>
								<div class="row">
									<div class="col-lg-8 text-center mx-auto slider" id="slider"></div>
								</div>
							</div>
						</div>
						<div class="row power_graphic_div justify-content-center text-center">
							<div class="col-lg-10" id="graphic"></div>
						</div>
					</span>`;
			div_slider = document.getElementById("slider");
        	div_slider.innerHTML = '';
        	div_slider_tag = document.getElementById("slider_tag");
        	div_slider_tag.innerHTML = '';
		} else {
			div_graphic_container.innerHTML = `
	    			<span class="graphic_container_span">
						<div class="row">
							<div class="col-lg-12 text-center slider_text" id="slider_text"></div>
						</div>
						<div class="row slider_div">
							<div class="col-lg-6 text-center mx-auto">
								<div class="row">
									<div class="col-lg-12 slider_tag" id="slider_tag"></div>
								</div>
								<div class="row">
									<div class="col-lg-8 text-center mx-auto slider" id="slider"></div>
								</div>
							</div>
						</div>
						<div class="row graphic_div">
							<div class="col-lg-12" id="graphic"></div>
						</div>
					</span>`;
			div_slider = document.getElementById("slider");
        	div_slider.innerHTML = '';
        	div_slider_tag = document.getElementById("slider_tag");
        	div_slider_tag.innerHTML = '';
		}

		div_slider_text = document.getElementById("slider_text");
        div_slider_text.innerHTML = '';
        
	    if (data_step_id == 0 || data_step_id == 7) {
	    	image = "images/racer.png";
	    	//zoomTo = 
	    	//show_bicycle_forces(image, idname, zoomTo);

	    	div_slider_text.innerHTML = "Forces acting on a bicycle";
	    	file = "data/bicycle_position_forces.csv";
           	idname = "#graphic";
			transition_duration = [0];
			end_x = 10;
			start_y_arr = [110];
			end_y_arr = start_y_arr;
			max_y = 90;
			user_value = "";
			type = "other";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type, data_step_id);
	    
	    } else if (data_step_id == 1) {
	    	div_slider_text.innerHTML = "Rolling resistance acting against a bicycle";
	    	file = "data/forces_rolling.csv";
           	idname = "#graphic";
			transition_duration = [0];
			end_x = 10;
			start_y_arr = [110];
			end_y_arr = start_y_arr;
			max_y = 90;
			user_value = "";
			type = "other";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type, data_step_id);

	    } else if (data_step_id == 2) {
	    	div_slider_text.innerHTML = "Use the slider to see how the rider's weight affects the speed of the bike";
			div_slider.innerHTML = `<div id="slider-range-min"></div>`;

	    	initial_value = 100;
			var output = document.getElementById("slider_tag");
        	output.innerHTML = `Bike + Rider Weight: <span class="slider_value">`+initial_value+` kg</span>`;
           	set_range_slider_rolling();

           	file = "data/bicycle_position_rolling.csv";
           	idname = "#graphic";
			transition_duration = [0, 0];
			end_x = 5;
			start_y_arr = [90, 50];
			end_y_arr = [90, 50];
			max_y = 100;
			user_value = initial_value + ' kg';
			type = "rolling";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type, data_step_id);

	    } else if (data_step_id == 3) {
	    	div_slider_text.innerHTML = "Force of gravity acting on a bicycle";
	    	file = "data/forces_gravity.csv";
           	idname = "#graphic";
			transition_duration = [0];
			end_x = 10;
			start_y_arr = [110];
			end_y_arr = start_y_arr;
			max_y = 90;
			user_value = "";
			type = "other";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type, data_step_id);

	    } else if (data_step_id == 4) {
	    	div_slider_text.innerHTML = "Use the slider to see how the slope affects the speed of the bike";
			div_slider.innerHTML = `<div id="slider-range-min"></div>`;

	    	initial_value = 10;
			var output = document.getElementById("slider_tag");
        	output.innerHTML = `Slope: <span class="slider_value">`+initial_value+` degrees</span>`;
           	set_range_slider_gravity();

           	file = "data/bicycle_position_gravity.csv";
           	idname = "#graphic";
			transition_duration = [0, 0];
			end_x = 10;
			start_y_arr = [80, 30];
			G1 = Math.tan(20*Math.PI/180);
	      	G2 = Math.tan(10*Math.PI/180);
			end_y_arr = [start_y_arr[0]+70*G1, start_y_arr[1]+70*G2];
			max_y = 140;
			user_value = initial_value + ' degrees';
			type = "gravity";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type, data_step_id);
	    
	    } else if (data_step_id == 5) {
	    	div_slider_text.innerHTML = "Aerodynamic drag acting against a bicycle";
	    	file = "data/forces_drag.csv";
           	idname = "#graphic";
			transition_duration = [0];
			end_x = 10;
			start_y_arr = [110];
			end_y_arr = start_y_arr;
			max_y = 90;
			user_value = "";
			type = "other";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type, data_step_id);

	    } else if (data_step_id == 6) {
	    	div_slider_text.innerHTML = "Notice how the seating position affects the drag and thereby bike speed";
	    	file = "data/bicycle_position_drag.csv";
           	idname = "#graphic";
			transition_duration = [0, 0, 0];
			end_x = 10;
			start_y_arr = [90, 60, 30];
			end_y_arr = start_y_arr;
			max_y = 90;
			user_value = "";
			type = "drag";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type, data_step_id);
           	set_button_drag();
	    } else if (data_step_id == 8) {
	    	div_slider_text.innerHTML = "Set the desired speed at which you want to ride and see how much power you need to generate";
	    	div_slider.innerHTML = `<div id="slider-range-min"></div>`;

	    	initial_value = 20;
			var output = document.getElementById("slider_tag");
        	output.innerHTML = `Velocity: <span class="slider_value">`+initial_value+` kilometers per hour</span>`;
           	set_range_slider_velocity();
           	var output = document.getElementById("graphic");
           	v = initial_value * 1000 / 3600;
           	Cd = 0.63;
			A = 0.509;
			Rho = 1.22601;
			power = (0.5*Cd*A*Rho*v*v)*v;
	      	var output = document.getElementById("graphic");
	      	output.innerHTML = `Assuming you and the bike together weigh 80kg, and you want to ride at velocity of <span class="power_slider_value">`+initial_value+` kmph</span> on a flat road, then you must apply <span class="power_slider_value">`+Math.round(power,2)+` Watts</span> of power`;
	    }
	}

	/*
	function show_bicycle_forces() {
		d3.select(idname).select("svg").remove();

		var width_scale_factor = 0.80;
		var margin = {right:5, left:5, top:10, bottom:10};

		var bb = d3.select(idname).node().offsetWidth;
		base_width = bb*width_scale_factor - margin.left - margin.right;
		windowWidth = window.innerWidth;
	}
	*/
    function plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr,  max_y, user_value, type, data_step_id) {
	    d3.select(idname).select("svg").remove();

		var width_scale_factor = 0.80;
		var margin = {right:5, left:5, top:10, bottom:10};

		var bb = d3.select(idname).node().offsetWidth;
		base_width = bb*width_scale_factor - margin.left - margin.right;
		windowWidth = window.innerWidth;

		if (windowWidth >= 576) {
			if (type=="rolling") {
				var height_scale_factor = 589/base_width * 1.2 * 0.5;
			} else if (type=="gravity") {
				var height_scale_factor = 589/base_width * 1.2 * 0.4;
			} else if (type=="drag") {
				var height_scale_factor = 589/base_width * 1.2 * 0.4;
			} else {
				var height_scale_factor = 589/base_width * 1.2 * 0.9;
			}
		} else {
			if (type=="rolling") {
				var height_scale_factor = 0.8;
			} else if (type=="gravity") {
				var height_scale_factor = 0.8;
			} else if (type=="drag") {
				var height_scale_factor = 0.8;
			} else {
				var height_scale_factor = 0.9;
			}
		}
		base_height = bb*height_scale_factor - margin.top - margin.bottom;
		
		plot_bicycle_comparison(idname, file, base_width, base_height, margin, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type, data_step_id);
    }


	function plot_bicycle_comparison(id, file, width, height, margin, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type, data_step_id) {

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

		// Bicycle bubbles
	  	d3.csv(file, function(error, data) {
	  	 	if (error) throw error;

		    data.forEach(function(d) {
		   		d.start_x = +d.start_x;

		   		icon_width = width*0.20;
		   		icon_height = height*0.20;

				if (type == "rolling") {
					line_start_y_arr = [70, 30];
					line_end_y_arr = [70, 30];
					max_x = 100;
				} else if (type =="gravity") {
					line_start_y_arr = [80, 15];
					line_end_y_arr = [line_start_y_arr[0] + end_y_arr[0]-start_y_arr[0], line_start_y_arr[1] + end_y_arr[1]-start_y_arr[1]];
					max_x = 100;
				} else if (type =="drag") {
					line_start_y_arr = [70, 40, 10];
					line_end_y_arr = line_start_y_arr;
					max_x = 90;
				} else {
					max_x = d.start_x;
					icon_width = width*0.90;
		   			icon_height = height*0.95;
				}
		    });

		    x.domain([0, 100]);
		    y.domain([0, max_y]);

		    var images = svg.selectAll(".images")
							  .data(data)
							  .enter()
							  .append("image");

			images.attr("xlink:href", function(d) {return d.url; })
			  .attr("x", function(d) {return x(d.start_x); })
			  .attr("y", function(d, i) {return y(start_y_arr[i]); })
			  .attr("width", icon_width)
			  .attr("height", icon_height)
			  .transition()
		      	.ease(d3.easeLinear)
		      	.duration(function(d, i) { return transition_duration[i]; })
		      	.attr("x", function(d) { return x(end_x); })
		      	.attr("y", function(d, i) { return y(end_y_arr[i]); });

		    if (type != "other") {
			    svg.selectAll(".line")
			    	.data(data)
			    	.enter()
				    .append("line")
			    	.style("stroke", "black")
			    	.attr("x1", function(d) {return x(d.start_x);})
			    	.attr("x2", function(d) {return x(max_x);})
			    	.attr("y1", function(d, i) {return y(line_start_y_arr[i]); })
			    	.attr("y2", function(d, i) {return y(line_end_y_arr[i]); });

			    var text = svg.selectAll(".text")
	                    .data(data)
	                    .enter()
	                    .append("text")
	                    .attr("x", function(d) { return x(d.start_x)-5; })
	                    .attr("y", function(d, i) { return y(start_y_arr[i]); })
	                    .style("fill", "black")
	                    .text(function(d,i) { return d.name;} )
	                        .transition()
	                        	.ease(d3.easeLinear)
			      				.duration(function(d, i) { return transition_duration[i]; })
	                            .attr("x", function(d) { return x(end_x); })
			     			 	.attr("y", function(d, i) { return y(end_y_arr[i]); })
	                            .text(function(d,i) {
	                            	if ((type == "rolling") || (type=="gravity")) {
		                            	if (i==0) {
		                            		return d.name;
		                            	} else {
		                            		return d.name + ' [' + user_value + ']'; 
		                            	}
		                            } else if (type == "drag") {
		                            	return d.name;
		                            }
	                            })
	                            .style("fill", "black");
	        }

		});

	  	/*
		function transition(svg, start, end) {
		  var center = [50, 45], //[width / 2, height / 2],
		      i = d3.interpolateZoom(start, end);

		  svg
		      .attr("transform", transform(start))
		    .transition()
		      .delay(250)
		      .duration(i.duration * 2)
		      .attrTween("transform", function() { return function(t) { return transform(i(t)); }; });
		      //.each("end", function() { d3.select(this).call(transition, end, start); });

		  function transform(p) {
		    var k = height / p[2];
		    return "translate(" + (center[0] - p[0] * k) + "," + (center[1] - p[1] * k) + ")scale(" + k + ")";
		  }
		}
		*/
	}

	function set_button_drag() {
		var output = document.getElementById("slider_tag");
        output.innerHTML = `<button class="ui-button ui-widget ui-corner-all">Play animation</button>`;
	    $( "button" ).click( function( event ) {
	    	file = "data/bicycle_position_drag.csv";
           	idname = "#graphic";
           	t1 = 3000; cda1 = 5.4;
           	cda2 = 3.2; t2 = t1 * cda2 / cda1;
           	cda3 = 0.91; t3 = t1 * cda3 / cda1;
			transition_duration = [t1, t2, t3];
			end_x = 70;
			start_y_arr = [90, 60, 30];
			end_y_arr = start_y_arr;
			max_y = 100;
			user_value = "";
			type = "drag";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type);
	    });
	}

	function set_range_slider_rolling() {
		//var handle = $( "#custom-handle" );
	    $( "#slider-range-min" ).slider({
	      create: function() {
	        //handle.text( $( this ).slider( "value" ) );
	      },
	      slide: function( event, ui ) {
	        //handle.text( ui.value );
	      	value = ui.value;
	        var output = document.getElementById("slider_tag");
        	output.innerHTML = `Bike + Rider Weight: <span class="slider_value">`+value+` kg</span>`;
	      },
	      change: function(event, ui) {
           	file = "data/bicycle_position_rolling.csv";
	      	idname = "#graphic";
	      	W1 = 80; t1 = 2000;
	      	W2 = ui.value;
	      	t2 = W2 * t1 / W1;
			transition_duration = [t1, t2];
			end_x = 75;
			max_y = 100;
			start_y_arr = [90, 50];
			end_y_arr = [90, 50];
			user_value = W2 + ' kg';
			type = "rolling";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type);
	      },
          range: "min",
	      max: 120,
	      min: 40,
	      step: 5,
	      value: 100,
	    });
	}

	function set_range_slider_gravity() {
		//var handle = $( "#custom-handle" );
	    $( "#slider-range-min" ).slider({
	      create: function() {
	        //handle.text( $( this ).slider( "value" ) );
	      },
	      slide: function( event, ui ) {
	        //handle.text( ui.value );
	      	value = ui.value;
	        var output = document.getElementById("slider_tag");
        	output.innerHTML = `Slope: <span class="slider_value">`+value+` degrees</span>`;
	      },
	      change: function(event, ui) {
           	file = "data/bicycle_position_gravity.csv";
	      	idname = "#graphic";
	      	G1 = Math.tan(20*Math.PI/180); t1 = 2000;
	      	G2 = Math.tan(ui.value*Math.PI/180);
	      	t2 = t1 * Math.sin(Math.atan(G2)) / Math.sin(Math.atan(G1));
			transition_duration = [t1, t2];
			end_x = 80;
			max_y = 140;
			start_y_arr = [80, 30];
			init_G1 = Math.tan(20*Math.PI/180);
	      	init_G2 = Math.tan(10*Math.PI/180);
			end_y_arr = [start_y_arr[0]+70*init_G1, start_y_arr[1]+70*init_G2];
			start_y_arr = end_y_arr;
			end_y_arr = [start_y_arr[0]+70*G1, start_y_arr[1]+70*G2];
			user_value = ui.value + ' degrees';
			type = "gravity";
           	plot_bicycle_comparison_top(file, idname, transition_duration, end_x, start_y_arr, end_y_arr, max_y, user_value, type);
	      },
          range: "min",
	      max: 40,
	      min: 0,
	      step: 5,
	      value: 10,
	    });
	}

	function set_range_slider_velocity() {
		//var handle = $( "#custom-handle" );
	    $( "#slider-range-min" ).slider({
	      create: function() {
	        //handle.text( $( this ).slider( "value" ) );
	      },
	      slide: function( event, ui ) {
	        //handle.text( ui.value );
	      	value = ui.value;
	        var output = document.getElementById("slider_tag");
        	output.innerHTML = `Velocity: <span class="slider_value">`+value+` kilometers per hour</span>`;
	      },
	      change: function(event, ui) {
	      	v = value * 1000 / 3600;
	      	W = 80;
			G = 0; //0.2 * 100;
			Crr = 0.005;
			Cd = 0.63;
			A = 0.509;
			Rho = 1.22601;
			//power = ((9.8067 * W * ( Math.sin(Math.atan(G/100)) + Crr * Math.cos(Math.atan(G/100)) )) + (0.5*Cd*A*Rho*v*v))*v;
			power = (0.5*Cd*A*Rho*v*v)*v;

	      	var output = document.getElementById("graphic");
	      	output.innerHTML = `Assuming you and the bike together weigh 80kg, and you want to ride at velocity of <span class="power_slider_value">`+value+` kmph</span> on a flat road, then you must apply <span class="power_slider_value">`+Math.round(power,2)+` Watts</span> of power`;
	      },
          range: "min",
	      max: 60,
	      min: 0,
	      step: 5,
	      value: 20,
	    });
	}

})();