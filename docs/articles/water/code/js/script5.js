(function() {
    // using d3 for convenience
    var container = d3.select('#scroll5');
    var graphic = container.select('.scroll__graphic5');
    var text = container.select('.scroll__text5');
    var step = text.selectAll('.step5');
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
    function handleProgressTransition(data_step_id, progress) {

        agriculture_gdp_radius = d3.scaleLinear().domain([0,1]).range([1,1]);
        rest_gdp_radius = d3.scaleLinear().domain([0,1]).range([1,9.4]);

        if (data_step_id == 3) {
            idname = "#country_water_agriculture";
            d3.select(idname).selectAll("circle")
                .attr("r", function(d,i) {
                        if (d.type===0) {
                            return agriculture_gdp_radius(progress);
                        } else{
                            console.log(rest_gdp_radius(progress));
                            return rest_gdp_radius(progress);
                        }
                    });
        }
    }

    function remove_id_text(idname) {
        div = document.getElementById(idname);
        div.innerHTML = "";
    }

    function handleStepTransition(data_step_id) {
        if (data_step_id==1) {

            //remove_id_text("country_water_agriculture");
            idname = "#country_water_agriculture";
            d3.select(idname).select("svg").remove();

            div = document.getElementById("india_water_stat");
            div.innerHTML = "";
            div = document.getElementById("india_water_text");
            div.innerHTML = "";
            div = document.getElementById("data_source4");
            div.innerHTML = "";
            document.getElementById('india_water_map').classList.remove('india_water_map');

            idname = "#india_water_plot";
            d3.select(idname).select("svg").remove();
            idname = "#india_water_plot";
            if (map!==undefined) {
                map.remove();
            }

            idname = "#country_water_agriculture_gauge";
            //var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            //base_height = Math.max(500, viewport_height*0.85);
            //document.getElementById('time_to_act').setAttribute("style","height:"+base_height+"px");

            if (!d3.select(idname).empty()) {
                plot_water_gauge(idname);
            }
            div = document.getElementById("data_source5");
            div.innerHTML = '<a href="https://www.orfonline.org/expert-speak/if-80-water-consumption-in-india-is-for-agriculture-why-is-it-unregulated-and-inefficient/"><span class="data_source_link">If 80% water consumption in India is for agriculture, why is it unregulated and inefficient?</span></a>';

        } else if (data_step_id==2) {
            remove_id_text("country_water_agriculture");
            idname = "#country_water_agriculture_gauge";
            d3.select(idname).remove();
            /*
            var elem = document.getElementById('country_water_agriculture_gauge');
            if (elem!==null) {
                elem.parentNode.removeChild(elem);
            }
            */
            var width_scale_factor = 1.0;
            var height_scale_factor = 0.90;
            var margin = {right:10, left:10, top:10, bottom:10};

            idname = "#country_water_agriculture";
            var bb = d3.select(idname).node().offsetWidth;
            base_width = bb*width_scale_factor - margin.left - margin.right;

            //base_height = bb*height_scale_factor - margin.top - margin.bottom;
            var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            base_height = viewport_height*0.85;

            d3.select(idname).select("svg").remove();
            file = "data/india_population_circlepacking.csv";
            var fill_color = "#a2d0ff";
            var stroke_color = "#0481ff";
            var init_opacity = 1.0;
            var duration = 1000;
            var india_population_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([4, 6]);
            draw_india_circles_pack(idname, file, base_width, base_height, fill_color, stroke_color, india_population_radius_factor, init_opacity, duration);
            
            div = document.getElementById("data_source5");
            div.innerHTML = '<a href="https://scroll.in/article/840655/farm-crisis-why-should-bharat-have-to-feed-india-at-its-cost"><span class="data_source_link">Farm crisis: Why should Bharat have to feed India at its cost?</span></a>';

        } else if (data_step_id==3) {
            remove_id_text("country_water_agriculture");
            var width_scale_factor = 1.0;
            height_scale_factor = 0.90;
            margin = {right:10, left:10, top:10, bottom:10};

            idname = "#country_water_agriculture";
            var bb = d3.select(idname).node().offsetWidth;
            base_width = bb*width_scale_factor - margin.left - margin.right;
            
            //base_height = bb*height_scale_factor - margin.top - margin.bottom;
            var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            base_height = viewport_height*0.85;

            //d3.select(idname).select("svg").remove();
            file = "data/india_gdp_circlepacking.csv";
            var fill_color = "#a2d0ff";
            var stroke_color = "#0481ff";
            var init_opacity = 1.0;
            var duration = 10;
            india_population_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([4, 6]);
            draw_india_circles_pack(idname, file, base_width, base_height, fill_color, stroke_color, india_population_radius_factor, init_opacity, duration);
            
            div = document.getElementById("data_source5");
            div.innerHTML = '<a href="https://scroll.in/article/840655/farm-crisis-why-should-bharat-have-to-feed-india-at-its-cost"><span class="data_source_link">Farm crisis: Why should Bharat have to feed India at its cost?</span></a>';

        } else if (data_step_id==4) {
            remove_id_text("country_water_agriculture");
            var width_scale_factor = 1.0;
            var height_scale_factor = 0.90;
            var margin = {right:10, left:10, top:10, bottom:10};

            idname = "#country_water_agriculture";
            var bb = d3.select(idname).node().offsetWidth;
            base_width = bb*width_scale_factor - margin.left - margin.right;

            //base_height = bb*height_scale_factor - margin.top - margin.bottom;
            var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            base_height = viewport_height*0.80;

            d3.select(idname).select("svg").remove();

            if (base_width >= 200) {
                hexbin(idname, base_width, base_height);
            }
            div = document.getElementById("data_source5");
            div.innerHTML = '<a href="https://scroll.in/article/840655/farm-crisis-why-should-bharat-have-to-feed-india-at-its-cost"><span class="data_source_link">Farm crisis: Why should Bharat have to feed India at its cost?</span></a>';

        } else if (data_step_id==5) {
            //remove_id_text("country_water_agriculture");
            var width_scale_factor = 1.0;
            var height_scale_factor = 0.90;
            var margin = {right:10, left:10, top:10, bottom:10};
            idname = "#country_water_agriculture";
            var bb = d3.select(idname).node().offsetWidth;
            base_width = bb*width_scale_factor - margin.left - margin.right;

            //base_height = bb*height_scale_factor - margin.top - margin.bottom;
            var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            base_height = viewport_height*0.80;

            if (base_width >= 200) {
                d3.select(idname).select(".hexagon").selectAll("path")
                    .transition()
                        .delay(function(d,i){ return i*2;} )
                        .duration(100)
                        .attr("class", function(d,i) {
                            if (d !== undefined) {
                                return d.fill ? "fill" : null;
                            }
                        });
            }
            div = document.getElementById("data_source5");
            div.innerHTML = '<a href="http://www.scind.org/286/Social-Issues/farmers-suicide-an-indian-perspective.html"><span class="data_source_link">Farmers Suicide: An Indian Perspective</span></a>';


        } else if (data_step_id==6) {
            idname = "#country_water_agriculture";
            d3.select(idname).select("svg").remove();

            document.getElementById('country_water_agriculture').setAttribute("style","height:550px");

            div = document.getElementById("country_water_agriculture");
            //div.innerHTML = "Around 15,000 farmers commit suicide every year accounting for around 10% of all suicides in India";
            div.innerHTML = '<div id="farmer_fact" class="row farmer_fact text-center"><div class="col-lg-12"><h3>Around 15,000 farmers commit suicide every year accounting for about 10% of all suicides in India</h3></div></div>';

            div = document.getElementById("data_source5");
            div.innerHTML = '<a href="http://www.ipsnews.net/2018/03/water-scarcity-indias-silent-crisis/"><span class="data_source_link">Water Scarcity: India’s Silent Crisis</span></a>';

        }
    }

    function init() {
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();
        // 2. setup the scroller passing options
        // this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
            container: '#scroll5',
            graphic: '.scroll__graphic5',
            text: '.scroll__text5',
            step: '.scroll__text5 .step5',
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


    function plot_water_gauge(idname) {

        d3.select(idname).call(d3.liquidfillgauge, 100, {
          circleColor: "#f58231", //"#FF7777",
          textColor: "#FF4444",
          waveTextColor: "#FFAAAA",
          waveColor: "#40a4df", //"#FFDDDD",
          circleThickness: 0.2,
          textVertPosition: 0.2,
          waveAnimateTime: 1000,
          backgroundColor: "#e0e0e0",
          valueCountUpAtStart: false,
          waveRiseAtStart: false
        });

        d3.select(idname).on("valueChanged")(20);

    }
})();