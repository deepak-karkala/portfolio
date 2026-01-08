var minDeviceWidth = 375;
var maxDeviceWidth = 1024;

idname = "#numlistings_time_plot";
width_scale_factor = 0.95;
if (window.innerWidth >= 768) {
  height_scale_factor = 0.6;
} else {
  height_scale_factor = 0.9;
}
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:50, left:60, top:40, bottom:30};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
city = "New York City";
plot_city_numlistings_time(idname, base_width, base_height, city);

function plot_city_numlistings_time(idname, width, height, city) {

    // Scale for axis label font size
    var axisLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([8, 16]);

    // Scale for axis label font size
    var textLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 20]);

    // Scale for axis label font size
    var cityLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([8, 20]);

    // Scale for tick label font size
    var tickLabelFontSizeScale = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 20]);

    var theme_font_color = "white";
    /*
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    */
    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.num_listings); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(idname).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(5);
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(5);
    }

    // Get the data
    d3.csv("data/num_listings_over_time.csv", function(error, data) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
          d.date = parseTime(d.date);
          d.num_listings = +d.num_listings;
      });


      //var city_list = ["New York City", "Paris", "London", "San Francisco", "Los Angeles", "Barcelona", "Amsterdam", "Berlin"];
      //var city_color_list = ["#e6194b", "#911eb4", "#ffe119", "#42d4f4", "#4363d8", "#3cb44b", "#f032e6", "#f58231"];

      var city_list = ["New York City", "Paris", "London", "San Francisco", "Los Angeles", "Barcelona", "Berlin"];
      var city_color_list = ["#e6194b", "#911eb4", "#ffe119", "#42d4f4", "#4363d8", "#3cb44b", "#f58231"];

      var critical_dates_list = [{"city":"Barcelona", "date": parseTime("2018-06-09"), "num_listings": 17221, "description": "The city instructed the site to remove 2,577 listings that it found to be operating without a city-approved license, or face substantial fines."},
                                 {"city":"Barcelona", "date": parseTime("2016-11-24"), "num_listings": 17036, "description": "Airbnb was hit with a €600,000 fine for listing unlicensed apartments"},
                                 {"city":"Berlin", "date": parseTime("2016-04-01"), "num_listings": 15673, "description": "Berlin passed a law banning short-term rentals that have not received explicit permission from the Berlin Senate"},
                                 {"city":"Berlin", "date": parseTime("2018-05-01"), "num_listings": 26019, "description": "Landlords will be able to apply for permits to rent a primary residence for unlimited periods and second homes for up to 90 days a year."},
                                 {"city":"San Francisco", "date": parseTime("2018-01-17"), "num_listings": 5224, "description": "Passed a law requiring hosts to register homes with the city for a $250 fee, or face fines as high as $1,000 a day. Listing plunged from over 10,000 to around 5,500"},
                                 {"city":"Los Angeles", "date": parseTime("2016-07-03"), "num_listings": 25475, "description": "All homeowners would be required to register with the city. Primary and non-primary residences to be rented for a maximum of 180 and 15 days anually."},
                                 {"city":"New York City", "date": parseTime("2015-12-01"), "num_listings": 34376, "description": "Airbnb finally released data on its business in New York to the public. But before releasing that data, it removed some 1,500 listings from potential commercial operators."},
                                 {"city":"New York City", "date": parseTime("2016-11-02"), "num_listings": 38936, "description": "New York Governor signed into law a bill to make it illegal to advertise entire unoccupied apartments for less than 30 days on Airbnb. Airbnb responded by suing NYC"},
                                 {"city":"New York City", "date": parseTime("2016-12-03"), "num_listings": 40227, "description": "Airbnb agreed that it would drop the suit as long as New York City enforces the new law only against hosts and does not fine Airbnb."},
                                 {"city":"New York City", "date": parseTime("2018-06-03"), "num_listings": 47542, "description": "New York City Council introduced legislation that would require Airbnb to turn over the personal, sensitive information of hosts, jeopardizing their privacy and their ability to host."},
                                 {"city":"New York City", "date": parseTime("2017-02-02"), "num_listings": 40459, "description": "New York City issues first illegal Airbnb fines."},
                                 {"city":"Paris", "date": parseTime("2016-04-03"), "num_listings": 39430, "description": "Airbnb hosts in Paris who fall foul of housing regulations will be sent letters warning them to follow the city’s homesharing rules."},
                                 {"city":"Paris", "date": parseTime("2016-01-02"), "num_listings": 40856, "description": "Paris authorities raided apartments to identify landlords who were renting out their units past the legal limit of 120 days per year, threatening offenders with fines of up to €25,000."},
                                 {"city":"Paris", "date": parseTime("2017-11-08"), "num_listings": 63870, "description": "Paris capped the number of days an individual can rent out their home as a short-term let at 120 per year."},
                                 {"city":"Paris", "date": parseTime("2018-04-10"), "num_listings": 63720, "description": "Paris filed a lawsuit against Airbnb for failing to respect local laws regulating holiday rental properties."},
                                 {"city":"London", "date": parseTime("2016-10-03"), "num_listings": 49348, "description": "AirBnB blocks hosts in London from renting out homes for more than 90 days a year without official consent."}];

      var alldata = [];

      for(var i=0; i<city_list.length; i++) {
        alldata[i] = data.filter(function(d) { return d.city  == city_list[i]; });
      }

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.num_listings; })]);


      // Tooltip
      var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_numlistings_time")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");


      // add the X gridlines
      svg.append("g")
          .attr("class", "num_listings_time_grid")
          .attr("transform", "translate(0," + height + ")")
          .call(make_x_gridlines()
              .tickSize(-height)
              .tickFormat("")
          );

      // add the Y gridlines
      svg.append("g")
          .attr("class", "num_listings_time_grid")
          .call(make_y_gridlines()
              .tickSize(-width)
              .tickFormat("")
          );

      for (i=0; i<alldata.length; i++) {
        // add the valueline path.
        svg.append("path")
            .data([alldata[i]])
            .attr("class", "num_listings_time_line")
            .style("stroke", city_color_list[i])
            .style("stroke-width", 3)
            .attr("d", valueline);

        // Append city label
        svg.append("text")
            .attr("class", "label_histogram")
            .attr("x", x(alldata[i][alldata[i].length-1]["date"])+5)
            .attr("y", y(alldata[i][alldata[i].length-1]["num_listings"]))
            .text(city_list[i])
            .style("fill", theme_font_color)
            .style("font-size", cityLabelFontSizeScale(width));

      }

      svg.selectAll(".dot")
          .data(critical_dates_list)
        .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("r", 4)
          .attr("cx", function(d) { return x(d.date); })
          .attr("cy", function(d) { return y(d.num_listings); })
          .style("fill", "white")
          .style("stroke", "#FF5A60")
          .style("stroke-width", "1.0px")
          .style("z-index", 1)
          .on("mouseover", function(d) {
            //return tooltip.text(d.city).style("visibility", "visible");
            d3.select(this).style('stroke', theme_font_color).style("stroke-width", 2).style("stroke-opacity", 1.0);
            return tooltip.html("<div class='well'>"+month[d.date.getMonth()]+" "+d.date.getFullYear()+": <span class='city_name'><b>"+d.description+"</b></span><br/>" +"</div>" ).style("visibility", "visible");
          })
          .on("mousemove", function(){
            if (event.pageX >= window.innerWidth/2) {
              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-230)+"px");
            } else {
              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            }
          })
          .on("mouseout", function(){
            d3.select(this).style('stroke', "#FF5A60").style("stroke-width", 1).style("stroke-opacity", 1.0);
            return tooltip.style("visibility", "hidden");
          });

/*
      // add the X Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .style("stroke", "white");

      // add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y))
          .style("stroke", "white");
*/

      var xAxis = d3.axisBottom()
                    .scale(x)
                    .tickFormat(d3.timeFormat("%Y"))
                    .tickValues(x.domain().filter(function(d,i){ return !(i%1)}));

      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "label_histogram axis--y")
          //.call(d3.axisBottom(x)
          //      .tickPadding(5))
          .call(xAxis)
          .style("font-size", axisLabelFontSizeScale(width))
        .append("text")
          .attr("class", "label_histogram")
          .attr("x", width)
          .attr("y", -40)
          .style("text-anchor", "end")
          //.text("Price [USD]")
          .style("fill", theme_font_color)
          .style("font-size", axisLabelFontSizeScale(width));

      // add the y Axis
      svg.append("g")
          .attr("class", "label_histogram axis--y")
          .call(d3.axisLeft(y)
              .tickFormat( (d,i) => {
                if (d%5000 === 0) return d;
              })
              .tickPadding(5))
          .style("font-size", axisLabelFontSizeScale(width))
        .append("text")
          .attr("class", "label_histogram")
          .attr("transform", "rotate(-90)")
          .attr("x", 0)
          .attr("y", -50)
          .style("text-anchor", "end")
          .text("Number of listings")
          .style("fill", theme_font_color)
          .style("font-size", textLabelFontSizeScale(width));
      

      svg.selectAll("text")
        .attr("class", "label")
        .style("fill", theme_font_color)
        .style("shape-rendering", "crispEdges");

      svg.selectAll(".axis--y path")
        .style("stroke", theme_font_color)
        .style("font-size", axisLabelFontSizeScale(width));

      svg.selectAll(".axis--x path")
        .style("stroke", theme_font_color)
        .style("font-size", axisLabelFontSizeScale(width));

      svg.selectAll("line")
        .style("stroke", theme_font_color)
        .style("stroke-width", 0.25)
        .style("font-size", axisLabelFontSizeScale(width));
        //.style("visibility", "hidden");

    });

}

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";