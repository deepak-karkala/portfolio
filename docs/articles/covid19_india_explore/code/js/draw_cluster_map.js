idname = "#cluster_map";
d3.select(idname).select("svg").remove();
filename = "data/cluster_network_map.csv";
width_scale_factor = 0.90;
height_scale_factor = 0.40;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:20, left:40, top:10, bottom:60};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_cluster_map(idname, filename, base_width, base_height);

var daily_cum_cases_count = {};
var daily_cum_deaths_count = {};

function draw_cluster_map(idname, filename, width, height) {

	var scale0 = (width - 1) / 2 / Math.PI;
	var cluster_type_colors = d3.scaleOrdinal().domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
								.range(['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#9A6324',
                            			'#46f0f0', '#f032e6', '#bcf60c', '#a9a9a9', "#dddddd"]);
	var month_list = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var cluster_colors = {'Mysuru Pharmaceutical industry': '#f032e6',
						 'Bengaluru scrap segregation worker': '#800000',
						 'Travel History': '#f58231',
						 'Italian tourists in Rajasthan': '#3cb44b',
						 'Delhi Religious meeting': '#4363d8',
						 'Iran evacuees': '#911eb4',
						 'Family member': '#ff0000',
						 'Close Contact': '#000075',
						 'Thai national in Tamil Nadu': '#008080',
						 'Dubai returnee, hosted feast for 1500 people': '#9a6324',
						 'Contact with UK returnee': '#808000'};


	// parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    /* Projection */
    var projection = d3.geoNaturalEarth2() //d3.geoNaturalEarth2() //d3.geoTimes() d3.geoWagner4() geoEquirectangular()
        .scale(width / 1.5 / Math.PI)
        .translate([width / 2.5, height / 1.5])
    var path = d3.geoPath()
        .projection(projection);

    /* Zoom */
	var zoom = d3.zoom()
	    .scaleExtent([1, 8])    //.scaleExtent([scale0, 8 * scale0])
	    .on("zoom", zoomed);

	/* SVG */
	var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .call(zoom);
    var g = svg.append("g");


    // Load external data and boot
    d3.queue()
        //.defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
        .defer(d3.json, "data/world-110m.geojson")
        //.defer(d3.json, "data/world_without_india.geojson")
        //.defer(d3.json, "data/world_with_india_composite.geojson")
        .defer(d3.json, "data/india_topojson.json")
        .defer(d3.csv, filename, data_ready)
        .await(ready);

    function ready(error, world, india, data) {
        if (error) throw error;

        start_date = new Date(2020, 2, 1); //Start from March
		end_date = new Date(data[data.length-1].date);
		num_sim_days = Math.ceil(Math.abs(end_date - start_date) / (1000 * 60 * 60 * 24)) - 1;
		num_milliseconds_per_date = 500;
		total_sim_duration = num_sim_days * num_milliseconds_per_date;



        // Draw the map
        g.attr("class", "countries")
            .selectAll("path")
            .data(world.features)
          .enter().append("path")
          	.attr("class", function(d) {
          		country_name = d.properties.name;
          		// Zoom to India with transition
          		if (country_name=="India") {
          			var bounds = path.bounds(d),
					dx = bounds[1][0] - bounds[0][0],
					dy = bounds[1][1] - bounds[0][1],
					x = (bounds[0][0] + bounds[1][0]) / 2,
					y = (bounds[0][1] + bounds[1][1]) / 2,
					scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
					translate = [width / 2 - scale * x, height / 2 - scale * y];

					svg.transition()
						.duration(total_sim_duration)
						// .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
						.call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
          			return "test";
          		} else {
          			return "country_background";
          		}
          	})
            .attr("d", path)
            .style("fill", "#eee")
            .style("stroke", "#fff");

        
        g.attr("class", "india")
			.selectAll("india_path")
	      .data(topojson.feature(india, india.objects.india).features)
          .enter().append("path")
          	.attr("class", "country_focus")
			.attr("d", path)
			.style("fill", "#ecf7fc")
			.style("stroke", "#c0c0c0");


        // Form list of network arcs
		var link = []
		data.forEach(function(d, i){
			d.cluster_type = +d.cluster_type;
			d.date = parseTime(d.date);
			daily_cum_cases_count[d.date] = +d["total_cases"];
			//daily_cum_deaths_count.push({d.date: +d.total_deaths});

			if (1) { //(d.cluster_type!=0) {
				source = [+d.cluster_longitude, +d.cluster_latitude]
				target = [+d.patient_longitude, +d.patient_latitude]
				topush = {type: "LineString", coordinates: [source, target], cluster_type: d.cluster_type,
							date: d.date, index: +d.index, cluster: d.cluster}
				link.push(topush)
			}
		})

        //console.log(link);

        // Add the path
		g.selectAll("myPath")
			.data(link)
			.enter()
			.append("path")
				.attr("class", function(d) {
					return "network_arc_"+d.index+" network_arc"
				})
				.attr("d", function(d){
					return path(d);
				})
				.style("fill", "none")
				.style("stroke", function(d) {
					//console.log(d);
					//return cluster_type_colors(d.cluster_type);
					return cluster_colors[d.cluster];
				})
				.style("stroke-width", function(d) {
					if (d.cluster_type==0) {
						return 0.05;
					} else if (d.cluster_type==4){
						return 0.1;
					} else {
						return 0.1;
					}
				})
				.style("opacity", 0);
				

		current_date = start_date;
		function update_date() {
			// Add a day
			current_date.setDate(current_date.getDate() + 1);
			g.selectAll(".cluster_map_date_label").remove();
			g.selectAll(".cluster_map_casecount_label").remove();

			//console.log(daily_cum_cases_count[current_date]);

			g.append("text")
				.attr("class", "cluster_map_date_label")
				.attr("x", width-120)
				.attr("y", 40)
				.text(current_date.getDate() + " " + month_list[current_date.getMonth()])
				.style("font-size", "2rem")
				.style("font-weight", "bold")
				.style("stroke", "none")
				.style("fill", "black");

			g.append("text")
				.attr("class", "cluster_map_casecount_label")
				.attr("x", width-120)
				.attr("y", 60)
				.text(numberWithCommas(daily_cum_cases_count[current_date]) + " cases")
				.style("font-size", "1rem")
				//.style("font-weight", "bold")
				.style("stroke", "none")
				.style("fill", "#404040");


			g.selectAll(".network_arc")
				.transition()
					.duration(1000)
					//.style("stroke-width", 0.05)
					/*
					.style("stroke-width", function(d) {
						if (d.cluster_type==0) {
							return 0.05;
						} else if (d.cluster_type==4){
							return 0.1;
						} else {
							return 0.1;
						}
					})
					*/
					.style("opacity", function(d) {
						if (current_date >= d.date) {
							return 1;
						} else {
							return 0;
						}
					});

		}

		for (let i=1; i<=num_sim_days; i++) {
			setTimeout( update_date, i*num_milliseconds_per_date );
		}


    }




    // When network data is loaded do this
	function data_ready(d) {
		return d;
	}

	// Zoom functionality
	function zoomed() {
		g.style("stroke-width", 1 / d3.event.transform.k + "px");
      	g.selectAll('path') // To prevent stroke width from scaling
        	.attr('transform', d3.event.transform);
		g.selectAll(".country_focus").style("stroke-width", d3.event.transform.k/10 + "px").style("stroke", "#000");
    }

}

