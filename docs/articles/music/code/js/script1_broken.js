(function() {
    // using d3 for convenience
    var container = d3.select('#scroll1');
    var graphic = container.select('.scroll__graphic1');
    var text = container.select('.scroll__text1');
    var step = text.selectAll('.step1');
    // initialize the scrollama
    var scroller = scrollama();
    // generic window resize listener event
    function handleResize() {
        // 1. update height of step elements
        var stepHeight = Math.floor(window.innerHeight * 0.15);
        //step.style('height', stepHeight + 'px');
        step.style('height', '5rem');
        // 2. update width/height of graphic element
        var bodyWidth = d3.select('body').node().offsetWidth;
        var graphicMargin = 16 * 4;
        var textWidth = text.node().offsetWidth;
        
        var graphicWidth = container.node().offsetWidth - textWidth - graphicMargin;
        containerWidth = container.node().offsetWidth;
        if (0) { //(containerWidth > 770) {
            graphicWidth = containerWidth - textWidth - graphicMargin;
        } else {
            graphicWidth = containerWidth - graphicMargin;
        }

        var graphicHeight = Math.floor(window.innerHeight * 0.95);
        var graphicMarginTop = Math.floor(graphicHeight / 2);
        graphic
            .style('width', graphicWidth + 'px')
            .style('height', graphicHeight + 'px');
        // 3. tell scrollama to update new element dimensions
        scroller.resize();
    }
    // scrollama event handlers
    function handleStepEnter(response) {
        var el = d3.select(response.element);
        var val = el.attr('data-step');
        // response = { element, direction, index }
        // add color to current step only
        step.classed('is-active', function (d, i) {
            return i === response.index;
        });
        // update graphic based on step
        graphic.select('p').text(response.index + 1);
        handleStepTransition(val);
    }
    function handleContainerEnter(response) {
        // response = { direction }
        // old school
        // sticky the graphic
        graphic.classed('is-fixed', true);
        graphic.classed('is-bottom', false);
    }
    function handleContainerExit(response) {
        // response = { direction }
        // old school
        // un-sticky the graphic, and pin to top/bottom of container
        graphic.classed('is-fixed', false);
        graphic.classed('is-bottom', response.direction === 'down');
    }
    function handleStepProgress(response) {
        //console.log(response);
        var el = d3.select(response.element);
        
        var val = el.attr('data-step');
        var rgba = 'rgba(' + val + ', ' + response.progress + ')';
        el.style('background-color', rgba);
        el.select('.progress').text(d3.format('.1%')(response.progress));

    }
    function handleStepTransition(data_step_id) {
        // Clear earlier graphic and text
        div = document.getElementById("text1");
        div.innerHTML = '';
        div = document.getElementById("graphic1_title");
        div.innerHTML = '';
        div = document.getElementById("graphic1_outer_frame");
        div.innerHTML = '';
        //div = document.getElementById("graphic1_viz");
        //div.innerHTML = '';
        d3.select("#graphic1").select("svg").remove();

        button_icon_size = "20";

        if (data_step_id==1) {
            div = document.getElementById("text1");
            text = "Rhythm is the pattern of regular or irregular pulses caused in music "+
                    "by the occurrence of strong and weak melodic and harmonic beats";
            div.innerHTML = get_rhythm_definition(text);

        } else if (data_step_id==2) {
            div = document.getElementById("text1");
            div.innerHTML = get_rhythm_definition_examples();
            add_button_icon("button_icon_1");
            //add_button_icon("button_icon_2");
            //add_button_icon("button_icon_3");
            //add_button_icon("button_icon_4");
            
            //audio_onended([1, 2, 4]);
            audio_onended([1]);
        } else if (data_step_id==3) {
            div = document.getElementById("text1");
            text = "Rhythm is that music component that makes us move, and tap our foot, when we listen to a song";
            div.innerHTML = get_rhythm_definition(text);
            
        } else if (data_step_id==4) {

            text = "Rhythm pattern in first 10 seconds of Ed Sheeran's Shape of You";
            div = document.getElementById("text1");
            div_class="graphic_text";
            div.innerHTML = set_text(text, div_class);

            text = "The radius determines the pitch. Colors denote different notes present in the rhythm."+
            "The on and off duration of the note are represented by the presence and absence of different colors";
            div = document.getElementById("graphic1_title");
            div_class="graphic1_title";
            div.innerHTML = set_text(text, div_class);

            div = document.getElementById("graphic1_outer_frame");
            artist_name = "Ed Sheeran";
            song_name = "Shape of You";
            idname = "#graphic1_viz_frame_explainer";
            song_path = "data/rhythm_viz/Ed_Sheeran/Shape_of_you_trim.mp3";
            div.innerHTML = get_rhythm_viz_frame(artist_name, song_name, "graphic1_viz_frame_explainer",
                                                 song_path, "song_player_5", "button_icon_5");

            //graphic: rhythm viz: Static
            csv_processed_file = "data/rhythm_viz/Ed_Sheeran/Shape_of_you_trim.csv";

            var width_scale_factor = 0.70;
            var height_scale_factor = 0.70;
            var margin = {right:10, left:10, top:10, bottom:10};

            d3.select(idname).select("svg").remove();
            var bb = d3.select(idname).node().offsetWidth;
            base_width = bb*width_scale_factor; //- margin.left - margin.right;
            base_height = bb*height_scale_factor; //- margin.top - margin.bottom;

            plot_rhythm_viz(idname, csv_processed_file, base_width, base_height);

            button_id = 5;
            // On ended handler
            audio_onended([button_id]);
            // Button icon
            add_button_icon("button_icon_" + button_id);
            // Onclick transition handler
            rhythm_viz_transition_onclick([button_id], idname);

        } else if (data_step_id==6 || data_step_id==7) {

            if (data_step_id==7) {
                text = "Notice how similar Ed Sheeran's <em>Shape of You</em> and Sia's <em>Cheap Thrills</em> are visually";
                div = document.getElementById("text1");
                div_class="graphic_text";
                div.innerHTML = set_text(text, div_class);
            }

            //graphic: 4 songs: rhythm viz: d3 transition with music playing
            div = document.getElementById("graphic1_outer_frame");
            div.innerHTML = get_rhythm_viz_frame_examples();

            idname = "#graphic1_viz_frame_example1";
            csv_processed_file = "data/rhythm_viz/viz_csv/Shape_of_you.csv";
            plot_rhythm_viz_top(idname, csv_processed_file);
            rhythm_viz_transition_onclick([6], idname);

            idname = "#graphic1_viz_frame_example2";
            csv_processed_file = "data/rhythm_viz/viz_csv/Attention.csv";
            plot_rhythm_viz_top(idname, csv_processed_file);
            rhythm_viz_transition_onclick([7], idname);

            idname = "#graphic1_viz_frame_example3";
            csv_processed_file = "data/rhythm_viz/viz_csv/Wake_me_up.csv";
            plot_rhythm_viz_top(idname, csv_processed_file);
            rhythm_viz_transition_onclick([8], idname);

            idname = "#graphic1_viz_frame_example4";
            csv_processed_file = "data/rhythm_viz/viz_csv/Cheap_Thrills.csv";
            plot_rhythm_viz_top(idname, csv_processed_file);
            rhythm_viz_transition_onclick([9], idname);

            button_id_arr = [6, 7, 8, 9];
            audio_onended(button_id_arr);
            add_button_icon("button_icon_6");
            add_button_icon("button_icon_7");
            add_button_icon("button_icon_8");
            add_button_icon("button_icon_9");
            

        } else if (data_step_id==8) {
            //Similarity score of songs
            //Measure of how close the rhythms in these songs are to Ed Sheeran's <em>Shape of You</em>
            //Backing our visual interpretation, the rhythms in Ed Sheeran's <em>Shape of You</em> and Sia's <em>Cheap Thrills</em>
            //are indeed remarkably similar.
            text = "How similar are songs rhythmically to Ed Sheeran's <em>Shape of You</em> ?";
            div = document.getElementById("text1");
            div_class="graphic_text";
            div.innerHTML = set_text(text, div_class);

            text = "Backing our visual interpretation, the rhythms in Ed Sheeran's <em>Shape of You</em> and Sia's <em>Cheap Thrills</em>"+
            " are indeed remarkably similar.";
            div = document.getElementById("graphic1_title");
            div_class="graphic1_title";
            div.innerHTML = set_text(text, div_class);
        
            idname = "#graphic1_outer_frame_full_width";
            var width_scale_factor = 0.70;
            var height_scale_factor = 0.50;

            d3.select(idname).select("svg").remove();
            var bb = d3.select(idname).node().offsetWidth;
            base_width = bb*width_scale_factor; //- margin.left - margin.right;
            base_height = bb*height_scale_factor; //- margin.top - margin.bottom;

            score_file = "data/similarity_score_example/similarity_score_example.csv";
            song_file = "data/similarity_score_example/song_list.csv";
            plot_score_explainer(idname, score_file, song_file, base_width, base_height);

        } else if (data_step_id==9) {
            //Rhythm of Shape of You, vocals of Cheap Thrills
            //Rhythm of Shape of You, vocals of ...
            //Clearly the scores are a good indication of similarity in rhythm patterns of songs.
            text = "Mashup: Rhythm of one song to tune of another song";
            div = document.getElementById("text1");
            div_class="graphic_text";
            div.innerHTML = set_text(text, div_class);

            text = "The rhythm of <em>Shape of You</em> fits perfectly to the tune of "+
            "<em>Cheap Thrills</em> but defintely not so to the tune of <em>Halo</em>";
            div = document.getElementById("graphic1_title");
            div_class="graphic1_title";
            div.innerHTML = set_text(text, div_class);
        
            //graphic: 4 songs: rhythm viz: d3 transition with music playing
            div = document.getElementById("graphic1_outer_frame");
            div.innerHTML = get_rhythm_viz_frame_mashup_examples();

            idname = "#graphic1_viz_frame_mashup_example1";
            csv_processed_file = "data/rhythm_viz/viz_csv/rhythm_ShapeOfYou_tune_CheapThrills.csv";
            plot_rhythm_viz_top(idname, csv_processed_file);
            rhythm_viz_transition_onclick([10], idname);

            idname = "#graphic1_viz_frame_mashup_example2";
            csv_processed_file = "data/rhythm_viz/viz_csv/rhythm_ShapeOfYou_tune_Halo.csv";
            plot_rhythm_viz_top(idname, csv_processed_file);
            rhythm_viz_transition_onclick([11], idname);

            button_id_arr = [10, 11];
            audio_onended(button_id_arr);
            add_button_icon("button_icon_10");
            add_button_icon("button_icon_11");
        }
    }

    function init() {
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();
        // 2. setup the scroller passing options
        // this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
            container: '#scroll1',
            graphic: '.scroll__graphic1',
            text: '.scroll__text1',
            step: '.scroll__text1 .step1',
            progress: 'true',
            debug: false,
            offset: 0.50,
        })
            .onStepEnter(handleStepEnter)
            .onContainerEnter(handleContainerEnter)
            .onContainerExit(handleContainerExit)
            .onStepProgress(handleStepProgress);
        // setup resize event
        window.addEventListener('resize', handleResize);
    }
    // kick things off
    init();

})();


function plot_rhythm_viz_top(idname, csv_processed_file) {
    //graphic: rhythm viz: Static
    var width_scale_factor = 0.70;
    var height_scale_factor = 0.70;
    var margin = {right:10, left:10, top:10, bottom:10};

    d3.select(idname).select("svg").remove();
    var bb = d3.select(idname).node().offsetWidth;
    base_width = bb*width_scale_factor; //- margin.left - margin.right;
    base_height = bb*height_scale_factor; //- margin.top - margin.bottom;

    plot_rhythm_viz(idname, csv_processed_file, base_width, base_height);
}

function get_rhythm_viz_frame_examples() {

    html_string = `<div class="row">
        <div class="col-lg-6">` + get_rhythm_viz_frame("Ed_Sheeran", "Shape of You", "graphic1_viz_frame_example1", "data/rhythm_viz/mp3/Shape_of_you.mp3", "song_player_6", "button_icon_6") + `</div>
        <div class="col-lg-6">` + get_rhythm_viz_frame("Charlie Puth", "Attention", "graphic1_viz_frame_example2", "data/rhythm_viz/mp3/Attention.mp3", "song_player_7", "button_icon_7") + `</div>
    </div>
    <div class="row">
        <div class="col-lg-6">` + get_rhythm_viz_frame("Avicii", "Wake me up", "graphic1_viz_frame_example3", "data/rhythm_viz/mp3/Wake_me_up.mp3", "song_player_8", "button_icon_8") + `</div>
        <div class="col-lg-6">` + get_rhythm_viz_frame("Sia", "Cheap Thrills", "graphic1_viz_frame_example4", "data/rhythm_viz/mp3/Cheap_Thrills.mp3", "song_player_9", "button_icon_9") + `</div>
    </div>`;

    return html_string;
}

function get_rhythm_viz_frame_mashup_examples() {

    html_string = `<div class="row">
        <div class="col-lg-6">` + get_rhythm_viz_frame("Ed Sheeran, Sia", "Shape of You, Cheap Thrills", "graphic1_viz_frame_mashup_example1", "data/rhythm_viz/mp3/rhythm_ShapeOfYou_tune_CheapThrills.mp3", "song_player_10", "button_icon_10") + `</div>
        <div class="col-lg-6">` + get_rhythm_viz_frame("Ed Sheeran, Beyonce", "Shape of You, Halo", "graphic1_viz_frame_mashup_example2", "data/rhythm_viz/mp3/rhythm_ShapeOfYou_tune_Halo.mp3", "song_player_11", "button_icon_11") + `</div>
    </div>`;

    return html_string;
}


function get_rhythm_viz_frame(artist_name, song_name, frame_id, song_path, audio_id, button_id) {
    html_string = `<div class="card mb-3" style="background-color: #d0d0d0;">
        <div class="card-header">
            <div class="artist_name">` + artist_name + `</div>
            <div class="song_name">` + song_name + `
            <audio id=` + audio_id + ` src=` + song_path + `></audio>
            <button type="button" id=` + button_id + ` class="btn btn-default btn-sm play_pause_button"></button>
            </div>
        </div>
        <div id=`+frame_id+` style="background-color: black;"></div>
    </div>`;

    return html_string
}

function rhythm_viz_transition_onclick(button_id_arr, frame_id) {
    for (var i=0; i<button_id_arr.length; i++) {
        button_id = button_id_arr[i];
        btn = document.getElementById("button_icon_" + button_id);
        btn.onclick = function() {
            transition_play_pause_onclick(this.id, frame_id);
        }
    }
}

function transition_play_pause_onclick(id, frame_id) {
    var audio_elem = document.getElementById('song_player_'.concat(id.split("_")[2]));
    var icon_div = document.getElementById(id);
    if (audio_elem.paused === true) {
        icon_div.innerHTML = '<img width='+button_icon_size+' height='+button_icon_size+' src="data/volume/pause_md.png"></img>';

        time_already_played = audio_elem.currentTime;
        audio_elem.play();

        d3.select(frame_id).select("svg").selectAll("circle").filter(".notes")
            .attr('r', function (d) { return 5; }) //return d.pitch/50 })
            .transition()
                .delay(function(d, i) {
                    if (time_already_played > d.note_start_secs) {
                        return 1e6;
                    } else {
                        return (d.note_start_secs-time_already_played)*1000;
                    }
                })
                .style("opacity", 1)
                .duration(function(d, i) { return d.note_duration_secs/2*1000; })
                .attr('r', 12)
            .transition()
                .duration(function(d, i) { return d.note_duration_secs/2*1000; })
                .style("opacity", 1)
                .attr('r', 5);

    } else {
        audio_elem.pause();
        icon_div.innerHTML = '<img width='+button_icon_size+' height='+button_icon_size+' src="data/volume/play_md.png"></img>';
        d3.select(frame_id).select("svg").selectAll("circle").interrupt();
    }
}


function plot_score_explainer(idname, score_file, song_file, width, height) {
    var margin = {right:100, left:60, top:0, bottom:80};

    var song_list = [];
    d3.csv(song_file, function (data) {
        song_list = data;
    });


    d3.csv(score_file, function (data) {
        data.forEach(function(d) {
            d.score = +d.score
        })
        scores = data;
        var xScale = d3.scaleLinear().domain(d3.extent(data, function(d) {return d.score} )).range([0, width]);
        var colorScale = d3.scaleSequential(d3.interpolateRdYlGn);
        //var yScale = d3.scaleLinear().domain([]).range([height, 0]);
        var xAxis = d3.axisBottom(xScale);

        var simulation = d3.forceSimulation(data)
            .force("x", d3.forceX(function(d) { return xScale(d.score); }).strength(1))
            .force("y", d3.forceY(height / 2))
            //.force("center", d3.forceCenter( function(d) { return xScale(d.score), height/2; } ))
            //.force("center", d3.forceCenter( width/2, height/2 ))
            .force("collide", d3.forceCollide(25))
            .stop();
    
        for (var i = 0; i < 120; ++i) simulation.tick();

        var svg = d3.select(idname)
                    .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append('g')
                        .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

        var circles = svg.selectAll("circle")
                        .data(data)
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
                                .attr("r", function(d) { return 20; })
                                .style("fill", function(d) { return colorScale(d.score); });

        var text = svg.selectAll(".text")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("x", function(d) { return d.x-5; })
                    .attr("y", function(d) { return d.y; })
                    .text(function(d,i) { return "";} )
                        .transition()
                            .delay(1500)
                            .attr("x", function(d) { return d.x-5; })
                            .attr("y", function(d) { return d.y; })
                            .text(function(d,i) { return song_list[i].song;} )
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
            .attr("stroke", "none");
    
    })
}


function plot_rhythm_viz(idname, csv_processed_file, width, height) {

    d3.csv(csv_processed_file, function (data) {

        // Scales
        //var colorScale = ["#0000ff", "#ff0000", "#ffe119"]; //d3.scale.category20()
        var colorScale = ["#0000ff", "#ff0000", "#f3cd05"]; //d3.scale.category20()
        //var colorScale = ["#0444bf", "#ff0000", "#f3cd05"]; //Blue alternative: 0444bf
        //var colorScale = ["#4363d8", "#e6194B", "#ffe119"]; //d3.scale.category20()
        var pitchScale = d3.scaleLinear().domain([10, 110]).range([0, 1]);
        var radiusScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
        var margin = {right:40, left:40, top:40, bottom:40};
        var c_tones = [48, 60, 72,];

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
            .attr('r', function (d) { return 5; }) //return d.pitch/50 })
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
                    .style("opacity", 0.25);
        }

    });
}



function get_rhythm_definition(text) {
    /*
    html_string = `<div class="container">
        <div class="row">
            <div class="col-lg-10" style="text-align:center; padding-top:10rem;">
                <span class="rhythm_definition">`+text+`
                </span>
            </div>
        </div>
    </div>`;
    */
    html_string = `<span class="rhythm_definition">`+text+`</span>`;
    return html_string
}

function set_text(text, div_class) {
    return '<div class=' + div_class + '>' + text + '</div>';
}

function get_rhythm_definition_examples() {
    html_string = `<div class="container rhythm_definition_examples">
        <div class="row rhythm_definition_examples">
            <div class="col-lg-4 col-4">
                <div class="card" style="background-color:#d0d0d0; color:black;">
                    <img src="data/thumbnail/queen.jpg" class="card-img-top" style="padding: 10px;" alt="...">
                    <div class="card-body" style="padding-top:0;">
                        <div class="row">
                            <div class="col-lg-8">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="artist_name">Queen</div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 song_name">
                                        Rock you
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4">
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
                        <div class="artist_name">Michael Jackson</div>
                        <div>
                            <span class="song_name">Beat It</span>
                            <audio id="song_player_2" src="data/rhythm_definition/trim/Beat_It.mp3"></audio>
                            <button type="button" id="button_icon_2" onclick="song_play_pause_onclick(this.id)" class="btn btn-default btn-sm play_pause_button"></button>
                        </div>
                    </div>
                </div>
            </div>`+
            /*
            <div class="col-lg-3 col-6">
                <div class="card" style="background-color:#d0d0d0; color:black;">
                    <img src="data/thumbnail/maroon-5.jpg" class="card-img-top" style="padding: 10px;" alt="...">
                    <div class="card-body" style="padding-top:0;">
                        <div class="artist_name">Maroon 5</div>
                        <div>
                            <span class="song_name">Moves like Jagger</span>
                            <audio id="song_player_3" src="data/rhythm_definition/trim/Moves_Like_Jagger.mp3"></audio>
                            <button type="button" id="button_icon_3" onclick="song_play_pause_onclick(this.id)" class="btn btn-default btn-sm play_pause_button"></button>
                        </div>
                    </div>
                </div>
            </div>
            */
            `<div class="col-lg-4 col-4">
                <div class="card" style="background-color:#d0d0d0; color:black;">
                    <img src="data/thumbnail/Ed_Sheeran.jpg" class="card-img-top" style="padding: 10px;" alt="...">
                    <div class="card-body" style="padding-top:0;">
                        <div class="artist_name">Ed Sheeran</div>
                        <div>
                            <span class="song_name">Shape of You</span>
                            <audio id="song_player_4" src="data/rhythm_definition/trim/Shape_of_You.mp3"></audio>
                            <button type="button" id="button_icon_4" onclick="song_play_pause_onclick(this.id)" class="btn btn-default btn-sm play_pause_button"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    
    //html_string = `<audio id="song_player_1" src="data/rhythm_definition/trim/Shape_of_You.mp3"></audio>
    //    <button type="button" id="button_icon_1" onclick="song_play_pause_onclick(this.id)" class="btn btn-default btn-sm play_pause_button"></button>`;

    

    html_string = `<audio id="song_player_1" src="data/rhythm_definition/trim/Rock_You.mp3"></audio>
        <button type="button" id="button_icon_1" onclick="song_play_pause_onclick(this.id)" class="btn btn-default btn-sm play_pause_button"></button>`;
    return html_string;
}

function add_button_icon(id) {
    var icon_div = document.getElementById(id);
    icon_div.innerHTML = '<img width='+button_icon_size+' height='+button_icon_size+' src="data/volume/play_md.png"></img>';
    //icon_div.innerHTML = '<img width=30 height='+button_icon_size+' src="data/volume/play_md.png"></img>';
    //icon_div.innerHTML = '<img width='+button_icon_size+' height="5px" src="data/volume/volume_dark.png"></img>';
}


function audio_onended(id_arr) {
    console.log(id_arr);

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

// Move nodes toward cluster focus.
function gravity(alpha) {
  return function(d) {
    d.y += (d.cy - d.y) * alpha;
    d.x += (d.cx - d.x) * alpha;
  };
}

// Resolve collisions between nodes.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

function fit_text_in_circle(text) {

    var words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
    if (!words[words.length - 1]) words.pop();
    if (!words[0]) words.shift();

    function measureWidth(text) {
      var context = document.createElement("canvas").getContext("2d");
      return context.measureText(text).width;
    }

    lineHeight = 12;
    targetWidth = Math.sqrt(measureWidth(text.trim()) * lineHeight);


    function get_wrap_text(words) {
      var line;
      var lineWidth0 = Infinity;
      var lines = [];
      for (var i = 0, n = words.length; i < n; ++i) {
        var lineText1 = (line ? line.text + " " : "") + words[i];
        var lineWidth1 = measureWidth(lineText1);
        if ((lineWidth0 + lineWidth1) / 2 < targetWidth) {
          line.width = lineWidth0 = lineWidth1;
          line.text = lineText1;
        } else {
          lineWidth0 = measureWidth(words[i]);
          //line = {width: lineWidth0, text: words[i]};
          line = words[i];
          lines.push(line);
        }
      }
      return lines;
    }
    wrap_text = get_wrap_text(words);

    function textRadius(lines) {
      var radius = 0;
      for (var i = 0, n = lines.length; i < n; ++i) {
        var dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight;
        var dx = lines[i].width / 2;
        radius = Math.max(radius, Math.sqrt(dx * dx  + dy * dy));
      }
      return radius;
    }
    radius = textRadius(wrap_text);

    return wrap_text;
}