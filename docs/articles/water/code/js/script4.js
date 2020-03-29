var map;
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

    }
    
    function handleStepTransition(data_step_id) {
        min_width_plot_map = 100;

        if (data_step_id==1) {
            idname = "#country_water_scarcity";
            d3.select(idname).select("svg").remove();
            div = document.getElementById("data_source3");
            div.innerHTML = "";

        } else if (data_step_id==2) {
            idname = "#country_water_scarcity";
            d3.select(idname).select("svg").remove();
            div = document.getElementById("data_source3");
            div.innerHTML = "";

            var width_scale_factor = 0.80;
            var height_scale_factor = 0.90;
            var margin = {right:10, left:10, top:10, bottom:10};

            idname = "#india_water_plot";
            var bb = d3.select(idname).node().offsetWidth;
            base_width = bb*width_scale_factor - margin.left - margin.right;
            base_height = bb*height_scale_factor - margin.top - margin.bottom;

            //div = document.getElementById("india_title");
            //div.innerHTML = "Clean water and sanitation";

            d3.select(idname).select("svg").remove();
            percent = 10;
            plot_pie_transition(idname, percent, base_width, base_height);

            div = document.getElementById("india_water_stat");
            div.innerHTML = "12 % of India's population <br/>[163,000,000] <br/>lack access to safe water";

            div = document.getElementById("india_water_text");
            div.innerHTML = "That's more than the number of people living in Russia";

            console.log(base_width);

            if (map === undefined) {
                center = [105.3188, 61.5240];
                zoom = 1;
                if (base_width >= min_width_plot_map) {
                    map = plot_map("india_water_map", center, zoom);
                    document.getElementById('india_water_map').className = 'india_water_map';
                }
            } else {
                if (base_width >= min_width_plot_map) {
                    fly_config = {
                        //bearing: 90,
                        center: [105.3188, 61.5240],
                        zoom : 1,
                        //pitch: 20
                    };
                    fly_map(map, fly_config);
                    document.getElementById('india_water_map').className = 'india_water_map';
                }
            }

            div = document.getElementById("data_source4");
            div.innerHTML = '<a href="https://water.org/our-impact/india/"><span class="data_source_link">https://water.org/our-impact/india/</span></a>';
        } else if (data_step_id==3) {
            var width_scale_factor = 0.80;
            var height_scale_factor = 0.90;
            var margin = {right:10, left:10, top:10, bottom:10};

            idname = "#india_water_plot";
            d3.select(idname).select("svg").remove();
            var bb = d3.select(idname).node().offsetWidth;
            base_width = bb*width_scale_factor - margin.left - margin.right;
            base_height = bb*height_scale_factor - margin.top - margin.bottom;

            //div = document.getElementById("india_title");
            //div.innerHTML = "Clean water and sanitation";

            percent = 40;
            plot_pie_transition(idname, percent, base_width, base_height);

            div = document.getElementById("india_water_stat");
            div.innerHTML = "40 % of India's population <br/>[524,000,000] <br/>practice open defecation";

            div = document.getElementById("india_water_text");
            div.innerHTML = "That's more than the number of people living in the entire continent of North America";

            if (base_width >= min_width_plot_map) {
                fly_config = {
                    //bearing: 90,
                    center: [-92.7129, 45.5260],
                    zoom: 1,
                    //pitch: 20
                };
                fly_map(map, fly_config);
                document.getElementById('india_water_map').className = 'india_water_map';
            }

            div = document.getElementById("data_source4");
            div.innerHTML = '<a href="https://water.org/our-impact/india/"><span class="data_source_link">https://water.org/our-impact/india/</span></a>';
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


    function plot_pie_transition(idname, percent, width, height) {
        var minWidth = 60;
        var maxWidth = 180;
        var outer_radius_factor = d3.scaleLinear().domain([minWidth, maxWidth]).range([20, 80]);

        var tau = 2 * Math.PI; // http://tauday.com/tau-manifesto

        // An arc function with all values bound except the endAngle. So, to compute an
        // SVG path string for a given angle, we pass an object with an endAngle
        // property to the `arc` function, and it will return the corresponding string.
        var arc = d3.arc()
            .innerRadius(1)
            .outerRadius(outer_radius_factor(width))
            //.outerRadius(100)
            .startAngle(0);

        // Get the SVG container, and apply a transform such that the origin is the
        // center of the canvas. This way, we don’t need to position arcs individually.
        /*
        var svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height"),
        */
        var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height),

            width = +svg.attr("width"),
            height = +svg.attr("height"),

            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Add the background arc, from 0 to 100% (tau).
        var background = g.append("path")
            .datum({endAngle: tau})
            //.style("fill", "#bdbdbd")
            .style("fill", "#a9a9a9")
            .style("stroke", "black")
            .attr("d", arc);

        // Add the foreground arc in orange, currently showing 12.7%.
        var foreground = g.append("path")
            .datum({endAngle: tau})
            .style("fill", "orange")
            .style("stroke", "black")
            .attr("d", arc)
            .transition()
                .duration(1250)
                .attrTween("d", arcTween(percent/100 * tau));
                //.attrTween("d", arcTween(Math.random() * tau));

        // Every so often, start a transition to a new random angle. The attrTween
        // definition is encapsulated in a separate function (a closure) below.
        /*
        d3.interval(function() {
          foreground.transition()
              .duration(750)
              .attrTween("d", arcTween(Math.random() * tau));
        }, 1500);
        */

        // Returns a tween for a transition’s "d" attribute, transitioning any selected
        // arcs from their current angle to the specified new angle.
        function arcTween(newAngle) {

          return function(d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);

            return function(t) {
              d.endAngle = interpolate(t);
              return arc(d);
            };
          };
        }
    }

    function fly_map(map, fly_config) {
        console.log(map);
        if (map!==undefined) {
            map.flyTo(fly_config);
        }
    }

    function plot_map(map_container, center, zoom) {
        //mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGthcmthbGEwMSIsImEiOiJjamlhOGF1NHUxNGpwM3Ftbm9kOTBtYmlqIn0.eL-ra45PjGsCc1XMc376jg';
        var map1 = new mapboxgl.Map({
            container: map_container,
            //style: 'mapbox://styles/mapbox/light-v9',
            //style: 'mapbox://styles/dkarkala01/cjqg8o2ee0nz82rl82hzwbomb',
            style: 'mapbox://styles/dkarkala01/cjqg91box1dap2sndb7ox2bsi',
            //center: [-73.95397214865059, 40.729869916914076],
            center: center,
            zoom: zoom
        });

        // disable map zoom when using scroll
        map1.scrollZoom.disable();

        // Add zoom and rotation controls to the map.
        map1.addControl(new mapboxgl.NavigationControl());
        return map1;
    }




})();