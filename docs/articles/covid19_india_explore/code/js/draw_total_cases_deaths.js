//(function(){

script_load_timeout_list.push(setTimeout(load_totalCasesDeaths_script, 2*script_load_timestep));

function load_totalCasesDeaths_script() {

    // total cases
    idname = "#total_confirmed_cases"
    d3.select(idname).select("svg").remove();
    filename = "data/overall_and_daily_cases_deaths.csv";
    type = "cases";
    width_scale_factor = 0.90;
    height_scale_factor = 0.40;
    var bb = d3.select(idname).node().offsetWidth;
    var margin = {right:40, left:10, top:30, bottom:30};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    fill_color = "#ffb2b2";
    plot_total_cases_deaths(idname, filename, base_width, base_height, type, fill_color, margin);


    // total deaths
    idname = "#total_confirmed_deaths"
    d3.select(idname).select("svg").remove();
    filename = "data/overall_and_daily_cases_deaths.csv";
    type = "deaths";
    width_scale_factor = 0.90;
    height_scale_factor = 0.40;
    var bb = d3.select(idname).node().offsetWidth;
    var margin = {right:40, left:10, top:30, bottom:30};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    fill_color = "#ffb2b2";
    plot_total_cases_deaths(idname, filename, base_width, base_height, type, fill_color, margin);
}

function plot_total_cases_deaths(idname, file, width, height, type, fill_color, margin) {
    // set the dimensions and margins of the graph
        //width = 960 - margin.left - margin.right,
        //height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    //var x = d3.scaleTime().range([0, width]);
    var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_daily_cases_deaths")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

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
    
    if (window.innerWidth >= 768) {
      font_size = "0.75rem";
    } else {
      font_size = "0.5rem";
    }

    // Get the data
    d3.csv(file, function(error, data) {
      if (error) throw error;

      data = data.filter(function(d,i) {
        month = new Date(d.date).getMonth();
        if (month>=2) { // Plot starting from March
          return 1;
        } else {
          return 0;
        }
      })

      // format the data
      data.forEach(function(d) {
          if (type=="cases") {
            d.yvalue = +d.total_confirmed;
          } else {
            d.yvalue = +d.total_deaths;
          }
          d.date = parseTime(d.date);
      });

    // define the line
    var valueline = d3.line()
        .x(function(d) {  return x(d.date); })
        .y(function(d) {  return y(d.yvalue); });

      // Scale the range of the data
      //x.domain(d3.extent(data, function(d) { return d.date; }));
      x.domain(data.map(function(d) {return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.yvalue; })]);

      var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.timeFormat("%b %e"))
        .tickValues(x.domain().filter(function(d,i){ return !(i%25)}));

      // Add the valueline path.
      if (type=="cases") {
        var path1 = svg.append("path")
              .data([data])
              .attr("class", "total_cases_death_line")
              .attr("d", valueline);
      } else {
        var path2 = svg.append("path")
              .data([data])
              .attr("class", "total_cases_death_line")
              .attr("d", valueline);
      }
        /*
          .style("opacity", 0)
            .transition()
                .delay(function(d, i) { console.log(i); return i*100; })
                .duration(function(d, i) { return i*100; })
                .style("opacity", 1);
        */
      if (type=="cases") {
        var totalLength = path1.node().getTotalLength();
        repeat(path1, totalLength);
      } else {
        var totalLength = path2.node().getTotalLength();
        repeat(path2, totalLength);
      }


      svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", "0.20rem")
          .attr("cx", function(d,i) { return x(d.date); })
          .attr("cy", function(d,i) { return y(d.yvalue); })
          .attr("fill", "#cc0000")
          .attr("opacity", 0)
          
          .on("mouseover", function(d, i) {
                d3.select(this).style('fill', fill_color).style("opacity", 0.5);
                if (type=="cases") {
                  return tooltip.html("<div class='well'>"+d.yvalue+" total cases till "+ months_list[d.date.getMonth()] + " " + d.date.getDate() + "</span></div>" ).style("visibility", "visible");
                } else {
                  return tooltip.html("<div class='well'>"+d.yvalue+" total deaths till "+ months_list[d.date.getMonth()] + " " + d.date.getDate() + "</span></div>" ).style("visibility", "visible");
                }
              }
          )
          .on("mousemove", function(){
            if (event.pageX >= window.innerWidth/2) {
              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-100)+"px");
            } else {
              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            }
            //return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
          })
          .on("mouseout", function(d, i){
            //d3.select(this).style('stroke', 'white').style("opacity", 1.0).style("stroke-width", 1).style("stroke-opacity", 1.0);
            d3.select(this).style('fill', "#cc0000").style("opacity", 1.0);
            return tooltip.style("visibility", "hidden");
          });
          

      svg.selectAll(".dot")
            .transition()
              .duration(3000)
              .delay(function(d,i) { return i*50; })
              .attr("opacity", 1)


      // Add the X Axis
      /*
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .style("font-size", "0.75rem");
      */

      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "label_histogram")
          .call(xAxis)
          .style("font-size", font_size)
        .append("text")
          .attr("class", "label_histogram")
          .attr("x", width)
          .attr("y", -40)
          .style("text-anchor", "end")
          .style("fill", "black")
          .style("font-size", font_size);

      format = d3.format(",");
      formattedY = format(y);

      // Add the Y Axis
      svg.append("g")
          .attr("class", "label_histogram axis--y")
          .attr("transform", "translate("+(width-10)+",0)")
          .call(d3.axisRight(y)
            /*
                  .tickFormat( (d,i) => {
                    if (type=="cases") {
                      if (d%2000 === 0) return d;
                    } else {
                      if (d%50 === 0) return d;
                    }
                  })
            */
                //.tickPadding(5)
                .ticks(3))
          .style("font-size", font_size)
        .append("text")
          .attr("class", "label_histogram")
          .attr("transform", "rotate(-90)")
          .attr("x", 0)
          .attr("y", -5)
          .style("text-anchor", "end")
          .text(function(){
            if (type=="cases") {
              return "Total cases";
            } else {
              return "Total deaths";
            }
          })
          .style("fill", "black")
          .style("font-size", font_size);

      svg.selectAll("text")
        .attr("class", "label")
        .style("fill", "black")
        .style("shape-rendering", "crispEdges");

      /*
      svg.selectAll("path")
        .style("stroke", "black")
        .style("font-size", "0.75rem");
      */
      svg.selectAll("line")
        .style("stroke", "black")
        .style("font-size", font_size)
        .style("visibility", "hidden");

    });

}


function repeat(path, totalLength) {
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
          .duration(3000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
          //.on("end", repeat);
}
//})();