

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

var scroll_data;
var projection = d3.geoMercator();
var svg_map;
var scroll_state_data;
var scroll_country_data;
var prediction_data;
var prediction_scenario_id = 0;
var outbreak_spread_timeouts = [];
var minDeviceWidth = 375;
var maxDeviceWidth = 1024;
var g4;
var g5;
var scroll_show_state_list = ["DL", "MH", "GJ", "WB", "KL", "KA", "MP", "AP", "TN", "RJ", "PB", "BR", "JK", "HR"];
var outbreak_spread_map_data;
var india_topojson_data;
var daily_stats_data;
var outbreak_free_state_counter = 0;
var svg_indv_time;
var outbreak_free_timeouts = [];
var svg_random;

function load_data(idname, filename, width, height, margin) {

	// parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_scroll")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    var svg = d3.select(idname).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g");
        //.attr("transform",
        //      "translate(" + margin.left + "," + margin.top + ")");

	d3.csv(filename, function(error, data) {
		if (error) throw error;

		//data = data.filter(function(d,i){
		//	return i%100==0;
		//})

		scroll_data = data;
		data.forEach(function(d, i) {
      		if (1) { 
      			d.id = +d.id;
				d.date = parseTime(d.date);
				d.status_change_date = parseTime(d.status_change_date); 
				d.day_id = +d.day_id;
			}
		});

		svg.selectAll(".dot")
			.data(data)
        .enter().append("circle")
			.attr("class", "scroll_randompos_circles circles")
			.attr("r", function(d,i) {
				if (window.innerWidth >= 768) {
					return "0.25rem";
				} else {
					return "0.15rem";
				}
			})
			.attr("cx", function(d,i) {
				return randomNumber(0, width);
			})
			.attr("cy", function(d,i) {
				return randomNumber(0, height);
			})
			.style("z-index", 0)
			.attr("fill", function(d,i) {
				return "#ff0000"; //"#FA8072"; //"#FA8072"; //#FF0000
			})
			//.attr("stroke", "#FF0000")
			//.attr("stroke-width", "0.25px")
			.attr("opacity", 1)
			.on("mouseover", function(d, i) {
			    //d3.selectAll(".scroll_randompos_circles").style("opacity", 0.5);
			    d3.select(this).style('stroke-width', '2px').style("opacity", 1.0);
			    return tooltip.html(`<div class='well'>Case detected on `+
			    					month_abbrv_list[d.date.getMonth()]+` `+d.date.getDate()+` at `+d.district + `, `+d.state_code+
                                    `</div>`)
                              .style("visibility", "visible");
			  }
			)
			.on("mousemove", function(){
				if (event.pageX >= window.innerWidth/2) {
		            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-150)+"px");
		        } else {
		        	return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
		        }
				//return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
			})
			.on("mouseout", function(d, i){
			    //d3.selectAll(".scroll_randompos_circles").style("opacity", 1.0);
			    d3.select(this).style('stroke-width', '0.25px').style("opacity", 1.0);
				return tooltip.style("visibility", "hidden");
			});

	});

}


function hide_existing_cases(idname, opacity) {
		d3.select(idname)
			.selectAll(".scroll_randompos_circles")
			.transition()
				.duration(1000)
				.style("opacity", opacity);
}

function move_random_points(width, height) {
	svg_random.selectAll(".randompos_circles")
				.transition()
					.duration(1000)
					.attr("cx", function(d,i) {
						return randomNumber(0, width);
						//return d.x + (Math.random()>0.5?1:-1) * Math.random()*10;
					})
					.attr("cy", function(d,i) {
						return randomNumber(0, height);
						//return d.y + (Math.random()>0.5?1:-1) * Math.random()*10;
					});
}

function show_random_points(idname, width, height, margin) {
	svg_random = d3.select(idname).append("svg")
			        .attr("width", width + margin.left + margin.right)
			        .attr("height", height + margin.top + margin.bottom)
			      .append("g");

	// set the ranges
    var x = d3.scaleLinear().domain([0,1]).range([0, width]);
    var y = d3.scaleLinear().domain([0,1]).range([height, 0]);

    var random_data = [];
    var num_random_points = 100;
    for (var i=0; i<num_random_points; i++) {
    	random_data[i] = [];
    	random_data[i].x = randomNumber(0, width);
    	random_data[i].y = randomNumber(0, height);
    }

	svg_random.selectAll(".dot")
			.data(random_data)
        .enter().append("circle")
			.attr("class", "randompos_circles circles")
			.attr("r", function(d,i) {
				if (window.innerWidth >= 768) {
					return "0.25rem";
				} else {
					return "0.15rem";
				}
			})
			.attr("cx", function(d,i) {
				return d.x;
			})
			.attr("cy", function(d,i) {
				return d.y;
			})
			.style("z-index", 0)
			.attr("fill", function(d,i) {
				return "#ff0000"; //"#FA8072"; //"#FA8072"; //#FF0000
			});
			/*
			.transition()
				.duration(1000)
				.attr("cx", function(d){
					return d.x + (Math.random()>0.5?1:-1) * Math.random()*10; //randomNumber(0, width);
				})
				.attr("cy", function(d){
					return d.y + (Math.random()>0.5?1:-1) * Math.random()*10; //randomNumber(0, width);
				});
				//.on("end", repeat_random_movement);
			*/
			/*
			.transition()
				.each("end", function(){
					repeat_random_movement();
				});
			*/
	/*
	repeat_random_movement();
	function repeat_random_movement() {
		svg_random.selectAll(".randompos_circles")
				.transition()
					.duration(100)
					.attr("cx", function(d,i) {
						return d.x + (Math.random()>0.5?1:-1) * Math.random()*10;
					})
					.attr("cy", function(d,i) {
						return d.y + (Math.random()>0.5?1:-1) * Math.random()*10;
					})
				.transition()
					.duration(100)
					.attr("cx", function(d,i) {
						return d.x + (Math.random()>0.5?1:-1) * Math.random()*10;
					})
					.attr("cy", function(d,i) {
						return d.y + (Math.random()>0.5?1:-1) * Math.random()*10;
					})
				.on("end", repeat_random_movement);
	}
	*/
	

}

function show_individual_cases(idname, width, height, margin, opacity) {

	// Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_scroll")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");


    svg_indv_time = d3.select(idname).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g");

    //console.log(scroll_data);

	svg_indv_time.selectAll(".dot")
			.data(scroll_data)
        .enter().append("circle")
			.attr("class", "scroll_randompos_circles circles")
			.attr("r", function(d,i) {
				if (window.innerWidth >= 768) {
					return "0.25rem";
				} else {
					return "0.15rem";
				}
			})
			.attr("cx", function(d,i) {
				return randomNumber(0, width);
			})
			.attr("cy", function(d,i) {
				return randomNumber(0, height);
			})
			.style("z-index", 0)
			.attr("fill", function(d,i) {
				return "#ff0000"; //"#FA8072"; //"#FA8072"; //#FF0000
			})
			//.attr("stroke", "#FF0000")
			//.attr("stroke-width", "0.25px")
			.attr("opacity", opacity)
			.on("mouseover", function(d, i) {
			    //d3.selectAll(".scroll_randompos_circles").style("opacity", 0.5);
			    d3.select(this).style('stroke-width', '2px').style("opacity", 1.0);
			    return tooltip.html(`<div class='well'>Case detected on `+
			    					month_abbrv_list[d.date.getMonth()]+` `+d.date.getDate()+` at `+d.district + `, `+d.state_code+
                                    `</div>`)
                              .style("visibility", "visible");
			  }
			)
			.on("mousemove", function(){
				  if (event.pageX >= window.innerWidth/2) {
		            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-150)+"px");
		          } else {
		            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
		          }
				//return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
			})
			.on("mouseout", function(d, i){
			    //d3.selectAll(".scroll_randompos_circles").style("opacity", 1.0);
			    d3.select(this).style('stroke-width', '0.25px').style("opacity", 1.0);
				return tooltip.style("visibility", "hidden");
			});

}





//status_color_mapping = {"Hospitalized":"#FF0000", "Recovered":"#229954", "Deceased":"#000000"}
//status_color_mapping = {"Hospitalized":"#FA8072", "Recovered":"#229954", "Deceased":"#000000"}
status_color_mapping = {"Hospitalized":"#ff0000", "Recovered":"#229954", "Deceased":"#0000ff"};

function color_case_by_status(idname) {

	var radius;
	if (window.innerWidth >= 768) {
		radius = "0.25rem";
	} else {
		radius = "0.15rem";
	}

	// Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_scroll")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

	d3.select(idname)
		.selectAll(".scroll_randompos_circles")
		.on("mouseover", function(d, i) {
		    //d3.selectAll(".scroll_randompos_circles").style("opacity", 0.5);
		    d3.select(this).style('stroke-width', '2px').style("opacity", 1.0);
		    if (d.status=="Hospitalized") {
		    	return tooltip.html(`<div class='well'>Case detected on `+
					month_abbrv_list[d.date.getMonth()]+` `+d.date.getDate()+` at `+d.district + `, `+d.state_code+
                    `</div>`)
             		 .style("visibility", "visible");
		    } else if (d.status=="Recovered"){
		    	return tooltip.html(`<div class='well'>Patient `+
					` at `+d.district + `-`+d.state_code+
                    `, recovered on `+month_abbrv_list[d.status_change_date.getMonth()]+` `+d.status_change_date.getDate()+`</div>`)
             		 .style("visibility", "visible");
		    } else if (d.status=="Deceased"){
		    	return tooltip.html(`<div class='well'>Patient `+
					` at `+d.district + `-`+d.state_code+
                    `, passed away on `+month_abbrv_list[d.status_change_date.getMonth()]+` `+d.status_change_date.getDate()+`</div>`)
             		 .style("visibility", "visible");
		    }
		    
		  }
		)
		.on("mousemove", function(){
			if (event.pageX >= window.innerWidth/2) {
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-150)+"px");
			} else {
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
			}
			//return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
		})
		.on("mouseout", function(d, i){
		    //d3.selectAll(".scroll_randompos_circles").style("opacity", 1.0);
		    d3.select(this).style('stroke-width', '0.25px').style("opacity", 1.0);
			return tooltip.style("visibility", "hidden");
		})
		.transition()
		.duration(2000)
			.attr("fill", function(d,i) {
				return status_color_mapping[d.status];
			})
			.attr("r", function(d,i) {
				return radius;
			})
			.attr("opacity", function(d){
				if (d.status=="Hospitalized") {
					return 0.5;
				} else {
					return 1;
				}
			});

}