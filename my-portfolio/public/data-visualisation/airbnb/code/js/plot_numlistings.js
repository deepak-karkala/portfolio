//Setup buttons
setupButtons("#listings_num_buttongroup");

var margin = {right:10, left:10, top:10, bottom:10};
var color_price = d3.scaleSequential(d3.interpolateBlues).domain([50,250]);

var width_scale_factor = 1.0;
var height_scale_factor = 1.0;
var bb = d3.select('#market-container1').node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
file = "data/num_listings_price_circle_packing.csv";
console.log(bb);
console.log(base_width);
draw_circles_pack("#market-container1", file, base_width, base_height, 0, color_price);

width_scale_factor = 1.0;
height_scale_factor = 0.5;
var bb = d3.select('#market-container3').node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_legend_price("#market-container3", base_width, base_height, color_price);

width_scale_factor = 1.0;
height_scale_factor = 0.85;
var bb = d3.select('#market-container4').node().offsetWidth;
base_width_legend_size = bb*width_scale_factor - margin.left - margin.right;
base_height_legend_size = bb*height_scale_factor - margin.top - margin.bottom;

var width_scale_max_numlistings = d3.scaleLinear()
    .domain([138, 235])
    .range([16.17, 35.60]);  //[38.13, 54.83]
var width_scale_min_numlistings = d3.scaleLinear()
    .domain([138, 235])
    .range([9.04, 10.73]);
var linear_numlistings = d3.scaleLinear()
    //.domain([2297, 59945])
    //.range(radius_range);
    .domain([2297, 25275])
    .range([width_scale_min_numlistings(base_width_legend_size),
     width_scale_max_numlistings(base_width_legend_size)]);
var legend_size_numlistings_data = [2000, 10000, 25000];


var width_scale_max_numlistings_per_residents = d3.scaleLinear()
    .domain([138, 235])
    .range([13.14, 30.37]);
var width_scale_min_numlistings_per_residents = d3.scaleLinear()
    .domain([138, 235])
    .range([3.91, 9.04]);
var linear_numlistings_per_residents = d3.scaleLinear()
    .domain([1.9, 21.64])
    .range([width_scale_min_numlistings_per_residents(base_width_legend_size),
     width_scale_max_numlistings_per_residents(base_width_legend_size)]);
//draw_legend_size("#market-container4", base_width_legend_size, base_height_legend_size, legend_size_numlistings_data, linear_numlistings, 0);
var legend_size_numlistings_per_residents_data = [2, 10, 20];


d3.select("#market-container4").select("svg").remove();
width_scale_factor = 1.0;
height_scale_factor = 0.85;
var bb = d3.select('#market-container4').node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_legend_size("#market-container4", base_width, base_height, legend_size_numlistings_data, linear_numlistings, 0);


$("#listings_num_button1").click(function() {
  
    d3.select('#market-container1').select("svg").remove();
    var width_scale_factor = 1.0;
    var height_scale_factor = 1.0;
    var margin = {right:10, left:10, top:10, bottom:10};
    var bb = d3.select('#market-container1').node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    file = "data/num_listings_price_circle_packing.csv";
    draw_circles_pack("#market-container1", file, base_width, base_height, 0, color_price);

    //d3.selectAll("circle").remove();
    d3.select("#market-container4").select("svg").remove();
    width_scale_factor = 1.0;
    height_scale_factor = 0.85;
    var margin = {right:10, left:10, top:10, bottom:10};
    bb = d3.select('#market-container4').node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    draw_legend_size("#market-container4", base_width, base_height, legend_size_numlistings_data, linear_numlistings, 0);
});


$("#listings_num_button2").click(function() {

    d3.select('#market-container1').select("svg").remove();
    var width_scale_factor = 1.0;
    var height_scale_factor = 1.0;
    var margin = {right:10, left:10, top:10, bottom:10};
    var bb = d3.select('#market-container1').node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    file = "data/num_listings_per_residents_price_circle_packing.csv";
    //file = "data/num_listings_price_circle_packing.csv";
    draw_circles_pack("#market-container1", file, base_width, base_height, 1, color_price);

    d3.select("#market-container4").select("svg").remove();
    width_scale_factor = 1.0;
    height_scale_factor = 0.85;
    var margin = {right:10, left:10, top:10, bottom:10};
    bb = d3.select('#market-container4').node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    draw_legend_size("#market-container4", base_width, base_height, legend_size_numlistings_per_residents_data, linear_numlistings_per_residents, 1);

});
  
// Number of listings by top 5 hosts
idname = "#top_hosts_numlistings_plot";
var width_scale_factor = 1.0;
var height_scale_factor = 1.0;
var margin = {right:10, left:10, top:10, bottom:10};
var bb = d3.select(idname).node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
file = "data/num_listings_top5hosts.csv";
var color_top5 = d3.scaleSequential(d3.interpolateBlues).domain([10, 1500]);
draw_circles_pack(idname, file, base_width, base_height, 2, color_top5);

/*
d3.select("#market-container4").select("svg").remove();
width_scale_factor = 1.0;
height_scale_factor = 0.85;
bb = d3.select('#market-container4').node().offsetWidth;
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_legend_size("#market-container4", base_width, base_height, legend_size_numlistings_per_residents_data, linear_numlistings_per_residents, 1);
*/



function draw_circles_pack(idname, file, width, height, listings_type, color_price) {

      var svg3 = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height),
              /*
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
              */
      width = +svg3.attr("width"),
      height = +svg3.attr("height");
/*
  var svg3 = d3.select(idname).append("svg").attr("viewBox", [0, 0, (width + margin.right + margin.left),
                        (height + margin.top + margin.bottom)].join(' '));
      width = +svg3.attr("width"),
      height = +svg3.attr("height");
*/

  var format = d3.format(",d");

/*
  var color = d3.scaleOrdinal(d3.schemeCategory20c);

  var custom_color = d3.scaleLinear().domain([0, 1, 2])
                      .range([d3.rgb("#f1e0d6"), d3.rgb("#bf988f"), d3.rgb("#583e2e")]);
*/
/*
  var color_price = d3.scaleLinear()
        .domain([70, 150, 225])
        .range(['#f1e0d6', '#bf988f' , '#583e2e'])
        .interpolate(d3.interpolateHcl); //interpolateHsl interpolateHcl interpolateRgb
*/
//  var color_price = d3.scaleSequential(d3.interpolateBlues).domain([70,225]);

  var pack = d3.pack()
      .size([width, height])
      .padding(1.5);

  d3.csv(file, function(d) {
    d.value = +d.value;
    d.price = +d.price;
    //d.region = +d.region;
    if (d.value) return d;
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
            //d.colorid = d.data.colorid;
            d.value = d.data.value;
            d.city = d.data.city;
            if (listings_type==0 || listings_type==1) {
              d.price = d.data.price;
            } else {
              d.host0 = d.data.host0;
              d.host1 = d.data.host1;
              d.host2 = d.data.host2;
              d.host3 = d.data.host3;
              d.host4 = d.data.host4;
            }
            //d.region = d.data.region;
          }
        });

    leaves = pack(root).leaves();

    var node = svg3.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


    if (listings_type===0) {
      var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip1")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");
    } else if (listings_type===1) {
      var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip2")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");
    } else if (listings_type===2) {
      var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip3")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");
    }
/*
    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
*/
    var circles1 = node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .text(function(d) { return d.value; })
        //.style("fill", "white")
        .style("fill", function(d) {
          if (listings_type==2) {
            return "#87bdeb"; //color_price(d.value);
          } else {
            return color_price(d.price);
          }
        })
        .on("mouseover", function(d){
          //return tooltip.text(d.city).style("visibility", "visible");
          d3.select(this).style('stroke', 'white').style("stroke-width", 5).style("stroke-opacity", 1.0);
          if (listings_type===0) {
            return tooltip.html("<b>"+d.city+"</b>" + "<br/>"  + Math.round(d.value) + " total listings" + "<br/>" + "Average apartment price: " + Math.round(d.price) + " USD per night").style("visibility", "visible");
          } else if (listings_type===1) {
            return tooltip.html("<b>"+d.city+"</b>" + "<br/>"  + Math.round(d.value) + " listings per 1000 residents" + "<br/>" + "Average apartment price: " + Math.round(d.price) + " USD per night").style("visibility", "visible");
          } else if (listings_type===2) {
            return tooltip.html("<b>"+d.city+"</b>" + "<br/><b>"  + Math.round(d.value) + " listings offered by top 5 hosts" + "</b><br/>" + "Host 1:" + Math.round(d.host0) + "  Host 2:" + Math.round(d.host1) + "  Host 3:" + Math.round(d.host2) + "  Host 4:" + Math.round(d.host3) + "  Host 5:" + Math.round(d.host4)).style("visibility", "visible");
          }
        })
        .on("mousemove", function(){
          if (event.pageX >= window.innerWidth/2) {
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-200)+"px");
          } else {
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-50)+"px");
          }
          //return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(){
          d3.select(this).style('stroke', 'white').style("stroke-opacity", 0);
          return tooltip.style("visibility", "hidden");
        })
        .attr("opacity", 0)
        .transition()
          .duration(1000)
          .attr("opacity", 1);
/*
        .on("mouseover", function(d) {
            div.transition()
                .duration(10)
                .style("opacity", 0.9);
            div.html(d.city + "<br/>"  + d.value)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(10)
                .style("opacity", 0);
        });
*/
    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });
  
    node.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
      .selectAll("tspan")
      .data(function(d) {
        var dsplit = d.class.split(/(?=[A-Z][^A-Z]) /g);

        if (listings_type===0) {
          if(dsplit[0]=="Paris" || dsplit[0]=="London" || dsplit[0]=="Sydney" || dsplit[0]=="Rome" || dsplit[0]=="Berlin")
            return dsplit;
          else if (dsplit[0]=="New York City")
            return ["NYC"];
          else if (dsplit[0]=="Los Angeles")
            return ["LA"];
          else
            return [""];
        } else if (listings_type===1) {
          if(dsplit[0]=="Copenhagen" || dsplit[0]=="Mallorca" || dsplit[0]=="Venice" || dsplit[0]=="Amsterdam" || dsplit[0]=="Geneva")
            return dsplit;
          else
            return [""];
        } else if (listings_type===2) {
          if(dsplit[0]=="Sydney" || dsplit[0]=="Mallorca" || dsplit[0]=="London" || dsplit[0]=="Paris" || dsplit[0]=="Madrid" || dsplit[0]=="Rome")
            return dsplit;
          else
            return [""];
        }
        //return dsplit;
      })
      .enter().append("tspan")
        .attr("x", listings_type===0 ? -15: -20)
        .attr("y", 0) //unction(d, i, nodes) { return 3 + (i - nodes.length / 2 - 0.5) * 10; })
        .text(function(d) { return d; })
        .style("font-size", 7*width/200+"px");

/*
      function repeat() {
        node
          .attr("opacity", 0)
          .transition()
          .duration(1000)
          .attr("opacity", 1)
          .transition()
          .duration(1000)
          .attr("opacity", 0)
          .on("end", repeat);
        /*
        //d3.selectAll("circle")
        circles1
          .attr('r', 4)      // position the circle at 40 on the x axis
          .transition()        // apply a transition
          .duration(2000)      // apply it over 2000 milliseconds
          .attr('r', 20)     // move the circle to 920 on the x axis
          .transition()        // apply a transition
          .duration(2000)      // apply it over 2000 milliseconds
          .attr('r', 4)      // return the circle to 40 on the x axis
          .on("end", repeat);  // when the transition finishes start again
      };

      repeat();
          */
      
  });

}



function draw_legend_price(idname, width, height, color_price) {
  /*
  // Legend
  var ordinal = d3.scaleOrdinal()
    .domain(["North America", "Europe", "Austraila"])
    .range([ "#f1e0d6", "#bf988f", "#583e2e"]);

  var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height);

  svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(20,20)");

  var legendOrdinal = d3.legendColor()
    //d3 symbol creates a path-string, for example
    //"M0,-8.059274488676564L9.306048591020996,
    //8.059274488676564 -9.306048591020996,8.059274488676564Z"
    .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
    .shapePadding(10)
    //use cellFilter to hide the "e" cell
    .cellFilter(function(d){ return d.label !== "e" })
    .scale(ordinal);

  svg.select(".legendOrdinal")
    .call(legendOrdinal)
    .style("fill", "white");

  */


  var linear = d3.scaleLinear()
    .domain([50, 250])
    .range([color_price(50), color_price(250)]);

  var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height);

  svg.append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(20,20)");

  var legendLinear = d3.legendColor()
    .shapeWidth(10*width/500+20)
    .cells([50, 100, 150, 200, 250])
    .orient('horizontal')
    .scale(linear);

  svg.select(".legendLinear")
    .call(legendLinear)
    .style("fill", "white")
    .style("font-size", 6*width/200+2+"px");

  svg.append("text")
    .attr("x", 10)
    .attr("y", 10)
    .attr("class", "side-info")
    .text("Average price (USD) of an apartment per night")
    .style("font-size", 6*width/220+2+"px")
    .style("fill", "white");

}

function draw_legend_size(idname, width, height, data, linearSize, listings_type) {


  //var linearSize = d3.scaleLinear().domain([0,10]).range([10, 30]);
  //  var svg = d3.select("svg");
  var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height);
              
  svg.append("g")
    .attr("class", "legendSize")
    .attr("transform", "translate(20, 40)");

  var x = d3.scaleLinear().range([0, width]);
  x.domain(d3.extent(data, function(d) { return d; }));


  svg.selectAll("circle")
    .data(data)
  .enter().append("circle")
    .attr("cy", 30*width/200+40)
    //.attr("cx", function(d, i) { return x(d); })
    .attr("cx", function(d,i) { return i*width/4+40-(i%2)*10; })
    .attr("r", function(d) { return linearSize(d); })
    .attr("stroke", "white");

  text = ["Total number of listings (in thousands)", "Number of listings per 1000 residents"];

  svg.append("text")
    .attr("x", 30)//-(listings_type===1)*20)
    .attr("y", 30)
    .attr("class", "side-info")
    .text(text[listings_type])
    .style("font-size", 6*width/200+2+"px")
    .style("fill", "white");

  label_data = [[0, 2, 10, 25], [0, 2, 10, 20]];

  svg.selectAll("text")
    .data(label_data[listings_type])
  .enter().append("text")
    .attr("x", function(d,i) { return (i-1)*width/4+35-(i===2)*10; } )
    .attr("y", 20*width/80+70)
    .text(function(d) {return d;} )
    .style("fill", "white")
    .style("font-size", 6*width/100+2+"px");
/*
    .attr("x", 50-(listings_type===1)*20)
    .attr("y", 10)
    .attr("class", "side-info")
    .text(text[listings_type])
    .style("font-size", 6*width/200+2+"px")
    .style("fill", "white");
*/

 //   alert(width);

/*
var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height);
// Set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Scale the range of the data
x.domain(d3.extent(data, function(d) { return d; }));
y.domain([d3.min(data, function(d) { return linearSize(d); }), d3.max(data, function(d) { return linearSize(d); })]);

// Define the line
var valueline = d3.line()
  .x(function(d) { return x(d); })
  .y(function(d) { return y(linearSize(d)); });


// Add the valueline path.
  svg.append("path")
    .data(data)
    .attr("class", "line")
    .attr("d", valueline(data))
    .attr("stroke", "black");
*/





  }


/*
 * Sets up the layout buttons to allow for toggling between view modes.
*/
function setupButtons(idname) {
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
