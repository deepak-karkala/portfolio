setupButtons("#most_similar_songs_button");

// Initial list: all decades
function plot_most_similar_songs_initial() {
	decade = "all";
	most_similar_songs_file = "data/most_similar_songs.csv";
    plot_most_similar_songs(most_similar_songs_file, decade)
}
plot_most_similar_songs_initial();

// Button click handler
function most_similar_songs_button_click(id) {
    if (id !== "all") {
        decade = parseInt(id);
    } else {
    	decade = "all";
    }
    most_similar_songs_file = "data/most_similar_songs.csv";
    plot_most_similar_songs(most_similar_songs_file, decade);
}

function plot_most_similar_songs(most_similar_songs_file, decade) {
	var song_pair_info_arr = [];
	d3.csv(most_similar_songs_file, function (data) {
		data.forEach(function(d,i){
			d.song1_decade = +d.song1_decade;
			d.song2_decade = +d.song2_decade;
			if ((decade == "all") || ((d.song1_decade === d.song2_decade) && (d.song1_decade === decade)) ) {
				song_pair_info = {};
				song_pair_info["song1_name"] = d.song1_name;
				song_pair_info["song2_name"] = d.song2_name;
				song_pair_info["song1_artist"] = d.song1_artist;
				song_pair_info["song2_artist"] = d.song2_artist;
				song_pair_info["song1_year"] = +d.song1_year;
				song_pair_info["song2_year"] = +d.song2_year;
				song_pair_info["song1_decade"] = +d.song1_decade;
				song_pair_info["song2_decade"] = +d.song2_decade;
				song_pair_info["similarity_score"] = +d.similarity_score;
				song_pair_info_arr.push(song_pair_info);
			} 
		});

		num_top_most_similar_songs = Math.min(song_pair_info_arr.length, 10);
		top_most_similar_songs_rows =``;
		for (var i=0; i<num_top_most_similar_songs; i++) {

			song1_name = toTitleCase(song_pair_info_arr[i]["song1_name"]);
			song2_name = toTitleCase(song_pair_info_arr[i]["song2_name"]);
			song1_year = song_pair_info_arr[i]["song1_year"];
			song2_year = song_pair_info_arr[i]["song2_year"];
			song1_artist = toTitleCase(song_pair_info_arr[i]["song1_artist"]);
			song2_artist = toTitleCase(song_pair_info_arr[i]["song2_artist"]);
			similarity_score = song_pair_info_arr[i]["similarity_score"];

			// Append rows of most similar song pairs
			top_most_similar_songs_rows += `
				<tr>
					<th scope="row">`+(i+1)+`</th>
					<td><span class="similar-table-song-name">`+song1_name+` - `+`</span><span class="similar-table-artist-name">`+song1_artist+`</span> & <span class="similar-table-song-name">`+song2_name+` - `+`</span><span class="similar-table-artist-name">`+song2_artist+`</span></td>
					<td>
				      	<div class="progress" style="height: 20px;">
	  						<div class="progress-bar" role="progressbar" style="width: `+Math.round(similarity_score*100)+`%;" aria-valuemin="0" aria-valuemax="100">`+similarity_score+`</div>
						</div>
				     </td>
				</tr>`;
		}

		most_similar_songs_table = document.getElementById("most_similar_songs_table");
		most_similar_songs_table.innerHTML = `
			<table class="table table-hover table-sm text-left">
			  <thead>
			    <tr class="table_heading">
			      <th scope="col"></th>
			      <th scope="col">Most Similar Song Pairs</th>
			      <th scope="col">Similarity Score</th>
			    </tr>
			  </thead>
			  <tbody>`+
			    top_most_similar_songs_rows+
			  `</tbody>
			</table>`;

	});

}