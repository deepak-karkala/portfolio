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
        var stepHeight = Math.floor(window.innerHeight * 0.20);
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

        windowWidth = window.innerWidth;
        if (windowWidth >= 576) {
            var graphicHeight = Math.floor(window.innerHeight * 0.95);
            var graphicMarginTop = Math.floor(graphicHeight / 2);
        } else {
            var graphicHeight = Math.floor(window.innerHeight * 0.55);
            var graphicMarginTop = Math.max(Math.floor(graphicHeight / 2), 60);
        }
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
        //response = { element, direction, index };
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

        if (data_step_id<=3) {
            var idname = "#graphic5";
            d3.select(idname).select("svg").remove();
            var bb = d3.select(idname).node().offsetWidth;
            var width_scale_factor = 1.0;
            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            base_width = bb*width_scale_factor - margin.left - margin.right;
            var file = "data/tesla_change_daily.csv";
            var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.8, 0.4]);
            var height_scale_factor = height_scale_factor_width(bb);
            base_height = bb*height_scale_factor - margin.top - margin.bottom;

            //plot_stock_time_step(idname, file, base_width, base_height);
            plot_stock_time_step_dot(idname, file, base_width, base_height);
        } else if (data_step_id==4) {
            var idname = "#graphic5";
            date_from = new Date(2013,0,1);
            date_to = new Date(2014,0,1);
            start_offset = 6000;
            end_offset = 5000;
            //plot_stock_time_step_animate(idname, date_from, date_to, start_offset, end_offset);
            plot_stock_time_step_dot_animate(idname, date_from, date_to);
        } else if (data_step_id==5) {
            var idname = "#graphic5";
            date_from = new Date(2014,0,1);
            date_to = new Date(2015,0,1);
            start_offset = 4000
            end_offset = 3500;
            plot_stock_time_step_animate(idname, date_from, date_to, start_offset, end_offset);
            //plot_stock_time_step_dot_animate(idname, date_from, date_to);
        } else if (data_step_id==6) {
            var idname = "#graphic5";
            date_from = new Date(2015,0,1);
            date_to = new Date(2016,0,1);
            start_offset = 3500
            end_offset = 3000;
            //plot_stock_time_step_dot_animate(idname, date_from, date_to);
            plot_stock_time_step_animate(idname, date_from, date_to, start_offset, end_offset);
        } else if (data_step_id==7) {
            var idname = "#graphic5";
            date_from = new Date(2016,0,1);
            date_to = new Date(2017,0,1);
            start_offset = 3000
            end_offset = 2500;
            plot_stock_time_step_animate(idname, date_from, date_to, start_offset, end_offset);
            //plot_stock_time_step_dot_animate(idname, date_from, date_to);
        } else if (data_step_id==8) {
            var idname = "#graphic5";
            date_from = new Date(2017,0,1);
            date_to = new Date(2018,0,1);
            start_offset = 2500
            end_offset = 2000;
            plot_stock_time_step_animate(idname, date_from, date_to, start_offset, end_offset);
            //plot_stock_time_step_dot_animate(idname, date_from, date_to);
        } else if (data_step_id==9) {
            var idname = "#graphic5";
            date_from = new Date(2018,0,1);
            date_to = new Date(2019,0,1);
            start_offset = 2000
            end_offset = 1500;
            plot_stock_time_step_animate(idname, date_from, date_to, start_offset, end_offset);
            //plot_stock_time_step_dot_animate(idname, date_from, date_to);
        } else if (data_step_id==10) {
            var idname = "#graphic5";
            date_from = new Date(2019,0,1);
            date_to = new Date(2020,0,1);
            start_offset = 1500
            end_offset = 0;
            plot_stock_time_step_animate(idname, date_from, date_to, start_offset, end_offset);
            //plot_stock_time_step_dot_animate(idname, date_from, date_to);
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

})();

function plot_stock_time_step_animate(idname, date_from, date_to, start_offset, end_offset) {
    path = d3.select(idname).selectAll(".path_line");
    var totalLength = path.node().getTotalLength();
    //console.log(totalLength);
    //console.log(path.node().d);
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", start_offset)
        .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", end_offset);

    /*
    var svg = d3.select(idname);
    svg.selectAll(".bar")
        .attr("opacity", 0)
        .transition()
        .duration(2000)
        .delay(function(d,i) {
            if ((d.date.getTime() <= date_from.getTime())) {
                return 0;
            } else if ((d.date.getTime() >= date_from.getTime()) && (d.date.getTime() <= date_to.getTime())) {
                return 0;
            }else {
                return 0;
            }
        })
        .attr("opacity", function(d) {
            if ((d.date.getTime() <= date_from.getTime())) {
                return 1;
            } else if ((d.date.getTime() >= date_from.getTime()) && (d.date.getTime() <= date_to.getTime())) {
                return 1;
            }else {
                return 0;
            }

        });
    */
}

function plot_stock_time_step_dot_animate(idname, date_from, date_to) {
    d3.select(idname).selectAll("circle")
    //d3.select(idname).selectAll(".path_line")
        .transition()
        .duration(1000)
        .delay(function(d,i) {
            if ((d.date.getTime()>=date_from.getTime()) && (d.date.getTime()<=date_to.getTime())) {
                return i*10;
            } else {
                return 0;
            }
        })
        .style("opacity", function(d,i) {
            if (d.date.getTime()<=date_to.getTime()) {
                return 1;
            } else {
                return 0;
            }
        });
}

function plot_stock_time_step_dot(idname, file, width, height) {
    // set the dimensions and margins of the graph
        //width = 960 - margin.left - margin.right,
        //height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    //var svg = d3.select("body").append("svg")
    var svg = d3.select(idname).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    

    // Get the data
    d3.csv(file, function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
          d.date = parseTime(d.date);
          d.close = +d.close;
      });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.close; })]);

      var circles = svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", function (d) {return x(d.date); })
            .attr("cy", function (d) {return y(d.close); })
            .attr("r", "0.10rem")
            .style("fill", "#cc0000")
            .style("opacity", 0);
            //.style("stroke", "black");

      // Add the X Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // Add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y));

    });

}



function plot_stock_time_step(idname, file, width, height) {
    // set the dimensions and margins of the graph
        //width = 960 - margin.left - margin.right,
        //height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var colorScale = d3.scaleLinear().domain([-20, 0, 20])
                        .range([ d3.interpolateRdYlGn(0), d3.interpolateRdYlGn(0.5), d3.interpolateRdYlGn(1)]);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    //var svg = d3.select("body").append("svg")
    var svg = d3.select(idname).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    var tip = d3.tip()
          .attr('class', 'd3-tip')
          //.offset([0, 0])
          .offset(function(d) { return [0, 0]; })
          .html(function(d) {
            return `<div class="row tooltip1">
                        <p class="tooltip1_text">`+d.close+`</p>
                    </div>`;
          });
    svg.call(tip);

    // Get the data
    d3.csv(file, function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
          d.date = parseTime(d.date);
          d.close = +d.close;
      });

    // define the line
    var valueline = d3.line()
        .x(function(d) {  return x(d.date); })
        .y(function(d) {  return y(d.close); });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.close; })]);

      // Add the valueline path.
      var path_step = svg.append("path")
            .data([data])
            .attr("class", "path_line")
            //.attr("class", "path_step")
            .attr("d", valueline)
            .attr("stroke", "darkgrey")
            .attr("stroke-width", "2")
            .attr("fill", "none")
            .style("opacity", 0.2);
        /*
          .style("opacity", 0)
            .transition()
                .delay(function(d, i) { console.log(i); return i*100; })
                .duration(function(d, i) { return i*100; })
                .style("opacity", 1);
        */
      var totalLength = path_step.node().getTotalLength();
      //console.log(totalLength);
      /*
      path_step
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("animation", "dash 5s linear alternate infinite");
        /*
        .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
        */

      // Add the X Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // Add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y));


    /*

        svg.selectAll(".bar")
          //.data(data.filter(function(d) { return 1; }))
          //.data(data.filter(function(d) { return new Date(d.date).getFullYear() >= 2013; }))
          .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.date); })
            //.attr("width", x.bandwidth())
            .attr("width", 3)
            .attr("y", function(d) { return y(d.close); })
            //.attr("fill", function(d) { return colorScale(d.nChange); })
            .attr("height", function(d) { 
                console.log(y(d.close));
                return height - y(d.close); 
            })
            .attr("fill", function(d) { return colorScale(d.change*100); })
            .attr("opacity", 0)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .transition()
                .duration(100)
                .delay(function(d,i) {return i*2;})
                .attr("opacity", function(d) {
                    return 1;
                });

    */
    });

}