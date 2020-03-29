//var colorScale = d3.scaleLinear().domain([0, 0.3, 0.7])
//                        .range([ d3.interpolateRdYlGn(0), d3.interpolateRdYlGn(0.5), d3.interpolateRdYlGn(1)]);
var colorScale = d3.scaleLinear().domain([-20, 0, 20])
                        .range([ d3.interpolateRdYlGn(0), d3.interpolateRdYlGn(0.5), d3.interpolateRdYlGn(1)]);


var idname = "#plot_explore";
d3.select(idname).select("svg").remove();
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 1.0;
var height_scale_factor = 0.15;
var margin = {top: 20, right: 20, bottom: 30, left: 40};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
var file = "data/tesla_change_weekly_weekday4.csv";
highlight_all = 1;
selected_date = "";
plot_stock_time_bar(idname, file, base_width, base_height, highlight_all, selected_date);

idname = "#plot_legend";
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 1.0;
var height_scale_factor = 0.25;
var margin = {top: 20, right: 20, bottom: 30, left: 40};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
loss_gain_legend(idname, base_width, base_height);


/*
d3.select("#top_gain_dropdown").selectAll(".btn-group").remove();
dropdown_id = "#top_gain_dropdown";
//setup_dropdown(dropdown_id);

top_gain_dropdown = document.getElementById("top_gain_dropdown");
top_gain_dropdown.innerHTML = `<div class="btn-group">
  <button type="button" class="btn btn-sm btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Top 5 Gains
  </button>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="#">Gain 1</a>
    <a class="dropdown-item" href="#">Gain 2</a>
    <a class="dropdown-item" href="#">Gain 3</a>
    <a class="dropdown-item" href="#">Gain 4</a>
    <a class="dropdown-item" href="#">Gain 5</a>
  </div>
</div>`;

d3.select("#top_loss_dropdown").selectAll(".btn-group").remove();
dropdown_id = "#top_loss_dropdown";
//setup_dropdown(dropdown_id);

top_loss_dropdown = document.getElementById("top_loss_dropdown");
top_loss_dropdown.innerHTML = `<div class="btn-group">
  <button type="button" class="btn btn-sm btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Top 5 Losses
  </button>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="#">Loss 1</a>
    <a class="dropdown-item" href="#">Loss 2</a>
    <a class="dropdown-item" href="#">Loss 3</a>
    <a class="dropdown-item" href="#">Loss 4</a>
    <a class="dropdown-item" href="#">Loss 5</a>
  </div>
</div>`;
*/

gain_loss_explanation = document.getElementById("gain_loss_explanation");
gain_loss_explanation.innerHTML = `<blockquote class="twitter-tweet" id="tweet"><p lang="en" dir="ltr">Am considering taking Tesla private at $420. Funding secured.</p>&mdash; Elon Musk (@elonmusk) <a href="https://twitter.com/elonmusk/status/1026872652290379776?ref_src=twsrc%5Etfw">August 7, 2018</a></blockquote>`;
//gain_loss_explanation.innerHTML = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

date_title = document.getElementById("date_title");
date_title.innerHTML = `August 7 2018 - 7% gain`;
//tweet = document.getElementById("tweet");
//tweet.innerHTML = `<p lang="en" dir="ltr">Am considering taking Tesla private at $420. Funding secured.</p>&mdash; Elon Musk (@elonmusk) <a href="https://twitter.com/elonmusk/status/1026872652290379776?ref_src=twsrc%5Etfw">August 7, 2018</a>`;

//tweet_list_title = document.getElementById("tweet_list_title");
//tweet_list_title.innerHTML = "Elon Musk's tweets during Sep1-Sep10 2018"
//tweet_list = document.getElementById("tweet_list");

//gain_loss_plot_title = document.getElementById("gain_loss_plot_title");
//gain_loss_plot_title.innerHTML = "Weekly changes in Tesla stock price"

function loss_gain_legend(idname, width, height) {
    var svg = d3.select(idname).append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
         .attr("class", "legendLinear")
         .attr("transform", "translate(0,0)");

        var legendLinear = d3.legendColor()
          .shapeWidth(30)
          //.cells([-10, -5, 0, 15, 30])
          .cells([-20, -10, 0, 10, 20])
          .orient('horizontal')
          .scale(colorScale);

        svg.select(".legendLinear")
          .call(legendLinear)
          .style("font-size", "0.6rem")
          .style("fill", "black");
}

function plot_stock_time_bar(idname, file, width, height, highlight_all, selected_date) {

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    //var x = d3.scaleBand()
    var x = d3.scaleTime()
              .range([0, width]);
              //.padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);

    //var colorScale = d3.scaleSequential(d3.interpolateRdYlGn);
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

    // get the data
    d3.csv(file, function(error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function(d) {
        //d.sales = +d.sales;
        //if (new Date(d.date).getFullYear() >= 2013) {
        //if (d.year >= 2013) {
        if (1) {
            d.date = parseTime(d.date);
            d.close = +d.close;
            //console.log(new Date(d.date).getFullYear());
        }
        });

        // Scale the range of the data in the domains
        //x.domain(data.map(function(d) { return d.salesperson; }));
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);

        /*
        var tooltip = d3.select("body")
          .append("div")
          .attr("class", "tooltip1")
          .style("position", "absolute")
          .style("z-index", "10")
          .style("visibility", "hidden");
        */

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

        // append the rectangles for the bar chart
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
            .attr("height", function(d) { return height - y(d.close); })
            //.attr("fill", function(d) { return colorScale(d.nChange); })
            .attr("fill", function(d) { return colorScale(d.change*100); })
            .attr("opacity", function(d) {
                if (highlight_all==1) {
                    return 1;
                } else {
                    if (d.date == selected_date) {
                        return 1;
                    } else {
                        return 0.4;
                    }
                }
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    /*  
        .on("mouseover", function(d) {
            //d3.select(this).style('stroke', 'black').style("stroke-width", 2).style("stroke-opacity", 1.0);
            //d3.select(this)
            console.log(d3.select(this));

            d3.select(this).append("text")
                .attr("x", function(d) { return x(d.date); })
                .attr("y", function(d) { return y(d.close); })
                .attr("text", function(d) { return "test"; } );
            return tooltip.html(
                '<div class="row">' +
                    '<p>Test</p>' +
                '</div>'
                )
                .style("visibility", "visible")
                .style("x", x(d.date))
                .style("y", y(d.close))
                .style("top", "10px")
                .style("left", "10px");
                .style("top", (event.pageY-10)+"px")
                .style("left",(event.pageX+10)+"px");
          })
        //.on("mousemove", function(){
        //  return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        //})
        .on("mouseout", function() {
          d3.select(this).style('stroke', 'none').style("stroke-opacity", 0);
          return tooltip.style("visibility", "hidden");
        });

        /*
        svg.selectAll(".text")
            .data(data)
            .enter().append("text")
            .attr("x", function(d) { return x(d.date); })
            .attr("y", function(d) { return y(d.close); })
            .text(function(d) { return "test"; } );
        */

        // add the x Axis
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
          //.attr("class", "axisWhite");

        // add the y Axis
        svg.append("g")
          .call(d3.axisLeft(y));
          //.attr("class", "axisWhite");

    });
}

/*
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
        d3.select("#graphic4").select("svg").remove();

        if (data_step_id==1) {
            var idname = "#graphic4";
            d3.select(idname).select("svg").remove();
            var bb = d3.select(idname).node().offsetWidth;
            var width_scale_factor = 1.0;
            var height_scale_factor = 0.40;
            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            base_width = bb*width_scale_factor - margin.left - margin.right;
            base_height = bb*height_scale_factor - margin.top - margin.bottom;
            var file = "data/tesla.csv";
            plot_stock_time(idname, file, base_width, base_height);
        } else if (data_step_id==2) {
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

})();
*/
idname = "#gain_loss_comparison";
filename = "data/top_gain_loss.csv";
d3.select(idname).select("svg").remove();
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 1.0;
var height_scale_factor = 0.65;
var margin = {top: 20, right: 20, bottom: 50, left: 40};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
var xname = "percentage_change";
var yname = "short_description";
plot_horizontal_bar(idname, filename, base_width, base_height, margin, xname, yname);


function plot_horizontal_bar(idname, filename, width, height, margin, xname, yname, plot_type) {
  
  var svg = d3.select(idname).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      //var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // set the ranges
  var y = d3.scaleBand()
      .range([height, 0])
      .padding(0.1);

  var x = d3.scaleLinear()
      .range([0, width]);

  d3.csv(filename, function(error, data) {
      // format the data
      data.forEach(function(d) {
          d[xname] = +d[xname];
          console.log(d);
      });

      data.sort(function(a, b){
        return a[xname]-b[xname];
      });

      x.domain(d3.extent(data, function(d) { return d[xname]; })); //.nice();
      y.domain(data.map(function(d) { return d[yname]; }));

      // append the rectangles for the bar chart
      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          /*
          .attr("class", function (d) {
              return "bar xfactor-bar--" + (d[xname] < 0 ? "negative" : "positive");
          })
          */
          .attr("fill", function(d) {
            if (d.type == "gain") {
                return "#77DD77"; //"#B5EAD7"; //"green";
            } else if (d.type == "loss") {
                return "#FFB7B2"; //"red";
            } else if (d.type == "tweet") {
                return "#FFFFBA"; //"blue";
            }
          })
          //.attr("stroke", "black")
          .attr("x", function (d) {
              return x(Math.min(0, d[xname]));
          })
          .attr("y", function (d) {
              return y(d[yname]);
          })
          .attr("width", function (d) {
              return Math.abs(x(d[xname]) - x(0));
          })
          //.style("fill", function(d) { console.log(team_colors(d["team"])); return team_colors(d["team"]); })
          .attr("height", y.bandwidth()*0.80);

      svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
          .attr("x", function (d) {
              //return d[xname]<0 ? x(-0.2) : x(0.2);
              //return x(Math.min(0, d[xname]));
              //return x(d[xname]);
              return d[xname]<0 ? (  d[xname]<-4 ? x(d[xname]) : x(d[xname])-65 ) : x(d[xname])-85;
              //return d[xname]<0 ? x(d[xname]) : x(d[xname])-45;
          })
          .attr("y", function (d) {
              return y(d[yname])+y.bandwidth()/2;
          })
          .text(function (d) { return d.date + ": " + d[xname].toFixed(1)+"%"; })
          //.text(function (d) { return d[xname].toFixed(1)+"%"; })
          .attr("fill", "black")
          .style("font-size", "0.6rem");
          //.style("font-weight", "bold");
          //.text(function (d) { return Math.abs(x(d[xname]) - x(0)); });

      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          /*
            .tickFormat( (d,i) => {
              if ([-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2].includes(d)) {
                return d;
              }
            }))
          */
          .style("font-size", "0.75rem")
        .append("text")
          .attr("class", "impact_label")
          .attr("x", width)
          .attr("y", 30)
          .style("text-anchor", "end")
          .text("% change in Tesla stock price on the day")
          .attr("fill", "black")
          .style("font-size", "0.75rem");

      // add the y Axis
      let yAxisGroup = svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + x(0) + ",0)")
          .call(d3.axisRight(y));

      yAxisGroup.selectAll('.tick')
        .data(data)
        .select('text')
        .attr('x', function(d,i){return d[xname]<0?9:-9;})
        .style('text-anchor', function(d,i){return d[xname]<0?'start':'end';})
        .attr("class", "xfactor_label")
        .style("font-size", "0.75rem");

  });
}

/*
gain_list = '';
        loss_list = '';
        tweet_list = '';
        for (i=0;i<data.length;i++){
            if (data[i].type == "gain") {
                gain_list += '<option value="'+ data[i].id + '">' + data[i].short_description + '</option>';
            } else if (data[i].type == "loss") {
                loss_list += '<option value="'+ data[i].id + '">' + data[i].short_description + '</option>';
            } else if (data[i].type == "tweet") {
                tweet_list += '<option value="'+ data[i].id + '">' + data[i].short_description + '</option>';
            }
        }

        
        $('#select_gain').append(gain_list);
        $('#select_gain').on('change', function(){
            id = this.value;
            alert(id);
        });
*/