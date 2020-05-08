(function() {
    // using d3 for convenience
    var container = d3.select('#scroll4');
    var graphic = container.select('.scroll__graphic4');
    var text = container.select('.scroll__text4');
    var step = text.selectAll('.step4');
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
        //var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
        //console.log(container.node().offsetWidth);
        //var graphicWidth = container.node().offsetWidth - graphicMargin;
        //console.log(graphicWidth);
        
        containerWidth = container.node().offsetWidth;
        if (containerWidth > 770) {
            var graphicWidth = containerWidth - textWidth - graphicMargin;
        } else {
            var graphicWidth = containerWidth; //- graphicMargin;
        }
        
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

        idname = "#circle_pack";
        d3.select(idname).select("svg").remove();
        remove_circle_legend();
        
        div = document.getElementById("top_tweets_table");
        div.innerHTML = '';
        div = document.getElementById("table_title");
        div.innerHTML = '';
        div = document.getElementById("dropdown_likes");
        div.innerHTML = '';
        id = document.getElementById("top_tweets_table");
        id.classList.remove("top_tweets_table");
        id = document.getElementById("table_title");
        id.classList.remove("table_title");

        div = document.getElementById("word_cloud");
        div.innerHTML = '';
        
        idname = "#links";
        remove_link_legend();

        //console.log(d3.select("#links").node().offsetWidth);

        var width_scale_factor = 1.0;
        var height_scale_factor = 0.40;
        var margin = {right:10, left:10, top:10, bottom:10};
        var bb = d3.select(idname).node().offsetWidth;
        base_width = bb*width_scale_factor - margin.left - margin.right;
        base_height = bb*height_scale_factor - margin.top - margin.bottom;

        if (data_step_id==1) {
            d3.select(idname).select("svg").remove();
            draw_links(idname, base_width, base_height);
            add_link_legend();

        } else if (data_step_id==2) {
            unhighlight_all_links();
            highlight_link("TheEllenShow");
            add_link_legend();

        } else if (data_step_id==3) {
            unhighlight_all_links();
            highlight_link("ArianaGrande");
            add_link_legend();

        } else if (data_step_id==4) {
            unhighlight_all_links();
            add_link_legend();

        } else if (data_step_id==5) {

        }
        
    }

    function init() {
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();
        // 2. setup the scroller passing options
        // this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
            container: '#scroll4',
            graphic: '.scroll__graphic4',
            text: '.scroll__text4',
            step: '.scroll__text4 .step4',
            progress: 'true',
            debug: false,
            offset: 0.8,
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