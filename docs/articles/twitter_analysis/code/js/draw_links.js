var twitter_background_blue = "#c0deed";
var twitter_verified_blue = "#1dcaff";
var twitter_logo_blue = "#00aced";
var twitter_dark_blue = "#0084b4";
var water_blue = "#4363d8";
var in_link_color = "#ffe119"; //#F1E0D6";
var out_link_color = "#f58231"; //#BF988F";
var circle_blue = "#5DADE2"; //"#85C1E9";
var circle_purple = "#AF7AC5"; //#48C9B0"; //"#A569BD";

var minDeviceWidth = 325; //375;
var maxDeviceWidth = 612; //1024/2;

var links_diagram_diameter = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([1.8, 0.9]);
var link_node_text_size = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.50, 0.75]);

function draw_links(idname, width, height) {

    var scale_factor = 1.10;

    var diameter = Math.min(600, width * scale_factor), //links_diagram_diameter(width), //width * 2.25, //550, //480,
        radius = diameter / 2,
        innerRadius = radius - 120;

    var cluster = d3.cluster()
        .size([360, innerRadius]);

    var line = d3.radialLine()
        .curve(d3.curveBundle.beta(0.85))
        .radius(function(d) { return d.y; })
        .angle(function(d) { return d.x / 180 * Math.PI; });

    var svg = d3.select(idname).append("svg")
        .attr("width", width * scale_factor)
        .attr("height", width * scale_factor)
        //.attr("width", diameter)
        //.attr("height", diameter)
      .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    var link = svg.append("g").selectAll(".link"),
        node = svg.append("g").selectAll(".node");
        circle = svg.append("g").selectAll(".circle");

    d3.json("data/link_new.json", function(error, classes) {
      if (error) throw error;

      var root = packageHierarchy(classes)
          .sum(function(d) { return d.size; });

      cluster(root);

      link = link
        .data(packageImports(root.leaves()))
        .enter().append("path")
          .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
          .attr("class", "link")
          .attr("d", line)
          .style("stroke", twitter_verified_blue)
          .style("fill", "none")
          .style("stroke-width", 1)
          .style("opacity", 0.5);

      node = node
        .data(root.leaves())
        .enter()
        .append("text")
          .attr("class", "node")
          .attr("dy", "0.31em")
          .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 18) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
          .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
          .text(function(d) { return d.data.key; })
          .style("fill", "white")
          .style("font-size", link_node_text_size(width)+"rem");
          //.style("opacity", 0);

     circle = circle
     .data(root.leaves())
     .enter()
     .append("circle")
         .attr("class", "circle")
         .attr("dy", "0.31em")
         .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
         .attr("r", 4)
         .style("fill", twitter_verified_blue)
         .on("mouseover", function(d) {
            circle_selected = d.data.key;
            
            d3.select(this).style("r", 8).style("stroke", "white").style("stroke-width", 3);

            d3.selectAll(".link")
              .filter(function(d) {
                link_source = d.source.data.key;
                link_target = d.target.data.key;
                return ( (circle_selected===link_source) );
              })
              .style("stroke-width", 3)
              .style("stroke", in_link_color)
              .style("opacity", 1.0);

            d3.selectAll(".link")
              .filter(function(d) {
                link_source = d.source.data.key;
                link_target = d.target.data.key;
                return ( (circle_selected===link_target) );
              })
              .style("stroke-width", 3)
              .style("stroke", out_link_color)
              .style("opacity", 1.0);

         })
         .on("mouseout", function(d) {
            d3.select(this).style("r", 4).style("stroke", "none");
            d3.selectAll(".link").style("stroke-width", 1).style("stroke", twitter_background_blue).style("opacity", 0.5);
         });

    });

}


function highlight_link(account) {

    d3.selectAll(".circle")
      .filter(function (d) {
        return d.data.key === account;
      })
      .style("r", 8)
      .style("stroke", "white")
      .style("stroke-width", 3);

    d3.selectAll(".link")
      .filter(function(d) {
        link_source = d.source.data.key;
        link_target = d.target.data.key;
        return ( (account===link_source) );
      })
      .style("stroke-width", 3)
      .style("stroke", in_link_color)
      .style("opacity", 1.0);

    d3.selectAll(".link")
      .filter(function(d) {
        link_source = d.source.data.key;
        link_target = d.target.data.key;
        return ( (account===link_target) );
      })
      .style("stroke-width", 3)
      .style("stroke", out_link_color)
      .style("opacity", 1.0);
}


function unhighlight_all_links() {
    d3.selectAll(".circle")
      .filter(function (d) {
        return 1;
        //return d.data.key === account;
      })
      .style("r", 4)
      .style("stroke", "none")
      .style("stroke-width", 1);

    d3.selectAll(".link")
      .style("stroke", twitter_background_blue)
      .style("stroke-width", 1)
      .style("opacity", 0.5);
}

// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  classes.forEach(function(d) {
    find(d.name, d);
  });

  return d3.hierarchy(map[""]);
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.data.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.data.imports) d.data.imports.forEach(function(i) {
      console.log(map[d.data.name]);
      console.log(map[i]);
      imports.push(map[d.data.name].path(map[i]));
    });
  });

  return imports;
}

function add_link_legend() {
    var div = document.getElementById("link_legend_text");
    div.innerHTML = '<svg height="20" width="20"><circle cx="10" cy="15" r="5" stroke="black" stroke-width="1" fill="#ffe119" /></svg>'+
                    'Tweets sent to'+
                    '<svg height="20" width="20"><circle cx="10" cy="15" r="5" stroke="black" stroke-width="1" fill="#f58231" /></svg>'+
                    'Tweets received from';
}

function remove_link_legend() {
    var div = document.getElementById("link_legend_text");
    div.innerHTML = '';
}