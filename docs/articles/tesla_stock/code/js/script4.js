var minDeviceWidth = 375;
var maxDeviceWidth = 1024;
//var colorScale = d3.scaleLinear().domain([0, 0.3, 0.7])
//                        .range([ d3.interpolateRdYlGn(0), d3.interpolateRdYlGn(0.5), d3.interpolateRdYlGn(1)]);
var colorScale = d3.scaleLinear().domain([-20, 0, 20])
                        .range([ d3.interpolateRdYlGn(0), d3.interpolateRdYlGn(0.5), d3.interpolateRdYlGn(1)]);

//plot_stock_time_bar(idname, file, base_width, base_height, highlight_all, selected_date);
plot_stock_time_box();

idname = "#plot_legend";
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 1.0;
var margin = {top: 20, right: 20, bottom: 30, left: 40};
base_width = bb*width_scale_factor - margin.left - margin.right;
var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.50, 0.25]);
var height_scale_factor = height_scale_factor_width(bb);
base_height = bb*height_scale_factor - margin.top - margin.bottom;

var shape_width_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([25, 30]);
shape_width = shape_width_factor(bb);
loss_gain_legend(idname, base_width, base_height, shape_width);

$('#dropdown-gain a').on('click', function(){
    id = parseInt(this.text.split(" ")[1]);
    filename = "data/top_gain_loss.csv";
    setup_dropdown_menu(filename, id);
});
$('#dropdown-loss a').on('click', function(){
    id = 5 + parseInt(this.text.split(" ")[1]);
    filename = "data/top_gain_loss.csv";
    setup_dropdown_menu(filename, id);
});
$('#dropdown-tweet a').on('click', function(){
    id = 10 + parseInt(this.text.split(" ")[1]);
    filename = "data/top_gain_loss.csv";
    setup_dropdown_menu(filename, id);
});
$('#show_all_days_button').on('click', function() {
    gain_loss_explanation = document.getElementById("gain_loss_explanation");
    gain_loss_explanation.innerHTML = "";
    date_title = document.getElementById("date_title");
    date_title.innerHTML = "";

    highlight_all = 1;
    highlight_stock_day("#plot_explore_2013", selected_date);
    highlight_stock_day("#plot_explore_2014", selected_date);
    highlight_stock_day("#plot_explore_2015", selected_date);
    highlight_stock_day("#plot_explore_2016", selected_date);
    highlight_stock_day("#plot_explore_2017", selected_date);
    highlight_stock_day("#plot_explore_2018", selected_date);
    highlight_stock_day("#plot_explore_2019", selected_date);
});

function setup_dropdown_menu(filename, id) {
    
    d3.csv(filename, function(error, data) {
        // format the data
        data.forEach(function(d) {
          d[xname] = +d[xname];
        });

        gain_loss_explanation = document.getElementById("gain_loss_explanation");
        //gain_loss_explanation.innerHTML = `<blockquote class="twitter-tweet" id="tweet"><p lang="en" dir="ltr">Am considering taking Tesla private at $420. Funding secured.</p>&mdash; Elon Musk (@elonmusk) <a href="https://twitter.com/elonmusk/status/1026872652290379776?ref_src=twsrc%5Etfw">August 7, 2018</a></blockquote>`;
        gain_loss_explanation.innerHTML = data[id-1].explanation;

        date_title = document.getElementById("date_title");
        date_title.innerHTML = data[id-1].date + ": " + data[id-1].percentage_change + "%";  //`August 7 2018 - 7% gain`;

        selected_date = new Date(data[id-1].date_format); //new Date("2019-09-04"); //data[id-1].date;
        selected_date.setHours(0,0,0);
        //next_friday_date = new Date(selected_date.getTime() + (5-selected_date.getDay())*(8.64e+7))
        //next_friday_date.setHours(0,0,0);

        //console.log(next_friday_date);
        highlight_all = 0;
        highlight_stock_day("#plot_explore_2013", selected_date, highlight_all);
        highlight_stock_day("#plot_explore_2014", selected_date, highlight_all);
        highlight_stock_day("#plot_explore_2015", selected_date, highlight_all);
        highlight_stock_day("#plot_explore_2016", selected_date, highlight_all);
        highlight_stock_day("#plot_explore_2017", selected_date, highlight_all);
        highlight_stock_day("#plot_explore_2018", selected_date, highlight_all);
        highlight_stock_day("#plot_explore_2019", selected_date, highlight_all);

    });

}

function highlight_stock_day(id, selected_date, highlight_all) {
    var svg = d3.select(id);
    svg.selectAll(".bar")
        .style("stroke", function(d) {
            if (highlight_all == 0) {
                if (d.date.getTime() == selected_date.getTime()) {
                    return "white";
                } else {
                    return "#212121";
                }
            } else {
                return "#212121";
            }
        })
        .style("stroke-width",0.5)
        .transition()
            .duration(500)
            .attr("opacity", 1)
        .transition(500)
            .duration(500)
            .attr("opacity", function(d) {
                if (highlight_all == 0) {
                    if (d.date.getTime() == selected_date.getTime()) {
                        return 1;
                    } else {
                        return 0.3;
                    }
                } else {
                    return 1;
                }
            });        
}


function loss_gain_legend(idname, width, height, shapeWidth) {
    var svg = d3.select(idname).append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
         .attr("class", "legendLinear")
         .attr("transform", "translate(0,0)");

        var legendLinear = d3.legendColor()
          .shapeWidth(shapeWidth)
          //.cells([-10, -5, 0, 15, 30])
          .cells([-14, -7, 0, 10, 20])
          .orient('horizontal')
          .scale(colorScale);

        svg.select(".legendLinear")
          .call(legendLinear)
          .style("font-size", "0.6rem")
          .style("fill", "white");
}


function plot_stock_time_box() {

    var idname = "#plot_explore_2013";
    d3.select(idname).select("svg").remove();
    var bb = d3.select(idname).node().offsetWidth;
    var width_scale_factor = 1.0;
    var margin = {top: 0, right: 20, bottom: 0, left: 50};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    highlight_all = 1;
    selected_date = "";
    //plot_stock_time_bar(idname, file, base_width, base_height, highlight_all, selected_date);
    
    
    var num_dots_per_row = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([45, 100]);
    num_dots_per_row_width = Math.floor(num_dots_per_row(base_width));
    var row_gap_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([8, 10]);
    var col_gap_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 15]);
    var box_width_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([6.0, 8.0]);

    var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.20, 0.04]);
    var height_scale_factor = height_scale_factor_width(bb);
    base_height = bb*height_scale_factor - margin.top - margin.bottom;

    plot_boxes("#plot_explore_2013", "data/tesla_change_daily_2013.csv", base_width, base_height,
                margin, num_dots_per_row_width, row_gap_factor, box_width_factor, col_gap_factor);
    plot_boxes("#plot_explore_2014", "data/tesla_change_daily_2014.csv", base_width, base_height,
                margin, num_dots_per_row_width, row_gap_factor, box_width_factor, col_gap_factor);
    plot_boxes("#plot_explore_2015", "data/tesla_change_daily_2015.csv", base_width, base_height,
                margin, num_dots_per_row_width, row_gap_factor, box_width_factor, col_gap_factor);
    plot_boxes("#plot_explore_2016", "data/tesla_change_daily_2016.csv", base_width, base_height,
                margin, num_dots_per_row_width, row_gap_factor, box_width_factor, col_gap_factor);
    plot_boxes("#plot_explore_2017", "data/tesla_change_daily_2017.csv", base_width, base_height,
                margin, num_dots_per_row_width, row_gap_factor, box_width_factor, col_gap_factor);
    plot_boxes("#plot_explore_2018", "data/tesla_change_daily_2018.csv", base_width, base_height,
                margin, num_dots_per_row_width, row_gap_factor, box_width_factor, col_gap_factor);
    plot_boxes("#plot_explore_2019", "data/tesla_change_daily_2019.csv", base_width, base_height,
                margin, num_dots_per_row_width, row_gap_factor, box_width_factor, col_gap_factor);
    
}

function plot_boxes(idname, file, width, height, margin, num_dots_per_row_width,
  row_gap_factor, box_width_factor, col_gap_factor) {

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleLinear()
              .range([0, width]);
              //.padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);

    var svg = d3.select(idname).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height) // + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + 0 + ")");
                //"translate(" + margin.left + "," + margin.top + ")");

    // get the data
    d3.csv(file, function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
            year = d.year;
        });

        
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d,i) {
                return (i%num_dots_per_row_width)*row_gap_factor(width);
            })
            .attr("y", function(d,i) {
                return Math.floor(i/num_dots_per_row_width)*col_gap_factor(width);
            })
            .attr("width", function(d,i) { return box_width_factor(width);})
            .attr("height", function(d,i) { return box_width_factor(width);})
            .style("fill", function(d) { return colorScale(d.change*100); })
            .style("stroke", function(d) { return "#212121"; })
            .attr("opacity", 0)
            .transition()
                .duration(1000)
                .delay(function(d, i) { return i*0.1; })
                .attr("opacity", 1);

        svg.append("text")
            .attr("class", "label")
            .attr("y", 6)
            .attr("x", -10)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(year)
            .attr("fill", "white")
            .style("font-size", "0.75rem");

    });
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
            //.attr("fill", function(d) { return colorScale(d.nChange); })
            .attr("height", function(d) { return height - y(d.close); })
            .attr("fill", function(d) { return colorScale(d.change*100); })
            .attr("opacity", 0)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .transition()
                .duration(100)
                .delay(function(d,i) {return i*2;})
                .attr("opacity", function(d) {
                    console.log(d.date);
                    if (highlight_all==1) {
                        return 1;
                    } else {
                        //console.log(selected_date);
                        //console.log(d.date.getTime() == selected_date.getTime());
                        if (d.date.getTime() == selected_date.getTime()) {
                            return 1;
                        } else {
                            return 0.2;
                        }
                    }
                });
            

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

idname = "#gain_loss_comparison";
filename = "data/top_gain_loss.csv";
d3.select(idname).select("svg").remove();
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 0.95;
var margin = {top: 20, right: 20, bottom: 50, left: 60};
base_width = bb*width_scale_factor - margin.left - margin.right;
var xname = "percentage_change";
var yname = "short_description";
var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.8, 0.65]);
var height_scale_factor = height_scale_factor_width(bb);
base_height = bb*height_scale_factor - margin.top - margin.bottom;

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
          .style("font-size", "0.4rem");
          //.style("font-weight", "bold");
          //.text(function (d) { return Math.abs(x(d[xname]) - x(0)); });

      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .style("font-size", "0.5rem")
        .append("text")
          .attr("class", "impact_label")
          .attr("x", width)
          .attr("y", 30)
          .style("text-anchor", "end")
          .text("% change in Tesla stock price on the day")
          .attr("fill", "black")
          .style("font-size", "0.5rem");

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
        .style("font-size", "0.45rem");

  });
}