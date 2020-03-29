(function() {
    // using d3 for convenience
    var container = d3.select('#scroll7');
    var graphic = container.select('.scroll__graphic7');
    var text = container.select('.scroll__text7');
    var step = text.selectAll('.step7');
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
        if (data_step_id==2) {
            var width_scale_factor = 1.0;
            var height_scale_factor = 0.70;
            var margin = {right:40, left:40, top:40, bottom:40};

            idname = "#time_to_act";
            var bb = d3.select(idname).node().offsetWidth;
            base_width = bb*width_scale_factor - margin.left - margin.right;
            base_height = bb*height_scale_factor - margin.top - margin.bottom;
            file = "data/diet.csv";

            d3.select(idname).select("svg").remove();
            var elem = document.getElementById('lifestyle');
            console.log(elem);
            if (elem!==null) {
                elem.parentNode.removeChild(elem);
            }
            plot_bar(idname, file, base_width, base_height);

            div = document.getElementById("data_source7");
            div.innerHTML = '<a href="https://planetsave.com/2009/03/20/10-simple-ways-to-conserve-water/"><span class="data_source_link">10 simple ways to conserve water</span></a>';

        } else if (data_step_id==1) {

            idname = "#circle_zoom_out";
            d3.select(idname).select("svg").remove();
            idname = "#country_water_agriculture";
            d3.select(idname).select("svg").remove();

            div = document.getElementById("data_source5");
            div.innerHTML = "";
            div = document.getElementById("farmer_fact");
            if (div!==null) {
              console.log(div);
              div.innerHTML = "";
            }

            width_scale_factor = 0.80;
            height_scale_factor = 0.70;
            margin = {right:10, left:10, top:10, bottom:10};
            idname = "#time_to_act";
            var bb = d3.select(idname).node().offsetWidth;
            base_width = bb*width_scale_factor - margin.left - margin.right;
            base_height = bb*height_scale_factor - margin.top - margin.bottom;

            d3.select(idname).select("svg").remove();
            div = document.getElementById("time_to_act");
            div.innerHTML = '<div id="lifestyle" class="row lifestyle_fact">'+
                               '<div class="col-lg-6 text-center">'+
                                      '<img class="graphic_image" src="data/golf.jpg"/>'+
                                      'One day of water usage in a Golf course ='+
                                '</div>'+
                                '<div class="col-lg-6 text-center">'+
                                     '<img class="graphic_image" src="data/american_family.jpg"/>'+
                                     'one year of water used by an American family.'+
                                '</div>'+
                            '</div>';

            document.getElementById('time_to_act').setAttribute("style","height:550px");
            div = document.getElementById("data_source7");
            div.innerHTML = '<a href="https://www.npr.org/templates/story/story.php?storyId=91363837"><span class="data_source_link">Water-Thirsty Golf Courses Need to Go Green</span></a>';

        } else if (data_step_id==3) {
            var elem = document.getElementById('lifestyle');
            if (elem!==null) {
                elem.parentNode.removeChild(elem);
            }
            div = document.getElementById("time_to_act");
            time_since_page_load_ms = get_time_since_page_load();
            litres_per_minute = 10;
            water_since_page_load_litres = Math.round(time_since_page_load_ms/1000/60 * litres_per_minute*100)/100;
            water_since_page_load_gallons = Math.round(water_since_page_load_litres * 0.264172*100)/100;

            div.innerHTML = '<div id="shower_fact" class="row shower_fact text-center">'+
                             '<div class="col-lg-12">An average shower head would have used '+ water_since_page_load_litres +
            ' litres (' + water_since_page_load_gallons + ' gallons) of water.</div></div>';

            //document.getElementById('time_to_act').setAttribute("style","height:550px");
            div = document.getElementById("data_source7");
            div.innerHTML = "";

        } else if (data_step_id==4) {
            var elem = document.getElementById('shower_fact');
            if (elem!==null) {
                elem.parentNode.removeChild(elem);
            }
        }
    }

    function init() {
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();
        // 2. setup the scroller passing options
        // this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
            container: '#scroll7',
            graphic: '.scroll__graphic7',
            text: '.scroll__text7',
            step: '.scroll__text7 .step7',
            progress: 'true',
            debug: false,
            offset: 0.70,
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

    function plot_bar(idname, file, width, height) {
        var margin = {right:40, left:40, top:40, bottom:60};
        var diet_type = ["140 liters", "1000 liters", "16000 liters"];

        // set the ranges
        var x = d3.scaleBand()
                  .range([0, width])
                  .padding(0.1);
        var y = d3.scaleLinear()
                  .range([height, 0]);
                  
        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select(idname).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        // get the data
        d3.csv(file, function(error, data) {
          if (error) throw error;

          // format the data
          data.forEach(function(d) {
            d.value = +d.value1;
          });

          // Scale the range of the data in the domains
          x.domain(data.map(function(d) { return d.type; }));
          y.domain([0, d3.max(data, function(d) { return d.value; })]);

          // append the rectangles for the bar chart
          svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.type)+x.bandwidth()*0.20; })
              .attr("width", x.bandwidth()*0.60)
              .attr("y", function(d) { return height; })
              //.attr("y", function(d) { return y(d.value); })
              .transition()
                .delay(function(d,i) { return i*10; })
                .duration(1000)
                .attr("y", function(d) { return y(d.value); })
                //.attr("height", function(d) { return height-y(d.value); });
                //.attr("height", function(d) { return height - y(d.value); });
              .attr("height", function(d) { return height - y(d.value);});
            
          // add the x Axis
          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x))
              .style("font-size", 12)
              .style("font-weight", "bold");

          // add the y Axis
          svg.append("g")
              .call(d3.axisLeft(y))
              .style("font-size", 12)
              .style("font-weight", "bold")
              .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Liters of water required")
                .style("font-weight", "bold")
                .attr("fill", "black")
                .style("font-size", 14);

          svg.selectAll(".text")
              .data(data)
            .enter().append("text")
              .attr("x", function(d) { return x(d.type)+x.bandwidth()*0.25; })
              .attr("y", function(d) { return y(d.value+100); })
              .text(function(d,i) { return diet_type[i]; })
              .style("stroke", "#e50000");

        });
    }

    function get_time_since_page_load() {
        // Feature detects Navigation Timing API support.
        if (window.performance) {
          // Gets the number of milliseconds since page load
          // (and rounds the result since the value must be an integer).
          var timeSincePageLoad = Math.round(performance.now());

          // Sends the timing hit to Google Analytics.
          //ga('send', 'timing', 'JS Dependencies', 'load', timeSincePageLoad);
          return timeSincePageLoad;
        }
    }

})();