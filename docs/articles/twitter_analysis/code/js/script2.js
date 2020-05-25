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
            .style('height', graphicHeight + 'px');
            //.style('top', '70px');
            //.style('top', '270px');
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

        idname = "#circle_pack";
        d3.select(idname).select("svg").remove();
        remove_circle_legend();

        idname = "#top_tweets_table";
        var width_scale_factor = 1.0;
        var height_scale_factor = 0.60;
        var margin = {right:10, left:10, top:10, bottom:10};
        var bb = d3.select(idname).node().offsetWidth;
        base_width = bb*width_scale_factor - margin.left - margin.right;
        base_height = bb*height_scale_factor - margin.top - margin.bottom;
        //var color_types = ["#4363d8", "#f58231"];
        //file = "data/most_liked_tweets.csv";
        //top_type = 0; // 0:Individual 1:All Top

        if (data_step_id == 1) {
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

            account = "BarackObama";  // "BBCBreaking";
            show_top_tweets(account, idname, base_width, base_height);
            //draw_circles_pack_likes(idname, file, account, base_width, base_height, color_types, top_type);

            id = document.getElementById("top_tweets_table");
            id.classList.add("top_tweets_table");
            id = document.getElementById("table_title");
            id.classList.add("table_title");

        } else if (data_step_id == 2) {
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

            account = "realDonaldTrump";  // "BBCBreaking";
            show_top_tweets(account, idname, base_width, base_height);
            id = document.getElementById("top_tweets_table");
            id.classList.add("top_tweets_table");
            id = document.getElementById("table_title");
            id.classList.add("table_title");

        } else if (data_step_id == 3) {
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

            account = "KevinHart4real";  // "BBCBreaking";
            show_top_tweets(account, idname, base_width, base_height);
            id = document.getElementById("top_tweets_table");
            id.classList.add("top_tweets_table");
            id = document.getElementById("table_title");
            id.classList.add("table_title");

        } else if (data_step_id == 4) {
            div = document.getElementById("top_tweets_table");
            div.innerHTML = '';
            div = document.getElementById("table_title");
            div.innerHTML = '';
            id = document.getElementById("top_tweets_table");
            id.classList.remove("top_tweets_table");
            id = document.getElementById("table_title");
            id.classList.remove("table_title");

            // Add dropdown to select user
            div = document.getElementById("dropdown_likes");
            div.innerHTML = '<div class="dropdown">' +
              'Select a Twitter Account' +
              '<select class="dropdown_menu" id="select_user"></select>' +
            '</div>';
            setup_dropdown_likes();

            // Update table based on user selection
            $('#select_user').on('change', function(){
                account = this.value;
                show_top_tweets(account, idname, base_width, base_height);
            });
        } else if (data_step_id == 5) {
            div = document.getElementById("top_tweets_table");
            div.innerHTML = '';
            div = document.getElementById("table_title");
            div.innerHTML = '';
            id = document.getElementById("top_tweets_table");
            id.classList.remove("top_tweets_table");
            id = document.getElementById("table_title");
            id.classList.remove("table_title");
            div = document.getElementById("dropdown_likes");
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
