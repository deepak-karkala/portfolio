function setup_dropdown_likes() {
    var users = ["katyperry", "justinbieber", "BarackObama", "rihanna", "taylorswift13",
                 "ladygaga", "TheEllenShow", "Cristiano", "YouTube", "jtimberlake", "ArianaGrande",
                 "KimKardashian", "realDonaldTrump", "selenagomez", "britneyspears", "twitter",
                 "cnnbrk", "shakira", "jimmyfallon", "BillGates", "narendramodi", "JLo",
                 "neymarjr", "BrunoMars", "KingJames", "Oprah", "MileyCyrus", "NiallOfficial",
                 "BBCBreaking", "Drake", "iamsrk", "instagram", "SrBachchan", "BeingSalmanKhan",
                 "SportsCenter", "KevinHart4real", "LilTunechi", "espn", "wizkhalifa", "Harry_Styles",
                 "Louis_Tomlinson", "LiamPayne", "Pink", "realmadrid", "onedirection", "NASA",
                 "aliciakeys", "chrisbrown"];
    var option = '';

    users.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
    });

    for (i=0;i<users.length;i++){
       option += '<option value="'+ users[i] + '">' + users[i] + '</option>';
    }

    init_account = "TheEllenShow";  // "BBCBreaking";

    $('#select_user').append(option);
    selectElement("select_user", init_account);

    function selectElement(id, valueToSelect) {
        var element = document.getElementById(id);
        element.value = valueToSelect;
    }

    idname = "#top_tweets_table";
    var width_scale_factor = 1.0;
    var height_scale_factor = 0.60;
    var margin = {right:10, left:10, top:10, bottom:10};
    var bb = d3.select(idname).node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;

    div = document.getElementById("top_tweets_table");
    div.innerHTML = '';
    div = document.getElementById("table_title");
    div.innerHTML = '';
    id = document.getElementById("top_tweets_table");
    id.classList.remove("top_tweets_table");
    id = document.getElementById("table_title");
    id.classList.remove("table_title");

    show_top_tweets(init_account, idname, base_width, base_height);

    id = document.getElementById("top_tweets_table");
    id.classList.add("top_tweets_table");
    id = document.getElementById("table_title");
    id.classList.add("table_title");

}



function insert_row(data) {
    row_str =  '<tr>' +
                  '<td class="table_text">'+data["tweet"]+'</td>' +
                  '<td class="table_text">'+numberWithCommas(data["likes"])+'</td>' +
                  //'<td>'+data["created_at"]+'</td>' +
                '</tr>';
    return row_str;
}


function show_top_tweets(screen_name, idname, width, height) {

    var file = "data/most_liked/" + screen_name + ".csv";
    d3.text(file, function(data) {
        var parsedCSV = d3.csvParse(data);

        var div = document.getElementById("top_tweets_table");
        table_str = '<table class="table table-dark table_text" >' +
                          '<thead>' +
                            '<tr>' +
                              '<th scope="col">Tweet</th>' +
                              '<th scope="col">Likes</th>' +
                              //'<th scope="col">Tweeted on</th>' +
                            '</tr>' +
                          '</thead>' +
                          '<tbody>';

        for (var i=0; i<parsedCSV.length; i++) {
            row_str = insert_row(parsedCSV[i]);
            table_str += row_str;
        }
        div.innerHTML = table_str;


        // Add title 
        var name = parsedCSV[0]["name"];
        var followers_count = parsedCSV[0]["followers_count"];

        div = document.getElementById("table_title");
        div.innerHTML = '<div class="row table_title_text text-center justify-content-center">' +
            '<div class="col-4 profile_image">' +
              '<img src="'+ 'data/profile_images/' + screen_name + '_image.jpg' +'"></img>' +
            '</div>' +
            '<div class="col-8">' +
              '<div class="row">' +
                '<span class="table_title_name"><b>' + name + '</b></span>' +
              '</div>' +
              '<div class="row">' +
                '@' + screen_name +
              '</div>' +
              '<div class="row">' +
                'Followers: ' + Math.round(followers_count/1e6) + ' Million' +
              '</div>' +
            '</div>'+
          '</div>';

        /*
        //var container = d3.select("body")
        var container = d3.select(idname)
            .append("table")

            .selectAll("tr")
                .data(parsedCSV).enter()
                .append("tr")

            .selectAll("td")
                .data(function(d) { console.log(d); return d; }).enter()
                .append("td")
                .text(function(d) { return d; });
        */
    });

    

}