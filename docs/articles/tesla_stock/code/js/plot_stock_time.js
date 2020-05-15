var minDeviceWidth = 375;
var maxDeviceWidth = 1024;

var idname = "#plot_wild_ride_cover";
d3.select(idname).select("svg").remove();
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 1.0;
//var height_scale_factor = 0.50;
var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.45, 0.15]);
var height_scale_factor = height_scale_factor_width(bb);
var margin = {top: 20, right: 20, bottom: 30, left: 50};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
var file = "data/tesla_processed_31032020.csv";
plot_stock_time(idname, file, base_width, base_height);



var idname = "#plot_wild_ride";
d3.select(idname).select("svg").remove();
var bb = d3.select(idname).node().offsetWidth;
var width_scale_factor = 1.0;
//var height_scale_factor = 0.50;
var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.75, 0.45]);
var height_scale_factor = height_scale_factor_width(bb);
var margin = {top: 20, right: 20, bottom: 30, left: 50};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
var file = "data/tesla_processed_31032020.csv";
plot_stock_time(idname, file, base_width, base_height);

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
          .call(d3.axisLeft(y)
                  .tickFormat( (d,i) => {
                    if ( (d%200==0) ) {
                        return d;
                    }
                  }));

    });

}