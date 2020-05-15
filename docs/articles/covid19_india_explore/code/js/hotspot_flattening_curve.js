// Daily cases
idname = "#flattening_curve"
d3.select(idname).select("svg").remove();
filename = "data/statewise_daily_confirmed_with_growth_rate.csv";
type = "cases";
width_scale_factor = 0.85;
height_scale_factor = 0.35;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:120, left:10, top:20, bottom:30};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
plot_flattening_curve(idname, filename, base_width, base_height, type)

var state_name_list = ['Andaman-and-Nicobar-Islands', 'Andhra-Pradesh',
                       'Arunachal-Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
                       'Daman-and-Diu', 'Delhi', 'Dadra-and-Nagar-Haveli', 'Goa', 'Gujarat',
                       'Himachal-Pradesh', 'Haryana', 'Jharkhand', 'Jammu-and-Kashmir',
                       'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Maharashtra',
                       'Meghalaya', 'Manipur', 'Madhya-Pradesh', 'Mizoram', 'Nagaland',
                       'Odisha', 'Punjab', 'Puducherry', 'Rajasthan', 'Sikkim', 'Telangana',
                       'Tamil-Nadu', 'Tripura', 'Uttar-Pradesh', 'Uttarakhand', 'West-Bengal'];

var highlight_state_list = ["Delhi", "Maharashtra", "Kerala", "Rajasthan",
                            "Telangana", "Tamil-Nadu", "Madhya Pradesh"];
var growth_rate = [];
var current_cases = [];

function plot_flattening_curve(idname, filename, width, height, type) {

    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_flattening_curve")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    // gridlines in y axis function
    function make_y_gridlines() {   
        return d3.axisLeft(y).ticks(3)
    }

    //var x = d3.scaleTime().range([0, width]);
    var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    var yAxis = d3.axisRight()
                  .scale(y)
                  .ticks(4);

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");
          
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(idname).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // get the data
    d3.csv(filename, function(error, data) {
      if (error) throw error;

      /*
      data = data.filter(function(d,i) {
        month = new Date(d.date).getMonth();
        if (1) { //month>=3) { // Plot starting from April
          return 1;
        } else {
          return 0;
        }
      })
      */

      //var headers = d3.keys(data[0]);
      //var state_name_list = headers[headers.length - 2]
      

      

      var highlight_name_state_list = ["Delhi", "Maharashtra", "Kerala", "Rajasthan",
                                  "Telangana", "Tamil-Nadu"];

      
      // Load state topodata and add as layers
      for (var s=0; s<state_name_list.length; s++) {
          state_name = state_name_list[s];

          data.forEach(function(d, i) {
              if (i==data.length-2) {
                  current_cases[state_name] = +d[state_name];
              }
              if (i==data.length-1) {
                  growth_rate[state_name] = +d[state_name];
              }
          });
      }

      data = data.filter(function(d,i) {
        if (i==data.length-1) {
          return 0;
        } else {
          return 1;
        }
      });

      for (var s=0; s<state_name_list.length; s++) {
          state_name = state_name_list[s];
          // format the data
          data.forEach(function(d, i) {
              d.cases = +d[state_name];
              if ((s==0)) {
                d.date = parseTime(d.date);
              }
          });

          //console.log(data);
          // Scale the range of the data in the domains
          x.domain(data.map(function(d) {return d.date; }));
          //y.domain([0, d3.max(data, function(d) { return d.cases; })]);
          y.domain([0, 2000]);

          // define the line
          var valueline = d3.line()
              .x(function(d) {
                return x(d.date);
              })
              .y(function(d) {
                return y(d.cases);
              });

          if (highlight_name_state_list.includes(state_name)) {
          //if (state_name=="Maharashtra") {
            svg.selectAll(".text")
                  .data(data)
                .enter().append("text")
                  .attr("class", "chart_text")
                  .attr("x", function(d, i) {
                      return x(d.date);
                  })
                  .attr("y", function(d, i) {
                      return y(d.cases);
                  })
                  .text(function(d, i) {
                      if (i==data.length-1) {
                        return state_name;
                      } else {
                        return "";
                      }
                  })
                  .style("font-size", "0.75rem")
                  .style("opacity", 1.0);
          }

          // Add the valueline path.
          path = svg.append("path")
                    .data([data])
                    .attr("class", state_name+"_growth_rate_curve growth_rate_curve")
                    .attr("d", valueline)
                    .attr("fill", "none")
                    .attr("stroke-width", "2px")
                    .attr("stroke", function(d) {
                      return get_growth_color_discrete(growth_rate[state_name]);
                      //return get_growth_color_continuous(growth_rate[state_name]);
                    })
                    .attr("opacity", function(d) {
                        if (highlight_state_list.includes(state_name)) {
                            return 1;
                        } else {
                            return 0.1;
                        }
                    })
                    .on("mouseover", function(d, i) {
                          state_name = this.getAttribute("class").split("_growth_rate_curve")[0];

                          d3.selectAll(".growth_rate_curve").style("opacity", 0.1);
                          d3.selectAll(".circles").attr("opacity", 0.1);

                          d3.select(this).style('stroke-width', "4px").style("opacity", 1.0);
                          d3.selectAll("."+state_name+"_circles").attr("r", "0.25rem").attr("opacity", 1.0);

                            return tooltip.html(`<div class='well'>`+
                                                  `<span class="state_name text-center">`+state_name+`</span></br><span class="case_count_info">`+ current_cases[state_name] + `</span>` +
                                                ` Cases, currently doubling every <span class="case_count_info">`+ Math.round(growth_rate[state_name],0) +`</span> days</div>` )
                                          .style("visibility", "visible");
                        }
                    )
                    .on("mousemove", function(){
                        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                    })
                    .on("mouseout", function(d, i){
                        for (var j=0; j<state_name_list.length; j++) {
                            st_nm = state_name_list[j];
                            d3.select("."+st_nm+"_growth_rate_curve").style("opacity", function() {
                                if (highlight_state_list.includes(st_nm)) {
                                    return 1.0;
                                } else {
                                    return 0.1;
                                }
                            })
                            if (highlight_state_list.includes(st_nm)) {
                                d3.selectAll("."+st_nm+"_circles").attr("r", "0.15rem").attr("opacity", 1.0);
                            }
                        }

                        state_name = this.getAttribute("class").split("_growth_rate_curve")[0];
                        if (highlight_state_list.includes(state_name)) {
                            d3.select(this).style('stroke-width', "2px").style("opacity", 1.0);
                        } else {
                            d3.select(this).style('stroke-width', "2px").style("opacity", 0.1);
                        }
                        return tooltip.style("visibility", "hidden");

                    });


          if (highlight_state_list.includes(state_name)) {
              svg.selectAll(".dot")
                  .data(data)
                .enter().append("circle")
                  .attr("class", state_name+"_circles circles")
                  .attr("r", "0.15rem")
                  .attr("cx", function(d,i) { return x(d.date); })
                  .attr("cy", function(d,i) { return y(d.cases); })
                  .attr("fill", get_growth_color_discrete(growth_rate[state_name]))
                  .attr("opacity", 1);
          }
              
      }

      function get_growth_color_discrete(growth_rate) {
          var color_scale = d3.scaleSequential(d3.interpolatePlasma); //interpolateRdYlGn

          //console.log(growth_rate);

          if (growth_rate==-1000) {
              growth_color = color_scale(1);
          } else if ((growth_rate>=2) && (growth_rate<=4)) {
              growth_color = color_scale(0);
          } else if ((growth_rate>4) && (growth_rate<=6)) {
              growth_color = color_scale(0.2);
          } else if ((growth_rate>6) && (growth_rate<=10)) {
              growth_color = color_scale(0.4);
          } else if ((growth_rate>10) && (growth_rate<=14)) {
              growth_color = color_scale(0.6);
          } else if ((growth_rate>14) && (growth_rate<=30)) {
              growth_color = color_scale(0.8);
          } else {
              growth_color = color_scale(0.9);
          }
          return growth_color;
      }

      function get_growth_color_continuous(growth_rate) {
          var color_scale = d3.scaleSequential(d3.interpolateRdYlGn);
          if (growth_rate==-1000) {
              return color_scale(1);
          } else {
              var growth_normalised = d3.scaleLinear().domain([1, 30]).range([0, 1]);
              return color_scale(growth_normalised(growth_rate));
          }
      }

      var xAxis = d3.axisBottom()
                    .scale(x)
                    .tickFormat(d3.timeFormat("%B %e"))
                    .tickValues(x.domain().filter(function(d,i){ return !(i%3)}));

    /*
      var totalLength = path.node().getTotalLength();
      repeat();

        function repeat() {
            path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                  .duration(3000)
                  .ease(d3.easeLinear)
                  .attr("stroke-dashoffset", 0);
        }
    */
      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "label_histogram")
          .call(xAxis)
          .style("font-size", "0.75rem")
        .append("text")
          .attr("class", "label_histogram")
          .attr("x", width)
          .attr("y", -40)
          .style("text-anchor", "end")
          .style("fill", "black")
          .style("font-size", "0.75rem");

      // add the y Axis
      svg.append("g")
          .attr("class", "label_histogram axis--y")
          .attr("transform", "translate("+(width+margin.right-40)+",0)")
          .call(yAxis)
          .style("font-size", "0.75rem")
        .append("text")
          .attr("class", "label_histogram")
          .attr("transform", "rotate(-90)")
          .attr("x", 0)
          .attr("y", -5)
          .style("text-anchor", "end")
          .text(function(){
            if (type=="cases") {
              return "Total cases";
            } else {
              return "Daily deaths";
            }
          })
          .style("fill", "black")
          .style("font-size", "0.75rem");

/*
      var color_scale = d3.scaleSequential(d3.interpolatePlasma);

      var linear = d3.scaleOrdinal()
        .domain([2, 4, 6, 10, 14, 30])
        .range([color_scale(0), color_scale(0.2), color_scale(0.4), color_scale(0.6), color_scale(0.8), color_scale(0.9)]);

      svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(0,10)");

      var legendLinear = d3.legendColor()
        .shapeWidth(20)
        .shapeHeight(10)
        .cells([2, 4, 6, 10, 14, 30])
        .orient('horizontal')
        .scale(linear);

      svg.select(".legendLinear")
        .call(legendLinear);
        
      svg.append("text")
          .attr("x", 0)
          .attr("y", 0)
          .text("Current doubling time (in days)");
*/
      /*
      // add the Y gridlines
      svg.append("g")     
          .attr("class", "grid")
          .call(make_y_gridlines()
              .tickSize(-width)
              .tickFormat("")
          );
      */

      svg.selectAll("text")
        .attr("class", "label")
        .style("fill", "black")
        .style("shape-rendering", "crispEdges");

      /*
      svg.selectAll("path")
        .style("stroke", "black")
        .style("font-size", "0.75rem");
      */
      svg.selectAll("line")
        .style("stroke", "black")
        .style("font-size", "0.75rem")
        .style("visibility", "hidden");

    });

}




function set_select_state_flattening_curve() {
    var state_name_list = ['Andaman-and-Nicobar-Islands', 'Andhra-Pradesh',
                             'Arunachal-Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
                             'Daman-and-Diu', 'Delhi', 'Dadra-and-Nagar-Haveli', 'Goa', 'Gujarat',
                             'Himachal-Pradesh', 'Haryana', 'Jharkhand', 'Jammu-and-Kashmir',
                             'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Maharashtra',
                             'Meghalaya', 'Manipur', 'Madhya-Pradesh', 'Mizoram', 'Nagaland',
                             'Odisha', 'Punjab', 'Puducherry', 'Rajasthan', 'Sikkim', 'Telangana',
                             'Tamil-Nadu', 'Tripura', 'Uttar-Pradesh', 'Uttarakhand', 'West-Bengal'];
    var state_list = '';
    for (var i=0; i<state_name_list.length; i++) {
        state_list += `<option value="`+state_name_list[i]+`">`+state_name_list[i]+`</option>`;
    }
    $('#viz_combobox').append(state_list);
}
set_select_state_flattening_curve();

$("#viz_combobox").change(function() {
    state_name = this.value;
    if ((state_name=="all") || (state_name=="")) {
      show_all_states_flattening_curve_button_click_handler();
      what_to_look_for_container = document.getElementById("what_to_look_for_container");
                        what_to_look_for_container.innerHTML = `<span class="what_to_look_for_title">Watch out for</span>: Flatter the curves, slower is the growth rate of cases. States like Kerala, Telangana have flattened the curves significantly over the past weeks.`;
    } else {
      d3.selectAll(".growth_rate_curve").style("opacity", 0.1);
      d3.selectAll(".circles").attr("opacity", 0.1);
      d3.select("."+state_name+"_growth_rate_curve").style('stroke-width', "4px").style("opacity", 1.0);
      d3.selectAll("."+state_name+"_circles").attr("r", "0.25rem").attr("opacity", 1.0);

      what_to_look_for_container = document.getElementById("what_to_look_for_container");
      what_to_look_for_container.innerHTML = `<div>`+
          `<span class="state_name text-center">`+state_name+`</span></br><span class="case_count_info">`+ current_cases[state_name] + `</span>` +
          ` Cases, currently doubling every <span class="case_count_info">`+ Math.round(growth_rate[state_name],0) +`</span> days</div>`;
    }

    
});
                          
function show_all_states_flattening_curve_button_click_handler() {
    for (var j=0; j<state_name_list.length; j++) {
        st_nm = state_name_list[j];
        d3.selectAll("."+st_nm+"_growth_rate_curve").style("stroke-width","2px").style("opacity", function() {
            if (highlight_state_list.includes(st_nm)) {
                return 1.0;
            } else {
                return 0.1;
            }
        })
        if (highlight_state_list.includes(st_nm)) {
            d3.selectAll("."+st_nm+"_circles").attr("r", "0.15rem").attr("opacity", 1.0);
        }
    }
}

$("#show_all_states_flattening_curve").click(function() {
    show_all_states_flattening_curve_button_click_handler();
    $('#viz_combobox').val("all").trigger('change');
});


plot_flattening_curve_legend("#flattening_curve_legend");

function plot_flattening_curve_legend(idname) {
    var color_scale = d3.scaleSequential(d3.interpolatePlasma);

    var linear = d3.scaleOrdinal()
      .domain([2, 4, 6, 10, 14, 30])
      .range([color_scale(0), color_scale(0.2), color_scale(0.4), color_scale(0.6), color_scale(0.8), color_scale(0.9)]);

    var svg = d3.select(idname).append("svg");

    svg.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(0,0)");

    var legendLinear = d3.legendColor()
      .shapeWidth(20)
      .shapeHeight(10)
      .cells([2, 4, 6, 10, 14, 30])
      .orient('horizontal')
      .scale(linear);

    svg.select(".legendLinear")
      .call(legendLinear);
}


/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setup_hotspots_buttons() {
  d3.select('#hotspots_buttons')
    .selectAll('.btn')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.btn').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      var is_init = 0;
      //draw_maps(is_init, buttonId);
    });
}

// setup the buttons.
setup_hotspots_buttons();