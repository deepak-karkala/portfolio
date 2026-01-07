idname = "#recovery_rate";
filename = "data/state_recovery_rate.csv";
d3.select(idname).select("svg").remove();
width_scale_factor = 0.95;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:10, left:40, top:30, bottom:20};
base_width = bb*width_scale_factor - margin.left - margin.right;
plot_state_recovery_rate(idname, filename, base_width);
var data = [];
var month_list = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var recovery_rate_color_scale = d3.scaleSequential(d3.interpolateRdYlGn);



function plot_state_recovery_rate(idname, file, width) {
    var minDeviceWidth = 375;
	var maxDeviceWidth = 1024;

    var recovery_rate_normalised = d3.scaleLinear().domain([0, 1]).range([0, 1]);
	// For large screen widths, show all states
	if (width>=550) {
		var min_case_count_to_show_in_recovery_rate_table = 0;
	} else {
		var min_case_count_to_show_in_recovery_rate_table = 100;
	}

	var row_gap_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([15, 22]);
    var col_gap_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([15, 15]);
    var box_width_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10.0, 12.0]);
    var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.5, 0.45]);
    var height_scale_factor = height_scale_factor_width(bb);
    height = bb*height_scale_factor - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");


	d3.csv(file, function(error, file_data) {
		if (error) throw error;

		var state_code_list = d3.keys(file_data[0]);
		var show_state_list = [];
      	var idx = 0;
      	var date_list = [];

      	file_data.forEach(function(d,i) {

      		if (i==0) {
	      		for (var c=1; c<state_code_list.length; c++) {
	      			state_code = state_code_list[c];
	      			if (d[state_code] >= min_case_count_to_show_in_recovery_rate_table) {
	      				show_state_list.push(state_code);
	      			}
      			}
      			
      		} else {
      			date = new Date(parseTime(d.date));
      			if (date.getMonth()>=3) { // Start from April
	      			for (var c=1; c<state_code_list.length; c++) {
		      			state_code = state_code_list[c];
		      			if (show_state_list.includes(state_code)) {
		      				data[idx] = [];
		      				data[idx].date = date;
		      				data[idx].rate = +d[state_code]; 
		      				idx+=1;
		      			}
	      			}
	      			date_list.push(date);
      			}
			}

		});


      	var num_dots_per_row = show_state_list.length;
      	var num_rows = data.length;

	    // set the ranges
	    var x = d3.scaleLinear().range([0, width]);
	    var y = d3.scaleLinear().range([height, 0]);

	    // append the svg object to the body of the page
	    // append a 'group' element to 'svg'
	    // moves the 'group' element to the top left margin
	    var svg = d3.select(idname).append("svg")
	          .attr("width", width) // + margin.left + margin.right)
	          .attr("height", height) // + margin.top + margin.bottom);
	        .append("g")
	          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d,i) {
                return (i%num_dots_per_row)*row_gap_factor(width);
            })
            .attr("y", function(d,i) {
                return Math.floor(i/num_dots_per_row)*col_gap_factor(width);
            })
            .attr("width", function(d,i) { return box_width_factor(width);})
            .attr("height", function(d,i) { return box_width_factor(width);})
            .style("fill", function(d) {
            	if (d.rate==-1) {
	      			return "#cdcdcd";
            	} else {
	            	return recovery_rate_color_scale(recovery_rate_normalised(d.rate));
            	}
            })
            //.style("stroke", function(d) { return "#212121"; })
            .attr("opacity", 0)
            .transition()
                .duration(1000)
                .delay(function(d, i) { return i*1; })
                .attr("opacity", 1.0);


        svg.selectAll(".text")
        	.data(show_state_list)
        	.enter().append("text")
        	.attr("class", "state_recovery_rate_label")
        	.attr("x", function(d,i) {
                return (i%num_dots_per_row)*row_gap_factor(width);
            })
        	.attr("y", -15)
        	.text(function(d,i) {
        		console.log(d);
        		return d;
        	})
        	.style("font-size", "0.6rem")
        	.style("font-weight", "bold")
        	.style("fill", "black");


        svg.selectAll(".text")
        	.data(date_list)
        	.enter().append("text")
        	.attr("class", "state_recovery_rate_label")
        	.attr("x", function(d,i) {
                return -35;
            })
        	.attr("y", function(d,i) {
                return Math.floor(i/1)*col_gap_factor(width)+8;
            })
        	.text(function(d,i) {
        		console.log(d);
        		return d.getDate() + " " + month_list[d.getMonth()];
        	})
        	.style("font-size", "0.6rem")
        	.style("fill", "black");
        	

/*
		$(document).ready(function () {
			$('#top_hotspots_table').DataTable({
			    "paging": true,
			    "pagingType": "simple_numbers",
			    "aaSorting": [],
			    "order": [[ 2, "desc" ]]
			});
			$('.dataTables_length').addClass('bs-select');
		});
*/
	});

}

plot_recovery_rate_legend();
function plot_recovery_rate_legend() {
	var legend = document.getElementById("recovery_rate_legend");
	legend.innerHTML = `More confirmed cases   `;
	var color_thresh = [0, 0.25, 0.5, 0.75, 1.0];
	for (var i=0; i<5; i++) {
		legend.innerHTML += `<svg height="10" width="12"><rect width="10" height="10" `+
								`fill="`+recovery_rate_color_scale(color_thresh[i])+`"/></svg>`;
	}
	legend.innerHTML += `   More recoveries`;

}


