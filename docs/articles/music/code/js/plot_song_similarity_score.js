var minDeviceWidth = 375;
var maxDeviceWidth = 1024;
var colorScale = d3.scaleSequential(d3.interpolatePRGn);
//var colorScale = d3.scaleLinear([0, 0.5, 1]).range([d3.interpolatePRGn(0), d3.interpolatePRGn(0.5), d3.interpolatePRGn(1)]);
//var colorScale = d3.scaleSequential(d3.interpolateRdYlGn);

plot_all_songs_similarity_score_initial();
plot_score_legend_top();

function plot_all_songs_similarity_score_initial() {
    idname = "#plot_all_songs_similarity_scores";
    d3.select(idname).select("svg").remove();
    var bb = d3.select(idname).node().offsetWidth;
    //height_scale_factor = 0.80;
    var width_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([1.0, 0.70]);
    width_scale_factor = width_scale_factor_width(bb);
    var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.80, 0.40]);
    height_scale_factor = height_scale_factor_width(bb);
    var margin = {right:80, left:40, top:20, bottom:20};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    file = "data/song_similarity_score.csv";

    var force_collide_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([5, 10]);
    force_collide_factor = force_collide_factor_width(bb);

    plot_song_similarity_score(idname, file, base_width, base_height, margin, colorScale, force_collide_factor);
}

//(function() {

    function plot_score_legend_top() {
        idname = "#all_songs_similarity_scores_legend";
        var bb = d3.select(idname).node().offsetWidth;
        var width_scale_factor = 1.0;
        var margin = {top: 30, right: 10, bottom: 10, left: 10};
        base_width = bb*width_scale_factor - margin.left - margin.right;
        var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.35, 0.15]);
        var height_scale_factor = height_scale_factor_width(bb);
        base_height = bb*height_scale_factor - margin.top - margin.bottom;
        var shape_width_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 5]);
        shape_width = shape_width_factor(bb);
        plot_score_legend(idname, base_width, base_height, shape_width, colorScale);
    }

    setupButtons("#all_songs_similarity_scores_button");

    function all_songs_similarity_scores_button_click(id) {
        if (id=="all") {
            decade = "";
            show_all = 1;
        } else {
            decade = parseInt(id);
            show_all = 0;
        }
        idname = "#plot_all_songs_similarity_scores";
        show_decade_songs(idname, decade, show_all);
    }

    function show_decade_songs(idname, decade, show_all) {
        d3.select(idname)
            .selectAll(".dot")
            .transition()
                .duration(500)
                .attr("opacity", 1)
            .transition()
                .duration(1000)
                .attr("opacity", function(d) {
                    if ((d.decade == decade) || show_all==1) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

        d3.select(idname)
            .selectAll(".text")
            .transition()
                .duration(1000)
                .attr("opacity", function(d) {
                    if ((d.decade == decade) || show_all==1) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
    }

    function plot_song_similarity_score(idname, file, width, height, margin, colorScale, force_collide_factor) {

        var tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip_song_similarity_score")
                      .style("position", "absolute")
                      .style("z-index", "10")
                      .style("visibility", "hidden");

        d3.csv(file, function (data) {
            data.forEach(function(d) {
                d.similarity_score = +d.similarity_score;
            })
            var xScale = d3.scaleLinear().domain(d3.extent(data, function(d) {return d.similarity_score} )).range([0, width]);
            var xAxis = d3.axisBottom(xScale);

            var simulation = d3.forceSimulation(data)
                .force("x", d3.forceX(function(d) { return xScale(d.similarity_score); }).strength(1))
                .force("y", d3.forceY(height / 2))
                .force("collide", d3.forceCollide(force_collide_factor)) //15
                .stop();
        
            for (var i = 0; i < 120; ++i) simulation.tick();

            var svg = d3.select(idname)
                        .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                        .append('g')
                            .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

            ////////* Background histogram *///////
            var x = d3.scaleLinear()
              .domain(d3.extent(data, function(d) {return d.similarity_score} ))
              .range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);
            // set the parameters for the histogram
            var histogram = d3.histogram()
                .value(function(d) { return d.similarity_score; })
                .domain(x.domain())
                //.thresholds([0.4,0.5,0.6,0.7,0.725,0.75,0.775,0.8,0.825,0.85,0.875,0.9]);
                .thresholds([0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9]);
     
            // group the data for the bars
            var bins = histogram(data);
            // Scale the range of the data in the y domain
            y.domain([0, d3.max(bins, function(d) { return d.length; })]);

            svg.selectAll("rect")
                  .data(bins)
                .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", 1)
                  .attr("transform", function(d) {
                        return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                  .attr("width", function(d) {
                        return x(d.x1) - x(d.x0) -1;
                   })
                  .attr("height", function(d) {
                    return height - y(d.length);
                    })
                  .style("fill", "white")
                  .attr("opacity", 0.20);
            ///////////////////////////////////////

            var circles = svg.selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                                .attr("class", "dot")
                                .attr("cx", function(d) { return d.x; })
                                .attr("cy", function(d) { return 0; })
                                .attr("r", function(d) { return 0; })
                                .style("fill", function(d) { return colorScale(d.similarity_score); }) //#87ceeb
                                .attr("opacity", 1)
                                .on("mouseover", function(d){
                                  d3.select(this).style('stroke', 'white').style("stroke-width", 1).style("stroke-opacity", 1.0);
                                  return tooltip.html(`<div><span class="song_name tooltip_song_name">`+toTitleCase(d.song_name)+`</span></br><span class="artist_name"><b>`+toTitleCase(d.artist)+`</b></span>`+
                                            `</br>Similarity score: <b>`+d.similarity_score+`</b></div>`)
                                        .style("visibility", "visible");
                                })
                                .on("mousemove", function(){
                                  if (event.pageX >= window.innerwidth*0.75/2) {
                                    return tooltip.style("top", (event.pageY-10)+"px").style("right",(width-event.pageX-100)+"px");
                                  } else {
                                      return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                                  }
                                })
                                .on("mouseout", function(){
                                  d3.select(this).style('stroke', 'white').style("stroke-opacity", 0);
                                  return tooltip.style("visibility", "hidden");
                                })
                                .transition()
                                    .ease(d3.easeBounce)
                                    .duration(2000)
                                    .attr("cx", function(d) { return d.x; })
                                    .attr("cy", function(d) { return d.y; })
                                    .attr("r", function(d) { return "0.25rem"; }) //10
                                    .style("fill", function(d) { return colorScale(d.similarity_score); });

            var text = svg.selectAll(".text")
                        .data(data.filter(function(d,i) {
                            //return d.similarity_score < 0.5;
                            return ["Stupid Love", "Dangerously", "Shape Of You", "Bad Romance", "Love Me Do", "Trouble"].includes(toTitleCase(d.song_name));
                        }))
                        .enter()
                        .append("text")
                        .attr("class", "text")
                        .attr("x", function(d) { return d.x-30; })
                        .attr("y", function(d) { return d.y-5; })
                        .style("font-size", "0.75rem")
                        .attr("opacity", 1)
                        .text(function(d,i) { return "";} )
                            .transition()
                                .delay(1500)
                                .attr("x", function(d) { return d.x-10; })
                                .attr("y", function(d) { return d.y-5; })
                                .text(function(d,i) { 
                                    return toTitleCase(d.song_name); 
                                })
                                .style("fill", "white");


            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis
                    .tickSize(4)
                    .tickFormat( (d,i) => {
                        if (Math.round(d*100)%10 === 0) return d;
                    })
                    .tickPadding(6))
                .style("stroke", "white")
                .style("fill", "white")
                .style("font-size", "0.75rem")
                .style("shape-rendering", "crispEdges")
              .append("text")
                .attr("class", "label_histogram")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("Similarity score")
                .attr("fill", "white")
                .attr("stroke", "none")
                .style("font-size", "0.75rem")
                .style("shape-rendering", "crispEdges");

        })
    }

//})

function plot_score_legend(idname, width, height, shapeWidth, colorScale) {
    var svg = d3.select(idname).append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
         .attr("class", "legendLinear")
         .attr("transform", "translate(0,0)");

        var legendLinear = d3.legendColor()
          .shapeWidth(shapeWidth)
          .cells(8)
          .orient('horizontal')
          .scale(colorScale);

        svg.select(".legendLinear")
          .call(legendLinear)
          .style("font-size", "0.6rem")
          .style("fill", "none");
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
