
var top_unique_songs_file = "data/song_similarity_score.csv";
plot_top_unique_songs(top_unique_songs_file);

function plot_top_unique_songs(top_unique_songs_file) {

	var top_most_similar_songs_rows = ``;
	d3.csv(top_unique_songs_file, function (data) {
		data.forEach(function(d,i){
			
		});

		// Sort songs by similarity score
		data.sort(function(x, y){
			return d3.ascending(x.similarity_score, y.similarity_score);
		});
		console.log(data);

		num_top_most_unique_songs = 25; //Math.min(song_pair_info_arr.length, 10);
		top_most_unique_songs_rows =``;
		for (var i=0; i<num_top_most_unique_songs; i++) {

			song1_name = toTitleCase(data[i]["song_name"]);
			song1_artist = toTitleCase(data[i]["artist"]);
			similarity_score = data[i]["similarity_score"];

			// Append rows of most similar song pairs
			top_most_similar_songs_rows += `
				<tr>
					<th scope="row">`+(i+1)+`</th>
					<td><span class="unique-table-song-name">`+song1_name+` - `+`</span><span class="unique-table-artist-name">`+song1_artist+`</span></td>
					<td>
				      	<div class="progress" style="height: 20px;">
	  						<div class="progress-bar" role="progressbar" style="width: `+Math.round(similarity_score*100)+`%;" aria-valuemin="0" aria-valuemax="100">`+similarity_score+`</div>
						</div>
				     </td>
				</tr>`;
		}

		most_similar_songs_table = document.getElementById("top_unique_songs_table");
		most_similar_songs_table.innerHTML = `
			<table class="table table-hover table-sm text-left">
			  <thead>
			    <tr class="table_heading">
			      <th scope="col"></th>
			      <th scope="col">Most Unique Songs</th>
			      <th scope="col">Similarity Score</th>
			    </tr>
			  </thead>
			  <tbody>`+
			    top_most_similar_songs_rows+
			  `</tbody>
			</table>`;

	});

}