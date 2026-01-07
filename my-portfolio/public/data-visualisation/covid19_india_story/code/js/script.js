var minDeviceWidth = 375;
var maxDeviceWidth = 1024;

months_list = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"];

var month_abbrv_list = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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

      // Toggle the bubble chart based on
      // the currently clicked button.
      //myBubbleChart.toggleDisplay(buttonId);
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


/*
district_name_mapping = {"Jagitial":"Jagtial", "Jangoan":"Jangaon", "Kumuram Bheem Asifabad":"Komaram Bheem Asifabad",
                         "Mahabubnagar": "Mahbubnagar", "Ranga Reddy": "Rangareddy", "Yadadri Bhuvanagiri":"Yadadri Bhongir",
                         "Jayashankar": "Jayashankar Bhupalapally", "West Khasi Hills":"West khasi Hills", "East Jaintia Hills":"East Jainta Hills",
                        "Kalaburagi":"Gulbarga", "Belagavi":"Belgaum", "Bagalkote":"Bagalkot", "Ballari":"Bellary",
                        "Shivamogga":"Shimoga", "Chikkamagaluru":"Chikmagalur", "Bengaluru Rural":""}
*/