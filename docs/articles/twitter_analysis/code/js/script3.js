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
        var graphicHeight = Math.floor(window.innerHeight * 0.75)
        var graphicMarginTop = Math.floor(graphicHeight / 2)
        graphic
            .style('width', graphicWidth + 'px')
            .style('height', graphicHeight + 'px')
            //.style('top', '80px');
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

        idname = "#word_cloud";

        var width_scale_factor = 0.80;
        var height_scale_factor = 0.60;
        var margin = {right:10, left:10, top:10, bottom:10};
        var bb = d3.select(idname).node().offsetWidth;
        base_width = bb*width_scale_factor - margin.left - margin.right;
        base_height = bb*height_scale_factor - margin.top - margin.bottom;

        if (data_step_id==1) {
            // Clear content from previous section
            div = document.getElementById("top_tweets_table");
            div.innerHTML = '';
            div = document.getElementById("table_title");
            div.innerHTML = '';
            div = document.getElementById("dropdown_likes");
            div.innerHTML = '';

            div = document.getElementById("word_cloud");
            div.innerHTML = '';
            div = document.getElementById("word_cloud_title");
            div.innerHTML = '';
            div = document.getElementById("dropdown_cloud");
            div.innerHTML = '';

            account = "BillGates";  // "BBCBreaking";
            div = document.getElementById("word_cloud");
            div.innerHTML = '<span class="word_cloud_image" id="word_cloud_image"><img src="data/word_cloud/'+account+'.png"></img></span>';

        } else if (data_step_id==2) {

            $("#word_cloud_image").find("img").fadeOut();
            //div = document.getElementById("word_cloud");
            //div.innerHTML = '';
            div = document.getElementById("word_cloud_title");
            div.innerHTML = '';
            div = document.getElementById("dropdown_cloud");
            div.innerHTML = '';

            account = "realDonaldTrump";  // "BBCBreaking";
            div = document.getElementById("word_cloud");
            div.innerHTML = '<span class="word_cloud_image"><img src="data/word_cloud/'+account+'.png"></img></span>';
            //$("#word_cloud_image").find("img").fadeIn("slow");

        } else if (data_step_id==3) {
            div = document.getElementById("word_cloud");
            div.innerHTML = '';
            div = document.getElementById("word_cloud_title");
            div.innerHTML = '';
            div = document.getElementById("dropdown_cloud");
            div.innerHTML = '';

            account = "cnnbrk";  // "BBCBreaking";
            div = document.getElementById("word_cloud");
            div.innerHTML = '<span class="word_cloud_image"><img src="data/word_cloud/'+account+'.png"></img></span>';

        } else if (data_step_id==4) {
            div = document.getElementById("word_cloud");
            div.innerHTML = '';
            div = document.getElementById("word_cloud_title");
            div.innerHTML = '';
            // Add dropdown to select user
            div = document.getElementById("dropdown_cloud");
            div.innerHTML = '<div class="dropdown">' +
              'Select a Twitter Account' +
              '<select class="dropdown_menu" id="select_cloud"></select>' +
            '</div>';
            setup_dropdown_cloud();

            // Update table based on user selection
            $('#select_cloud').on('change', function(){
                account = this.value;
                div = document.getElementById("word_cloud");
                div.innerHTML = '<span class="word_cloud_image"><img src="data/word_cloud/'+account+'.png"></img></span>';
            });

        } else if (data_step_id==5) {
            div = document.getElementById("word_cloud");
            div.innerHTML = '';
            div = document.getElementById("word_cloud_title");
            div.innerHTML = '';
            div = document.getElementById("dropdown_cloud");
            div.innerHTML = '';

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