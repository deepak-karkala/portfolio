//script_load_timeout_list.push(setTimeout(load_dailyCasesDeaths_script, 2*script_load_timestep));


function load_dailyCasesDeaths_script() {
  // Daily cases
  idname = "#new_cases_day"
  d3.select(idname).select("svg").remove();
  filename = "data/overall_and_daily_cases_deaths.csv";
  type = "cases";
  width_scale_factor = 0.90;
  height_scale_factor = 0.40;
  var bb = d3.select(idname).node().offsetWidth;
  var margin = {right:40, left:15, top:10, bottom:30};
  base_width = bb*width_scale_factor - margin.left - margin.right;
  base_height = bb*height_scale_factor - margin.top - margin.bottom;
  fill_color = "#ffb2b2";
  is_cover = 0;
  plot_daily_cases_deaths(idname, filename, base_width, base_height, type, fill_color, margin);


  // Daily deaths
  idname = "#new_deaths_day"
  d3.select(idname).select("svg").remove();
  filename = "data/overall_and_daily_cases_deaths.csv";
  type = "deaths";
  width_scale_factor = 0.90;
  height_scale_factor = 0.40;
  var bb = d3.select(idname).node().offsetWidth;
  var margin = {right:40, left:15, top:10, bottom:30};
  base_width = bb*width_scale_factor - margin.left - margin.right;
  base_height = bb*height_scale_factor - margin.top - margin.bottom;
  fill_color = "#ffb2b2";
  is_cover = 0;
  plot_daily_cases_deaths(idname, filename, base_width, base_height, type, fill_color, margin)
}

//(function(){

function plot_daily_cases_deaths(idname, filename, width, height, type, fill_color, margin) {

    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_daily_cases_deaths")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    // gridlines in y axis function
    function make_y_gridlines() {   
        return d3.axisLeft(y).ticks(3)
    }

    //var x = d3.scaleTime().range([0, width]);
    var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    var yAxis = d3.axisRight()
                  .scale(y)
                  .ticks(4);

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");
          
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(idname).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (window.innerWidth >= 768) {
      font_size = "0.75rem";
    } else {
      font_size = "0.5rem";
    }

    // get the data
    d3.csv(filename, function(error, data) {
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
            d.yvalue = +d.daily_confirmed;
            d.rolling_avg = +d["rolling_avg_confirmed"];
          } else {
            d.yvalue = +d.daily_deaths;
            d.rolling_avg = +d["rolling_avg_deaths"];
          }
          d.date = parseTime(d.date);
          //latest_case_count = +d.daily_confirmed;
          //latest_death_count = +d.daily_deaths;
      });

      // Scale the range of the data in the domains
      //x.domain(data.map(function(d) { return d.bins; }));
      //x.domain(d3.extent(data, function(d) { return d.date; }));
      x.domain(data.map(function(d) {return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.yvalue; })]);

      // define the line
      var valueline = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.rolling_avg); });

      var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.timeFormat("%b %e"))
        .tickValues(x.domain().filter(function(d,i){ return !(i%20)}));

      var g = svg.selectAll("."+type+"_bars")
                .data(data)
                .enter().append("g");
      // append the rectangles for the bar chart
      g.append("rect")
          .attr("class", type+"_bars")
          .attr("x", function(d) {
            return x(d.date);
          })
          .attr("width", x.bandwidth()*0.8)
          //.attr("y", function(d) { return y(d.num_listings_eu); })
          //.attr("height", function(d) { return height - y(d.num_listings_eu); })
          .attr("y", function(d) { return height; })
          .attr("height", function(d) { return 0; })
          .style("fill", fill_color)
          .on("mouseover", function(d){
            //return tooltip.text(d.city).style("visibility", "visible");
            d3.select(this).style('fill', fill_color).style("opacity", 0.5);
            if (type == "cases") {
              return tooltip.html("<div class='well'>"+d.yvalue+" new cases on "+ months_list[d.date.getMonth()] + " " + d.date.getDate() + "</span></div>" ).style("visibility", "visible");
            } else {
              return tooltip.html("<div class='well'>"+d.yvalue+" deaths on "+ months_list[d.date.getMonth()] + " " + d.date.getDate() + "</span></div>" ).style("visibility", "visible");
            }
          })
          .on("mousemove", function(){
            if (event.pageX >= window.innerWidth/2) {
              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-100)+"px");
            } else {
              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            }
            //return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
          })
          .on("mouseout", function(){
            d3.select(this).style('fill', fill_color).style("opacity", 1.0);
            return tooltip.style("visibility", "hidden");
          });

      d3.selectAll("."+type+"_bars")
        .transition()
        .delay(function(d, i) { return i * 50; })
        .attr("y", function(d) { return y(d.yvalue); })
        .attr("height", function(d) { return height - y(d.yvalue); });

      // Add the valueline path.
      path = svg.append("path")
                .data([data])
                .attr("class", "rolling_avg_line")
                .attr("d", valueline);

      var totalLength = path.node().getTotalLength();
      repeat();

        function repeat() {
            path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                  .duration(3000)
                  .ease(d3.easeLinear)
                  .attr("stroke-dashoffset", 0);
        }

      // add the x Axis
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

      // add the y Axis
      svg.append("g")
          .attr("class", "label_histogram axis--y")
          .attr("transform", "translate("+(width)+",0)")
          .call(yAxis)
          .style("font-size", font_size)
        .append("text")
          .attr("class", "label_histogram")
          .attr("transform", "rotate(-90)")
          .attr("x", 0)
          .attr("y", -5)
          .style("text-anchor", "end")
          .text(function(){
            if (type=="cases") {
              return "Daily cases";
            } else {
              return "Daily deaths";
            }
          })
          .style("fill", "black")
          .style("font-size", font_size);

      /*
      // add the Y gridlines
      svg.append("g")     
          .attr("class", "grid")
          .call(make_y_gridlines()
              .tickSize(-width)
              .tickFormat("")
          );
      */

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


function plot_daily_cases_deaths_cover(idname, filename, width, height, type, fill_color, margin) {

    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_daily_cases_deaths")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    // gridlines in y axis function
    function make_y_gridlines() {   
        return d3.axisLeft(y).ticks(3)
    }

    if (window.innerWidth >= 768) {
      font_size = "0.75rem";
    } else {
      font_size = "0.5rem";
    }
    //var x = d3.scaleTime().range([0, width]);
    var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    var yAxis = d3.axisRight()
                  .scale(y)
                  .ticks(4);

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");
          
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(idname).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // get the data
    d3.csv(filename, function(error, data) {
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
            d.yvalue = +d.daily_confirmed;
            d.rolling_avg = +d["rolling_avg_confirmed"];
          } else {
            d.yvalue = +d.daily_deaths;
            d.rolling_avg = +d["rolling_avg_deaths"];
          }
          d.date = parseTime(d.date);
          latest_case_count = +d.total_confirmed;
          latest_death_count = +d.total_deaths;
      });

      console.log(latest_death_count);
      // Scale the range of the data in the domains
      //x.domain(data.map(function(d) { return d.bins; }));
      //x.domain(d3.extent(data, function(d) { return d.date; }));
      x.domain(data.map(function(d) {return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.yvalue; })]);

      // define the line
      var valueline = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.rolling_avg); });

      var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.timeFormat("%b %e"))
        .tickValues(x.domain().filter(function(d,i){ return !(i%20)}));

      var g = svg.selectAll(".cover_bars")
                .data(data)
                .enter().append("g");
      // append the rectangles for the bar chart
      g.append("rect")
          .attr("class", "cover_bars")
          .attr("x", function(d) {
            return x(d.date);
          })
          .attr("width", x.bandwidth()*0.8)
          //.attr("y", function(d) { return y(d.num_listings_eu); })
          //.attr("height", function(d) { return height - y(d.num_listings_eu); })
          .attr("y", function(d) { return height; })
          .attr("height", function(d) { return 0; })
          .style("fill", fill_color)
          .on("mouseover", function(d){
            //return tooltip.text(d.city).style("visibility", "visible");
            d3.select(this).style('fill', fill_color).style("opacity", 0.5);
            if (type == "cases") {
              return tooltip.html("<div class='well'>"+d.yvalue+" new cases on "+ months_list[d.date.getMonth()] + " " + d.date.getDate() + "</span></div>" ).style("visibility", "visible");
            } else {
              return tooltip.html("<div class='well'>"+d.yvalue+" deaths on "+ months_list[d.date.getMonth()] + " " + d.date.getDate() + "</span></div>" ).style("visibility", "visible");
            }
          })
          .on("mousemove", function(){
            if (event.pageX >= window.innerWidth/2) {
              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-100)+"px");
            } else {
              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            }
            //return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
          })
          .on("mouseout", function(){
            d3.select(this).style('fill', fill_color).style("opacity", 1.0);
            return tooltip.style("visibility", "hidden");
          });

      d3.selectAll(".cover_bars")
        .transition()
        .delay(function(d, i) { return i * 50; })
        .attr("y", function(d) { return y(d.yvalue); })
        .attr("height", function(d) { return height - y(d.yvalue); });

      // Add the valueline path.
      path = svg.append("path")
                .data([data])
                .attr("class", "rolling_avg_line")
                .attr("d", valueline);

      var totalLength = path.node().getTotalLength();
      repeat();

        function repeat() {
            path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                  .duration(3000)
                  .ease(d3.easeLinear)
                  .attr("stroke-dashoffset", 0);
        }

      // add the x Axis
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

      // add the y Axis
      svg.append("g")
          .attr("class", "label_histogram axis--y")
          .attr("transform", "translate("+(width)+",0)")
          .call(yAxis)
          .style("font-size", font_size)
        .append("text")
          .attr("class", "label_histogram")
          .attr("transform", "rotate(-90)")
          .attr("x", 0)
          .attr("y", -5)
          .style("text-anchor", "end")
          .text(function(){
            if (type=="cases") {
              return "Daily cases";
            } else {
              return "Daily deaths";
            }
          })
          .style("fill", "black")
          .style("font-size", font_size);

      /*
      // add the Y gridlines
      svg.append("g")     
          .attr("class", "grid")
          .call(make_y_gridlines()
              .tickSize(-width)
              .tickFormat("")
          );
      */

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



//})();

