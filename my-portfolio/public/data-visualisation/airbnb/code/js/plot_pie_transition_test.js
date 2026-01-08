    var tau = 2 * Math.PI; // http://tauday.com/tau-manifesto

    // An arc function with all values bound except the endAngle. So, to compute an
    // SVG path string for a given angle, we pass an object with an endAngle
    // property to the `arc` function, and it will return the corresponding string.
    var arc = d3.arc()
        .innerRadius(1)
        .outerRadius(50)
        .startAngle(0);

    // Get the SVG container, and apply a transform such that the origin is the
    // center of the canvas. This way, we don’t need to position arcs individually.
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Add the background arc, from 0 to 100% (tau).
    var background = g.append("path")
        .datum({endAngle: tau})
        //.style("fill", "#ddd")
        .style("fill", "white")
        .attr("d", arc);

    console.log(width);
    console.log(height);

    // Add the foreground arc in orange, currently showing 12.7%.
    var foreground = g.append("path")
        .datum({endAngle: 0.127 * tau})
        .style("fill", "orange")
        .attr("d", arc)
        .transition()
            .duration(1250)
            .attrTween("d", arcTween(Math.random() * tau));

    // Every so often, start a transition to a new random angle. The attrTween
    // definition is encapsulated in a separate function (a closure) below.
    /*
    d3.interval(function() {
      foreground.transition()
          .duration(750)
          .attrTween("d", arcTween(Math.random() * tau));
    }, 1500);
    */

    // Returns a tween for a transition’s "d" attribute, transitioning any selected
    // arcs from their current angle to the specified new angle.
    function arcTween(newAngle) {

      return function(d) {
        var interpolate = d3.interpolate(d.endAngle, newAngle);

        return function(t) {
          d.endAngle = interpolate(t);
          return arc(d);
        };
      };
    }