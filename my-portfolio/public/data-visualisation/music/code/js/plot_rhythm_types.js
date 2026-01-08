function plot_rhythm_types() {
    
    idname = "#rhythm_type_song1";
    d3.select(idname).select("svg").remove();
    var bb = d3.select(idname).node().offsetWidth;
    width_scale_factor = 0.6;
    height_scale_factor = 0.6;
    var margin = {right:10, left:10, top:10, bottom:10};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;

    idname = "#rhythm_type_song1";
    csv_processed_file = "data/rhythm_viz/viz_csv/coldplay__Viva_la_vida.csv";
    plot_rhythm_visualisation_types(idname, csv_processed_file, base_width, base_height);

    idname = "#rhythm_type_song2";
    csv_processed_file = "data/rhythm_viz/viz_csv/david_guetta__Love_is_gone.csv";
    plot_rhythm_visualisation_types(idname, csv_processed_file, base_width, base_height);

    idname = "#rhythm_type_song3";
    csv_processed_file = "data/rhythm_viz/viz_csv/katy_perry__I_kissed_a_girl.csv";
    plot_rhythm_visualisation_types(idname, csv_processed_file, base_width, base_height);

    idname = "#rhythm_type_song4";
    csv_processed_file = "data/rhythm_viz/viz_csv/ariana_grande__Focus.csv";
    plot_rhythm_visualisation_types(idname, csv_processed_file, base_width, base_height);

    idname = "#rhythm_type_song5";
    csv_processed_file = "data/rhythm_viz/viz_csv/ed_sheeran__Shape_of_you.csv";
    plot_rhythm_visualisation_types(idname, csv_processed_file, base_width, base_height);

    idname = "#rhythm_type_song6";
    csv_processed_file = "data/rhythm_viz/viz_csv/eminem__Love_the_way_you_lie_part_1.csv";
    plot_rhythm_visualisation_types(idname, csv_processed_file, base_width, base_height);

    idname = "#rhythm_type_song7";
    csv_processed_file = "data/rhythm_viz/viz_csv/calvin_harris__Outside.csv";
    //csv_processed_file = "data/rhythm_viz/viz_csv/shawn_mendes__Perfectly_wrong.csv";
    plot_rhythm_visualisation_types(idname, csv_processed_file, base_width, base_height);

    idname = "#rhythm_type_song8";
    csv_processed_file = "data/rhythm_viz/viz_csv/rihanna__Work.csv";
    plot_rhythm_visualisation_types(idname, csv_processed_file, base_width, base_height);    

}
//plot_rhythm_types();


function plot_rhythm_visualisation_types(idname, csv_processed_file, width, height) {
    d3.select(idname).select("svg").remove();

    d3.csv(csv_processed_file, function (data) {

        // Scales
        //var colorScale = ["#0000ff", "#ff0000", "#ffe119"]; //d3.scale.category20()
        var colorScale = ["#0000ff", "#ff0000", "#f3cd05"]; //d3.scale.category20()
        //var colorScale = ["#0444bf", "#ff0000", "#f3cd05"]; //Blue alternative: 0444bf
        //var colorScale = ["#4363d8", "#e6194B", "#ffe119"]; //d3.scale.category20()
        //var pitchScale = d3.scaleLinear().domain([10, 110]).range([0, 1]);
        var pitchScale = d3.scaleLinear().domain([30, 80]).range([0, 1]);
        var radiusScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
        var margin = {right:10, left:10, top:10, bottom:10};
        var c_tones = [36, 48, 60, 72,];
        
        data.forEach(function(d) {
            d.pitch = +d.pitch;
            d.theta = +d.theta;
            d.cx = pitchScale(d.pitch) * Math.sin(d.theta);
            d.cy = pitchScale(d.pitch) * Math.cos(d.theta);
            //d.cx = +d.cx;
            //d.cy = +d.cy;
            d.note = +d.note;
            d.note_duration_secs = +d.note_duration_secs;
            d.note_start_secs = +d.note_start_secs;
        });

        var xScale = d3.scaleLinear()
          .domain([
            d3.min(data,function (d) { return d.cx; }),
            d3.max(data,function (d) { return d.cx; })
            ])
          .range([0, width]);
        var yScale = d3.scaleLinear()
          .domain([
            d3.min(data,function (d) { return d.cy; }),
            d3.max(data,function (d) { return d.cy; })
            ])
          .range([height, 0]);
        // SVG
        var svg = d3.select(idname).append('svg')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right)
          .append('g')
            .attr('transform','translate(' + margin.left + ',' + margin.top + ')');
            //.attr('transform','translate(' + 100 + ',' + 100 + ')')
            
        // Circles
        var circles = svg.selectAll('circle')
            .data(data)
            .enter()
          .append('circle')
            .attr('class', 'dot')
            .attr('class', 'notes')
            .attr('cx',function (d) { return xScale(d.cx); })
            .attr('cy',function (d) { return yScale(d.cy); })
            .attr('r', function (d) {
                return "0.1rem";
            }) //return d.pitch/50 })
            //.attr('cx',function (d) { return xScale(d.start_secs) })
            //.attr('cy',function (d) { return yScale(d.pitch) })
            //.attr('r','4')
            .attr('stroke','white')
            .attr('stroke-width',0.25)
            .attr('fill',function (d,i) { return colorScale[d.note]; })
            .style("opacity", 1);
            /*
            .transition()
                .duration(1000)
                .delay(function(d,i){ return i*1; })
                .style("opacity", 1);
            */

        for(var i=0; i<c_tones.length; i++) {
            var c_circles = svg.append('circle')
                    .attr('class', 'dot')
                    .attr('class', 'c_tones')
                    .attr('cx', xScale(radiusScale(0)))
                    .attr('cy', yScale(radiusScale(0)))
                    .attr('r', function(d) { return radiusScale(pitchScale(c_tones[i])); })
                    .attr('fill', 'none')
                    .attr('stroke', 'white')
                    .style("opacity", 0.5);
        }

/*
        d3.select(idname)
            .selectAll(".dot")
            .transition()
                .duration(2000)
                .delay(function(d,i) { return i*10; })
                .style("opacity", 1);
*/
    });
}