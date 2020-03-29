var idname = "#plot_wild_ride";
d3.select(idname).select("svg").remove();
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 1.0;
var height_scale_factor = 0.40;
var margin = {top: 20, right: 20, bottom: 30, left: 50};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
var file = "data/tesla_processed_09032020.csv";
plot_stock_time(idname, file, base_width, base_height);

/*
var idname = "#plot_mcap_av";
d3.select(idname).select("svg").remove();
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 1.0;
var height_scale_factor = 0.40;
var margin = {top: 20, right: 20, bottom: 30, left: 50};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
var file = "data/nasdaq_filtered_av_mcap.csv";
plot_mcap_av(idname, file, base_width, base_height);
*/

function plot_stock_time(idname, file, width, height) {
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

    // define the line
    var valueline = d3.line()
        .x(function(d) {  return x(d.date); })
        .y(function(d) {  return y(d.close); });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.close; })]);

      // Add the valueline path.
      var path = svg.append("path")
            .data([data])
            .attr("class", "stock_time_line")
            .attr("d", valueline)
            .attr("stroke", "darkgrey")
            .attr("stroke-width", "2")
            .attr("fill", "none");
        /*
          .style("opacity", 0)
            .transition()
                .delay(function(d, i) { console.log(i); return i*100; })
                .duration(function(d, i) { return i*100; })
                .style("opacity", 1);
        */
      var totalLength = path.node().getTotalLength();
      repeat();

        function repeat() {
            path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                  .duration(3000)
                  .ease(d3.easeLinear)
                  .attr("stroke-dashoffset", 0)
                  .on("end", repeat);
        }

      // Add the X Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // Add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y));

    });

}

function plot_mcap_av_axes(id, file, width, height, include_outliers, scale) {
    var margin = {top: 20, right: 50, bottom: 30, left: 30};

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var svg = d3.select(id).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(file, function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            if (include_outliers == 1) {
                d.av = +d.av;
                d.name = d.name;
                d.symbol = d.symbol;
                d.lastClose = +d.lastClose;
                d.mcap = +d.mcap;
            } else {
                if (d.mcap <= 1e11) {
                    d.av = +d.av;
                    d.name = d.name;
                    d.symbol = d.symbol;
                    d.lastClose = +d.lastClose;
                    d.mcap = +d.mcap;
                }
            }
        });

        //x.domain(d3.extent(data, function(d) { return d.lastClose+40;} ));
        //y.domain(d3.extent(data, function(d) { return d.av;} ));
        x.domain([0, d3.max(data, function(d) { return d.lastClose;}) ]);
        y.domain([-0.1, d3.max(data, function(d) { return d.av+0.1;}) ]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                //.tickValues(d3.range(240))
                .tickFormat( (d,i) => {
                  if(d%40 === 0) return d;
                }))
            .style("font-size", "0.75rem")
          .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Stock price")
            .attr("fill", "#3f3f3f")
            .style("font-size", "1rem");

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y))
            .style("font-size", "0.75rem")
          .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Annualized volatility")
            .attr("fill", "#3f3f3f")
            .style("font-size", "1rem");
    });
}

function plot_mcap_av_transition(id, file, width, height, include_outliers, scale) {
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    d3.csv(file, function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            if (include_outliers == 1) {
                d.av = +d.av;
                d.name = d.name;
                d.symbol = d.symbol;
                d.lastClose = +d.lastClose;
                d.mcap = +d.mcap;
            } else {
                if (d.mcap <= 1e11) {
                    d.av = +d.av;
                    d.name = d.name;
                    d.symbol = d.symbol;
                    d.lastClose = +d.lastClose;
                    d.mcap = +d.mcap;
                }
            }
        });

        //x.domain(d3.extent(data, function(d) { return d.lastClose;} ));
        //y.domain(d3.extent(data, function(d) { return d.av;} ));
        x.domain([0, d3.max(data, function(d) { return d.lastClose;}) ]);
        y.domain([-0.1, d3.max(data, function(d) { return d.av+0.1;}) ]);

        if (include_outliers == 1) {
            var svg = d3.select(id);
            svg.select(".x")
                .transition()
                .call(d3.axisBottom(x));

            svg.selectAll(".dot")
                .transition()
                .duration(1000)
                    .attr("cx", function(d) { return x(d.lastClose); })
                    .attr("cy", function(d) { return y(d.av); })
                    .attr("r", function(d) { return d.mcap/scale; })
                    .attr("stroke", "black");

            svg.selectAll(".text")
                .transition()
                .duration(1000) 
                    .attr("x", function(d) { return x(d.lastClose+3); })
                    .attr("y", function(d) { return y(d.av); })
                    .text(function(d) { return d.symbol; })
                    .attr("fill", function(d) {
                        if (d.symbol == "TSLA") {
                            return "#cc0000";
                        } else {
                            return "black";
                        }
                    })
                    .style("font-size", "0.75rem");
        } else {
            var svg = d3.select(id);

            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                    .attr("class", "dot")
                    .attr("cx", function(d) { return x(d.lastClose); })
                    .attr("cy", function(d) { return y(d.av); })
                    .attr("r", function(d) { return d.mcap/scale; })
                    .attr("stroke", "black");

            svg.selectAll(".text")
                .data(data.filter(function(d) {return d.symbol == "TSLA";} ))
                .enter().append("text")
                    .attr("class", "text")
                    .attr("x", function(d) { return x(d.lastClose+3); })
                    .attr("y", function(d) { return y(d.av); })
                    .text(function(d) { return d.symbol; })
                    .attr("fill", function(d) {
                        if (d.symbol == "TSLA") {
                            return "#cc0000";
                        } else {
                            return "black";
                        }
                    })
                    .style("font-size", "0.75rem");
        }

        
    });
}

function plot_mcap_av(id, file, width, height, include_outliers, scale) {
    var margin = {top: 20, right: 50, bottom: 30, left: 30};

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var xaxis = d3.axisBottom(x);
    var yaxis = d3.axisLeft(y);

    var svg = d3.select(id).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(file, function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            if (include_outliers == 1) {
                d.av = +d.av;
                d.name = d.name;
                d.symbol = d.symbol;
                d.lastClose = +d.lastClose;
                d.mcap = +d.mcap;
            } else {
                if (d.mcap <= 1e11) {
                    d.av = +d.av;
                    d.name = d.name;
                    d.symbol = d.symbol;
                    d.lastClose = +d.lastClose;
                    d.mcap = +d.mcap;
                }
            }
        });

        //x.domain(d3.extent(data, function(d) { return d.lastClose+40;} ));
        //y.domain(d3.extent(data, function(d) { return d.av;} ));
        x.domain([0, d3.max(data, function(d) { return d.lastClose;}) ]);
        y.domain([-0.1, d3.max(data, function(d) { return d.av+0.1;}) ]);

        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
                .attr("class", "dot")
                .attr("cx", function(d) { return x(d.lastClose); })
                .attr("cy", function(d) { return y(d.av); })
                .attr("r", function(d) { return d.mcap/scale; })
                .attr("opacity", 0)
                .attr("stroke", "black")
                .attr("fill", function(d) {
                    if (d.symbol == "TSLA") {
                        return "#cc0000";
                    } else {
                        return "black";
                    }
                })
                .transition()
                .duration(500)
                    .attr("opacity", 1);

        svg.selectAll(".text")
            .data(data.filter(function(d) {return (d.symbol == "TSLA") || (d.mcap >= 10e9) ;} ))
            .enter().append("text")
                .attr("class", "text")
                .attr("x", function(d) { return x(d.lastClose+3); })
                .attr("y", function(d) { return y(d.av); })
                .text(function(d) { return d.symbol; })
                //.attr("fill", "yellow")
                .style("font-size", "0.75rem");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                //.tickValues(d3.range(240))
                .tickFormat( (d,i) => {
                  if(d%40 === 0) return d;
                }))
            .style("font-size", "0.75rem")
          .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Stock price")
            .attr("fill", "#3f3f3f")
            .style("font-size", "1rem");

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y))
            .style("font-size", "0.75rem")
          .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Annualized volatility")
            .attr("fill", "#3f3f3f")
            .style("font-size", "1rem");
    });
}


(function() {
    // using d3 for convenience
    var container = d3.select('#scroll1');
    var graphic = container.select('.scroll__graphic1');
    var text = container.select('.scroll__text1');
    var step = text.selectAll('.step1');
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
        //d3.select("#graphic1").select("svg").remove();
        var minDeviceWidth = 375;
        var maxDeviceWidth = 1024;
        var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.8, 0.4]);

        var idname = "#graphic1";
        d3.select(idname).select("svg").remove();
        var bb = d3.select(idname).node().offsetWidth;
        var width_scale_factor = 1.0;
        var height_scale_factor =  height_scale_factor_width(bb); //0.40;
        var margin = {top: 20, right: 20, bottom: 30, left: 20};
        base_width = bb*width_scale_factor - margin.left - margin.right;
        base_height = bb*height_scale_factor - margin.top - margin.bottom;
        var file = "data/nasdaq_filtered_av_mcap.csv";

        if (data_step_id==0) {
            
            graphic_text = document.getElementById("graphic_text");
            graphic_text.innerHTML = "To get a sense of the variations of stocks, let us compare the stock prices and Annualized volatility of various companies.";

        } else if (data_step_id==1) {
            var idname = "#graphic1";
            d3.select(idname).select("svg").remove();
            graphic_text = document.getElementById("graphic_text");
            graphic_text.innerHTML = "The graph compares the stock price and Annualized volatility of various companies. The horizontal and vertical axes represent the stock price and Annualized volatility respectively.";

            
            include_outliers = 0;
            scale = 5e9;
            plot_mcap_av_axes(idname, file, base_width, base_height, include_outliers, scale);

        } else if (data_step_id==2) {
            var idname = "#graphic1";
            d3.select(idname).select("svg").remove();
            graphic_text = document.getElementById("graphic_text");
            graphic_text.innerHTML = "The horizontal and vertical axes represent the stock price and Annualized volatility respectively. The data for TESLA is shown in red circle.";

            include_outliers = 0;
            scale = 5e9;
            plot_mcap_av(idname, file, base_width, base_height, include_outliers, scale);
            //plot_mcap_av_transition(idname, file, base_width, base_height, include_outliers, scale);

        } else if (data_step_id==3) {
            var idname = "#graphic1";
            //d3.select(idname).select("svg").remove();
            graphic_text = document.getElementById("graphic_text");
            graphic_text.innerHTML = "Notice the large market cap and high share price of tech giants Amazon and Google.";

            include_outliers = 1;
            scale = 50e9;
            //plot_mcap_av(idname, file, base_width, base_height, include_outliers, scale);
            plot_mcap_av_transition(idname, file, base_width, base_height, include_outliers, scale);
        }
    }

    function init() {
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();
        // 2. setup the scroller passing options
        // this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
            container: '#scroll1',
            graphic: '.scroll__graphic1',
            text: '.scroll__text1',
            step: '.scroll__text1 .step1',
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
