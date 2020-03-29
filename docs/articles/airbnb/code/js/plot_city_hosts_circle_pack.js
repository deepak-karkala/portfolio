num_listings = {
 'Amsterdam': 18547,
 'Antwerp': 1227,
 'Asheville': 864,
 'Athens': 5127,
 'Austin': 9663,
 'Barcelona': 18531,
 'Berlin': 20576,
 'Boston': 4870,
 'Brussels': 6192,
 'Chicago': 5207,
 'Copenhagen': 20545,
 'Denver': 3918,
 'Dublin': 6729,
 'Edinburgh': 9638,
 'Geneva': 3060,
 'Hong Kong': 6474,
 'London': 53904,
 'Los Angeles': 31253,
 'Madrid': 16313,
 'Mallorca': 14858,
 'Manchester': 865,
 'Melbourne': 14305,
 'Montreal': 10619,
 'Nashville': 5332,
 'New Orleans': 5215,
 'New York City': 48852,
 'Northern Rivers': 2350,
 'Oakland': 1718,
 'Paris': 59945,
 'Portland': 4738,
 'Quebec City': 2297,
 'Rome': 25275,
 'San Diego': 6608,
 'San Francisco': 4804,
 'Santa Cruz County': 814,
 'Seattle': 3818,
 'Sydney': 32830,
 'Tasmania': 4459,
 'Toronto': 12714,
 'Vancouver': 6651,
 'Venice': 6027,
 'Victoria': 1691,
 'Vienna': 9201,
 'Washington, D.C.': 7788};

//base_width = 200;
//base_height = 120;

width_scale_factor = 0.40;
height_scale_factor = 0.30;
num_listings_scale_factor = 500;

idname = "#circles_pack1";
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:10, left:10, top:10, bottom:10};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;

city = "Mallorca";
draw_city_circles_pack("#circles_pack1", city, base_width+num_listings[city]/num_listings_scale_factor, base_height+num_listings[city]/num_listings_scale_factor);
city = "Copenhagen";
draw_city_circles_pack("#circles_pack2", city, base_width+num_listings[city]/num_listings_scale_factor, base_height+num_listings[city]/num_listings_scale_factor);
city = "Amsterdam";
draw_city_circles_pack("#circles_pack3", city, base_width+num_listings[city]/num_listings_scale_factor, base_height+num_listings[city]/num_listings_scale_factor);
city = "New York City";
draw_city_circles_pack("#circles_pack4", city, base_width+num_listings[city]/num_listings_scale_factor, base_height+num_listings[city]/num_listings_scale_factor);
city = "London";
draw_city_circles_pack("#circles_pack5", city, base_width+num_listings[city]/num_listings_scale_factor, base_height+num_listings[city]/num_listings_scale_factor);
city = "Paris";
draw_city_circles_pack("#circles_pack6", city, base_width+num_listings[city]/num_listings_scale_factor, base_height+num_listings[city]/num_listings_scale_factor);
city = "Dublin";
draw_city_circles_pack("#circles_pack7", city, base_width+num_listings[city]/num_listings_scale_factor, base_height+num_listings[city]/num_listings_scale_factor);
city = "Berlin";
draw_city_circles_pack("#circles_pack8", city, base_width+num_listings[city]/num_listings_scale_factor, base_height+num_listings[city]/num_listings_scale_factor);
city = "Hong Kong";
draw_city_circles_pack("#circles_pack9", city, base_width+num_listings[city]/num_listings_scale_factor, base_height+num_listings[city]/num_listings_scale_factor);

//draw_circles_pack_legend();

function draw_city_circles_pack(idname, city, width, height) {

  //height = height * 0.6;

  var svg3 = d3.select(idname).append("svg").attr("width", width).attr("height", height),
      width = +svg3.attr("width"),
      height = +svg3.attr("height");

  var format = d3.format(",d");
  /*
  var color = d3.scaleOrdinal(d3.schemeCategory20c);

  var custom_color = d3.scaleLinear().domain([1,100])
                      .interpolate(d3.interpolateHcl)
                      .range([d3.rgb("#ffff8c"), d3.rgb('#d7191c')]);
  */
  //var host_type_color = d3.scaleLinear().domain([0, 1, 2]).range([  "#F7A6DA", "#A6DAF7", "#DAF7A6"]);
  //var host_type_color = d3.scaleLinear().domain([0, 1, 2]).range([  "#f58231", "#e6beff", "#bfef45"]);
  //var host_type_color = d3.scaleLinear().domain([0, 1, 2]).range([  "#6738aa", "#fa9742","#cef040",     ]);
  var host_type_color = d3.scaleLinear().domain([0, 1, 2]).range([ "#fa9742", "#cef040","#6738aa",      ]);
  //var host_type_color = d3.scaleLinear().domain([0, 1, 2]).range(["#521aa0","#eb7714","#bae213",         ]);

  var pack = d3.pack()
      .size([width, height])
      .padding(1.5);

  d3.csv("data/cities/"+city+"/numlistings_per_host_ordinal.csv", function(d) {
    d.value = +d.value;
    d.colorid = +d.colorid;
    if (d.value > 1) return d;
  }, function(error, classes) {
    if (error) throw error;

    var root = d3.hierarchy({children: classes})
        .sum(function(d) { return d.value; })
        .each(function(d) {
          if (id = d.data.id) {
            var id, i = id.lastIndexOf(".");
            d.id = id;
            d.package = id.slice(0, i);
            d.class = id.slice(i + 1);
            d.colorid = d.data.colorid;
          }
        });

    var node = svg3.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return host_type_color(d.colorid); });

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });
  /*
    node.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
      .selectAll("tspan")
      .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
      .enter().append("tspan")
        .attr("x", 0)
        .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
        .text(function(d) { return d; });

    node.append("title")
        .text(function(d) { return d.id + "\n" + format(d.value); });
  */
  });
}


function draw_circles_pack_legend() {
  // Legend 
  //Append a defs (for definition) element to your SVG
  var svg4 = d3.select("#legend_circles_pack").append("svg").attr("width", 400).attr("height", 250);
  var defs = svg4.append("defs");

  //Append a linearGradient element to the defs and give it a unique id
  var linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient");

  //Horizontal gradient
  linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

  //Set the color for the start (0%)
  linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ffff8c"); //light blue

  //Set the color for the end (100%)
  linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#d7191c"); //dark blue

  //Draw the rectangle and fill with gradient
  svg4.append("rect")
      .attr("width", 300)
      .attr("height", 20)
      .style("fill", "url(#linear-gradient)");
}
