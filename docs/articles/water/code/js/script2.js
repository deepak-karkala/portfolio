(function() {
    // using d3 for convenience
    var container = d3.select('#scroll2');
    var graphic = container.select('.scroll__graphic2');
    var text = container.select('.scroll__text2');
    var step = text.selectAll('.step2');
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

        //handleProgressTransition(val, response.progress);
        
    }
    function handleStepTransition(data_step_id) {
        //var div = document.getElementById("test_progress2");
        //div.innerHTML = data_step_id + "--" + progress;

        var width_scale_factor = 1.0;
        var height_scale_factor = 1.0;
        var margin = {right:10, left:10, top:10, bottom:10};
        idname = "#population_matrix";
        var bb = d3.select(idname).node().offsetWidth;
        base_width = bb*width_scale_factor - margin.left - margin.right;
        var scale_range = d3.scaleLinear().domain([90, 740]).range([15e6, 3e6]);
        var scale = scale_range(base_width); //3e6; //1e7/3;


        if (data_step_id == 1) {
            

            plot_population_matrix(scale);
        } else if (data_step_id == 2 ) {
            div = document.getElementById("data_source2");
            div.innerHTML = '<a href="http://www.un.org/en/sections/issues-depth/water/"><span class="data_source_link">http://www.un.org/en/sections/issues-depth/water/</span></a></br>(WHO/UNICEF 2015)';
        } else if (data_step_id == 3 ) {
            var population_thresh1 = 892e6 / scale;
            delay_factor = 4;
            plot_population_focus(population_thresh1, delay_factor);
            div = document.getElementById("data_source2");
            div.innerHTML = '<a href="http://www.unwater.org/publication_categories/sdg-6-synthesis-report-2018-on-water-and-sanitation/"><span class="data_source_link">http://www.unwater.org/publication_categories/sdg-6-synthesis-report-2018-on-water-and-sanitation/</span></a></br>';
        } else if (data_step_id == 4 ) {
            var population_thresh2 = 2.1e9 / scale;
            delay_factor = 2;
            plot_population_focus(population_thresh2, delay_factor);
            div = document.getElementById("data_source2");
            div.innerHTML = '<a href="http://www.un.org/en/sections/issues-depth/water/"><span class="data_source_link">http://www.un.org/en/sections/issues-depth/water/</span></a></br>(WHO/UNICEF 2017)';
        } else if (data_step_id == 5 ) {
            var population_thresh3 = 4.5e9 / scale;
            delay_factor = 1;
            plot_population_focus(population_thresh3, delay_factor);
            div = document.getElementById("data_source2");
            div.innerHTML = '<a href="http://www.un.org/en/sections/issues-depth/water/"><span class="data_source_link">http://www.un.org/en/sections/issues-depth/water/</span></a></br>(WHO/UNICEF 2017)';
        }
    }
    function plot_population_focus(thresh, delay_factor) {
        d3.select("#population_matrix").selectAll("circle")
                .transition()
                    .delay(function(d, i) { return i*delay_factor; })
                    .style('fill', function(d, i) {
                        if (i <= thresh) {
                            return "black";
                        } else {
                            return "white";
                        }
                    });
    }
    function plot_population_matrix(scale) {
        // Width and height of container
        //var width = document.getElementById("population_matrix").clientWidth;
        //var height = 600; //document.getElementById("population_matrix").clientHeight;

        var width_scale_factor = 1.0;
        var height_scale_factor = 1.0;
        var margin = {right:10, left:10, top:10, bottom:10};
        idname = "#population_matrix";
        d3.select(idname).select("svg").remove();
        
        var bb = d3.select(idname).node().offsetWidth;
        base_width = bb*width_scale_factor - margin.left - margin.right;
        //base_height = 700; //bb*height_scale_factor - margin.top - margin.bottom;
        var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        base_height = viewport_height*0.90;

        var num_circles_per_row = d3.scaleLinear().domain([90, 740]).range([8, 50]);
        var scale_range = d3.scaleLinear().domain([90, 740]).range([18e6, 3e6]);
        var scale = scale_range(base_width); //3e6; //1e7/3;

        var size_arr = 7.530e9;
        size_arr = Math.floor(size_arr / scale);
        //var num_circles_per_row = 50;

        var data_arr = [];
        for (var i=0; i<size_arr; i++) {
            data_arr[i] = i;
        }

        var idname = "#population_matrix";
        plot_population(idname, base_width, base_height, data_arr, Math.floor(num_circles_per_row(base_width)));

        function plot_population(idname, width, height, data, num_circles_per_row) {
            // Set the dimensions of the canvas / graph
            //var margin = {top: 30, right: 20, bottom: 0, left: 50};

            var svg1 = d3.select(idname).append("svg")
                    .attr("width", width) // + margin.left + margin.right)
                    .attr("height", height) // + margin.top + margin.bottom)
                .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

            svg1.selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                  .attr("r", 3)
                  .attr("cx", function(d,i) { return Math.floor(i%num_circles_per_row)*10; })
                  .attr("cy", function(d,i) { return Math.floor(i/num_circles_per_row)*10; })
                  .style("stroke", "black")
                  .style("stroke-width", "1px")
                  .style("fill", "white")
                .style("opacity", "0")
                .transition()
                  .delay(function(d, i) { return i*1; })
                  .style("opacity", "1")
                  .duration(function(d, i) { return 1; })
                .transition()
                  .duration(function(d, i) { return 2; })
                  .attr('r', function(d, i) { return 3; } );

        }
    }


    function init() {
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();
        // 2. setup the scroller passing options
        // this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
            container: '#scroll2',
            graphic: '.scroll__graphic2',
            text: '.scroll__text2',
            step: '.scroll__text2 .step2',
            progress: 'true',
            debug: false,
            offset: 0.40,
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