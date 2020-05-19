
//(function(){

var outbreak_free_timeouts = [];
var outbreak_free_g;

function draw_scroll_outbreak_free_districts(idname, filename, width, height, margin) {

	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

	var scale0 = (width - 1) / 2 / Math.PI;
	var month_list = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_outbreak_free_districts_scroll")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

	// parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    /* Projection */
    /*
    var projection = d3.geoNaturalEarth2() //d3.geoNaturalEarth2() //d3.geoTimes() d3.geoWagner4() geoEquirectangular()
        .scale(width / 1.5 / Math.PI)
        .translate([width / 2.5, height / 1.5])

    var projection = d3.geoAlbers()
	    .center([23.5937, 80.9629])
	    //.rotate([4.4, 0])
	    //.parallels([50, 60])
	    .scale(6000)
	    .translate([width / 2, height / 2]);
	*/
	//var projection = d3.geoMercator();

    var path = d3.geoPath()
        .projection(projection)
        .pointRadius(5);


    /* Zoom */
	var zoom = d3.zoom()
	    .scaleExtent([1, 8])    //.scaleExtent([scale0, 8 * scale0])
	    .on("zoom", zoomed);

	/* SVG */
	svg_map = d3.select(idname).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              //.style("left", "50rem")
              .append("g")
              	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
              //.call(zoom);
    outbreak_free_g = svg_map.append("g");
    var g2 = svg_map.append("g");


    // Load external data and boot
    //if scroll_data
    d3.queue()
        .defer(d3.json, "data/india_topojson.json")
        .defer(d3.json, "data/district_data_map/karnataka.json")
        //.defer(d3.csv, filename) //, data_ready)
        .await(ready);

    function ready(error, india, state) {
        if (error) throw error;

        /*
        data = scroll_data;
		*/
        //data = data.filter(function(d,i){
		//	return i%100==0;
		//})

        // Zoom to India
        var o = topojson.mesh(india, india.objects.india, function(a, b) { return a === b; });
      	projection
	          .scale(1)
	          .translate([0, 0]);
		var b = path.bounds(o),
			  s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
			  t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        projection = projection.scale(s).translate(t);

        path = d3.geoPath()
	        .projection(projection)
	        .pointRadius(2);

        start_date = new Date(2020, 2, 15); //Start from March
        var step_delay = 5000;
        //end_date = new Date(2020, 4, 7); //Start from March
		//end_date = new Date(data[data.length-1].date);
		//num_sim_days = Math.ceil(Math.abs(end_date - start_date) / (1000 * 60 * 60 * 24)) - 1;
		//num_milliseconds_per_date = 500;
		//total_sim_duration = num_sim_days * num_milliseconds_per_date;


        outbreak_free_g.attr("class", "india")
			.selectAll("india_path")
	      .data(topojson.feature(india, india.objects.india).features)
          .enter().append("path")
          	.attr("class", "country_focus")
			.attr("d", path)
			.style("fill", "#fff")
			.style("stroke", "#c0c0c0")
			.style("opacity", 1);


        state_name_list = ['odisha', 'telangana', 'meghalaya', 'karnataka', 'haryana', 'bihar', 'andhrapradesh',
                      'jammukashmir','westbengal','kerala', 'chhattisgarh', 'andamannicobarislands',
                      'jharkhand','ladakh','uttarpradesh','mizoram','lakshadweep','nagaland','tamilnadu',
                      'dadranagarhaveli','delhi','puducherry','madhyapradesh','arunachalpradesh','uttarakhand',
                      'manipur','tripura','gujarat','goa','assam','maharashtra','punjab','sikkim','rajasthan',
                      'chandigarh','himachalpradesh'];

        //state_name_list = ["karnataka"];
        // Load state topodata and add as layers
        for (var i=0; i<state_name_list.length; i++) {
            state_name = state_name_list[i]
            
            $.getJSON('data/district_data_map/'+state_name+'.json', function(data){
                st_nm_key = Object.keys(data.objects)[0];
                outbreak_free_state_counter += 1;

                outbreak_free_g.selectAll("state_zero_case")
                  .data(topojson.feature(data, data.objects[st_nm_key]).features)
                  .enter().append("path")
                    .attr("class", function(d){
                        num_cases = +d.properties.cases;
                        if (num_cases==0) {
                            return "state_nonzero_case";
                        } else {
                            return "state_zero_case";
                        }
                    })
                    .attr("d", path)
                    .style("fill", "#fff")
                    .style("stroke", "#dadada")
                    .style("stroke-width", "0.5px")
                    .style("opacity", 1);

                if (outbreak_free_state_counter == state_name_list.length) {
                    update_outbreak_free_date();
                }
            })
            
        }

        function update_outbreak_free_date() {
            outbreak_free_state_counter = 0;
            d3.select(idname).selectAll(".state_zero_case")
                .transition()
                    .delay(function(d,i){
                        cdt = parseTime(d.properties.first_case_date);
                        diff_time = Math.abs(cdt - start_date);
                        num_days = Math.log10(Math.ceil(diff_time / (1000 * 60 * 60 * 24)));
                        return num_days*step_delay;
                        //return 100;
                    })
                    .duration(1000)
                        .style("fill",  "#ff4c4c");
        }

        //for (let i=1; i<=num_sim_days; i++) {
            //outbreak_free_timeouts.push(setTimeout( update_outbreak_free_date, i*num_milliseconds_per_date ));
        //}

    }

    // Zoom functionality
    function zoomed() {
        outbreak_free_g.style("stroke-width", 1 / d3.event.transform.k + "px");
        outbreak_free_g.selectAll('path') // To prevent stroke width from scaling
            .attr('transform', d3.event.transform);
        outbreak_free_g.selectAll(".country_focus").style("stroke-width", d3.event.transform.k/10 + "px").style("stroke", "#000");
    }

}

//})();
