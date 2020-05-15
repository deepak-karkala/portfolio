
plot_decade_similarity_top();

function plot_decade_similarity_top() {
  idname = "#decade_similarity_graphic";
  d3.select(idname).select("svg").remove();
  var bb = d3.select(idname).node().offsetWidth;
  var width_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([1.0, 0.90]);
  width_scale_factor = width_scale_factor_width(bb);
  var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.70, 0.30]);
  height_scale_factor = height_scale_factor_width(bb);
  var margin = {right:20, left:60, top:20, bottom:40};
  base_width = bb*width_scale_factor - margin.left - margin.right;
  base_height = bb*height_scale_factor - margin.top - margin.bottom;
  file = "data/decade_similarity.csv";
  plot_decade_similarity(idname, file, base_width, base_height, margin);
}


function plot_decade_similarity(idname, file, width, height, margin) {
    // set the dimensions and margins of the graph
        //width = 960 - margin.left - margin.right,
        //height = 500 - margin.top - margin.bottom;

    // parse the date / time
    //var parseTime = d3.timeParse("%Y-%m-%d");
    //var parseTime = d3.timeParse("%Y");

    // set the ranges
    //var x = d3.scaleTime().range([0, width]);
    var x = d3.scaleLinear().range([0, width]);
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
    
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_decade_similarity")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    // Get the data
    d3.csv(file, function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
          //d.decade = parseTime(d.decade);
          d.decade = +d.decade;
          d.similarity_score = +d.similarity_score;
      });

    // define the line
    var valueline = d3.line()
        .x(function(d) {  return x(d.decade); })
        .y(function(d) {  return y(d.similarity_score); })
        .curve(d3.curveMonotoneX);

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.decade; }));
      y.domain([0, d3.max(data, function(d) { return d.similarity_score; })]);

      // Add the valueline path.
      var path = svg.append("path")
            .data([data])
            .attr("class", "decade_similarity_line")
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
            .duration(0)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
            //.delay(500);
            //.on("end", repeat);
      }

      svg.selectAll(".dot")
        .data(data)
      .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return x(d.decade); })
        .attr("cy", function(d) { return y(d.similarity_score); })
        .attr("r", 5)
        .on("mouseover", function(d){
            d3.select(this).style('stroke', 'black').style("opacity", 1.0).style("stroke-width", 2).style("stroke-opacity", 1.0);
            return tooltip.html("<div class='well'>Average similarity score in <b>"+d.decade+"s: "+Math.round(d.similarity_score*100)/100+"</b></span></div>" ).style("visibility", "visible");
        })
        .on("mousemove", function(){
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(){
            d3.select(this).style('stroke', 'white').style("opacity", 1.0).style("stroke-width", 1).style("stroke-opacity", 1.0);
            return tooltip.style("visibility", "hidden");
        });

      // Add the X Axis
      svg.append("g")
          .attr("class", "axis")
          .style("stroke", "white")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
                .tickFormat( (d,i) => {
                    if (d%10 === 0)  {
                      return d+"s";
                    }
                })
                .tickSize(0)
                .tickPadding(5))
          .append("text")
            .attr("x", width)
            .attr("y", -10)
            .style("text-anchor", "end")
            .text("Decade")
            .style("font-size", "1rem");
            //.style("stroke", "#ffd8b1");

      // Add the Y Axis
      svg.append("g")
          .attr("class", "axis")
          .call(d3.axisLeft(y)
                .tickFormat( (d,i) => {
                  if (d!=0) return d;
                })
                .tickSize(2))
          .style("stroke", "white")
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0)
            .attr("y", -40)
            .style("text-anchor", "end")
            .text("Similarity score")
            .style("font-size", "1rem");
            //.style("stroke", "#ffd8b1");

    });

}