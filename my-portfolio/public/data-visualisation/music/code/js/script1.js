var scrolly = d3.select('#scrolly');
var figure = scrolly.select('figure');
var article = scrolly.select('article');
var step = article.selectAll('.step');
// initialize the scrollama
var scroller = scrollama();
// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.75);
    //step.style('height', stepH + 'px');
    if (window.innerWidth >= 768) {
        step.style('height', '5rem');
    } else if (window.innerWidth <= 350) { 
        step.style('height', '6rem');
    } else {
        step.style('height', '9rem');
    }
    //var figureHeight = Math.floor(window.innerHeight * 0.95);
    //var figureMarginTop = Math.floor(figureHeight / 2);
    var figureHeight = Math.floor(window.innerHeight / 2);
    var figureMarginTop = (window.innerHeight - figureHeight) / 2
    //var figureMarginTop = Math.floor(figureHeight / 2);
    figure
        .style('height', figureHeight + 'px')
        //.style('top', figureMarginTop + 'px');
        .style('top', '55%');
    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}
// scrollama event handlers
function handleStepEnter(response) {
    //console.log(response)
    // response = { element, direction, index }
    // add color to current step only
    step.classed('is-active', function (d, i) {
        return i === response.index;
    })
    // update graphic based on step
    //figure.select('p').text(response.index + 1);
    var val = response.index + 1;
    handleStepTransition(val);
}
function setupStickyfill() {
    d3.selectAll('.sticky').each(function () {
        Stickyfill.add(this);
    });
}

function handleContainerExit(response) {
    // response = { direction }
    // old school
    // un-sticky the graphic, and pin to top/bottom of container
    figure.classed('is-fixed', false);
    figure.classed('is-bottom', response.direction === 'down');

    div = document.getElementById("text1");
    div.innerHTML = '';
    //d3.select("#graphic1").select("svg").remove();
}

function handleStepTransition(data_step_id) {

    
    //if ((data_step_id!=7) && (data_step_id!=10)) {
        // Clear earlier graphic and text
        d3.select("#text1").select("svg").remove();
        div = document.getElementById("text1");
        div.innerHTML = '';
        //$('#text1').empty();
    //}
    
    button_icon_size = "20";

    //Set z-index
    if (data_step_id==3 || data_step_id==5 || data_step_id==6 || data_step_id==7 || data_step_id==12) {
        set_zindex('figure', 'zindex_10', 'zindex_0');
    } else {
        set_zindex('figure', 'zindex_0', 'zindex_10');
    }

    //if ((data_step_id!=7) && (data_step_id!=10)) {
    d3.select("#graphic1").select("svg").remove();
    d3.select("#graphic1_viz_frame_example1").select("svg").remove();
    d3.select("#graphic1_viz_frame_example2").select("svg").remove();
    d3.select("#graphic1_viz_frame_example3").select("svg").remove();
    d3.select("#graphic1_viz_frame_example4").select("svg").remove();

    //}

    if (data_step_id==1) {
        div = document.getElementById("text1");
        text = "";
        div.innerHTML = get_rhythm_definition(text);
        //div.innerHTML = `<button onclick="test_func()">Click me</button>`;
    } else if (data_step_id==2) {
        div = document.getElementById("text1");
        text = "Rhythm is the pattern of regular or irregular pulses caused in music "+
                "by the occurrence of strong and weak melodic and harmonic beats";
        div.innerHTML = get_rhythm_definition(text);
    } else if (data_step_id==3) {
        div = document.getElementById("text1");
        div.innerHTML = get_rhythm_definition_examples();
        add_button_icon("button_icon_1");
        add_button_icon("button_icon_2");
        add_button_icon("button_icon_3");
        //audio_onended([1,3]);
        audio_onended([1, 2, 3]);

    } else if (data_step_id==4) {
        div = document.getElementById("text1");
        text = "Rhythm is that music component that makes us move, and tap our foot, when we listen to a song";
        div.innerHTML = get_rhythm_definition(text);

    } else if (data_step_id==5) {
        text = ""; // "Rhythm pattern in first 10 seconds of Ed Sheeran's Shape of You";
        div = document.getElementById("text1");
        div_class="graphic_text";
        div.innerHTML = set_text(text, div_class);

        /*
        text = ""; //"The radius determines the pitch. Colors denote different notes present in the rhythm."+
        //"The on and off duration of the note are represented by the presence and absence of different colors";
        div = document.getElementById("graphic1_title");
        div_class="graphic1_title";
        div.innerHTML = set_text(text, div_class);
        */
        div = document.getElementById("text1");
        artist_name = "Ed Sheeran";
        song_name = "Shape of You";
        idname = "#graphic1_viz_frame_explainer";
        song_path = "data/rhythm_viz/Ed_Sheeran/Shape_of_you_trim.mp3";
        div.innerHTML = get_rhythm_viz_frame_explainer(artist_name, song_name, "graphic1_viz_frame_explainer",
                                             song_path, "song_player_5", "button_icon_5");

        //graphic: rhythm viz: Static
        csv_processed_file = "data/rhythm_viz/Ed_Sheeran/Shape_of_you_trim.csv";

        //d3.select(idname).select("svg").remove();
        var bb = d3.select(idname).node().offsetWidth;
        var minDeviceWidth = 375;
        var maxDeviceWidth = 1024;
        //var width_scale_factor = 0.30;
        //var height_scale_factor = 0.30;
        var width_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.40, 0.40]);
        width_scale_factor = width_scale_factor_width(bb);
        var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.40, 0.40]);
        height_scale_factor = height_scale_factor_width(bb);
        var margin = {right:10, left:10, top:10, bottom:10};
        base_width = bb*width_scale_factor; //- margin.left - margin.right;
        base_height = bb*height_scale_factor; //- margin.top - margin.bottom;

        var is_big_radius = 1;
        plot_rhythm_viz(idname, csv_processed_file, base_width, base_height, is_big_radius);

        button_id = 5;
        // On ended handler
        audio_onended([button_id]);
        // Button icon
        add_button_icon("button_icon_" + button_id);
        // Onclick transition handler
        rhythm_viz_transition_onclick([button_id], idname, base_width, is_big_radius);

    } else if ((data_step_id==6) || (data_step_id==7)) {

        //graphic: 4 songs: rhythm viz: d3 transition with music playing
        div = document.getElementById("text1");
        div.innerHTML = get_rhythm_viz_frame_examples();

        idname = "#graphic1_viz_frame_example1";
        d3.select(idname).select("svg").remove();
        csv_processed_file = "data/rhythm_viz/viz_csv_sample/Shape_of_you.csv";
        button_id_arr = [6];
        plot_rhythm_viz_top(idname, csv_processed_file, button_id_arr);
        //rhythm_viz_transition_onclick([6], idname);

        idname = "#graphic1_viz_frame_example2";
        d3.select(idname).select("svg").remove();
        csv_processed_file = "data/rhythm_viz/viz_csv_sample/Attention.csv";
        button_id_arr = [7];
        plot_rhythm_viz_top(idname, csv_processed_file, button_id_arr);
        //rhythm_viz_transition_onclick([7], idname);

        idname = "#graphic1_viz_frame_example3";
        d3.select(idname).select("svg").remove();
        csv_processed_file = "data/rhythm_viz/viz_csv_sample/Wake_me_up.csv";
        button_id_arr = [8];
        plot_rhythm_viz_top(idname, csv_processed_file, button_id_arr);
        //rhythm_viz_transition_onclick([8], idname);

        idname = "#graphic1_viz_frame_example4";
        d3.select(idname).select("svg").remove();
        csv_processed_file = "data/rhythm_viz/viz_csv_sample/Cheap_Thrills.csv";
        button_id_arr = [9];
        plot_rhythm_viz_top(idname, csv_processed_file, button_id_arr);
        //rhythm_viz_transition_onclick([9], idname);

        button_id_arr = [6, 7, 8, 9];
        audio_onended(button_id_arr);
        add_button_icon("button_icon_6");
        add_button_icon("button_icon_7");
        add_button_icon("button_icon_8");
        add_button_icon("button_icon_9");
    
    } 
    /*
    else if ((data_step_id==7)) {

        //graphic: 4 songs: rhythm viz: d3 transition with music playing
        div = document.getElementById("text1");
        div.innerHTML = get_rhythm_viz_frame_examples();

        idname = "#graphic1_viz_frame_example1";
        csv_processed_file = "data/rhythm_viz/viz_csv_sample/Shape_of_you.csv";
        button_id_arr = [6];
        plot_rhythm_viz_top(idname, csv_processed_file, button_id_arr);
        //rhythm_viz_transition_onclick([6], idname);

        idname = "#graphic1_viz_frame_example2";
        csv_processed_file = "data/rhythm_viz/viz_csv_sample/Attention.csv";
        button_id_arr = [7];
        plot_rhythm_viz_top(idname, csv_processed_file, button_id_arr);
        //rhythm_viz_transition_onclick([7], idname);

        idname = "#graphic1_viz_frame_example3";
        csv_processed_file = "data/rhythm_viz/viz_csv_sample/Wake_me_up.csv";
        button_id_arr = [8];
        plot_rhythm_viz_top(idname, csv_processed_file, button_id_arr);
        //rhythm_viz_transition_onclick([8], idname);

        idname = "#graphic1_viz_frame_example4";
        csv_processed_file = "data/rhythm_viz/viz_csv_sample/Cheap_Thrills.csv";
        button_id_arr = [9];
        plot_rhythm_viz_top(idname, csv_processed_file, button_id_arr);
        //rhythm_viz_transition_onclick([9], idname);

        button_id_arr = [6, 7, 8, 9];
        audio_onended(button_id_arr);
        add_button_icon("button_icon_6");
        add_button_icon("button_icon_7");
        add_button_icon("button_icon_8");
        add_button_icon("button_icon_9");
    } 
    */

    else if ((data_step_id==9) || (data_step_id==10)) {
        //Similarity score of songs
        //Measure of how close the rhythms in these songs are to Ed Sheeran's <em>Shape of You</em>
        //Backing our visual interpretation, the rhythms in Ed Sheeran's <em>Shape of You</em> and Sia's <em>Cheap Thrills</em>
        //are indeed remarkably similar.
        /*
        text = "How similar are songs rhythmically to Ed Sheeran's <em>Shape of You</em> ?";
        div = document.getElementById("graphic1_title");
        div_class="graphic_text";
        div.innerHTML = set_text(text, div_class);

        text = "Backing our visual interpretation, the rhythms in Ed Sheeran's <em>Shape of You</em> and Sia's <em>Cheap Thrills</em>"+
        " are indeed remarkably similar.";
        div = document.getElementById("graphic1_title");
        div_class="graphic1_title";
        div.innerHTML = set_text(text, div_class);
        */

        idname = "#text1";
        d3.select("#text1").select("svg").remove();
        var width_scale_factor = 0.70;
        
        //var width_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.40, 0.40]);
        //width_scale_factor = width_scale_factor_width(bb);
        //var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.50, 0.30]);
        //height_scale_factor = height_scale_factor_width(bb);

        //d3.select(idname).select("svg").remove();
        var bb = d3.select(idname).node().offsetWidth;
        base_width = bb*width_scale_factor; //- margin.left - margin.right;
        if (window.innerWidth >= 768) {
            var height_scale_factor = 0.40;
        } else {
            var height_scale_factor = 0.90;
        }
        base_height = bb*height_scale_factor; //- margin.top - margin.bottom;

        score_file = "data/similarity_score_example/similarity_score_example_all_songs.csv";
        song_file = "data/similarity_score_example/song_list_all_songs.csv";
        plot_score_explainer(idname, score_file, song_file, base_width, base_height);

    } else if (data_step_id==11) {
        div = document.getElementById("text1");
        div.innerHTML = '';
        //d3.select("#graphic1").select("svg").remove();

    } else if (data_step_id==12) {
        //graphic: 4 songs: rhythm viz: d3 transition with music playing
        div = document.getElementById("text1");
        div.innerHTML = get_rhythm_viz_frame_mashup_examples();

        idname = "#graphic1_viz_frame_mashup_example1";
        csv_processed_file = "data/rhythm_viz/viz_csv_sample/rhythm_ShapeOfYou_tune_CheapThrills.csv";
        button_id_arr = [10];
        plot_rhythm_viz_top(idname, csv_processed_file, button_id_arr);
        //rhythm_viz_transition_onclick([10], idname);

        idname = "#graphic1_viz_frame_mashup_example2";
        csv_processed_file = "data/rhythm_viz/viz_csv_sample/rhythm_ShapeOfYou_tune_Halo.csv";
        button_id_arr = [11];
        plot_rhythm_viz_top(idname, csv_processed_file, button_id_arr);
        //rhythm_viz_transition_onclick([11], idname);

        button_id_arr = [10, 11];
        audio_onended(button_id_arr);
        add_button_icon("button_icon_10");
        add_button_icon("button_icon_11");
    
    } else if (data_step_id==13) {
        div = document.getElementById("text1");
        div.innerHTML = '';
        //d3.select("#graphic1").select("svg").remove();
    }
}



function init() {
    setupStickyfill();
    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();
    // 2. setup the scroller passing options
    //      this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller.setup({
        step: '#scrolly article .step',
        offset: 0.80,
        debug: false,
    })
        .onStepEnter(handleStepEnter);
        //.onContainerExit(handleContainerExit);
    // setup resize event
    window.addEventListener('resize', handleResize);
}
// kick things off
init();

function set_zindex(id, add_class, remove_class) {
    document.getElementById(id).classList.remove(remove_class);
    document.getElementById(id).classList.add(add_class);
}

function get_rhythm_definition(text) {
    html_string = text;
    return html_string
}

function get_rhythm_definition_examples() {
    html_string=`<div class="row">
                    <div class="col-lg-4 col-4">
                        <div class="card" style="background-color:#d0d0d0; color:black;">
                            <img src="data/thumbnail/queen.jpg" class="card-img-top" style="padding: 10px;" alt="...">
                            <div class="card-body" style="padding-top:0;">
                                <div class="row card-text">
                                    <div class="col-lg-8 col-12" style="text-align: left;">
                                        <div class="row">
                                            <div class="col-lg-12 col-12 artist_name">
                                                Queen
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12 col-12 song_name">
                                                Rock You
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4 col-12" style="padding-top: 5px;">
                                        <audio id="song_player_1" src="data/rhythm_definition/trim/Rock_You.mp3"></audio>
                                        <button type="button" id="button_icon_1" onclick="song_play_pause_onclick(this.id)" class="btn btn-default btn-sm play_pause_button"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-4">
                        <div class="card" style="background-color:#d0d0d0; color:black;">
                            <img src="data/thumbnail/michael-jackson.jpg" class="card-img-top" style="padding: 10px;" alt="...">
                            <div class="card-body" style="padding-top:0;">
                                <div class="row card-text">
                                    <div class="col-lg-8" style="text-align: left;">
                                        <div class="row">
                                            <div class="col-lg-12 artist_name">
                                                Michael Jackson
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12 song_name">
                                                Beat It 
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4" style="padding-top: 5px;">
                                        <audio id="song_player_2" src="data/rhythm_definition/trim/Beat_It.mp3"></audio>
                                        <button type="button" id="button_icon_2" onclick="song_play_pause_onclick(this.id)" class="btn btn-default btn-sm play_pause_button"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-4">
                        <div class="card" style="background-color:#d0d0d0; color:black;">
                            <img src="data/thumbnail/Ed_Sheeran.jpg" class="card-img-top" style="padding: 10px;" alt="...">
                            <div class="card-body" style="padding-top:0;">
                                <div class="row card-text">
                                    <div class="col-lg-8" style="text-align: left;">
                                        <div class="row">
                                            <div class="col-lg-12 artist_name">
                                                Ed Sheeran
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12 song_name">
                                                Shape Of You 
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4" style="padding-top: 5px;">
                                        <audio id="song_player_3" src="data/rhythm_definition/trim/Shape_of_You.mp3"></audio>
                                        <button type="button" id="button_icon_3" onclick="song_play_pause_onclick(this.id)" class="btn btn-default btn-sm play_pause_button"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

    return html_string;
}

var minDeviceWidth = 375/2;
var maxDeviceWidth = 1024/2;
var radius_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([2.5, 6]);
var big_radius_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([4, 8]);
var play_radius_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([15, 36]);

function test_func() {
    alert("Clicked !");
}

function add_button_icon(id) {
    var icon_div = document.getElementById(id);
    icon_div.innerHTML = '<img width='+button_icon_size+' height='+button_icon_size+' src="data/volume/play_md.png"></img>';
}


function audio_onended(id_arr) {

    for (var i=0; i<id_arr.length; i++) {
        // On audio ended handler
        var audio_elem = document.getElementById('song_player_'+id_arr[i]);
        audio_elem.onended = function() {
            id = audio_elem.id.split("_")[2];
            audio_elem.currentTime = 0;
            var icon_div = document.getElementById("button_icon_"+id);
            icon_div.innerHTML = '<img width='+button_icon_size+' height='+button_icon_size+' src="data/volume/play_md.png"></img>';
        };
    }
}

function song_play_pause_onclick(id) {
    console.log(id);

    var audio_elem = document.getElementById('song_player_'.concat(id.split("_")[2]));
    var icon_div = document.getElementById(id);
    if (audio_elem.paused === true) {
        audio_elem.play();
        icon_div.innerHTML = '<img width='+button_icon_size+' height='+button_icon_size+' src="data/volume/pause_md.png"></img>';
    } else {
        audio_elem.pause();
        icon_div.innerHTML = '<img width='+button_icon_size+' height='+button_icon_size+' src="data/volume/play_md.png"></img>';
    }
}


function plot_rhythm_viz_top(idname, csv_processed_file, button_id_arr) {
    //graphic: rhythm viz: Static
    var margin = {right:10, left:10, top:10, bottom:10};
    //d3.select(idname).select("svg").remove();
    var bb = d3.select(idname).node().offsetWidth;
    
    //var width_scale_factor = 0.70;
    //var height_scale_factor = 0.70;
    var minDeviceWidth = 375;
    var maxDeviceWidth = 1024;
    var width_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.5, 0.5]);
    width_scale_factor = width_scale_factor_width(bb);
    var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.5, 0.5]);
    height_scale_factor = height_scale_factor_width(bb);
    base_width = bb*width_scale_factor; //- margin.left - margin.right;
    base_height = bb*height_scale_factor; //- margin.top - margin.bottom;

    var is_big_radius = 0;
    plot_rhythm_viz(idname, csv_processed_file, base_width, base_height, is_big_radius);
    rhythm_viz_transition_onclick(button_id_arr, idname, base_width, is_big_radius);
}

function get_rhythm_viz_frame_examples() {

    html_string = `<div class="row" style="margin-top:50px;">
            <div class="col-lg-6 col-6">` + get_rhythm_viz_frame("Ed Sheeran", "Shape of You", "graphic1_viz_frame_example1", "data/rhythm_viz/mp3/Shape_of_you.mp3", "song_player_6", "button_icon_6") + `</div>
            <div class="col-lg-6 col-6">` + get_rhythm_viz_frame("Charlie Puth", "Attention", "graphic1_viz_frame_example2", "data/rhythm_viz/mp3/Attention.mp3", "song_player_7", "button_icon_7") + `</div>
        </div>
        <div class="row" style="margin-top:30px;">
            <div class="col-lg-6 col-6">` + get_rhythm_viz_frame("Avicii", "Wake me up", "graphic1_viz_frame_example3", "data/rhythm_viz/mp3/Wake_me_up.mp3", "song_player_8", "button_icon_8") + `</div>
            <div class="col-lg-6 col-6">` + get_rhythm_viz_frame("Sia", "Cheap Thrills", "graphic1_viz_frame_example4", "data/rhythm_viz/mp3/Cheap_Thrills.mp3", "song_player_9", "button_icon_9") + `</div>
    </div>`;

    return html_string;
}

function get_rhythm_viz_frame_mashup_examples() {

    html_string = `<div class="row">
        <div class="col-lg-6 col-6">` + get_rhythm_viz_frame("Rhythm: Shape of You", "Tune: Cheap Thrills", "graphic1_viz_frame_mashup_example1", "data/rhythm_viz/mp3/rhythm_ShapeOfYou_tune_CheapThrills.mp3", "song_player_10", "button_icon_10") + `</div>
        <div class="col-lg-6 col-6">` + get_rhythm_viz_frame("Rhythm: Shape of You", "Tune: Halo", "graphic1_viz_frame_mashup_example2", "data/rhythm_viz/mp3/rhythm_ShapeOfYou_tune_Halo.mp3", "song_player_11", "button_icon_11") + `</div>
    </div>`;

    return html_string;
}


function get_rhythm_viz_frame_explainer(artist_name, song_name, frame_id, song_path, audio_id, button_id) {
    html_string = `<div class="row text-center justify-content-center">
        <div class="col-lg-10 card rhythm_viz_frame_top " style="background-color: #d0d0d0;">
            <div class="card-header">
                <div class="row rhythm_viz_frame_title">
                    <div class="col-lg-12">
                        <span class="">Rhythm pattern in first 10 seconds of Ed Sheeran's Shape of You</span>
                        <!--
                        <div class="artist_name">` + artist_name + `</div>
                        <div class="song_name">` + song_name + `</div>
                        -->
                        <audio id=` + audio_id + ` src=` + song_path + `></audio>
                        <button type="button" id=` + button_id + ` class="btn btn-default btn-sm play_pause_button"></button>
                    </div>
                </div>
                <div class="row rhythm_viz_frame_subtitle rhythm_pattern_features">
                    <div class="col-lg-12">
                        Each note in the song is shown as a circle. The pitch of the note determines the
                        distance of the circle from center. The colors denote the various notes present
                        in the song. The space between the circles are based on the on and off duration
                        of the notes. Together these features constitute a rhythm pattern.
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div id=`+frame_id+` style="background-color: black;"></div>
                    </div>
                </div>           
            </div>
        </div>
    </div>`;

    return html_string
}

function get_rhythm_viz_frame(artist_name, song_name, frame_id, song_path, audio_id, button_id) {
    html_string = `<div class="row text-center justify-content-center">
        <div class="col-lg-10 card" style="background-color: #d0d0d0;">
            <div class="card-header">
                <div class="row rhythm_viz_frame_title">
                    <!--
                    <div class="col-lg-4 artist_name">` + artist_name +`</div>
                    <div class="col-lg-4 song_name">` + song_name +`</div>
                    <div class="col-lg-4">
                        <audio id=` + audio_id + ` src=` + song_path + `></audio>
                        <button type="button" id=` + button_id + ` class="btn btn-default btn-sm play_pause_button"></button>
                    </div>
                    -->
                    <div class="col-lg-8" style="text-align: left;">
                        <div class="row">
                            <div class="col-lg-12 artist_name">`
                                +artist_name+
                            `</div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12 song_name">`
                                +song_name+ 
                            `</div>
                        </div>
                    </div>
                    <div class="col-lg-4" style="padding-top: 5px;">
                        <audio id=` + audio_id + ` src=` + song_path + `></audio>
                        <button type="button" id=` + button_id + ` class="btn btn-default btn-sm play_pause_button"></button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div id=`+frame_id+` style="background-color: black;"></div>
                    </div>
                </div>           
            </div>
        </div>
    </div>`;

    return html_string
}

function rhythm_viz_transition_onclick(button_id_arr, frame_id, width, is_big_radius) {
    for (var i=0; i<button_id_arr.length; i++) {
        button_id = button_id_arr[i];
        btn = document.getElementById("button_icon_" + button_id);
        btn.onclick = function() {
            transition_play_pause_onclick(this.id, frame_id, width, is_big_radius);
        }
    }
}

function transition_play_pause_onclick(id, frame_id, width, is_big_radius) {
    var audio_elem = document.getElementById('song_player_'.concat(id.split("_")[2]));
    var icon_div = document.getElementById(id);
    if (audio_elem.paused === true) {
        icon_div.innerHTML = '<img width='+button_icon_size+' height='+button_icon_size+' src="data/volume/pause_md.png"></img>';

        time_already_played = audio_elem.currentTime;
        audio_elem.play();

        d3.select(frame_id).select("svg").selectAll("circle").filter(".notes")
            .attr('r', function (d) {
                if (is_big_radius==1) {
                    return big_radius_width(width);
                } else {
                    return radius_width(width);
                }
            }) //return d.pitch/50 })
            //.style("opacity", 0.5)
            .transition()
                .delay(function(d, i) {
                    if (time_already_played > d.note_start_secs) {
                        return 1e6;
                    } else {
                        return (d.note_start_secs-time_already_played)*1000;
                    }
                })
                //.style("opacity", 1)
                .duration(function(d, i) { return d.note_duration_secs/2*1000; })
                .attr('r', play_radius_width(width))
            .transition()
                .duration(function(d, i) { return d.note_duration_secs/2*1000; })
                //.style("opacity", 0.5);
                .attr('r', function(d) {
                    if (is_big_radius==1) {
                        return big_radius_width(width);
                    } else {
                        return radius_width(width);
                    }
                });

    } else {
        audio_elem.pause();
        icon_div.innerHTML = '<img width='+button_icon_size+' height='+button_icon_size+' src="data/volume/play_md.png"></img>';
        d3.select(frame_id).select("svg").selectAll("circle").interrupt();
    }
}

function set_text(text, div_class) {
    return '<div class=' + div_class + '>' + text + '</div>';
}

function plot_rhythm_viz(idname, csv_processed_file, width, height, is_big_radius) {

    //d3.select(idname).select("svg").remove();

    d3.csv(csv_processed_file, function (data) {

        // Scales
        //var colorScale = ["#0000ff", "#ff0000", "#ffe119"]; //d3.scale.category20()
        var colorScale = ["#0000ff", "#ff0000", "#f3cd05"]; //d3.scale.category20()
        //var colorScale = ["#0444bf", "#ff0000", "#f3cd05"]; //Blue alternative: 0444bf
        //var colorScale = ["#4363d8", "#e6194B", "#ffe119"]; //d3.scale.category20()
        //var pitchScale = d3.scaleLinear().domain([10, 110]).range([0, 1]);
        var pitchScale = d3.scaleLinear().domain([35, 80]).range([0, 1]);
        var radiusScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
        var margin = {right:10, left:10, top:10, bottom:10};
        var c_tones = [36, 48, 60, 72,];
        


        data.forEach(function(d) {
            d.pitch = +d.pitch;
            d.theta = +d.theta;
            d.cx = pitchScale(d.pitch) * Math.sin(d.theta);
            d.cy = pitchScale(d.pitch) * Math.cos(d.theta);
            //d.cx = +d.cx;
            //d.cy = +d.cy;
            d.note_duration_secs = +d.note_duration_secs;
            d.note_start_secs = +d.note_start_secs;
        });

        var xScale = d3.scaleLinear()
          .domain([
            d3.min(data,function (d) { return d.cx; }),
            d3.max(data,function (d) { return d.cx; })
            ])
          .range([0, width]);
        var yScale = d3.scaleLinear()
          .domain([
            d3.min(data,function (d) { return d.cy; }),
            d3.max(data,function (d) { return d.cy; })
            ])
          .range([height, 0]);
        // SVG
        var svg = d3.select(idname).append('svg')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right)
          .append('g')
            .attr('transform','translate(' + margin.left + ',' + margin.top + ')');
            //.attr('transform','translate(' + 100 + ',' + 100 + ')')
            
        // Circles
        var circles = svg.selectAll('circle')
            .data(data)
            .enter()
          .append('circle')
            .attr('class', 'dot')
            .attr('class', 'notes')
            .attr('cx',function (d) { return xScale(d.cx); })
            .attr('cy',function (d) { return yScale(d.cy); })
            .attr('r', function (d) {
                if (is_big_radius==1) {
                    return big_radius_width(width);
                } else {
                    return radius_width(width);
                }
            }) //return d.pitch/50 })
            //.attr('cx',function (d) { return xScale(d.start_secs) })
            //.attr('cy',function (d) { return yScale(d.pitch) })
            //.attr('r','4')
            .attr('stroke','white')
            .attr('stroke-width',0.25)
            .attr('fill',function (d,i) { return colorScale[d.note]; })
            .style("opacity", 1);

        for(var i=0; i<c_tones.length; i++) {
            var c_circles = svg.append('circle')
                    .attr('class', 'dot')
                    .attr('class', 'c_tones')
                    .attr('cx', xScale(radiusScale(0)))
                    .attr('cy', yScale(radiusScale(0)))
                    .attr('r', function(d) { return radiusScale(pitchScale(c_tones[i])); })
                    .attr('fill', 'none')
                    .attr('stroke', 'white')
                    .style("opacity", 0.5);
        }

    });
}

function plot_score_explainer(idname, score_file, song_file, width, height) {
    var margin = {right:70, left:20, top:50, bottom:70};

    var song_list = [];
    d3.csv(song_file, function (data) {
        song_list = data;

    d3.csv(score_file, function (data) {
        data.forEach(function(d) {
            d.score = +d.score
        })
        scores = data;
        
        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        //var xScale = d3.scaleLinear().domain(d3.extent(data, function(d) {return d.score} )).range([0, width]);
        var xScale = d3.scaleLinear().domain([0.2, 1.2]).range([0, width]);
        var colorScale = d3.scaleSequential(d3.interpolateRdYlGn);
        //var yScale = d3.scaleLinear().domain([]).range([height, 0]);
        var xAxis = d3.axisBottom(xScale);

        var simulation = d3.forceSimulation(data)
            .force("x", d3.forceX(function(d) { return xScale(d.score); }).strength(1))
            .force("y", d3.forceY(height / 2))
            //.force("center", d3.forceCenter( function(d) { return xScale(d.score), height/2; } ))
            //.force("center", d3.forceCenter( width/2, height/2 ))
            .force("collide", d3.forceCollide(8))
            .stop();
    
        for (var i = 0; i < 120; ++i) simulation.tick();

        var svg = d3.select(idname)
                    .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append('g')
                        .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

        var circles = svg.selectAll("circle")
                        .data(data.filter(function(d,i) {return i!=198;} ))
                        .enter()
                        .append("circle")
                            .attr("class", "dot")
                            //.attr("cx", function(d,i) { return xScale(d.score); })
                            //.attr("cy", function(d) { return height/2; })
                            .attr("cx", function(d) { return d.x; })
                            //.attr("cx", function(d) { return width/2; })
                            //.attr("cy", function(d) { return d.y; })
                            .attr("cy", function(d) { return 0; })
                            //.attr("cy", function(d) { return height/2; })
                            //.attr("r", function(d) { return 20; })
                            .attr("r", function(d) { return 0; })
                            .style("fill", function(d) { return colorScale(d.score); })
                            .transition()
                                //.delay(100)
                                .ease(d3.easeBounce)
                                .duration(2000)
                                .attr("cx", function(d) { return d.x; })
                                .attr("cy", function(d) { return d.y; })
                                .attr("r", function(d) { return "0.15rem"; })
                                .style("fill", function(d) { return colorScale(d.score); });

        var text = svg.selectAll(".text")
                    .data(data.filter(function(d,i) {return i!=0;} ))
                    .enter()
                    .append("text")
                    //.attr("class", "song_name_labels")
                    .attr("x", function(d) { return d.x-10; })
                    .attr("y", function(d) { return d.y-5; })
                    .style("font-size", "0.75rem")
                    .text(function(d,i) { return "";} )
                        .transition()
                            .delay(1500)
                            .attr("x", function(d) { return d.x-10; })
                            .attr("y", function(d) { return d.y-5; })
                            .text(function(d,i) {
                                //if (d.index==223) {
                                if ( ( (d.score < 0.3) || (d.score > 0.9)) && (d.index!=198)) {
                                    //console.log(song_list[i].song.split("_").join(" "));
                                    return song_list[d.index].song.split("_").join(" ");
                                } else {
                                    return "";
                                }
                            })
                            //.text(function(d,i) { return fit_text_in_circle(song_list[i].song); })
                            .style("fill", "white");


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis
                .tickSize(4)
                .tickPadding(6))
            .style("stroke", "white")
            .style("fill", "white")
            .style("font-size", 8)
          .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Similarity score")
            .attr("fill", "white")
            .style("font-size", "0.75rem")
            .attr("stroke", "none");


    //Rhythms similar to Shape of You              
    svg.append("line")
      .attr("x1", width/2+20)
      .attr("y1", height+40)
      .attr("x2", width)
      .attr("y2", height+40)
      .attr("stroke-width", 1)
      .attr("stroke", "white")
      .attr("marker-end", "url(#triangle)");

    svg.append("svg:defs").append("svg:marker")
      .attr("id", "triangle")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", "1rem")
      .attr("markerHeight", "1rem")
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "white");

    svg.append("text")
        .attr("x", width/2+40)
        .attr("y", height+60)
        .attr("class", "similarity_score_example_legend")
        .text("Rhythms more similar to Shape of You")
        .style("fill", "white")
        .style("font-weight", "bold");

    //Rhythms different from Shape of You              
    svg.append("line")
      .attr("x1", width/2-20)
      .attr("y1", height+40)
      .attr("x2", 0)
      .attr("y2", height+40)
      .attr("stroke-width", 1)
      .attr("stroke", "white")
      .attr("marker-end", "url(#triangle)");

    svg.append("svg:defs").append("svg:marker")
      .attr("id", "triangle")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", "1rem")
      .attr("markerHeight", "1rem")
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "white");

    svg.append("text")
        .attr("x", 40)
        .attr("y", height+60)
        .attr("class", "similarity_score_example_legend")
        .text("Rhythms different from Shape of You")
        .style("fill", "white")
        .style("font-weight", "bold");

    })

    });
    
}

function plot_example_song_score_legend_top() {
    idname = "#example_song_similarity_scores_legend";
    var bb = d3.select(idname).node().offsetWidth;
    var width_scale_factor = 1.0;
    var margin = {top: 30, right: 10, bottom: 10, left: 10};
    base_width = bb*width_scale_factor - margin.left - margin.right;
    var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.35, 0.15]);
    var height_scale_factor = height_scale_factor_width(bb);
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    var shape_width_factor = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([10, 5]);
    shape_width = shape_width_factor(bb);
    var colorScale = d3.scaleSequential(d3.interpolateRdYlGn);
    plot_score_legend(idname, base_width, base_height, shape_width, colorScale);
}

function plot_example_song_score_legend(idname, width, height, shapeWidth, colorScale) {
    var svg = d3.select(idname).append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
         .attr("class", "legendLinear")
         .attr("transform", "translate(0,0)");

        var legendLinear = d3.legendColor()
          .shapeWidth(shapeWidth)
          .cells(8)
          .orient('horizontal')
          .scale(colorScale);

        svg.select(".legendLinear")
          .call(legendLinear)
          .style("font-size", "0.6rem")
          .style("fill", "none");
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
