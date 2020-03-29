function transition(svg, start, end, width, height) {
  var center = [width / 2, height / 2],
      i = d3.interpolateZoom(start, end);

      console.log(start);
      console.log(end);

  svg
      .attr("transform", transform(start))
    .transition()
      .delay(250)
      .duration(i.duration * 2)
      .attrTween("transform", function() { return function(t) { return transform(i(t)); }; });
      //.each("end", function() { d3.select(this).call(transition, end, start); });

  function transform(p) {
    var k = height / p[2];
    return "translate(" + (center[0] - p[0] * k) + "," + (center[1] - p[1] * k) + ")scale(" + k + ")";
  }
}

function plot_country_water_scarcity(idname, file, width, height) {
    /*
    // The svg
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    */
    var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    var height_offset_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([2, 2]);

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoNaturalEarth()
        .scale(width / 2 / Math.PI)
        .translate([width / 3, height / height_offset_factor(width)])
    var path = d3.geoPath()
        .projection(projection);

    // Data and color scale
    var data = d3.map();
    var colorScheme = d3.schemeReds[5];
    //colorScheme.unshift("#eee")
    var colorScale = d3.scaleThreshold()
        .domain([1, 2, 3, 4, 5])
        .range(colorScheme);

    console.log(height);

    // Legend
    var g = svg.append("g")
        .attr("class", "legendThreshold")
        .attr("transform", "translate(20,"+20+")");
    g.append("text")
        .attr("class", "caption")
        .attr("x", 0)
        .attr("y", -6)
        .text("Water scarcity rank");
    var labels = ['Low', 'Low-medium', 'Medium-high', 'High', 'Extremely High'];
    var legend = d3.legendColor()
        .labels(function (d) { return labels[d.i]; })
        //.orient("horizontal")
        //.shapeWidth(100)
        //.shapePadding(40)
        //.shapeHeight(5)
        .scale(colorScale);
    svg.select(".legendThreshold")
        .call(legend);
        //.attr("x", 0)
        //.attr("y", 300);

    // Load external data and boot
    d3.queue()
        .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
        .defer(d3.csv, file, function(d) { data.set(d.code, +d.score); })
        .await(ready);

    function ready(error, topo) {
        if (error) throw error;

        // Draw the map
        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(topo.features)
            .enter().append("path")
                .attr("fill", function (d){
                    // Pull data for this country
                    d.total = data.get(d.id) || 0;
                    // Set the color
                    return colorScale(d.total);
                })
                .attr("d", path);
    }
}