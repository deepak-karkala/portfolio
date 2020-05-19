var minDeviceWidth = 375;
var maxDeviceWidth = 1024;
var small_screen_thresh = 768;
var window_inner_width = window.innerWidth;
var script_load_timestep = 5*500;
var script_load_timeout_list = [];



months_list = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"];

var month_abbrv_list = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

var state_code_mapping = {'AP': 0, 'AR': 1, 'AS': 2, 'BR': 3,'CT': 4,'GA': 5, 'GJ': 6,'HR': 7,'HP': 8,
                'JH': 9, 'KA': 10, 'KL': 11, 'MP': 12, 'MH': 13, 'MN': 14, 'ML': 15, 'MZ': 16,
                'NL': 17, 'OR': 18, 'PB': 19, 'RJ': 20, 'SK': 21, 'TN': 22, 'TG': 23, 'TR': 24,
                'UT': 25, 'UP': 26, 'WB': 27, 'AN': 28, 'CH': 29, 'DN': 30, 'DD': 31, 'DL': 32,
                'JK': 33, 'LA': 34, 'LD': 35, 'PY': 36};

var state_colors_list = ["#404040", "#FF0000", "#800000", "#F1C40F", "#808000", "#00FF00", "#008000", "#0000FF",
             "#000080", "#FF00FF", "#800080", "#F77210",
             "#404040", "#FF0000", "#800000", "#F1C40F", "#808000", "#00FF00", "#008000", "#0000FF",
             "#000080", "#FF00FF", "#800080", "#F77210",
             "#404040", "#FF0000", "#800000", "#F1C40F", "#808000", "#00FF00", "#008000", "#0000FF",
             "#000080", "#FF00FF", "#800080", "#F77210"]

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d");

//Daily stats data
daily_cum_cases_count = [];
daily_cum_deaths_count = [];
daily_cum_recovered_count = [];
load_daily_stats_file("data/overall_and_daily_cases_deaths.csv");
function load_daily_stats_file(filename) {
    d3.csv(filename, function(error, daily_stats_data) {
        // format the data
        daily_stats_data.forEach(function(d) {
            d.date = parseTime(d.date);
            daily_cum_cases_count[d.date] = d.total_confirmed;
            daily_cum_deaths_count[d.date] = d.total_deaths;
            daily_cum_recovered_count[d.date] = d.total_recovered;
        });
    });
}



//Outbreak spread map parameters
var svg_outbreak_spread_map;
var outbreak_spread_circles_g;
var outbreak_spread_start_date;
var outbreak_spread_sim_duration;
var outbreak_spread_num_sim_days;
var outbreak_spread_num_milliseconds_per_date;
var outbreak_spread_step_duration = 50;
var outbreak_spread_step_delay = 100;


//State flattening curve
var state_latest_case_count = [];
var case_count_state_list = [];
var state_case_count_highlight_list = [];
var default_background_color_state_case_count = "#808080";
var state_growth_rate = [];
var state_case_count_highlight_list = ["Delhi", "Maharashtra", "Kerala", "Rajasthan",
                                  "Andhra-Pradesh", "Jharkhand", "Bihar"];



// State doubling time
var state_doubling_time_state_color_mapping = d3.scaleOrdinal()
      .domain([0, 36])
      .range(state_colors_list);
var state_doubling_time_highlight_list = ["MH", "TN", "DL", "KA", "HR", "WB", "PB", "BR"]; 
var default_background_color_state_doubling_time = "#c0c0c0";


// District growth rate
var district_growth_rate_state_color_mapping = d3.scaleOrdinal()
      .domain([0, 36])
      .range(state_colors_list);
var district_growth_rate_highlight_list = ["Amritsar_PB", "Kolkata_WB", "Solapur_MH", "Chandigarh_CH",
                "Ludhiana_PB"];
var default_background_color_district_growth_rate = "#c0c0c0";


// District case density
var district_case_density_state_color_mapping = d3.scaleOrdinal()
      .domain([0, 36])
      .range(state_colors_list);
var district_case_density_highlight_list = ["Chennai_TN", "Bhopal_MP",
      "Indore_MP", "Delhi_DL", "Kasaragod_KL", "Kolkata_WB", "Amritsar_PB"]; //"SPS-Nellore_AP"
var default_background_color_district_case_density = "#c0c0c0";
var min_case_count_to_plot_case_density = 40;

// Emerging hotspots
var map_emerging_hotspots;
var markers_hotspots = [];
var slider_cases_value = 500;
var slider_density_value = 200;
var slider_growth_value = 5;
var topoLayer_hotspots;
var hotspot_districts_list = [];

// Country case count
var default_background_color_country_case_count = "#808080";
var country_case_count_highlight_list = ["Germany","Spain","France",
                  "Italy", "China", "India", "Japan",
                  "South-Korea", "Singapore","United-States", "Austria"];
var country_case_count_list = [];


// Country testing
var min_country_case_count_to_show_testing;
if (window.innerWidth >= 768) {
  min_country_case_count_to_show_testing = 10000;
} else {
  min_country_case_count_to_show_testing = 50000;
}


/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');


      if (buttonId=="maps") {
          load_draw_maps_script();
      } else if (buttonId=="daily_tracker") {  
          load_dailyCasesDeaths_script();
          load_totalCasesDeaths_script();
      } else if (buttonId=="tracing_outbreak") {
          setTimeout(load_clusterMap_script, 100);
          setTimeout(load_clusterTable_script, 3000);
          setTimeout(load_outbreakSpreadMap_script, 6000);
      } else if (buttonId=="state_analysis") {
          load_stateStreamGraph_script();
          load_stateCaseCount_script();
          load_districtDailyCaseCount();
          load_stateNtod_script();
          load_stateRecovery_script();
          load_stateDoublingTime_script();
      } else if (buttonId=="district_analysis") {
          load_topHotspotsTable_script();
          load_districtGrowthRate_script();
          load_districtCaseDensity_script();
          load_outbreakFreeDistricts();
          load_emergingHotspotsMap_script();
      } else if (buttonId=="country_analysis") {
          load_countryCaseCount_script();
          load_countryTestingRate_script();
      }
      // Toggle the bubble chart based on
      // the currently clicked button.
    });
}

// setup the buttons.
setupButtons();





/*
function setupPredictionScenarioButtons() {
  d3.select('#scenario_toolbar')
    .selectAll('.button')
    .on('click', function () {
      console.log("Click handler");
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      //myBubbleChart.toggleDisplay(buttonId);
    });
}
// setup the buttons.
setupPredictionScenarioButtons();
*/

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}





var state_code_name_mapping = {'AP': 'Andhra Pradesh',
                               'AR': 'Arunachal Pradesh',
                               'AS': 'Assam',
                               'BR': 'Bihar',
                               'CT': 'Chhattisgarh',
                               'GA': 'Goa',
                               'GJ': 'Gujarat',
                               'HR': 'Haryana',
                               'HP': 'Himachal Pradesh',
                               'JH': 'Jharkhand',
                               'KA': 'Karnataka',
                               'KL': 'Kerala',
                               'MP': 'Madhya Pradesh',
                               'MH': 'Maharashtra',
                               'MN': 'Manipur',
                               'ML': 'Meghalaya',
                               'MZ': 'Mizoram',
                               'NL': 'Nagaland',
                               'OR': 'Odisha',
                               'PB': 'Punjab',
                               'RJ': 'Rajasthan',
                               'SK': 'Sikkim',
                               'TN': 'Tamil Nadu',
                               'TG': 'Telangana',
                               'TR': 'Tripura',
                               'UT': 'Uttarakhand',
                               'UP': 'Uttar Pradesh',
                               'WB': 'West Bengal',
                               'AN': 'Andaman and Nicobar Islands',
                               'CH': 'Chandigarh',
                               'DN': 'Dadra and Nagar Haveli',
                               'DD': 'Daman and Diu',
                               'DL': 'Delhi',
                               'JK': 'Jammu and Kashmir',
                               'LA': 'Ladakh',
                               'LD': 'Lakshadweep',
                               'PY': 'Puducherry'};


var country_continent_mapping = {'United Arab Emirates': 'Asia',
                                 'Austria': 'Europe',
                                 'Belgium': 'Europe',
                                 'Belarus': 'Europe',
                                 'Brazil': 'Americas',
                                 'Canada': 'Americas',
                                 'Switzerland': 'Europe',
                                 'Chile': 'Americas',
                                 'China': 'Asia',
                                 'Germany': 'Europe',
                                 'Ecuador': 'Africa',
                                 'Spain': 'Europe',
                                 'France': 'Europe',
                                 'United Kingdom': 'Europe',
                                 'Indonesia': 'Asia',
                                 'India': 'Others',
                                 'Ireland': 'Europe',
                                 'Iran': 'Asia',
                                 'Israel': 'Asia',
                                 'Italy': 'Europe',
                                 'Japan': 'Asia',
                                 'South Korea': 'Asia',
                                 'Mexico': 'Americas',
                                 'Netherlands': 'Europe',
                                 'Pakistan': 'Asia',
                                 'Peru': 'Americas',
                                 'Poland': 'Europe',
                                 'Portugal': 'Europe',
                                 'Qatar': 'Asia',
                                 'Romania': 'Europe',
                                 'Russia': 'Europe',
                                 'Saudi Arabia': 'Asia',
                                 'Singapore': 'Asia',
                                 'Sweden': 'Europe',
                                 'Turkey': 'Europe',
                                 'Ukraine': 'Europe',
                                 'United States': 'Americas'}


var continent_color_mapping = d3.scaleOrdinal()
                                .domain(["Asia", "Europe", "Americas", "Africa", "Others"])
                                .range(["#4363d8", "#f58231", "#e6194b", "#3cb44b", "#000000"]);



var state_name_code_mapping = {'Andhra Pradesh': 'AP',
                               'Arunachal Pradesh': 'AR',
                               'Assam': 'AS',
                               'Bihar': 'BR',
                               'Chhattisgarh': 'CT',
                               'Goa': 'GA',
                               'Gujarat': 'GJ',
                               'Haryana': 'HR',
                               'Himachal Pradesh': 'HP',
                               'Jharkhand': 'JH',
                               'Karnataka': 'KA',
                               'Kerala': 'KL',
                               'Madhya Pradesh': 'MP',
                               'Maharashtra': 'MH',
                               'Manipur': 'MN',
                               'Meghalaya': 'ML',
                               'Mizoram': 'MZ',
                               'Nagaland': 'NL',
                               'Odisha': 'OR',
                               'Punjab': 'PB',
                               'Rajasthan': 'RJ',
                               'Sikkim': 'SK',
                               'Tamil Nadu': 'TN',
                               'Telangana': 'TG',
                               'Tripura': 'TR',
                               'Uttarakhand': 'UT',
                               'Uttar Pradesh': 'UP',
                               'West Bengal': 'WB',
                               'Andaman and Nicobar Islands': 'AN',
                               'Chandigarh': 'CH',
                               'Dadra and Nagar Haveli': 'DN',
                               'Daman and Diu': 'DD',
                               'Delhi': 'DL',
                               'Jammu and Kashmir': 'JK',
                               'Ladakh': 'LA',
                               'Lakshadweep': 'LD',
                               'Puducherry': 'PY'
                              };

var state_code_name_mapping = {'AP': 'Andhra Pradesh',
                               'AR': 'Arunachal Pradesh',
                               'AS': 'Assam',
                               'BR': 'Bihar',
                               'CT': 'Chhattisgarh',
                               'GA': 'Goa',
                               'GJ': 'Gujarat',
                               'HR': 'Haryana',
                               'HP': 'Himachal Pradesh',
                               'JH': 'Jharkhand',
                               'KA': 'Karnataka',
                               'KL': 'Kerala',
                               'MP': 'Madhya Pradesh',
                               'MH': 'Maharashtra',
                               'MN': 'Manipur',
                               'ML': 'Meghalaya',
                               'MZ': 'Mizoram',
                               'NL': 'Nagaland',
                               'OR': 'Odisha',
                               'PB': 'Punjab',
                               'RJ': 'Rajasthan',
                               'SK': 'Sikkim',
                               'TN': 'Tamil Nadu',
                               'TG': 'Telangana',
                               'TR': 'Tripura',
                               'UT': 'Uttarakhand',
                               'UP': 'Uttar Pradesh',
                               'WB': 'West Bengal',
                               'AN': 'Andaman and Nicobar Islands',
                               'CH': 'Chandigarh',
                               'DN': 'Dadra and Nagar Haveli',
                               'DD': 'Daman and Diu',
                               'DL': 'Delhi',
                               'JK': 'Jammu and Kashmir',
                               'LA': 'Ladakh',
                               'LD': 'Lakshadweep',
                               'PY': 'Puducherry'};

/*
district_name_mapping = {"Jagitial":"Jagtial", "Jangoan":"Jangaon", "Kumuram Bheem Asifabad":"Komaram Bheem Asifabad",
                         "Mahabubnagar": "Mahbubnagar", "Ranga Reddy": "Rangareddy", "Yadadri Bhuvanagiri":"Yadadri Bhongir",
                         "Jayashankar": "Jayashankar Bhupalapally", "West Khasi Hills":"West khasi Hills", "East Jaintia Hills":"East Jainta Hills",
                        "Kalaburagi":"Gulbarga", "Belagavi":"Belgaum", "Bagalkote":"Bagalkot", "Ballari":"Bellary",
                        "Shivamogga":"Shimoga", "Chikkamagaluru":"Chikmagalur", "Bengaluru Rural":""}
*/