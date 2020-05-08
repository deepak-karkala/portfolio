var minDeviceWidth = 375;
var maxDeviceWidth = 1024;

var water_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([3, 5]);
//var water_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([25, 20]);
var population_radius_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([4, 6]);


//var prev_progress_water_opacity = 0;
//var min_change_water_opacity = 0.01;
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function draw_circles_pack(idname, file, width, height, listings_type, color_types) {

  var svg3 = d3.select(idname).append("svg")
        .attr("width", width)
        .attr("height", height);
        /*
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
        */
  //width = +svg3.attr("width"),
  //height = +svg3.attr("height");

  var format = d3.format(",d");

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
            d.name = d.data.name;
            d.type = d.data.type;
            d.image = d.data.image;
            //d.region = d.data.region;
          }
        });

    leaves = pack(root).leaves();

    var node = svg3.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip1")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");

    var circles1 = node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .text(function(d) { return d.name; })
        .style("fill", function(d) { return color_types[d.type]; })
        //.style("fill", "white")
        //.style("fill", function(d) { return color_price(d.price); })
      
        .on("mouseover", function(d){
          //return tooltip.text(d.city).style("visibility", "visible");
          d3.select(this).style('stroke', 'white').style("stroke-width", 5).style("stroke-opacity", 1.0);
          if (listings_type===0) {
            return tooltip.html(
              '<div class="row">' +
                '<div class="col-4 profile_image">' +
                  '<img src="'+ 'data/profile_images/' + d.id + '_image.jpg' +'"></img>' +
                '</div>' +
                '<div class="col-8">' +
                  '<div class="row">' +
                    '<b>' + d.name + '</b>' +
                  '</div>' +
                  '<div class="row">' +
                    '@' + d.id +
                  '</div>' +
                  '<div class="row">' +
                    'Followers: ' + Math.round(d.value/1e6) + ' Million' +
                  '</div>' +
                '</div>'+
              '</div>'
              )
            .style("visibility", "visible");
          } else if (listings_type===1) {
            return tooltip.html(
              '<div class="row">' +
                '<div class="col-4 profile_image">' +
                  '<img src="'+ 'data/profile_images/' + d.id + '_image.jpg' +'"></img>' +
                '</div>' +
                '<div class="col-8">' +
                  '<div class="row">' +
                    '<b>' + d.name + '</b>' +
                  '</div>' +
                  '<div class="row">' +
                    '@' + d.id +
                  '</div>' +
                  '<div class="row">' +
                    'Following: ' + numberWithCommas(d.value) +
                  '</div>' +
                '</div>'+
              '</div>'
              )
            .style("visibility", "visible");
            //return tooltip.html("<b>"+d.name+"</b>" + "<br/>"  + Math.round(d.value) + " Number following").style("visibility", "visible");
          } else if (listings_type===2) {
            return tooltip.html(
              '<div class="row">' +
                '<div class="col-4 profile_image">' +
                  '<img src="'+ 'data/profile_images/' + d.id + '_image.jpg' +'"></img>' +
                '</div>' +
                '<div class="col-8">' +
                  '<div class="row">' +
                    '<b>' + d.name + '</b>' +
                  '</div>' +
                  '<div class="row">' +
                    '@' + d.id +
                  '</div>' +
                  '<div class="row">' +
                    numberWithCommas(d.value) + ' tweets posted' +
                  '</div>' +
                '</div>'+
              '</div>'
              )
            .style("visibility", "visible");
            //return tooltip.html("<b>"+d.name+"</b>" + "<br/>"  + Math.round(d.value) + " Number of tweets").style("visibility", "visible");
          } else if (listings_type===3) {
            return tooltip.html(
              '<div class="row">' +
                '<div class="col-4 profile_image">' +
                  '<img src="'+ 'data/profile_images/' + d.id + '_image.jpg' +'"></img>' +
                '</div>' +
                '<div class="col-8">' +
                  '<div class="row">' +
                    '<b>' + d.name + '</b>' +
                  '</div>' +
                  '<div class="row">' +
                    '@' + d.id +
                  '</div>' +
                  '<div class="row">' +
                    numberWithCommas(d.value) + ' tweets liked' +
                  '</div>' +
                '</div>'+
              '</div>'
              )
            .style("visibility", "visible");
            //return tooltip.html("<b>"+d.name+"</b>" + "<br/>"  + Math.round(d.value) + " Number of likes").style("visibility", "visible");
          }
        })
        .on("mousemove", function(){
          return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(){
          d3.select(this).style('stroke', 'white').style("stroke-opacity", 0);
          return tooltip.style("visibility", "hidden");
        })
        .attr("opacity", 0)
        .transition()
          .duration(1000)
          .attr("opacity", 1);

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
              dsplit = [];
              if (d.data.name.split(" ")[1]===undefined) {
                dsplit[0] = d.data.name.split(" ")[0];
              } else {
                dsplit[0] = d.data.name.split(" ")[1];
              }
              //if(dsplit[0]=="katyperry" || dsplit[0]=="justinbieber" || dsplit[0]=="BarackObama" || dsplit[0]=="rihanna" || dsplit[0]=="ladygaga")
              if(dsplit[0]=="PERRY" || dsplit[0]=="Bieber" || dsplit[0]=="Obama" || dsplit[0]=="Rihanna" || dsplit[0]=="Gaga" || dsplit[0]=="YouTube" || dsplit[0]=="Twitter") {
                return dsplit;
              } else {
                return [""];
              }
            } else if (listings_type===1) {
              if (width <= 300) {
                if(dsplit[0]=="BarackObama" || dsplit[0]=="britneyspears" || dsplit[0]=="justinbieber" || dsplit[0]=="ladygaga") {
                  return dsplit;
                } else {
                  return [""];
                }
              } else {
                if(dsplit[0]=="BarackObama" || dsplit[0]=="britneyspears" || dsplit[0]=="justinbieber" || dsplit[0]=="ladygaga" || dsplit[0]=="ArianaGrande") {
                  return dsplit;
                } else {
                  return [""];
                }
              }
            } else if (listings_type===2) {
              if (width <= 300) {
                if(dsplit[0]=="nytimes" || dsplit[0]=="CNN" || dsplit[0]=="espn") {
                  return dsplit;
                } else {
                  return [""];
                }
              } else {
                if(dsplit[0]=="nytimes" || dsplit[0]=="CNN" || dsplit[0]=="SportsCenter" || dsplit[0]=="espn" || dsplit[0]=="realmadrid") {
                  return dsplit;
                } else {
                  return [""];
                }
              }

              if(dsplit[0]=="nytimes" || dsplit[0]=="CNN" || dsplit[0]=="SportsCenter" || dsplit[0]=="espn" || dsplit[0]=="realmadrid")
                return dsplit;
              else
                return [""];
            } else if (listings_type===3) {
              if(dsplit[0]=="ArianaGrande" || dsplit[0]=="nytimes" || dsplit[0]=="JLo" || dsplit[0]=="katyperry" || dsplit[0]=="Twitter")
                return dsplit;
              else
                return [""];
            }
            //return dsplit;
          })
        .enter().append("tspan")
          .attr("x", -18)
          .attr("y", 0) //unction(d, i, nodes) { return 3 + (i - nodes.length / 2 - 0.5) * 10; })
          .text(function(d) { return d; })
          .attr("class", "account_circle")
          .style("font-size", "0.60rem");

    /*
      // Append images
      var images = node.append("svg:image")
            .attr("xlink:href",  function(d) { return "https://pbs.twimg.com/profile_images/1043155752435834881/7MAR7MJO_normal.jpg";})
            .attr("x", function(d) { return -25;})
            .attr("y", function(d) { return -25;})
            .attr("height", 50)
            .attr("width", 50);
    */
  });

}

function draw_circles_pack_likes(idname, file, account, width, height, color_types, top_type) {

  var svg3 = d3.select(idname).append("svg")
        .attr("width", width)
        .attr("height", height);
        /*
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
        */
  //width = +svg3.attr("width"),
  //height = +svg3.attr("height");

  var format = d3.format(",d");

  var pack = d3.pack()
      .size([width, height])
      .padding(1.5);

  d3.csv(file, function(d) {
    d.value = +d.value;
    d.id = d.id;
    d.type = +d.type;
    d.account_type = +d.account_type;
    if ((d.id == account) && (d.type==top_type) && (d.value)) {
      return d;
    }
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
            d.tweet = d.data.tweet;
            d.type = d.data.type;
            d.account_type = d.data.account_type;
          }
        });

    leaves = pack(root).leaves();

    var node = svg3.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip1")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");

    var circles1 = node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) {
          //console.log(account_type);
          //return "gray";
          return color_types[d.account_type];
        })
        //.style("fill", "white")
        //.style("fill", function(d) { return color_price(d.price); })
      
        .on("mouseover", function(d){
          //return tooltip.text(d.city).style("visibility", "visible");
          d3.select(this).style('stroke', 'white').style("stroke-width", 5).style("stroke-opacity", 1.0);
            return tooltip.html(
              '<div class="row">' +
                '<div class="col-4 profile_image">' +
                  '<img src="'+ 'data/profile_images/' + d.id + '_image.jpg' +'"></img>' +
                '</div>' +
                '<div class="col-8">' +
                  '<div class="row">' +
                    '<b>' + d.name + '</b>' +
                  '</div>' +
                  '<div class="row">' +
                    '@' + d.id +
                  '</div>' +
                  '<div class="row">' +
                    'Likes: ' + d.value +
                  '</div>' +
                '</div>'+
              '</div>'
              )
            .style("visibility", "visible");
        })
        .on("mousemove", function(){
          return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function(){
          d3.select(this).style('stroke', 'white').style("stroke-opacity", 0);
          return tooltip.style("visibility", "hidden");
        })
        .attr("opacity", 0)
        .transition()
          .duration(1000)
          .attr("opacity", 1);


          node.append("text")
            .attr("dx", -40)
            .attr("dy", -50)
            .attr("radius", 10)
            .text(function(d) {
              wrap_text = fit_text_in_circle(d.tweet);
              insert_wrap_text(node, wrap_text);
              return "";
            })
            .style("font-size", "0.5rem");

  });

}

function add_circle_legend() {
    var div = document.getElementById("legend_text");
    div.innerHTML = '<svg height="20" width="20"><circle cx="10" cy="15" r="5" stroke="black" stroke-width="1" fill="#5DADE2" /></svg>'+
                    'Individual'+
                    '<svg height="20" width="20"><circle cx="10" cy="15" r="5" stroke="black" stroke-width="1" fill="#AF7AC5" /></svg>'+
                    'Organisation';
}

function remove_circle_legend() {
    var div = document.getElementById("legend_text");
    div.innerHTML = '';
}

function insert_wrap_text(node, text) {
  init_dy = -50;
  for (var i=0; i<wrap_text.length; i++) {
    node.append("text")
      .attr("dx", -40)
      .attr("dy", init_dy + 10)
      .attr("radius", 10)
      .text(function(d) {
        return d.tweet;
      })
      .style("font-size", "0.5rem");
  }

}

function fit_text_in_circle(text) {

    var words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
    if (!words[words.length - 1]) words.pop();
    if (!words[0]) words.shift();

    function measureWidth(text) {
      var context = document.createElement("canvas").getContext("2d");
      return context.measureText(text).width;
    }

    lineHeight = 12;
    targetWidth = Math.sqrt(measureWidth(text.trim()) * lineHeight);


    function get_wrap_text(words) {
      var line;
      var lineWidth0 = Infinity;
      var lines = [];
      for (var i = 0, n = words.length; i < n; ++i) {
        var lineText1 = (line ? line.text + " " : "") + words[i];
        var lineWidth1 = measureWidth(lineText1);
        if ((lineWidth0 + lineWidth1) / 2 < targetWidth) {
          line.width = lineWidth0 = lineWidth1;
          line.text = lineText1;
        } else {
          lineWidth0 = measureWidth(words[i]);
          //line = {width: lineWidth0, text: words[i]};
          line = words[i];
          lines.push(line);
        }
      }
      return lines;
    }
    wrap_text = get_wrap_text(words);

    function textRadius(lines) {
      var radius = 0;
      for (var i = 0, n = lines.length; i < n; ++i) {
        var dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight;
        var dx = lines[i].width / 2;
        radius = Math.max(radius, Math.sqrt(dx * dx  + dy * dy));
      }
      return radius;
    }
    radius = textRadius(wrap_text);

    return wrap_text;
}
