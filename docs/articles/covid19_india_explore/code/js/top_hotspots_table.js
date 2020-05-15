table_idname = "top_hotspots_table_body";
//filename = "data/districtwise_top_hotspots.csv";
filename = "data/districtwise_case_death_growth_density_withDelhiCombined.csv";
insert_district_rows(table_idname, filename);

var min_case_count_to_show_in_table = 50;
var num_past_days_growth_rate = 15;

function insert_district_rows(table_idname, file) {
	var table = document.getElementById(table_idname);
	table.innerHTML = ``;

	var width = 100, height=20;
	var margin = {right:0, left:0, top:0, bottom:0};

    var rect_width = 6;
    var rect_height = 15;
    var growth_rate_normalised = d3.scaleLinear().domain([0, 40]).range([0, 1]);
	var growth_rate_color_scale = d3.scaleSequential(d3.interpolateYlOrRd);

	d3.csv(file, function(error, data) {
		if (error) throw error;

		var x = d3.scaleLinear().domain([0, num_past_days_growth_rate]).range([0, width]);
	    //var y = d3.scaleLinear().range([height, 0]);

      	data.forEach(function(d,i) {
      		d.cases = +d.cases;
      		d.deaths = +d.deaths;
      		idname = "district_"+i; //d.district.split(' ').join('_');


      		//if (d.district == "Mumbai") { //(d.cases >= min_case_count_to_show_in_table) {
      		if (d.cases >= min_case_count_to_show_in_table) {
				table.innerHTML += `<tr class="table-primary">` +
										`<td align="left">`+d.district+`, `+d.state_code+`</td>`+
										`<td align="right">`+d.cases+`</td>`+
										`<td align="right">`+d.cases_per_lakh+`</td>`+
										`<td align="right">`+d.deaths+`</td>`+
										`<td align="right">`+d.current_avg_growth_rate+`</td>`+
										`<td><div id="`+idname+`"></div></td>`+
									`</tr>`


	      		var data = [];
	      		for (var j=0; j<num_past_days_growth_rate; j++) {
	      			data[j] = [];
	      			data[j].x = j; 
	      			data[j].y = 5;
	      			//console.log(d["day"+j]);
	      			growth_rate = parseFloat(d["day"+j]);
	      			if (isNaN(growth_rate)) {
	      				data[j].color = "#cdcdcd";
	      			} else {
		      			data[j].color = growth_rate_color_scale(growth_rate_normalised(growth_rate));
		      		}
	      		}

	      		//console.log(idname);
	      		//console.log(data);

	      		var svg = d3.select("#"+idname).append("svg")
			          .attr("width", width + margin.left + margin.right)
			          .attr("height", height + margin.top + margin.bottom)
			        .append("g");
			          //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			    svg.selectAll(".bar")
			    	.data(data)
			    	.enter().append("rect")
			    	.attr("class", "bar growth_rate_bar")
			    	.attr("x", function(d, i) { 
			    		//console.log(x(d.x));
			    		return x(d.x);
			    		//return 0;
			    	})
			    	.attr("y", height/4-5)
			    	.attr("width", rect_width)
			    	.attr("height", rect_height)
			    	.style("fill", function(d,i) { return d.color; });
      		}


		});

		$(document).ready(function () {
			$('#top_hotspots_table').DataTable({
			    "paging": true,
			    "pagingType": "simple_numbers",
			    "aaSorting": [],
			    /*
			    columnDefs: [{
			      orderable: false,
			      targets: 3
			    }],
			    */
			    "order": [[ 2, "desc" ]]
			});
			$('.dataTables_length').addClass('bs-select');
		});

	});

}