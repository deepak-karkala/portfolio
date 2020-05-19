//(function(){

script_load_timeout_list.push(setTimeout(load_clusterTable_script, 4*script_load_timestep));

function load_clusterTable_script() {      
      idname = "cluster_table_body";
      filename = "data/cluster_table.csv"
      insert_cluster_table(idname, filename);
}

function insert_cluster_table(idname, filename) {

	var table = document.getElementById(idname);
	table.innerHTML = ``;

	d3.csv(filename, function(error, data) {
		if (error) throw error;

      	data.forEach(function(d,i) {
      		d.cluster = d.cluster;
      		d.case_count = +d.case_count;
      		// Insert row
      		table.innerHTML += `<tr>`+
      							`<td>`+d.cluster+`</td>`+
      							`<td align="right">`+d.case_count+`</td>`+
      						  `</tr>`;
      	});

    });

}
//})();