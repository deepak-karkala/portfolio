var minDeviceWidth = 375;
var maxDeviceWidth = 512; //1024;
var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.6, 0.6])

var idname = "#plot_payoff_matrix";
d3.select(idname).select("svg").remove();
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 0.80;
var height_scale_factor = height_scale_factor_width(bb);
var margin = {top: 90, right: 10, bottom: 10, left: 110};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
file = "data/payoff_matrix.csv";

var minDeviceWidth = 375;
var maxDeviceWidth = 512; //1024;
var num_dots_per_row = 5; //d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([5, 5]);
var row_gap_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([8, 10]);
var col_gap_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 15]);
var box_width_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([6.0, 8.0]);

var base_width_factor = 8;
var row_gap_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([base_width/base_width_factor, base_width/base_width_factor]);
var col_gap_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([base_width/base_width_factor, base_width/base_width_factor]);
var box_width_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([base_width/base_width_factor, base_width/base_width_factor]);

var colorScale = d3.scaleLinear().domain([0, 5])
                        //.range([d3.interpolateBuPu(0), d3.interpolateBuPu(1)]);
                        //.range([d3.interpolateGnBu(0), d3.interpolateGnBu(1)]);
                        .range([d3.interpolateOrRd(0), d3.interpolateOrRd(1)]);
                        //.range(["#ffffff", "#000000"]);

plot_payoff_matrix(idname, file, base_width, base_height, margin, num_dots_per_row);


var idname = "#plot_payoff_legend";
d3.select(idname).select("svg").remove();
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 0.80;
var height_scale_factor = 0.20;
var margin = {top: 10, right: 10, bottom: 10, left: 10};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
plot_payoff_legend(idname, base_width, base_height, margin);

function plot_payoff_matrix(idname, file, width, height, margin, num_dots_per_row) {
	// set the ranges
    var x = d3.scaleLinear()
              .range([0, width]);
              //.padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);

    var svg = d3.select(idname).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    d3.csv(file, function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            d.payoff = +d.payoff;
        });

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d,i) {
                return (i%num_dots_per_row)*row_gap_factor(width);
            })
            .attr("y", function(d,i) {
                return Math.floor(i/num_dots_per_row)*col_gap_factor(width);
            })
            .attr("width", function(d,i) { return box_width_factor(width);})
            .attr("height", function(d,i) { return box_width_factor(width);})
            .style("fill", function(d) { 
                //console.log(colorScale(d.payoff));
                return colorScale(d.payoff); 
            })
            .style("stroke", function(d) { return "#212121"; })
            .attr("opacity", 0)
            .transition()
                .duration(1000)
                .delay(function(d, i) { return i*0.1; })
                .attr("opacity", 1);

        svg.selectAll(".ylabel")
            .data(data.filter(function(d,i){return i%5==0;}))
            .enter().append("text")
            .attr("class", "ylabel")
            .attr("x", -70)
            .attr("y", function(d,i) {
                return Math.floor(i)*col_gap_factor(width)+box_width_factor(width)/2;
            })
            .text(function(d,i){
                return d.player;
            })
            .attr("fill", "black")
            .style("font-size", "0.8rem")
            .style("font-weight", "bold");

        svg.selectAll(".label")
            .data(data.filter(function(d,i){return i%5==0;}))
            .enter().append("text")
            .attr("class", "label")
            .attr("x", 5)
            .attr("y", function(d,i) {
                return Math.floor(i)*row_gap_factor(width)+box_width_factor(width)/2; //+20;
            })
            .text(function(d,i){
                return d.player;
            })
            .attr("transform", "rotate(-90)")
            .attr("fill", "black")
            .style("font-size", "0.8rem")
            .style("font-weight", "bold");

    });
}


function plot_payoff_legend(idname, width, height, margin) {

    var svg = d3.select(idname).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    var linear = d3.scaleLinear()
      .domain([0, 5])
      .range([d3.interpolateOrRd(0), d3.interpolateOrRd(1)]);
      //.range(["#ffffff", "#000000"]);

    svg.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(0,0)");

    var legendLinear = d3.legendColor()
      .shapeWidth(30)
      .cells(6)
      .orient('horizontal')
      .scale(linear);

    svg.select(".legendLinear")
      .call(legendLinear);
}