width_scale_factor = 1.0;
height_scale_factor = 0.50;

idname = "#histogram_us_eu";
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:30, left:50, top:30, bottom:30};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
filename = "data/histogram_entireApartment.csv";
listing_type = "home";
plot_histogram_us_eu(idname, filename, base_width, base_height, listing_type);


$("#histogram_home_button").click(function() {
    d3.select("#histogram_us_eu").select("svg").remove();
    filename = "data/histogram_entireApartment.csv";
    listing_type = "home";
    idname = "#histogram_us_eu";
    width_scale_factor = 1.0;
    height_scale_factor = 0.50;
    var bb = d3.select(idname).node().offsetWidth;
    var margin = {right:30, left:50, top:30, bottom:30};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    plot_histogram_us_eu(idname, filename, base_width, base_height, listing_type);
    //d3.select("#listings_city_legend").select("svg").remove();
    //plot_individual_legend("#listings_city_legend_text", base_width, base_height);
});
$("#histogram_room_button").click(function() {
    d3.select("#histogram_us_eu").select("svg").remove();
    filename = "data/histogram_privateRoom.csv";
    listing_type = "room";
    idname = "#histogram_us_eu";
    width_scale_factor = 1.0;
    height_scale_factor = 0.50;
    var bb = d3.select(idname).node().offsetWidth;
    var margin = {right:30, left:50, top:30, bottom:30};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    plot_histogram_us_eu(idname, filename, base_width, base_height, listing_type);
    //d3.select("#listings_city_legend").select("svg").remove();
    //plot_individual_legend("#listings_city_legend_text", base_width, base_height);
});

//Setup buttons
setupHistogramTypeButtons("#histogram_type_buttongroup");

function plot_histogram_us_eu(idname, filename, width, height, listing_type) {

    var minDeviceWidth = 375;
    var maxDeviceWidth = 1024;

    // Scale for axis label font size
    var axisLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([8, 16]);

    var theme_font_color = "black";
    var airbnb_color = ["#FF5A60", "#FFF6E6"];

    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_histogram")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);
          
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(idname).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
/*
    d3.csv("data/histogram_entireApartment.csv", function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
        d.num_listings_eu = +d.num_listings_eu;
        d.num_listings_us = +d.num_listings_us;
        d.bins = +d.bins;
      });

      // Scale the range of the data in the domains
      //x.domain([d3.min(data, function(d) { return d.bins;}), d3.max(data, function(d) { return d.bins;}) ]);
      x.domain(data.map(function(d) { return d.bins; }));
      y.domain([0, d3.max(data, function(d) { return d.num_listings_eu; })]);

    });
*/
    // get the data
    d3.csv(filename, function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
        d.num_listings_eu = +d.num_listings_eu;
        d.num_listings_us = +d.num_listings_us;
        d.bins = +d.bins;
      });

      // Scale the range of the data in the domains
      x.domain(data.map(function(d) { return d.bins; }));
      y.domain([0, d3.max(data, function(d) { return d.num_listings_eu; })]);

      var g = svg.selectAll(".bars")
                .data(data)
                .enter().append("g");

      // append the rectangles for the bar chart

      // Europe
      g.append("rect")
          .attr("class", "bar_eu")
          .attr("x", function(d) { return x(d.bins); })
          .attr("width", x.bandwidth()/2)
          //.attr("y", function(d) { return y(d.num_listings_eu); })
          //.attr("height", function(d) { return height - y(d.num_listings_eu); })
          .attr("y", function(d) { return height; })
          .attr("height", function(d) { return 0; })
          .style("fill", airbnb_color[0])
          .on("mouseover", function(d){
            //return tooltip.text(d.city).style("visibility", "visible");
            d3.select(this).style('stroke', theme_font_color).style("opacity", 0.5);
            if (listing_type == "home") {
              return tooltip.html("<div class='well'>"+d.num_listings_eu+" homes are listed on Airbnb in Europe that cost around USD "+Math.floor(d.bins)+"</span></div>" ).style("visibility", "visible");
            } else {
              return tooltip.html("<div class='well'>"+d.num_listings_eu+" private rooms are listed on Airbnb in Europe that cost around USD "+Math.floor(d.bins)+"</span></div>" ).style("visibility", "visible");
            }
          })
          .on("mousemove", function(){
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
          })
          .on("mouseout", function(){
            d3.select(this).style('stroke', theme_font_color).style("opacity", 1.0);
            return tooltip.style("visibility", "hidden");
          });

      // US
      g.append("rect")
          .attr("class", "bar_us")
          .attr("x", function(d) { return x(d.bins)+x.bandwidth()/2; })
          .attr("width", x.bandwidth()/2)
          //.attr("y", function(d) { return y(d.num_listings_us); })
          //.attr("height", height) //function(d) { return height - y(d.num_listings_us); })
          .attr("y", function(d) { return height; })
          .attr("height", function(d) { return 0; })
          .style("fill", airbnb_color[1])
          .on("mouseover", function(d){
            //return tooltip.text(d.city).style("visibility", "visible");
            d3.select(this).style('stroke', theme_font_color).style("opacity", 0.5);
            if (listing_type == "home") {
              return tooltip.html("<div class='well'>"+d.num_listings_eu+" homes are listed on Airbnb in US that cost around USD "+Math.floor(d.bins)+"</span></div>" ).style("visibility", "visible");
            } else {
              return tooltip.html("<div class='well'>"+d.num_listings_eu+" private rooms are listed on Airbnb in US that cost around USD "+Math.floor(d.bins)+"</span></div>" ).style("visibility", "visible");
            }
          })
          .on("mousemove", function(){
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
          })
          .on("mouseout", function(){
            d3.select(this).style('stroke', theme_font_color).style("opacity", 1.0);
            return tooltip.style("visibility", "hidden");
          });


      d3.selectAll(".bar_eu").transition()
        .delay(function(d, i) { return i * 50; })
        .attr("y", function(d) { return y(d.num_listings_eu); })
        .attr("height", function(d) { return height - y(d.num_listings_eu); });

      d3.selectAll(".bar_us").transition()
        .delay(function(d, i) { return 1000+i * 50; })
        .attr("y", function(d) { return y(d.num_listings_us); })
        .attr("height", function(d) { return height - y(d.num_listings_us); });

      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "label_histogram")
          .call(d3.axisBottom(x)
                .tickFormat( (d,i) => {
                  if (d%50 === 0) return d;
                })
                .tickPadding(5))
          .style("font-size", axisLabelFontSizeScale(width))
        .append("text")
          .attr("class", "label_histogram")
          .attr("x", width)
          .attr("y", -40)
          .style("text-anchor", "end")
          .text("Price [USD]")
          .style("fill", "white")
          .style("font-size", axisLabelFontSizeScale(width));

      // add the y Axis
      svg.append("g")
          .attr("class", "label_histogram axis--y")
          .call(d3.axisLeft(y)
              .tickFormat( (d,i) => {
                if (d%4000 === 0) return d;
              })
              .tickPadding(5))
          .style("font-size", axisLabelFontSizeScale(width))
        .append("text")
          .attr("class", "label_histogram")
          .attr("transform", "rotate(-90)")
          .attr("x", 0)
          .attr("y", 15)
          .style("text-anchor", "end")
          .text("Number of listings")
          .style("fill", "white")
          .style("font-size", axisLabelFontSizeScale(width));

      svg.selectAll("text")
        .attr("class", "label")
        .style("fill", "white")
        .style("shape-rendering", "crispEdges");

      svg.selectAll("path")
        .style("stroke", "white")
        .style("font-size", axisLabelFontSizeScale(width));

      svg.selectAll("line")
        .style("stroke", "white")
        .style("font-size", axisLabelFontSizeScale(width))
        .style("visibility", "hidden");

    });

}


/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupHistogramTypeButtons(idname) {
  d3.select(idname)
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

    });
}
