var similar_song_ids = [];

// Initial top list, id = 0
function plot_song_similar_to_initial() {
	song_id = 0;
	plot_song_similar_to_top(song_id);
}
plot_song_similar_to_initial();

function plot_song_similar_to_top(song_id) {
	idname = "#song_discography_table";
	d3.select(idname).select("svg").remove();
	var bb = d3.select(idname).node().offsetWidth;
	var width_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([1.0, 0.70]);
	width_scale_factor = width_scale_factor_width(bb);
	var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.70, 0.30]);
	height_scale_factor = height_scale_factor_width(bb);
	var margin = {right:80, left:40, top:20, bottom:40};
	base_width = bb*width_scale_factor - margin.left - margin.right;
	base_height = bb*height_scale_factor - margin.top - margin.bottom;
	similar_song_id_file = "data/top_songs_similar_to_ids.csv";
	similar_song_scores_file = "data/top_songs_similar_to_scores.csv";
	song_info_file = "data/song_similarity_score.csv";
	//song_id = 0;
	plot_song_similar_to(idname, base_width, base_height, margin, song_id, similar_song_id_file, similar_song_scores_file, song_info_file);
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function plot_song_similar_to(idname, width, height, margin, song_id, similar_song_id_file, similar_song_scores_file, song_info_file) {
	var song_info_arr = [];
	d3.csv(song_info_file, function (data) {
		data.forEach(function(d,i){
			song_info = {};
			song_info["id"] = +d.id;
			song_info["song_name"] = d.song_name;
			song_info["artist"] = d.artist;
			song_info["decade"] = +d.decade;
			song_info["year"] = +d.year;
			song_info["similarity_score"] = +d.similarity_score;
			song_info_arr.push(song_info);

			if (d.id == song_id) {
				subtitle = document.getElementById("song_discography_subtitle");
				subtitle.innerHTML = `Most similar songs to <span class="song_discography_subtitle_song">` + toTitleCase(song_info["song_name"]) + `, </span><span class="song_discography_subtitle_artist">` + toTitleCase(song_info["artist"]) + `</span>`;
			}
		})

		d3.csv(similar_song_id_file, function (data) {
			data.forEach(function(d,i){
				d.id = +d.id;
				if (d.id == song_id) {
					similar_song_ids = Object.values(d);
					similar_song_ids_length = similar_song_ids.length;
					similar_song_ids = similar_song_ids.slice(0, similar_song_ids_length-1);
				}
			})
			var num_similar_songs = similar_song_ids.length;
			//console.log(num_similar_songs);

			var similar_song_scores = [];
			d3.csv(similar_song_scores_file, function (data) {
		        data.forEach(function(d, i) {
					d.id = +d.id;
		        	if (d.id==song_id) {
			            similar_song_scores = Object.values(d);
			            similar_song_scores = similar_song_scores.slice(0, num_similar_songs);
			         }
				})

		        // Append list of top similar song details
				var top_similar_songs_rows = ``;
				for (var i=0; i<num_similar_songs; i++) {

					for (var j=0; j<song_info_arr.length; j++) {
						if (song_info_arr[j]["id"] == similar_song_ids[i]) {
							song_name = toTitleCase(song_info_arr[j]["song_name"]);
							song_year = song_info_arr[j]["year"];
							song_artist = toTitleCase(song_info_arr[j]["artist"]);
						}
					}

					top_similar_songs_rows += `	<tr>
													<th scope="row">`+(i+1)+`</th>
													<td><span class="similar-table-song-name">`+song_name+` - `+`</span><span class="similar-table-artist-name">`+song_artist+`</span></td>
													<td>
												      	<div class="progress" style="height: 20px;">
									  						<div class="progress-bar" role="progressbar" style="width: `+Math.round(similar_song_scores[i]*100)+`%;" aria-valuemin="0" aria-valuemax="100">`+similar_song_scores[i]+`</div>
														</div>
												     </td>
												</tr>`;
				}


				song_discography_table = document.getElementById("song_discography_table");
				song_discography_table.innerHTML = `
					<table class="table table-hover table-sm text-left">
					  <thead>
					    <tr class="table_heading">
					      <th scope="col"></th>
					      <th scope="col">Song</th>
					      <th scope="col">Similarity score</th>
					    </tr>
					  </thead>
					  <tbody>`
					    +top_similar_songs_rows+
					  `</tbody>
					</table>`;


			});

		});
	
	});

}

set_song_discography_combobox();

function set_song_discography_combobox() {
	song_info_file = "data/song_similarity_score.csv";
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
		var song_list = '';
		for (var i=0; i<song_info_arr.length; i++) {
			song_list += `<option value="`+song_info_arr[i]["id"]+`">`+song_info_arr[i]["song_name"]+` - `+song_info_arr[i]["artist"]+`</option>`;
		}
		$('#combobox').append(song_list);
	});
}

$("#combobox").change(function() {
    //alert(this.value);
    song_id = this.value;
	plot_song_similar_to_top(song_id);
});




