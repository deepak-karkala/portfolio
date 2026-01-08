set_artist_discography_combobox();

function set_artist_discography_combobox() {
    /*
	song_info_file = "data/song_similarity/song_similarity_score.csv";
	d3.csv(song_info_file, function (data) {
		var artist_list = []
		data.forEach(function(d,i){
			if (!artist_list.includes(toTitleCase(d.artist))) {
				artist_list.push(toTitleCase(d.artist));
			}
		})
		artist_list.sort();
		// Append songs to dropdown menu
		var song_list = '';
		for (var i=0; i<artist_list.length; i++) {
			song_list += `<option value="`+artist_list[i]+`">`+artist_list[i]+`</option>`;
		}
		$('#artist_combobox').append(song_list);
	});
    */
    artist_info_file = "data/all_songs_artist_list.csv";
    d3.csv(artist_info_file, function(data) {
        //var song_list = ''; //<option value="">Search for a song...</option>';
        var artist_list = []
        data.forEach(function(d,i) {
            //d["id"] = +d.id;
            //d["artist_song"] = d.artist_song;
            //d["artist_song_folder"] = d.artist_song_folder;
            //d["artist"] = toTitleCase(d.artist);
            if (!artist_list.includes(d.artist)) {
                artist_list.push(d.artist);
            }
        })
        artist_list.sort();
        var option_list = '';
        for (var i=0; i<artist_list.length; i++) {
            option_list += `<option value="`+artist_list[i]+`">`+artist_list[i]+`</option>`;
        }
        $('#artist_combobox').append(option_list);
    })
    //plot_artist_discography(toTitleCase("Lady Gaga"));
}


$("#artist_combobox").change(function() {
    var artist = this.value;
	//plot_artist_discography(artist);
    var is_score = document.getElementById("artist_viz_score_toggle").checked;
    if (is_score==true) {
        var viz_plot = document.getElementById("plot_artist_discography");
        //viz_plot.innerHTML = `<img src="data/rhythm_viz/viz/`+artist.replace(/\s+/g,'_').toLowerCase()+`__All_songs.jpg">`;
        var viz_legend = document.getElementById("artist_discography_legend");
        viz_legend.innerHTML = "";


        artist_data = all_songs_artist_data.filter(function(d,i){
            return ((d.artist==artist) && (d.song!="All songs"));
        });
        //console.log(artist_data);

        viz_plot.innerHTML = ``;
        for (var i=0; i<artist_data.length; i++) {
            artist_song_folder = artist_data[i].artist_song_folder;
            song_name = toTitleCase(artist_data[i].song);

            viz_plot.innerHTML += `<div class="col-lg-3 col-4 artist_all_songs_viz" id="artist_discography_song_`+i+`"><span class="rhythm_viz_song_title">`+song_name+`</span></div>`;
            idname = "#artist_discography_song_"+i;

            var bb = d3.select(idname).node().offsetWidth;
            width_scale_factor = 0.8;
            height_scale_factor = 0.8;
            var margin = {right:10, left:10, top:10, bottom:10};
            base_width = bb*width_scale_factor - margin.left - margin.right;
            base_height = bb*height_scale_factor - margin.top - margin.bottom;
            if (artist_song_folder=="lady_gaga__I'll_never_love_again") {
                artist_song_folder = "lady_gaga__I_will_never_love_again";
            }
            csv_processed_file = "data/rhythm_viz/viz_csv/"+artist_song_folder+".csv";
            plot_rhythm_visualisation_types(idname, csv_processed_file, base_width, base_height);
        }


    } else {
        plot_artist_discography(toTitleCase(artist));
    }
    
    document.getElementById("plot_artist_discography_artist_name").innerHTML = `<span>`+toTitleCase(artist)+`</span>`;
});


function plot_artist_discography(artist) {
	idname = "#plot_artist_discography";
	/*
    d3.select(idname).select("svg").remove();
    var bb = d3.select(idname).node().offsetWidth;
    //height_scale_factor = 0.80;
    var width_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([1.0, 0.70]);
    width_scale_factor = width_scale_factor_width(bb);
    var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.70, 0.30]);
    height_scale_factor = height_scale_factor_width(bb);
    var margin = {right:80, left:40, top:20, bottom:40};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    file = "data/song_similarity/song_similarity_score.csv";

    var force_collide_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 15]);
    force_collide_factor = force_collide_factor_width(bb);
    plot_artist_song_similarity_score(idname, artist, file, base_width, base_height, margin, colorScale, force_collide_factor);
	*/
    d3.select(idname)
    	.selectAll(".dot")
    	.transition()
    		//.ease(d3.easeElastic)
    		.duration(1000)
    		.attr("opacity", function(d) {
                console.log(toTitleCase(d.artist));
                console.log(artist);
				if (toTitleCase(d.artist) == artist) {
                //if ((d.artist) == artist) {
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
                if (toTitleCase(d.artist) == artist) {
                //if ((d.artist) == artist) {
                    return 1;
                } else {
                    return 0;
                }
            });
    document.getElementById("plot_artist_discography_artist_name").innerHTML = `<span>`+toTitleCase(artist)+`</span>`;
}


plot_artist_discography_initial("Lady Gaga");
plot_artist_score_legend_top();

function plot_artist_discography_initial(artist) {
    idname = "#plot_artist_discography";
    d3.select(idname).select("svg").remove();
    var viz_plot = document.getElementById("plot_artist_discography");
    viz_plot.innerHTML = ``;
    var bb = d3.select(idname).node().offsetWidth;
    //height_scale_factor = 0.80;
    var width_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([1.0, 0.70]);
    width_scale_factor = width_scale_factor_width(bb);
    var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.80, 0.35]);
    height_scale_factor = height_scale_factor_width(bb);
    var margin = {right:110, left:40, top:20, bottom:60};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    file = "data/song_similarity_score.csv";

    var force_collide_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([7, 7]);
    force_collide_factor = force_collide_factor_width(bb);
    //var artist = "Beyonce";
    plot_artist_song_similarity_score(idname, artist, file, base_width, base_height, margin, colorScale, force_collide_factor);
    //document.getElementById("artist_combobox").value = artist;
    document.getElementById("plot_artist_discography_artist_name").innerHTML = `<span>`+toTitleCase(artist)+`</span>`;
}


function plot_artist_score_legend_top() {
    idname = "#artist_songs_similarity_scores_legend";
    var bb = d3.select(idname).node().offsetWidth;
    var width_scale_factor = 1.0;
    var margin = {top: 30, right: 10, bottom: 10, left: 10};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.35, 0.15]);
    var height_scale_factor = height_scale_factor_width(bb);
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    var shape_width_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 5]);
    shape_width = shape_width_factor(bb);
    plot_artist_score_legend(idname, base_width, base_height, shape_width, colorScale);
}

function plot_artist_score_legend(idname, width, height, shapeWidth, colorScale) {
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


function plot_artist_song_similarity_score(idname, artist, file, width, height, margin, colorScale, force_collide_factor) {
    var tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip_artist_discography")
                      .style("position", "absolute")
                      .style("z-index", "10")
                      .style("visibility", "hidden");

    d3.csv(file, function (data) {
        data.forEach(function(d) {
	        d.similarity_score = +d.similarity_score;
        })
        var xScale = d3.scaleLinear().domain(d3.extent(data, function(d) {return d.similarity_score} )).range([0, width]);
        var xAxis = d3.axisBottom(xScale);

        var x = d3.scaleLinear()
          .domain(d3.extent(data, function(d) {return d.similarity_score} ))
          .range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

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
		      .attr("height", function(d) { return height - y(d.length); })
		      .style("fill", "white")
		      .attr("opacity", 0.20);

        
        var circles = svg.selectAll("circle")
                        .data(data) //.filter(function(d) {return toTitleCase(d.artist) == artist; } ))
                        .enter()
                        .append("circle")
                            .attr("class", "dot")
                            .attr("cx", function(d) { return d.x; })
                            .attr("cy", function(d) { return 0; })
                            .attr("r", function(d) { return 0; })
                            .style("fill", function(d) { return colorScale(d.similarity_score); }) //#87ceeb
                            .attr("opacity", function(d) {
                            	if (toTitleCase(d.artist) == artist) {
                            		return 1;
                            	} else {
                            		return 0;
                            	}
                            })
                            .on("mouseover", function(d){
                              d3.select(this).style('stroke', 'white').style("stroke-width", 1).style("stroke-opacity", 1.0);
                              return tooltip.html(`<div><span class="song_name tooltip_song_name">`+toTitleCase(d.song_name)+`</span></br><span class="artist_name"><b>`+toTitleCase(d.artist)+`</b></span>`+
                                        `</br>Similarity score: <b>`+d.similarity_score+`</b></div>`)
                                    .style("visibility", "visible");
                            })
                            .on("mousemove", function(){
                              if (event.pageX >= window.innerWidth/2) {
                                return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-200)+"px");
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
                    .data(data) //.filter(function(d,i) { return toTitleCase(d.artist) == artist;} ))
                    .enter()
                    .append("text")
                    .attr("class", "text")
                    .attr("x", function(d) { return d.x; })
                    .attr("y", function(d) { return d.y-5; })
                    .style("font-size", function(d,i) {
                        return "0.6rem";
                    })
                    .attr("opacity", function(d) {
                    	if (toTitleCase(d.artist) == artist) {
                    		return 1;
                    	} else {
                    		return 0;
                    	}
                    })
                    .text(function(d,i) { return "";} )
                        .transition()
                            .delay(1500)
                            .text(function(d,i) { 
                                return capitalizeFirstLetter(d.song_name); 
                            })
                            .style("stroke", "black")
                            .style("stroke-width", "0.01rem")
                            .style("fill", "white")
                            .style("font-weight", "bold");


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
            .attr("x", width+40)
            .attr("y", 35)
            .style("text-anchor", "end")
            .text("Similarity score")
            .attr("fill", "white")
            .attr("stroke", "none")
            .style("font-size", "0.75rem")
            .style("shape-rendering", "crispEdges");

    })
}

function artist_viz_score_button_click(id) {
    var is_score = document.getElementById("artist_viz_score_toggle").checked;
    var artist = document.getElementById("artist_combobox").value;
    if (is_score==true) {
        var viz_plot = document.getElementById("plot_artist_discography");
        //viz_plot.innerHTML = `<img src="data/rhythm_viz/viz/`+artist.replace(/\s+/g,'_').toLowerCase()+`__All_songs.jpg">`;
        var viz_legend = document.getElementById("artist_discography_legend");
        viz_legend.innerHTML = "";


        artist_data = all_songs_artist_data.filter(function(d,i){
            return ((d.artist==artist) && (d.song!="All songs"));
        });
        //console.log(artist_data);

        
        viz_plot.innerHTML = ``;
        for (var i=0; i<artist_data.length; i++) {
            artist_song_folder = artist_data[i].artist_song_folder;
            song_name = toTitleCase(artist_data[i].song);

            viz_plot.innerHTML += `<div class="col-lg-3 col-4" id="artist_discography_song_`+i+`"><span class="rhythm_viz_song_title">`+song_name+`</span></div>`;
            idname = "#artist_discography_song_"+i;

            var bb = d3.select(idname).node().offsetWidth;
            width_scale_factor = 0.8;
            height_scale_factor = 0.8;
            var margin = {right:10, left:10, top:10, bottom:10};
            base_width = bb*width_scale_factor - margin.left - margin.right;
            base_height = bb*height_scale_factor - margin.top - margin.bottom;
            if (artist_song_folder=="lady_gaga__I'll_never_love_again") {
                artist_song_folder = "lady_gaga__I_will_never_love_again";
            }
            csv_processed_file = "data/rhythm_viz/viz_csv/"+artist_song_folder+".csv";
            plot_rhythm_visualisation_types(idname, csv_processed_file, base_width, base_height);
        }
        

    } else {
        plot_artist_discography_initial(toTitleCase(artist));
    }
}
