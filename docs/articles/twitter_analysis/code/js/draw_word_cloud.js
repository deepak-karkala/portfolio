function setup_dropdown_cloud() {
    var users = ["katyperry", "justinbieber", "BarackObama", "rihanna", "taylorswift13",
                 "ladygaga", "TheEllenShow", "Cristiano", "YouTube", "jtimberlake", "ArianaGrande",
                 "KimKardashian", "realDonaldTrump", "selenagomez", "britneyspears", "twitter",
                 "cnnbrk", "shakira", "jimmyfallon", "BillGates", "narendramodi", "JLo",
                 "neymarjr", "BrunoMars", "KingJames", "Oprah", "MileyCyrus", "CNN", "NiallOfficial",
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

    for (i=0; i<users.length; i++){
       option += '<option value="'+ users[i] + '">' + users[i] + '</option>';
    }

    init_account = "TheEllenShow";
    $('#select_cloud').append(option);
    selectElement("select_cloud", init_account);

    function selectElement(id, valueToSelect) {
        var element = document.getElementById(id);
        element.value = valueToSelect;
    }

    div = document.getElementById("word_cloud");
    div.innerHTML = '';
    div = document.getElementById("word_cloud_title");
    div.innerHTML = '';

    div = document.getElementById("word_cloud");
    div.innerHTML = '<span class="word_cloud_image text-center justify-content-center"><img src="data/word_cloud/'+init_account+'.png"></img></span>';
}