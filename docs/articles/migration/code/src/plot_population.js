//Setup buttons
setupButtons("#plot_type");

var minDeviceWidth = 375;
var maxDeviceWidth = 1024;

// Width and height of container
var bb = document.getElementById("vis1").clientWidth;
var margin = {top: 20, right: 10, bottom: 0, left: 40};
var width_scale_factor = 1.0;
base_width = bb*width_scale_factor - margin.left - margin.right;

//Size
/*
var size_arr = [500e3, 950715, 1500e3, 5806015, 8000e3, 39557045, 50000e3, 82887000, 200000e3];
var size_text_arr = ["0.5 Million", "0.95 Million", "1.5 Million", "5.8 Million", "8 Million",
"39 Million", "50 Million", "82 Million", "200 Million"];
var names_arr = ["Sandhill Cranes", "Population of Austin, Texas","Wildebeest", "Population of Denmark",
"Straw-Colored Fruit Bats", "Population of California", "Red Crab of Christmas Island", "Population of Germany",
"Monarch Butterfly"];
var is_comparison_arr = [0, 1, 0, 1, 0, 1, 0, 1, 0];
*/
var size_arr = [500e3, 950715, 1500e3, 5806015, 8000e3, 50000e3, 82887000, 200000e3];
var size_text_arr = ["0.5 Million", "0.95 Million", "1.5 Million", "5.8 Million", "8 Million",
 "50 Million", "82 Million", "200 Million"];
var names_arr = ["Sandhill Cranes", "Population of Austin, Texas","Wildebeest", "Population of Denmark",
"Straw-Colored Fruit Bats", "Red Crab of Christmas Island", "Population of Germany",
"Monarch Butterfly"];
var is_comparison_arr = [0, 1, 0, 1, 0, 0, 1, 0];


// Distance
//var distance_arr = [3800, 4500, 5000, 15000, 17000, 17600, 20000, 22000, 40000, 71000];
//var distance_text_arr = ["3,800 Kilometers", "4,500 Kilometers",
//"5,000 Kilometers", "15,000 Kilometers", "17,000 Kilometers", "17,600 Kilometers", "20,000 Kilometers",
//"22,000 Kilometers", "40,000 Kilometers", "71,000 Kilometers"];
//var distance_names_arr = ["Salmon", "Distance from NYC to Los Angeles",
//"Caribou", "Distance from NYC to Singapore", "Dragon Flies",
//"Adélie Penguins", "Leatherback Turtle", "Humpback Whale",
//"Circumference of Earth", "Arctic Tern"];
//var distance_is_comparison_arr = [0, 1, 0, 1, 0, 0, 0, 0, 1, 0];
var distance_arr = [3800, 5000, 15000, 17000, 17600, 20000, 22000, 40000, 71000];
var distance_text_arr = ["3,800 Kilometers",
"5,000 Kilometers", "15,000 Kilometers", "17,000 Kilometers", "17,600 Kilometers", "20,000 Kilometers",
"22,000 Kilometers", "40,000 Kilometers", "71,000 Kilometers"];

var distance_names_arr = ["Salmon",
"Caribou", "Distance from NYC to Singapore", "Dragon Flies",
"Adélie Penguins", "Leatherback Turtle", "Humpback Whale",
"Circumference of Earth", "Arctic Tern"];
var distance_is_comparison_arr = [0, 0, 1, 0, 0, 0, 0, 1, 0];

////// By population //////
var scale = 1e5;
var num_size = size_arr.length;
var data_arr = [];

for (var j=0; j<num_size; j++) {
    data_arr[j] = [];
    size_arr[j] = Math.floor(size_arr[j] / scale);
    for (var i=0; i<size_arr[j]; i++) {
        data_arr[j][i] = i;
    }
}


////// By distance //////
var distance_scale = 1e2;
var distance_num_size = distance_arr.length;
var distance_data_arr = [];

for (var j=0; j<distance_num_size; j++) {
    distance_data_arr[j] = [];
    distance_arr[j] = Math.floor(distance_arr[j] / distance_scale);
    for (var i=0; i<distance_arr[j]; i++) {
        distance_data_arr[j][i] = i;
    }
}


// Width dependent factors
var name_font_size_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([8, 12]);

// Initial visualisation
draw_population();

// On click "size"
$("#migration_size").click(function() {
    for (var j=0; j<Math.max(num_size, distance_num_size); j++) {
        var idname = "#vis"+(j+1);
        d3.select(idname).select("svg").remove();
    }
    draw_population();
});

// On click "population"
$("#migration_distance").click(function() {
    for (var j=0; j<Math.max(num_size, distance_num_size); j++) {
      var idname = "#vis"+(j+1);
      d3.select(idname).select("svg").remove();
    }
    draw_distance();
});


function draw_population() {
  div = document.getElementById("sub_text");
  div.innerHTML = "Shows the population of migratory herd. Each dot represents 100,000 individuals. Hover over animal name to learn more.";

  var num_dots_per_row = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([70, 150]);
  num_dots_per_row_width = Math.floor(num_dots_per_row(base_width));
  var row_gap_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([5, 7]);
  var radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([2.0, 2.75]);
  for (var j=0; j<num_size; j++) {
      var idname = "#vis"+(j+1);
      var height = 5 + size_arr[j]/15; //height_factor(base_width); //document.getElementById("vis1").clientHeight;

      //div = document.getElementById("name"+(j+1));
      //div.innerHTML = names_arr[j];
      plot_population(idname, base_width, height, data_arr[j], is_comparison_arr[j], j, num_dots_per_row_width, row_gap_factor,
        radius_factor);
  }
}



function draw_distance() {
  div = document.getElementById("sub_text");
  div.innerHTML = "Shows the distance covered by migratory herd or individual animal. Hover over animal name to learn more.";

  var num_dots_per_row = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([150, 300]);
  num_dots_per_row_width = Math.floor(num_dots_per_row(base_width));
  var row_gap_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([2, 3]);
  var col_gap_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([7, 10]);
  var radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([1.5, 2.75]);
  for (var j=0; j<distance_num_size; j++) {
      var idname = "#vis"+(j+1);
      var height = 5 + distance_arr[j]/15; //height_factor(base_width); //document.getElementById("vis1").clientHeight;

      //div = document.getElementById("name"+(j+1));
      //div.innerHTML = names_arr[j];
      plot_distance(idname, base_width, height, distance_data_arr[j], distance_is_comparison_arr[j], j,
        num_dots_per_row_width, row_gap_factor, radius_factor, num_dots_per_row_width, col_gap_factor);
  }
}

// Tooltip
var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip1")
      /*.style("position", "absolute")*/
      //.style("z-index", "10")
      .style("visibility", "hidden");


function plot_distance(idname, width, height, data, name_type, name_idx, num_dots_per_row_width,
  row_gap_factor, radius_factor, num_dots_per_row, col_gap_factor) {

    var svg = d3.select(idname).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("r", radius_factor(width))
          //.attr("cx", function(d,i) { return (i%150)*5; })
          //.attr("cy", function(d,i) { return Math.floor(i/150)*5; })
          .attr("cx", function(d,i) {
            return (i%num_dots_per_row_width)*row_gap_factor(width);
            /*
            row_id = Math.floor(i/num_dots_per_row_width);
            if (row_id%2===0) {
              return (i%num_dots_per_row_width)*row_gap_factor(width);
            } else {
              return (num_dots_per_row_width - i%num_dots_per_row_width)*row_gap_factor(width);
            }
            */
          })
          .attr("cy", function(d,i) { return Math.floor(i/num_dots_per_row_width)*col_gap_factor(width); })
          .style("fill", function(d,i) {
            if (name_type===0) {
              return "red";
            } else{
              return "gray";
            }
          })
        .style("opacity", "0")
        .transition()
          .delay(function(d, i) { return i*20; })
          .style("opacity", "1")
          .duration(function(d, i) { return 5; })
          .attr('r', radius_factor(width))
        .transition()
          .duration(function(d, i) { return 5; })
          .attr('r', function(d, i) { return radius_factor(width); } );


    svg.append("text")
        .attr("class", function(d,i) {
          if (name_type === 0) {
            return "animal_name_text";
          } else {
            return "comparison_name_text";
          }
        })
        .attr("x", function(d) { return -30; } )
        .attr("y", function(d) { return -10; })
        .text(function(d) { return distance_names_arr[name_idx];})
        //.html("<em class='animal_name_text' style='color:white;'>Test</em>")
        //.style("font-size", name_font_size_factor(width))
        //.style("fill", "white")
        .on("mouseover", function(d, i) {
          if (name_type === 0) {
            //return tooltip.text(d.city).style("visibility", "visible");
            d3.select(this).style("opacity", 1.0).style("stroke-opacity", 1.0);
            return tooltip.html(
              '<div class="well animal_name">'+
                  distance_names_arr[name_idx]+
              '</div>'+
                '<div class="row">'+
                  '<div class="col-lg-4 col-md-4 col-sm-4 col-4">'+
                      '<img class="animal_thumbnail" src="img/distance_img'+name_idx+'.jpg"></img>'+
                  '</div>'+
                  '<div class="col-lg-8 col-md-8 col-sm-8 col-8 animal_description">'+
                      distance_description_arr[name_idx]+
                  '</div>'+
              '</div>')
            .style("visibility", "visible");
          }
        })
        .on("mousemove", function(d, i) {
          if (name_type === 0) {
            return tooltip.style("top", (event.pageY-height*4)+"px").style("left",(event.pageX+30)+"px");
          }
        })
        .on("mouseout", function(d, i) {
          if (name_type === 0) {
            d3.select(this).style("opacity", 1.0).style("stroke-opacity", 1.0);
            return tooltip.style("visibility", "hidden");
          }
        });


    svg.append("text")
        .attr("class", "animal_name_info")
        .attr("x", function(d) { return 180; } )
        .attr("y", function(d) { return -10; })
        .text(function(d) { return distance_text_arr[name_idx];});
}


function plot_population(idname, width, height, data, name_type, name_idx, num_dots_per_row_width, row_gap_factor,
        radius_factor) {

    var svg = d3.select(idname).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("r", radius_factor(width))
          //.attr("cx", function(d,i) { return (i%150)*5; })
          //.attr("cy", function(d,i) { return Math.floor(i/150)*5; })
          .attr("cx", function(d,i) { return (i%num_dots_per_row_width)*row_gap_factor(width); })
          .attr("cy", function(d,i) { return Math.floor(i/num_dots_per_row_width)*row_gap_factor(width); })
          .style("fill", function(d,i) {
            if (name_type===0) {
              return "red";
            } else{
              return "gray";
            }
          })
        .style("opacity", "0")
        .transition()
          .delay(function(d, i) { return i*20; })
          .style("opacity", "1")
          .duration(function(d, i) { return 2; })
          .attr('r', radius_factor(width))
        .transition()
          .duration(function(d, i) { return 2; })
          .attr('r', function(d, i) { return radius_factor(width); } );


    svg.append("text")
        .attr("class", function(d,i) {
              if (name_type === 0) {
                return "animal_name_text";
              } else {
                return "comparison_name_text";
              }
            })
        .attr("x", function(d) { return -30; } )
        .attr("y", function(d) { return -10; })
        .text(function(d) { return names_arr[name_idx];})
        //.style("font-size", name_font_size_factor(width))
        //.style("fill", "white")
        .on("mouseover", function(d, i) {
          //if (name_idx%2 === 0) {
          if (name_type === 0) {
            //return tooltip.text(d.city).style("visibility", "visible");
            d3.select(this).style("opacity", 1.0).style("stroke-opacity", 1.0);
            return tooltip.html(
              '<div class="well animal_name">'+
                  names_arr[name_idx]+
              '</div>'+
                '<div class="row">'+
                  '<div class="col-lg-4 col-md-4 col-sm-4 col-4">'+
                      '<img class="animal_thumbnail" src="img/img'+name_idx+'.jpg"></img>'+
                  '</div>'+
                  '<div class="col-lg-8 col-md-8 col-sm-8 col-8 animal_description">'+
                      description_arr[name_idx]+
                  '</div>'+
              '</div>')
            .style("visibility", "visible");
          }
        })
        .on("mousemove", function(d, i) {
          if (name_type === 0) {
          //if (name_idx%2 === 0) {
            return tooltip.style("top", (event.pageY-height*1.5)+"px").style("left",(event.pageX+30)+"px");
          }
        })
        .on("mouseout", function(d, i) {
          if (name_type === 0) {
          //if (name_idx%2 === 0) {
            d3.select(this).style("opacity", 1.0).style("stroke-opacity", 1.0);
            return tooltip.style("visibility", "hidden");
          }
        });

    svg.append("text")
        .attr("class", "animal_name_info")
        .attr("x", function(d) { return 200; } )
        .attr("y", function(d) { return -10; })
        .text(function(d) { return size_text_arr[name_idx];});

/*
    svg.selectAll(".animal_name_info")
        .transition()
          .delay(function(d, i) { return i*20; })
          .text(function(d,i) { return i; })
          .duration(function(d, i) { return 2; });
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

var description_arr = ["Every March, more than 500,000 of these giant birds converge on Nebraska's Platte" +
" River basin before continuing their pilgrimage north.",
"",
"The Serengeti population of wildebeest is a huge nomadic group that migrates 1,600 "+
"kilometres each year. Beginning in January and February the herd moves from the Serengeti plains west towards Lake Victoria.",
"",
"Eight million straw-colored fruit bats descend on Zambia's Kasanka National Park, beginning in October.",
"In the Indian Ocean some 1,600 miles "+
"off the northwestern coast of Australia, this island is overrun each spring by more than 50 million scuttling red"+
" land crabs during breeding season. The journey is about 5 kilometres long, lasting up to 12 hours over 5 days."+
" At the beginning of the wet season the group heads out from the forest to the coast to breed.",
"",
"Monarch butterflies native to North America, cover up to 4800 kilometers in migration every year. "+
"They migrate to southern part of California and Mexico to spend the winter season and spend most of their lifespan in"+
" migration, up to 2-3 months. The migration cycle is longer than the life span so no one butterfly makes "+
"the entire round trip."];

var distance_description_arr = [
"Salmon fishes traverse between freshwater "+
"and saltwater. After hatching of eggs salmons remain in river waters for 2-3 years. During that time salmons "+
"undergo many physiological changes. These changes help them to migrate to seas waters without facing much obstacles.",
"Caribous or reindeers are found in northern parts of Europe, Asia and North America. During summer season they start "+
"migration in search of food. They form large herd that have members up to 50,000 reindeers before starting "+
"migration. Caribous will covers up to 70 kilometers in a single day during migration, have power to run up to "+
"speed of 80 km/hr and can swim at 10km/hr.",
"",
"Dragon flies cover up to "+
"17000 kilometers during migration. There are 5200 different dragonflies are in the world, 50 of them do migration. "+
"Unfortunately no dragonfly can make complete migration, only possible by four generations of dragon flies.",
"Adélie penguins have the longest migration of all of the penguins.  They follow the sun from the breeding colonies to winter feeding grounds.",
"Unlike other turtles, Leatherback sea turtles have smooth outer layer and show "+
"strong migratory behaviour. Leatherback sea turtles will cross both Atlantic and Pacific ocean during migration, "+
"cross a long distance up to 20,000 kilometers in a complete migration. They make migration in searching for food "+
"and for breeding.",
"Humpback whales makes longest migration of any mammals in the world and cover distance of 22,000 kilometers every year."+
" They spend summer season near polar region and feed on krills, "+
"planktons and other smaller fishes. In the beginning of winter season they migrate to equator. The massive tail "+
"fin help them to move easily across ocean waters. Females and small whales moves at first in groups during migration.",
"",
"The 113 grams weighs tiny Arctic tern makes longest migration in the world, annual round trip distance of "+
"71,000 kilometers. During migration they travel from Arctic circle to Antarctic region and flies back every year. "+
"In that way Arctic tern sees more day light than any other creatures on Earth, also sees two summers per year."
];




