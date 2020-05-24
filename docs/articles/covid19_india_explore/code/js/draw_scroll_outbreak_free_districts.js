
//(function(){

script_load_timeout_list.push(setTimeout(load_outbreakFreeDistricts_script, 15*script_load_timestep));

function load_outbreakFreeDistricts_script() {
    //idname = "#outbreak_spread_map";
    //d3.select(idname).select("cluster_animation_svg").remove();

    var chart_id = document.getElementById("outbreak_free_districts");
    if (window.innerWidth >= 768) {
        chart_id.innerHTML = `<div class="row text-center justify-content-center"><div class="col-lg-10 col-12 cluster_video">`+
                                `<video id="cluster_animation_video" preload="auto" loop="loop"`+
                                `muted="muted" autoplay="true">
                                  <source src="docs/outbreak_free_animation_compressed.mp4" type="video/mp4">
                                  Your browser does not support the video tag.
                                </video></div></div>`;
    } else {
        chart_id.innerHTML = `<div class="row"><div class="col-lg-10 col-12 cluster_video"><video id="cluster_animation_video" preload="auto" loop="loop" muted="muted" autoplay="true">
                                  <source src="docs/outbreak_free_animation_compressed.mp4" type="video/mp4">
                                  Your browser does not support the video tag.
                                </video></div></div>`;
    }
    // Update key takeaway
    var id = document.getElementById("takeaway_container_outbreak_free_districts");
    id.innerHTML = `<span class="takeaway_title">Key takeaways</span>: The `+
        `situation has changed dramatically over last two weeks with the outbreak now spreading to India's vast hinterland.`+
        `This is a particularly worrying trend since failing to contain the outbreak will quickly overwhelm the `+
        `under-equipped healthcare system in rural India, turning this crisis into an outright catastrophe.`;
}

/*
function load_outbreakFreeDistricts_script() {
    title_idname = "outbreak_free_districts_title";
    per_virus_free_districts = 100;
    num_virus_free_districts = 725;
    num_virus_free_people = 1.3e9;
    title_id = document.getElementById(title_idname);
    title_id.innerHTML = `
        <div class="progress" style="height: 20px;">`+
            `<div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuemin="0" aria-valuemax="100">`+
            //`<span class="num_virus_free_districts">`+ num_virus_free_districts +`</span>/725 districts, <span class="num_virus_free_people">` +num_virus_free_people+`</span> people free of virus risk</div>`+
            num_virus_free_districts +` / 725 districts free of virus risk</div>`+
        `</div>`;

    idname = "#outbreak_free_districts";
    d3.select(idname).select("svg").remove();
    filename = ""; //"data/outbreak_free_numdistricts.csv";
    width_scale_factor = 0.90;
    if (window.innerWidth >= 768) {
        height_scale_factor = 0.50;
    } else {
        height_scale_factor = 1.20;
    }
    var bb = d3.select(idname).node().offsetWidth;
    var margin = {right:20, left:20, top:20, bottom:20};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    //base_height = Math.floor(window.innerHeight * 1); 
    var show_virus_states = 1;
    draw_scroll_outbreak_free_districts(idname, filename, base_width, base_height, margin, show_virus_states);

    // Update key takeaway
    var id = document.getElementById("takeaway_container_outbreak_free_districts");
    id.innerHTML = `<span class="takeaway_title">Key takeaways</span>: The `+
        `situation has changed dramatically over last two weeks with the outbreak now spreading to India's vast hinterland.`+
        `This is a particularly worrying trend since failing to contain the outbreak will quickly overwhelm the `+
        `under-equipped healthcare system in rural India, turning this crisis into an outright catastrophe.`;
}



function draw_scroll_outbreak_free_districts(idname, filename, width, height, margin, show_virus_states) {

    var outbreak_free_timeouts = [];
    var outbreak_free_g;
    var outbreak_free_max_transition_time = [];

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

    var projection = d3.geoMercator();

    var path = d3.geoPath()
        .projection(projection)
        .pointRadius(5);


    var zoom = d3.zoom()
        .scaleExtent([1, 8])    //.scaleExtent([scale0, 8 * scale0])
        .on("zoom", zoomed);

    svg_map = d3.select(idname).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              //.style("left", "50rem")
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
              //.call(zoom);
    outbreak_free_g = svg_map.append("g");
    var g2 = svg_map.append("g");
    outbreak_free_state_counter = 0;

    // Load external data and boot
    //if scroll_data
    d3.queue()
        .defer(d3.json, "data/india_topojson.json")
        .defer(d3.csv, "data/outbreak_free_numdistricts.csv")
        //.defer(d3.csv, filename) //, data_ready)
        .await(ready);

    function ready(error, india, data) {
        if (error) throw error;

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
            .style("stroke", "#fff")
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

                svg_map.selectAll("state_zero_case")
                  .data(topojson.feature(data, data.objects[st_nm_key]).features)
                  .enter().append("path")
                    .attr("class", function(d) {
                        num_cases = +d.properties.cases;
                        //return "state_zero_case";
                        
                        if (num_cases==0) {
                            return "state_nonzero_case";
                        } else {
                            return "state_zero_case";
                        }
                        
                    })
                    .attr("d", path)
                    .style("fill", "#fff")
                    .style("stroke", "#fff")
                    .style("stroke-width", "0.5px")
                    .style("opacity", 1);

                if ((show_virus_states==1) && (outbreak_free_state_counter == state_name_list.length)) {
                    update_outbreak_free_date();
                }
            })
            
        }

        function update_outbreak_free_date() {
            d3.select(idname).selectAll(".state_zero_case").style("fill", "#fff");
            for (var j=0; j<outbreak_free_timeouts.length; j++) {
              clearTimeout(outbreak_free_timeouts[j]);
            }
            outbreak_free_timeouts = [];

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

            dates = d3.keys(data[0]);
            var num_dates = dates.length;
            var num_outbreak_free_districts = [];

            for (let i=0; i<=num_dates; i++) {
                diff_time = Math.abs(parseTime(dates[i]) - start_date);
                num_days = Math.log10(Math.ceil(diff_time / (1000 * 60 * 60 * 24)));
                num_outbreak_free_districts[i] = 725 - (+data[0][dates[i]]);

                if (!isNaN(num_outbreak_free_districts[i])) {
                    outbreak_free_timeouts.push(setTimeout( function(){
                        update_outbreak_free_district_count(num_outbreak_free_districts[i], parseTime(dates[i]));
                    }, num_days*step_delay ));
                }
            }

            function update_outbreak_free_district_count(num_outbreak_free_districts, current_date) {
                svg_map.selectAll(".outbreak_free_date_label").remove();
                svg_map.append("text")
                    .attr("class", "outbreak_free_date_label")
                    .attr("x", width-120)
                    .attr("y", 40)
                    .text(current_date.getDate() + " " + month_list[current_date.getMonth()])
                    .style("font-size", "1.5rem")
                    .style("font-weight", "bold")
                    .style("stroke", "none")
                    .style("fill", "black");

                title_idname = "outbreak_free_districts_title";
                title_id = document.getElementById(title_idname);
                per_virus_free_districts = num_outbreak_free_districts/725*100;
                num_virus_free_districts = 725;
                title_id.innerHTML = `
                    <div class="progress" style="height: 20px;">`+
                        `<div class="progress-bar" role="progressbar" style="width: `+per_virus_free_districts+`%;" aria-valuemin="0" aria-valuemax="100">`+
                        //`<span class="num_virus_free_districts">`+ num_virus_free_districts +`</span>/725 districts, <span class="num_virus_free_people">` +num_virus_free_people+`</span> people free of virus risk</div>`+
                        num_outbreak_free_districts +` / 725 districts free of virus risk</div>`+
                    `</div>`;
            }
        }

        document.getElementById("outbreak_free_animation_button").onclick = function() {
            update_outbreak_free_date();
        }

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
*/

/*
function update_outbreak_free_date() {
    console.log("Here");
    start_date = new Date(2020, 2, 15); //Start from March
    var step_delay = 5000;
    outbreak_free_state_counter = 0;
    d3.select(idname).selectAll(".state_zero_case")
        .transition()
            .delay(function(d,i) {
                console.log(d);
                cdt = parseTime(d.properties.first_case_date);
                diff_time = Math.abs(cdt - start_date);
                num_days = Math.log10(Math.ceil(diff_time / (1000 * 60 * 60 * 24)));
                return num_days*step_delay;
                //return 100;
            })
            .duration(1000)
                .style("fill",  "#ff4c4c");
}
*/

