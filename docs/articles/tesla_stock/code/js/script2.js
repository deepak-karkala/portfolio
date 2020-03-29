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
        containerWidth = container.node().offsetWidth;
        if (0) { //(containerWidth > 770) {
            graphicWidth = containerWidth - textWidth - graphicMargin;
        } else {
            graphicWidth = containerWidth - graphicMargin;
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

    }
    function handleStepTransition(data_step_id) {
        d3.select("#graphic1").select("svg").remove();
        d3.select("#graphic2").select("svg").remove();

        if (data_step_id==1) {
            d3.select("#graphic1").select("svg").remove();
            d3.select("#graphic2").select("svg").remove();
        } else if (data_step_id==2) {
            var idname = "#graphic2";
            d3.select(idname).select("svg").remove();
            var bb = d3.select(idname).node().offsetWidth;
            var width_scale_factor = 1.0;
            var height_scale_factor = 0.40;
            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            base_width = bb*width_scale_factor - margin.left - margin.right;
            base_height = bb*height_scale_factor - margin.top - margin.bottom;
            var file = "data/nasdaq_filtered_av_mcap.csv";
            include_outliers = 1;
            scale = 50e9;
            plot_mcap_av(idname, file, base_width, base_height, include_outliers, scale);
        } else if (data_step_id==3) {
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
