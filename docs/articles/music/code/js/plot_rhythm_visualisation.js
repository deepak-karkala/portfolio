function plot_rhythm_visualisation_initial() {
    idname = "#plot_song_artist_rhythm_visualisation";
    d3.select(idname).select("svg").remove();
    var bb = d3.select(idname).node().offsetWidth;
    
    width_scale_factor = 0.4;
    height_scale_factor = 0.4;

    var minDeviceWidth = 375;
    var maxDeviceWidth = 1024;
    var width_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.60, 0.20]);
    width_scale_factor = width_scale_factor_width(bb);
    var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.60, 0.20]);
    height_scale_factor = height_scale_factor_width(bb);


    var margin = {right:10, left:10, top:10, bottom:10};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    //csv_processed_file = "data/rhythm_viz/viz_csv/Shape_of_you.csv";
    csv_processed_file = "data/rhythm_viz/viz_csv/bruno_mars__Count_on_me.csv";
    plot_rhythm_visualisation(idname, csv_processed_file, base_width, base_height);
    
    artist = "Bruno Mars";
    song = "Count on me";
    document.getElementById("plot_song_artist_rhythm_visualisation_subtitle").innerHTML = `<span>`+artist+` - `+song+`</span>`;

}
plot_rhythm_visualisation_initial();


function plot_rhythm_visualisation(idname, csv_processed_file, width, height) {
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
        var c_tones = [36, 48]; //, 60]; //, 72,];
        
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
                if (window.innerWidth >= 768) {
                    return "0.15rem";
                } else {
                    return "0.10rem";
                }
            }) //return d.pitch/50 })
            //.attr('cx',function (d) { return xScale(d.start_secs) })
            //.attr('cy',function (d) { return yScale(d.pitch) })
            //.attr('r','4')
            .attr('stroke','white')
            .attr('stroke-width',0.25)
            .attr('fill',function (d,i) { return colorScale[d.note]; })
            .style("opacity", 0)
            .transition()
                .duration(1000)
                .delay(function(d,i){ return i*10; })
                .style("opacity", 1);

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

var song_list = '';
var all_songs_artist_data;

function set_song_viz_combobox() {
    /*
    song_info_file = "data/song_similarity/song_similarity_score.csv";
    d3.csv(song_info_file, function (data) {
        var song_info_arr = [];
        data.forEach(function(d,i){
            song_info = {};
            song_info["id"] = +d.id;
            song_info["song_name"] = toTitleCase(d.song_name);
            song_info["artist"] = toTitleCase(d.artist);
            song_info["decade"] = +d.decade;
            song_info["year"] = +d.year;
            song_info["similarity_score"] = +d.similarity_score;
            song_info_arr.push(song_info);
        })
        // Append songs to dropdown menu
        for (var i=0; i<song_info_arr.length; i++) {
            song_list += `<option value="`+song_info_arr[i]["id"]+`">`+song_info_arr[i]["artist"]+`-`+ song_info_arr[i]["song_name"]+`</option>`;
        }
    });
    console.log(song_list);
    */

    artist_info_file = "data/all_songs_artist_list.csv";
    d3.csv(artist_info_file, function(data) {
        var song_list = ''; //<option value="">Search for a song...</option>';
        data.forEach(function(d,i) {
            d["id"] = +d.id;
            d["artist_song"] = d.artist_song;
            d["artist_song_folder"] = d.artist_song_folder;
            song_list += `<option value="`+d["artist_song_folder"]+`">`+d["artist_song"]+`</option>`;
        })
        $('#viz_combobox').append(song_list);

        all_songs_artist_data = data;
    })

}
set_song_viz_combobox();

$("#viz_combobox").change(function() {
    //alert(this.value);
    artist_song_folder = this.value;
    artist_folder = artist_song_folder.split("__")[0];
    song_folder = artist_song_folder.split("__")[1];

    idname = "#plot_song_artist_rhythm_visualisation";
    d3.select(idname).select("svg").remove();
    var el = document.getElementById("plot_song_artist_rhythm_visualisation");
    el.innerHTML = ``;

    if (song_folder=="All_songs") {
        artist = toTitleCase(artist_folder.split("_").join(" "));
        var el = document.getElementById("plot_song_artist_rhythm_visualisation");

        //el.innerHTML = `<img src="data/rhythm_viz/viz/`+artist_song_folder+`.jpg">`;
        artist_data = all_songs_artist_data.filter(function(d,i){
            return ((d.artist==artist) && (d.song!="All songs"));
        });
        //console.log(artist_data);

        el.innerHTML = ``;
        for (var i=0; i<artist_data.length; i++) {
            artist_song_folder = artist_data[i].artist_song_folder;
            song_name = toTitleCase(artist_data[i].song);

            el.innerHTML += `<div class="col-lg-3 col-4 artist_all_songs_viz" id="artist_song_`+i+`"><span class="rhythm_viz_song_title">`+song_name+`</span></div>`;
            idname = "#artist_song_"+i;

            var bb = d3.select(idname).node().offsetWidth;
            width_scale_factor = 0.8;
            height_scale_factor = 0.8;
            var margin = {right:10, left:10, top:10, bottom:10};
            base_width = bb*width_scale_factor - margin.left - margin.right;
            base_height = bb*height_scale_factor - margin.top - margin.bottom;
            csv_processed_file = "data/rhythm_viz/viz_csv/"+artist_song_folder+".csv";
            plot_rhythm_visualisation_types(idname, csv_processed_file, base_width, base_height);
        }

        document.getElementById("plot_song_artist_rhythm_visualisation_subtitle").innerHTML = `<span>`+artist+` - All Songs</span>`;
    } else {
        var bb = d3.select(idname).node().offsetWidth;
        width_scale_factor = 0.4;
        height_scale_factor = 0.4;
        var margin = {right:10, left:10, top:10, bottom:10};
        base_width = bb*width_scale_factor - margin.left - margin.right;
        base_height = bb*height_scale_factor - margin.top - margin.bottom;
        csv_processed_file = "data/rhythm_viz/viz_csv/"+artist_song_folder+".csv";
        plot_rhythm_visualisation(idname, csv_processed_file, base_width, base_height);

        artist = toTitleCase(artist_folder.split("_").join(" "));
        song = toTitleCase(song_folder.split("_").join(" "));

        document.getElementById("plot_song_artist_rhythm_visualisation_subtitle").innerHTML = `<span>`+artist+` - `+song+`</span>`;

    }


});

