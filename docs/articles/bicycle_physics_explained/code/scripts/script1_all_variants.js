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
		// 1. update height of step elements
		var stepH = Math.floor(window.innerHeight * 0.75);
		step.style('height', stepH + 'px');

		var figureHeight = window.innerHeight * 0.8// / 2
		var figureMarginTop = (window.innerHeight - figureHeight) / 2  

		figure
			.style('height', figureHeight + 'px')
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
	    handleStepTransition(val);

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

	    div_slider_text = document.getElementById("slider_text");
        div_slider_text.innerHTML = '';
        div_slider = document.getElementById("slider");
        div_slider.innerHTML = '';
        div_slider_tag = document.getElementById("slider_tag");
        div_slider_tag.innerHTML = '';
        //div_slider_value = document.getElementById("slider_value");
        //div_slider_value.innerHTML = '';
	    //div_slider_value.classList.remove("slider_value");

	    if (data_step_id == 3) {
	    	div_slider_text.innerHTML = "Use the slider to see how the rider's weight affects the speed of the bike";
	    	//div_slider.innerHTML = `<input type="range" min="40" max="120" data-rangeslider>`;
	    	div_slider.innerHTML = `<div class="mySlider onlight" data-val="80"></div>`;
	    	value = 80;
			var output = document.getElementById("slider_tag");
        	output.innerHTML = `Bike + Rider Weight: <span class="slider_value">`+value+` kg</span>`;
           	set_range_slider();

           	idname = "#graphic";
			transition_duration = [2000, 3000];
           	plot_bicycle_comparison_top(idname, transition_duration);
	    }
	}

    function plot_bicycle_comparison_top(idname, transition_duration) {
	    d3.select(idname).select("svg").remove();

		var width_scale_factor = 0.80;
		var margin = {right:20, left:20, top:10, bottom:10};

		var bb = d3.select(idname).node().offsetWidth;
		base_width = bb*width_scale_factor - margin.left - margin.right;
		var height_scale_factor = 0.5;
		base_height = bb*height_scale_factor - margin.top - margin.bottom;

		file = "data/bicycle_position.csv";
		plot_bicycle_comparison(idname, file, base_width, base_height, margin, transition_duration);
    }


	function plot_bicycle_comparison(id, file, width, height, margin, transition_duration) {
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
		    	d.start_y = +d.start_y;
		    	d.end_x = +d.end_x;
		    	d.end_y = +d.end_y;
		    	console.log(d);
		    });

		    x.domain([0, 100]);
		    y.domain([0, 100]);

		    /*
			svg.selectAll(".dot")
		        .data(data)
		      .enter().append("circle")
		        .attr("class", "dot")
		        .attr("r", function(d) { return 16; })
		        .attr("cx", function(d) { return x(d.start_x); })
		        .attr("cy", function(d) { return y(d.start_y); })
		        .style("fill", function(d) { return "black" })
		        .style("stroke", "white")
		        .style("stroke-width", "1.0px")
		        .style("opacity", 1.0)
		      .transition()
		      	.ease(d3.easeLinear)
		      	.duration(function(d, i) { return (i+1)*3000; })
		      	.attr("cx", function(d) { return x(d.end_x); });
		    */
			var images = svg.selectAll(".images")
							  .data(data)
							  .enter()
							  .append("image");

			images.attr("xlink:href", function(d) {return d.url; })
			  .attr("x", function(d) {return x(d.start_x); })
			  .attr("y", function(d) {return y(d.start_y); })
			  .attr("width", 100)
			  .attr("height", 100)
			  .transition()
		      	.ease(d3.easeLinear)
		      	.duration(function(d, i) { return transition_duration[i]; })
		      	.attr("x", function(d) { return x(d.end_x); });


		    var text = svg.selectAll(".text")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("x", function(d) { return x(d.start_x)-5; })
                    .attr("y", function(d) { return y(d.start_y); })
                    .style("fill", "black")
                    .text(function(d,i) { return d.name;} )
                        .transition()
                        	.ease(d3.easeLinear)
		      				.duration(function(d, i) { return transition_duration[i]; })
                            .attr("x", function(d) { return x(d.end_x); })
                            .text(function(d,i) { return d.name;} )
                            .style("fill", "black");

		});
	}

	function set_range_slider() {
		//var mySlider = new LjSlider({
    	//	elt: document.querySelector('.mySlider')
		//});
		var mySlider = new LjSlider({
			elt: document.querySelector('.mySlider'),
		    // Makes the steps have the same length
		    sameStep: true,

		    // Starting value
		    start: 40,

		    // The number of handles
		    pins: 1,

		    // A function which will be fired on change
		    handler: function(vals) {
		    	//console.log(vals);
		    	value = vals; //mySlider.values[0];
				var output = document.getElementById("slider_tag");
        		output.innerHTML = `Bike + Rider Weight: <span class="slider_value">`+value+` kg</span>`;
		    },

		    // Uses green background
		    link: true,

		    // An array of steps
		    steps: [{ step: 5, number: 16 }],

		    // Initial values.
		    values: []
		});

		elt = document.querySelector('.mySlider');
		elt.addEventListener("mouseleave", function(){
			console.log(mySlider);
			idname = "#graphic";
			transition_duration = [2000, 3000];
           	plot_bicycle_comparison_top(idname, transition_duration);
		});
		/*
		var $document = $(document);
        var selector = '[data-rangeslider]';
        var $element = $(selector);
        // For ie8 support
        var textContent = ('textContent' in document) ? 'textContent' : 'innerText';
        // Example functionality to demonstrate a value feedback
        function valueOutput(element) {
            var value = element.value;
            //var output = element.parentNode.getElementsByTagName('output')[0] || element.parentNode.parentNode.getElementsByTagName('output')[0];
            //output[textContent] = value;
            var output = document.getElementById("slider_tag");
            output.innerHTML = `Bike + Rider Weight: <span class="slider_value">`+value+` kg</span>`;
        }
        $document.on('input', 'input[type="range"], ' + selector, function(e) {
            valueOutput(e.target);
        });

        // Basic rangeslider initialization
        $element.rangeslider({
            // Deactivate the feature detection
            polyfill: false,
            // Callback function
            onInit: function() {
                valueOutput(this.$element[0]);
            },
            // Callback function
            onSlide: function(position, value) {
                console.log('onSlide');
                console.log('position: ' + position, 'value: ' + value);
            },
            // Callback function
            onSlideEnd: function(position, value) {
                console.log('onSlideEnd');
                console.log('position: ' + position, 'value: ' + value);
            }
        });
        */
	}


})();