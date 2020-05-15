idname = "#district_daily_case_count";
d3.select(idname).select("svg").remove();
filename = "data/districtwise_daily_case_count.csv";
width_scale_factor = 1.0;
height_scale_factor = 0.80;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:20, left:20, top:10, bottom:30};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_district_daily_case_count(idname, filename, base_width, base_height);

var state_list = ['Andaman and Nicobar Islands', 'Andhra Pradesh',
       'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
       'Chhattisgarh', 'Daman And Diu', 'Delhi', //'Dadra and Nagar Haveli', 
       'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
       'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh',
       'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
       'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
       'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
       'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];




var asid = document.getElementById("district_daily_case_count");
asid.innerHTML = '';
for (var i=0; i<state_list.length; i++) {
	state_name = state_list[i];
	if (state_name=="Andaman and Nicobar Islands") {
		state_name = "Andaman and Nicobar";
	}
	asid.innerHTML += `<div class="col-lg-2 col-4" id="state_`+i+`">`+
	`<span class="district_daily_case_count_state_name">`+state_name+`</span></div>`;
}




function draw_district_daily_case_count(idname, filename, width, height) {

	// parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");
    var default_background_color_district_case_count = "#808080";
    var district_current_case_count = [];
    
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_district_daily_case_count")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    // Get the data
    d3.csv(filename, function(error, data_csv) {
		if (error) throw error;

		var all_states_data = data_csv;
		var dates = d3.keys(data_csv[0]);
		idx = 0;
		var date_data = [];
		var case_count_10 = [];
	    var case_count_100 = [];
    	var case_count_1000 = [];

		for (var i=3; i<dates.length-1; i++) {
			date_data[idx] = [];
			date_data[idx].date = parseTime(dates[i]);

			case_count_10[idx] = [];
			case_count_10[idx].date = date_data[idx].date;
			case_count_10[idx].rate = 10;

			case_count_100[idx] = [];
			case_count_100[idx].date = date_data[idx].date;
			case_count_100[idx].rate = 100;

			case_count_1000[idx] = [];
			case_count_1000[idx].date = date_data[idx].date;
			case_count_1000[idx].rate = 1000;
			idx += 1
		}

		// State loop
		for (var st=0; st<state_list.length; st++) {
		//for (var st=0; st<1; st++) {
			data_csv = all_states_data;
			state_name = state_list[st];

			idname = "#state_" + st;
			d3.select(idname).select("svg").remove();
			var bb = d3.select(idname).node().offsetWidth;
			width = bb*width_scale_factor - margin.left - margin.right;
			height = bb*height_scale_factor - margin.top - margin.bottom;

			var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
		    //var y = d3.scaleLinear().range([height, 0]);
		    var y = d3.scaleLog().range([height, 0]).base(10);

			var svg = d3.select(idname).append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			state_data = data_csv.filter(function(d,i) { return d.state == state_name });

			//console.log(state_data);

			// District loop
			for (var dt=0; dt<state_data.length; dt++){
			//for (var dt=3; dt<4; dt++){
				var didx = 0;
				var data = [];
				district_case_count = state_data[dt]; //.slice(1, data_csv.length-1));
				district_name = district_case_count[dates[0]].replace(/\./g,"").replace(", ","_").split(" ").join("-");
				state_code = district_case_count[dates[1]];
				state_name = district_case_count[dates[1]];

				// Dates loop
				for (var i=3; i<dates.length-1; i++) {
					data[didx] = [];
					case_count = parseFloat(district_case_count[dates[i]]);
					data[didx].date = parseTime(dates[i]);
					data[didx].rate = case_count;
					didx += 1;
		    	}
	    		district_current_case_count[district_name] = data[didx-1].rate;

			    x.domain(data.map(function(d) {
					return d.date;
				}));
			    y.domain([1, d3.max(all_states_data, function(d) { return +d[dates[dates.length-1]]; })]);
			    //y.domain([0, 1400]);
		    	//var y = d3.scaleLog().domain([1, 1400]).range([height, 0]); //.base(10);
	
			    //console.log(data);

	    		// define the line
				var valueline = d3.line()
					.x(function(d) {
						//console.log(x(d.date));
						return x(d.date);
					})
					.y(function(d) {
						//console.log(y(100));
						//return y(d.rate);
						if (d.rate!=0) {
							return y(d.rate);
						} else {
							return height;
						}
					});

				// Add the valueline path.
				path = svg.append("path")
		                .data([data])
		                .attr("class", district_name+"_case_count_curve case_count_curve")
		                .attr("d", valueline)
		                .attr("fill", "none")
		                .attr("stroke-width", "1.5px")
		                .style("z-index", 0)
		                .attr("stroke", function() {
				      		if (0) {
				      			//return state_color;
		                	} else {
		                		return default_background_color_district_case_count; 
		                	}
		                })
		                .attr("opacity", function() {
				      		if (0) {
				      			return 1;
				      		} else {
				      			return 0.5;
				      		}
			      		})
		                .on("mouseover", function(d,i) {
	                    	dname_with_state_code = this.getAttribute("class").split("_case_count_curve")[0];
	                    	console.log(dname_with_state_code);
							//show_selected_district_case_count(dname_with_state_code);

	                    	return tooltip.html(`<div class='well district_daily_state_name_tooltip'>`+
	                                                  `<span class="district_daily_state_name text-center">`+dname_with_state_code.replace("_",", ")+`</span></br>` +
	                                                `<span class="district_daily_case_count_info">`+ district_current_case_count[dname_with_state_code] +`</span> cases</div>` )
	                                          .style("visibility", "visible");
		                })
		                .on("mousemove", function(){
	                        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
	                    })
		                .on("mouseout", function(d,i) {
							//show_all_districts_case_count_button_click_handler();
	                        return tooltip.style("visibility", "hidden");
		                })

		    }

		    var xAxis = d3.axisBottom()
                    .scale(x)
                    .tickFormat(d3.timeFormat("%b %e"))
                    .tickValues(x.domain().filter(function(d,i){ return !(i%14)}))
		            .tickSize(0)
              		.tickPadding(5);


            var yAxis = d3.axisLeft()
		                  .scale(y)
		                  .tickFormat( (d,i) => {
			                  if ((d==10) || (d==100) || (d==400) || (d==1000)) {
			                    return d;
			                  }
			                })
		                  .tickSize(0)
              			  .tickPadding(2);

			// add the x Axis
			svg.append("g")
			  .attr("transform", "translate(0," + (height+5) + ")")
			  .attr("class", "label_histogram")
			  .call(xAxis)
			  .style("font-size", "0.5rem")
			.append("text")
			  .attr("class", "label_histogram")
			  .attr("x", width)
			  .attr("y", -40)
			  .style("text-anchor", "end")
			  .style("fill", "black")
			  .style("font-size", "0.5rem");


			// add the y Axis
			svg.append("g")
			  .attr("class", "label_histogram axis--y")
			  //.attr("transform", "translate("+(-10)+",0)")
			  .call(yAxis)
			  .style("font-size", "0.5rem");
			
			// Horizontal grid lines
			horizontal_grid_lines_data = [case_count_10, case_count_100, case_count_1000];
			for (var hg=0; hg<3; hg++) {
				svg.append("path")
		            .data([horizontal_grid_lines_data[hg]])
		            .attr("d", valueline)
		            .attr("fill", "none")
		            .attr("stroke", "#c0c0c0")
		            .attr("stroke-width", "1.5px")
		            .attr("stroke-dasharray", 2);
	        }

		}


	});
}