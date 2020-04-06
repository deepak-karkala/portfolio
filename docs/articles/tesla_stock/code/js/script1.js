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

        //var graphic_text = document.getElementById("graphic_text");
        //graphic_text.innerHTML = "";
        //var graphic_legend = document.getElementById("graphic_legend");
        //graphic_legend.innerHTML = "";

        var idname = "#graphic1";
        var width_scale_factor = 0.90;
        var margin = {right:40, left:40, top:10, bottom:20};
        var bb = d3.select(idname).node().offsetWidth;
        base_width = bb*width_scale_factor - margin.left - margin.right;
        var height_scale_factor = 0.4;
        base_height = bb*height_scale_factor - margin.top - margin.bottom;
        var sector_array = ['Technology', 'Health Care', 'Consumer Services', 'Transportation',
                            'Miscellaneous', 'Consumer Non-Durables', 'Consumer Durables',
                            'Capital Goods', 'Public Utilities', 'Finance'];
        var sector_colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#9A6324',
                            '#46f0f0', '#f032e6', '#bcf60c', '#a9a9a9'];
        var sectorColors = d3.scaleOrdinal()
                                .domain(sector_array)
                                .range(sector_colors);
        
        if (data_step_id==0) {
            d3.select(idname).select("svg").remove();
            var graphic_legend = document.getElementById("graphic_legend");
            graphic_legend.innerHTML = "";
            
            var file = "data/all_companies_all_data.csv";
            var is_random_x = 1;
            var is_random_y = 1;
            var show_x_axis = 0;
            var show_y_axis = 0;
            var show_colors = 0;
            var is_same_radius = 1;
            var show_symbol = 1;
            var show_xaxis = 0;
            var show_yaxis = 0;
            plot_company_circles(idname, file, base_width, base_height, is_random_x, is_random_y,
                show_x_axis, show_y_axis, show_colors, is_same_radius, sectorColors, show_symbol,
                show_only_auto, show_xaxis, show_yaxis);

            //graphic_text = document.getElementById("graphic_text");
            //graphic_text.innerHTML = "Each circle denotes a company listed in NASDAQ Top 100. The circles can be identified by the associated company stock symbols.";

        } else if (data_step_id==1) {
            var idname = "#graphic1";
            //graphic_text = document.getElementById("graphic_text");
            //graphic_text.innerHTML = "Let us the change the color of the companies based on the sectors they operate in";

            /*
            var sector_array = ['Technology', 'Health Care', 'Consumer Services', 'Transportation',
                            'Miscellaneous', 'Consumer Non-Durables', 'Consumer Durables',
                            'Capital Goods', 'Public Utilities', 'Finance'];
            var sector_colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4',
                            '#46f0f0', '#f032e6', '#bcf60c', '#fabebe'];
            */
            graphic_legend = document.getElementById("graphic_legend");
            graphic_legend.innerHTML = ""
            for(var i=0; i<sector_array.length; i++) {
                graphic_legend.innerHTML += `<svg height="20" width="20"><circle cx="10" cy="15" r="5" fill="`+sector_colors[i]+`" /></svg>`+sector_array[i];
            }

            var is_random_x = 1;
            var is_random_y = 1;
            var show_x_axis = 0;
            var show_y_axis = 0;
            var show_colors = 1;
            var is_same_radius = 1;
            var show_symbol = 1;
            var show_xaxis = 0;
            var show_yaxis = 0;
            var idname = "#graphic1";
            var file = "data/all_companies_all_data.csv";
            transition_company_circles(idname, file, base_width, base_height, is_random_x, is_random_y,
                show_x_axis, show_y_axis, show_colors, is_same_radius, sectorColors, show_symbol,
                show_only_auto, show_xaxis, show_yaxis);
           
        } else if (data_step_id==2) {
            var idname = "#graphic1";
            //graphic_text = document.getElementById("graphic_text");
            //graphic_text.innerHTML = "Let us arrange the companies on horizontal axis based on their stock price. Companies with higher stock price are placed on the right.";

            var is_random_x = 0;
            var is_random_y = 1;
            var show_x_axis = 0;
            var show_y_axis = 0;
            var show_colors = 1;
            var is_same_radius = 1;
            var show_symbol = 1;
            var show_xaxis = 1;
            var show_yaxis = 0;
            var idname = "#graphic1";
            var file = "data/all_companies_all_data.csv";
            transition_company_circles(idname, file, base_width, base_height, is_random_x, is_random_y,
                show_x_axis, show_y_axis, show_colors, is_same_radius, sectorColors, show_symbol,
                show_only_auto, show_xaxis, show_yaxis);

        } else if (data_step_id==3) {
            var idname = "#graphic1";
            //graphic_text = document.getElementById("graphic_text");
            //graphic_text.innerHTML = "Let us change the size of the circles based on the market capitalisation of companies";

            var is_random_x = 0;
            var is_random_y = 1;
            var show_x_axis = 0;
            var show_y_axis = 0;
            var show_colors = 1;
            var is_same_radius = 0;
            var show_symbol = 1;
            var show_xaxis = 1;
            var show_yaxis = 0;
            var idname = "#graphic1";
            var file = "data/all_companies_all_data.csv";
            transition_company_circles(idname, file, base_width, base_height, is_random_x, is_random_y,
                show_x_axis, show_y_axis, show_colors, is_same_radius, sectorColors, show_symbol,
                show_only_auto, show_xaxis, show_yaxis);

        } else if (data_step_id==4) {
            var idname = "#graphic1";
            //graphic_text = document.getElementById("graphic_text");
            //graphic_text.innerHTML = "Let us place the companies on vertical axis based on their <em>Annualised Volatility</em>. Investopedia defines <em>Volatility</em> as a statistical measure of the dispersion of returns for a stock. Higher the volatility, higher is the variation in the company stock price";

            var is_random_x = 0;
            var is_random_y = 0;
            var show_x_axis = 0;
            var show_y_axis = 0;
            var show_colors = 1;
            var is_same_radius = 0;
            var show_symbol = 1;
            var show_xaxis = 1;
            var show_yaxis = 1;
            var idname = "#graphic1";
            var file = "data/all_companies_all_data.csv";
            transition_company_circles(idname, file, base_width, base_height, is_random_x, is_random_y,
                show_x_axis, show_y_axis, show_colors, is_same_radius, sectorColors, show_symbol,
                show_only_auto, show_xaxis, show_yaxis);

        } else if (data_step_id==5) {
            var idname = "#graphic1";
            //graphic_text = document.getElementById("graphic_text");
            //graphic_text.innerHTML = "Let us now look at how the stock price and volatility of the NASDAQ Top 100 companies have evolved over the years. The Market Cap (size) is kept as a constant";

        } else if (data_step_id==6) {
            var idname = "#graphic1";
            //graphic_text = document.getElementById("graphic_text");
            //graphic_text.innerHTML = "Let us now consider only those companies operating in <em>Auto-Manufacturing</em> industry. Let us also include prominent auto companies trading on platforms other than NASDAQ";

            var is_random_x = 0;
            var is_random_y = 0;
            var show_x_axis = 0;
            var show_y_axis = 0;
            var show_colors = 1;
            var is_same_radius = 0;
            var show_symbol = 1;
            var show_only_auto = 1;
            var show_xaxis = 1;
            var show_yaxis = 1;
            var idname = "#graphic1";
            var file = "data/all_companies_all_data.csv";
            transition_company_circles(idname, file, base_width, base_height, is_random_x, is_random_y,
                show_x_axis, show_y_axis, show_colors, is_same_radius, sectorColors, show_symbol,
                show_only_auto, show_xaxis, show_yaxis);

        } else if (data_step_id==7) {
            d3.select(idname).select("svg").remove();
            var graphic_legend = document.getElementById("graphic_legend");
            graphic_legend.innerHTML = "";
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

    function transition_company_circles(id, file, width, height, is_random_x, is_random_y,
        show_x_axis, show_y_axis, show_colors, is_same_radius, sectorColors, show_symbol,
        show_only_auto, show_xaxis, show_yaxis) {

        var x = d3.scaleLog()
              .range([0, width]);
        var y = d3.scaleLinear()
              .range([height, 0]);


        d3.csv(file, function(error, data) {
            if (error) throw error;

            data.forEach(function(d, i) {
                d.id = i;
                d.x = +d.prev_close;
                d.y = +d.av;
                d.name = d.name;
                d.symbol = d.symbol;
                d.market_cap = +d.market_cap;
                d.sector = d.Sector;
            });

            xmin = d3.min(data, function(d) { return d.x; });
            xmax = d3.max(data, function(d) { return d.x; })+500;
            ymin = d3.min(data, function(d) { return d.y; })-0.05;
            ymax = d3.max(data, function(d) { return d.y; });
            x.domain([xmin, xmax]);
            y.domain([ymin, ymax]);
            var radiusScale = d3.scaleLinear()
                                .domain([d3.min(data, function(d) { return d.market_cap; }), d3.max(data, function(d) { return d.market_cap; })])
                                .range([0.25, 1.5]);
            d3.select(id)
                .selectAll(".dot")
                .transition()
                    .delay(1000)
                    .duration(2000)
                    .attr("r", function(d) {
                        if (is_same_radius==1) {
                            return "0.25rem";
                        } else {
                            return radiusScale(d.market_cap)+"rem";
                        }
                    })
                    .attr("cx", function(d) {
                        if (is_random_x==1) {
                            return x(d.random_x);
                        } else {
                            return x(d.x);
                        }
                    })
                    .attr("cy", function(d) {
                        if (is_random_y==1) {
                            return y(d.random_y);
                        } else{
                            return y(d.y);
                        }
                    })
                    .style("fill", function(d) { 
                        if (show_colors==1) {
                            return sectorColors(d.sector);
                        } else {
                            return "#aaffc3";
                        }
                    })
                    .style("opacity", function(d,i) {
                        if (show_only_auto==1) {
                            if (d.Industry=="Auto Manufacturing") {
                                return 1;
                            } else {
                                return 0.1;
                            }
                        } else {
                            return 1;
                        }
                    });

            d3.select(id)
                .selectAll(".x_axis")
                .transition()
                    .delay(1000)
                    .duration(2000)
                    .style("opacity", function() {
                        if (show_xaxis==1) {
                            return 1;
                        } else{
                            return 0;
                        }
                    });
            d3.select(id)
                .selectAll(".xlabel")
                .transition()
                    .delay(1000)
                    .duration(2000)
                    .style("opacity", function() {
                        if (show_xaxis==1) {
                            return 1;
                        } else{
                            return 0;
                        }
                    });

            d3.select(id)
                .selectAll(".y_axis")
                .transition()
                    .delay(1000)
                    .duration(2000)
                    .style("opacity", function() {
                        if (show_yaxis==1) {
                            return 1;
                        } else{
                            return 0;
                        }
                    });

            d3.select(id)
                .selectAll(".ylabel")
                .transition()
                    .delay(1000)
                    .duration(2000)
                    .style("opacity", function() {
                        if (show_yaxis==1) {
                            return 1;
                        } else{
                            return 0;
                        }
                    });

            d3.select(id)
                .selectAll(".company_symbol")
                .transition()
                    .delay(1000)
                    .duration(2000)
                    .attr("x", function(d, i) {
                        if (is_random_x==1) {
                            return x(d.random_x);
                        } else {
                            return x(d.x);
                        }
                    })
                    .attr("y", function(d, i) {
                        if (is_random_y==1) {
                            return y(d.random_y);
                        } else{
                            return y(d.y);
                        }
                    })
                    .style("opacity", function(d,i) {
                        if (show_symbol==1) {
                            if (show_only_auto==1) {
                                if (d.Industry=="Auto Manufacturing") {
                                    return 1;
                                } else {
                                    return 0.1;
                                }
                            } else {
                                return 1;
                            }
                        } else {
                            return 0;
                        }
                    });

       });
    }

    function plot_company_circles(id, file, width, height, is_random_x, is_random_y,
        show_x_axis, show_y_axis, show_colors, is_same_radius, sectorColors, show_symbol,
        show_only_auto, show_xaxis, show_yaxis) {

        var x = d3.scaleLog()
              .range([0, width]);
        var y = d3.scaleLinear()
              .range([height, 0]);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisRight(y);

        var svg = d3.select(id).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var colorScale = d3.scaleSequential(d3.interpolateYlOrRd);


        // Tooltip
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip1")
            /*.style("position", "absolute")*/
            .style("z-index", "50")
            .style("visibility", "hidden");


        // Expert bubbles
        d3.csv(file, function(error, data) {
            if (error) throw error;

            data.forEach(function(d, i) {
                d.id = i;
                d.x = +d.prev_close;
                d.y = +d.av;
                d.name = d.name;
                d.symbol = d.symbol;
                d.market_cap = +d.market_cap;
                d.sector = d.Sector;
                d.name = d.name;
            });

            //x.domain([0, 10]);
            //y.domain([0, 10]);
            xmin = d3.min(data, function(d) { return d.x; });
            xmax = d3.max(data, function(d) { return d.x; })+500;
            ymin = d3.min(data, function(d) { return d.y; })-0.05;
            ymax = d3.max(data, function(d) { return d.y; });
            x.domain([xmin, xmax]);
            y.domain([ymin, ymax]);
            xmin = 40;
            xmax = 1000;
            ymin = 0.25;
            ymax = 0.45;
            var radiusScale = d3.scaleLinear()
                                .domain([d3.min(data, function(d) { return d.market_cap; }), d3.max(data, function(d) { return d.market_cap; })])
                                .range([0.25, 1.5]);

            if ((is_random_x==1) && (is_random_y==1)) {
                data.forEach(function(d,i) {
                    d.random_x = getRandomArbitrary(xmin, xmax);
                    d.random_y = getRandomArbitrary(ymin, ymax);
                });
            } else if ((is_random_x==1) && (is_random_y==0)) {
                data.forEach(function(d,i) {
                    d.random_x = getRandomArbitrary(xmin, xmax);
                });
            } else if ((is_random_x==0) && (is_random_y==1)) {
                data.forEach(function(d,i) {
                    d.random_y = getRandomArbitrary(ymin, ymax);
                });
            }

            // x-axis
            svg.append("g")
                .attr("class", "x_axis")
                .attr("transform", "translate(0," + height + ")")
                .style("font-size", "0.65rem")
                .call(xAxis
                        .tickFormat( (d,i) => {
                            if ( ((d<=200)&&(d%20==0)) || (d%200==0) ) {
                                return d;
                            }
                        })
                        .ticks(20, ",.1s")
                    )
                .style("opacity", function() {
                    if (show_xaxis==1) {
                        return 1;
                    } else{
                        return 0;
                    }
                })
              .append("text")
                .attr("class", "xlabel")
                .attr("x", width-20)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("Stock price (Log scale)")
                .attr("fill", "white")
                .style("font-size", "0.75rem")
                .style("opacity", function() {
                    if (show_xaxis==1) {
                        return 1;
                    } else{
                        return 0;
                    }
                });

            // y-axis
            svg.append("g")
                .attr("class", "y_axis")
                .attr("transform", "translate("+(width-20)+",0)")
                .style("font-size", "0.65rem")
                .call(yAxis)
                .style("opacity", function() {
                    if (show_yaxis==1) {
                        return 1;
                    } else{
                        return 0;
                    }
                })
              .append("text")
                .attr("class", "ylabel")
                .attr("transform", "rotate(-90)")
                .attr("y", -20)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Annualised Volatility")
                .attr("fill", "white")
                .style("font-size", "0.75rem")
                .style("opacity", function() {
                    if (show_yaxis==1) {
                        return 1;
                    } else{
                        return 0;
                    }
                });

            svg.selectAll(".dot")
                .data(data
                    .filter( (d,i) => {
                        if ((d.market_cap>=2e10) || (d.Industry=="Auto Manufacturing")) {
                            return 1;
                        } else {
                            return 0;
                        }
                    })
                )
              .enter().append("circle")
                .attr("class", "dot")
                .attr("r", function(d) {
                    if (is_same_radius==1) {
                        return "0.25rem";
                    } else {
                        return radiusScale(d.market_cap)+"rem";
                    }
                })
                .attr("cx", function(d) {
                    if (is_random_x==1) {
                        return x(d.random_x);
                    } else {
                        return x(d.x);
                    }
                })
                .attr("cy", function(d) {
                    if (is_random_y==1) {
                        return y(d.random_y);
                    } else{
                        return y(d.y);
                    }
                })
                .style("fill", function(d) { 
                    if (show_colors==1) {
                        return sectorColors(d.sector);
                    } else {
                        return "#aaffc3";
                    }
                })
                .style("opacity", function(d,i) {
                    if (show_only_auto==1) {
                        if (d.Industry=="Auto Manufacturing") {
                            return 1;
                        } else {
                            return 0.25;
                        }
                    } else {
                        return 1;
                    }
                })
                /*
                .style("fill", function(d) { 
                    console.log(d);
                    return colorScale(d.dangerous*0.75/10);
                })
                */
                .style("stroke", "white")
                .style("stroke-width", "0.75px")
                .style("opacity", 1.0)
                .style("z-index", "10")
                .on("mouseover", function(d, i) {
                    if ( ((d.market_cap>=2e10) || (d.Industry=="Auto Manufacturing")) || (show_only_auto==1 && (d.Industry=="Auto Manufacturing")) ) {
                          //return tooltip.text(d.city).style("visibility", "visible");
                          //d3.select(this).style('stroke', 'white').style("opacity", 1.0).style("stroke-width", 2).style("stroke-opacity", 1.0);
                          return tooltip.html(
                            '<div class="row flex-container">' +
                                '<div class="col-lg-12 col-12">' +
                                    '<span class="company_name">' + d.name + '</span></br>' +
                                    'Sector: <span class="company_sector"><b>' + d.sector + '</b></span></br>' +
                                    'Market Cap: <span class="company_mcap"><b>USD ' + Math.round(d.market_cap/1e9, 4) + ' Billion</b></span></br>' +
                                    'Stock price: <span class="company_close"><b>$' + d.x + '</b></span></br>' +
                                '</div>' +
                            '</div>'
                            )
                          .style("visibility", "visible");
                    }
                })
                .on("mousemove", function(){
                  return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function(d, i){
                  //d3.select(this).style('stroke', 'white').style("opacity", 1.0).style("stroke-width", 1).style("stroke-opacity", 1.0);
                  return tooltip.style("visibility", "hidden");
                });
                /*
              .append("svg:image")
                .attr("xlink:href", "https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/ce2ece60-9b32-11e6-95ab-00163ed833e7/260663710/the-test-fun-for-friends-screenshot.jpg")
                .attr("x", function(d) { return x(d.dangerous);})
                .attr("y", function(d) { return y(d.promising);})
                .attr("height", 50)
                .attr("width", 50);
    */
            svg.selectAll(".text")
                .data(data.filter(function(d,i) { 
                        if ( (d.market_cap>=1e11) || (d.Industry=="Auto Manufacturing") ){
                            if (["AMGN"].includes(d.symbol)) {
                                return 0;
                            } else {
                                return 1;
                            }
                        } else {
                            return 0;
                        }
                    })
                )
              .enter().append("text")
                .attr("class", "company_symbol")
                .attr("x", function(d, i) {
                    if (is_random_x==1) {
                        return x(d.random_x);
                    } else {
                        return x(d.x);
                    }
                })
                .attr("y", function(d, i) {
                    if (is_random_y==1) {
                        return y(d.random_y);
                    } else{
                        return y(d.y);
                    }
                })
                .text(function(d) { return d.symbol;})
                .style("fill", "white")
                .style("font-size", "0.75rem")
                .style("opacity", function(d,i) {
                    if (show_symbol==1) {
                        if (show_only_auto==1) {
                            if (d.Industry=="Auto Manufacturing") {
                                return 1;
                            } else {
                                return 0.25;
                            }
                        } else {
                            return 1;
                        }
                    } else {
                        return 0;
                    }
                });

            svg.selectAll("path")
                .style("stroke", "white");

            svg.selectAll("line")
                .style("stroke", "white");

            svg.selectAll("tick")
                .style("fill", "white");

            svg.selectAll("text")
                .style("fill", "white")
                .style("shape-rendering", "crispEdges");
           
        });
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

})();