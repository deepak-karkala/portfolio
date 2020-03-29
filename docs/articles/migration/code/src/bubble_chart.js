/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 * and
 * Shan Carter's 
 * https://archive.nytimes.com/www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html
 * 
 * Code reused from https://github.com/vlandham/bubble_chart_v4
 */

// Width and height of container
var width = document.getElementById("vis").clientWidth;
var height = document.getElementById("vis").clientHeight;

function bubbleChart() {
  
  // Delay between graph transitions
  var transitionDelay = 1000; //1 second

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height / 2 };

  var genderCenters = {
    "Male": { x: width / 3, y: height / 2 },
    "Female": { x: 2 * width / 3, y: height / 2 },
  };

  var ageCenters = {
    0: { x: width / 6, y: height / 2 },
    1: { x: width * 2 / 6, y: height / 2 },
    2: { x: width * 3 / 6, y: height / 2 },
    3: { x: width * 4 / 6, y: height / 2 },
    4: { x: width * 5 / 6, y: height / 2 },
  };

  var ruralurbanCenters = {
    0: { x: width / 3, y: height / 2 },
    1: { x: 2 * width / 3, y: height / 2 },
  };

  var religionCenters = {
    "Hindu": { x: width * 1.5 / 6, y: 1.2*height / 4},
    "Muslim": { x: width * 2.5 / 6, y: 1.2*height  / 4},
    "Christian": { x: width * 3.5 / 6, y: 1.2*height  / 4},
    "Sikh": { x: width * 4.5 / 6, y: 1.2*height / 4},
    "Buddhist": { x: width * 1.5 / 6, y: height * 2.35 / 4},
    "Jain": { x: width * 2.5 / 6, y: height * 2.4 / 4},
    "Other": { x: width * 3.5 / 6, y: height * 2.45 / 4},
    "Not stated": { x: width * 4.5 / 6, y: height * 2.5 / 4},
  };

  var employmentCenters = {
    0: { x: width / 5, y: height / 2 },
    1: { x: width * 2 / 5, y: height / 2 },
    2: { x: width * 3 / 5, y: height / 2 },
    3: { x: width * 4 / 5, y: height / 2 },
  };
  
  var sanitationCenters = {
    0: { x: width / 3, y: height / 2 },
    1: { x: 2 * width / 3, y: height / 2 },
  };

  var povertyCenters = {
    0: { x: width / 3, y: height / 2 },
    1: { x: 2 * width / 3, y: height / 2 },
  };

  var taxCenters = {
    0: { x: width / 3, y: height / 2 },
    1: { x: 2 * width / 3, y: height / 2 },
  };
  
  var stateCenters = {
    //First row
    "Uttar Pradesh": { x: width * 1.5 / 8, y: height * 2 / 8},
    "Maharashtra": { x: width * 2.5 / 8, y: height * 2 / 8},
    "Bihar": { x: width * 3.5 / 8, y: height * 2 / 8},
    "West Bengal": { x: width * 4.5 / 8, y: height * 2 / 8},
    "Madhya Pradesh": { x: width * 5.5 / 8, y: height * 2 / 8},
    "Tamil Nadu": { x: width * 6.5 / 8, y: height * 2 / 8},

    //Second row
    "Rajasthan": { x: width * 1.5 / 8, y: height * 3 / 8},
    "Karnataka": { x: width * 2.5 / 8, y: height * 3 / 8},
    "Gujarat": { x: width * 3.5 / 8, y: height * 3 / 8},
    "Andhra Pradesh": { x: width * 4.5 / 8, y: height * 3 / 8},
    "Odisha": { x: width * 5.5 / 8, y: height * 3 / 8},
    "Telangana": { x: width * 6.5 / 8, y: height * 3 / 8},

    //Third row
    "Kerala": { x: width * 1.5 / 8, y: height * 4 / 8},
    "Jharkhand": { x: width * 2.5 / 8, y: height * 4 / 8},
    "Assam": { x: width * 3.5 / 8, y: height * 4 / 8},
    "Punjab": { x: width * 4.5 / 8, y: height * 4 / 8},
    "Chhattisgarh": { x: width * 5.5 / 8, y: height * 4 / 8},
    "Haryana": { x: width * 6.5 / 8, y: height * 4 / 8},

    //Fourth row
    "Delhi": { x: width * 1.5 / 8, y: height * 5 / 8},
    "Jammu and Kashmir": { x: width * 2.5 / 8, y: height * 5 / 8},
    "Uttarakhand": { x: width * 3.5 / 8, y: height * 5 / 8},
    "Himachal Pradesh": { x: width * 4.5 / 8, y: height * 5 / 8},
    "Tripura": { x: width * 5.5 / 8, y: height * 5 / 8},
    "Meghalaya": { x: width * 6.5 / 8, y: height * 5 / 8},

    //Fifth row
    "Manipur": { x: width * 1.5 / 8, y: height * 6 / 8},
    "Nagaland": { x: width * 2.5 / 8, y: height * 6 / 8},
    "Goa": { x: width * 3.5 / 8, y: height * 6 / 8},
    "Arunachal Pradesh": { x: width * 4.5 / 8, y: height * 6 / 8},
    "Puducherry": { x: width * 5.5 / 8, y: height * 6 / 8},
    "Mizoram": { x: width * 6.5 / 8, y: height * 6 / 8},

    //Sixth row
    "Chandigarh": { x: width * 1.5 / 8, y: height * 7 / 8},
    "Sikkim": { x: width * 2.5 / 8, y: height * 7 / 8},
    "Andaman Nicobar": { x: width * 3.5 / 8, y: height * 7 / 8},
    "Dadra Nagar Haveli": { x: width * 4.5 / 8, y: height * 7 / 8},
    "Daman Diu": { x: width * 5.5 / 8, y: height * 7 / 8},
    "Lakshadweep": { x: width * 6.5 / 8, y: height * 7 / 8},

  };

  var languageCenters = {
    //First row
    "Hindi": { x: width * 1.5 / 8, y: height * 1.6 / 8},
    "Bengali": { x: width * 2.5 / 8, y: height * 2 / 8},
    "Marathi": { x: width * 3.5 / 8, y: height * 2 / 8},
    "Telugu": { x: width * 4.5 / 8, y: height * 2 / 8},
    "Tamil": { x: width * 5.5 / 8, y: height * 2 / 8},
    "Gujarati": { x: width * 6.5 / 8, y: height * 2 / 8},

    //Second row
    "Urdu": { x: width * 1.5 / 8, y: height * 2.8 / 8},
    "Kannada": { x: width * 2.5 / 8, y: height * 2.9 / 8},
    "Odia": { x: width * 3.5 / 8, y: height * 3.05 / 8},
    "Malayalam": { x: width * 4.5 / 8, y: height * 3.1 / 8},
    "Punjabi": { x: width * 5.5 / 8, y: height * 3.15 / 8},
    "Assamese": { x: width * 6.5 / 8, y: height * 3.15 / 8},

    //Third row
    "Maithili": { x: width * 1.5 / 8, y: height * 3.9 / 8},
    "Bhili/Bhilodi": { x: width * 2.5 / 8, y: height * 3.9 / 8},
    "Santali": { x: width * 3.5 / 8, y: height * 4 / 8},
    "Kashmiri": { x: width * 4.5 / 8, y: height * 4 / 8},
    "Gondi": { x: width * 5.5 / 8, y: height * 4 / 8},
    "Nepali": { x: width * 6.5 / 8, y: height * 4 / 8},

    //Fourth row
    "Sindhi": { x: width * 1.5 / 8, y: height * 4.9 / 8},
    "Dogri": { x: width * 2.5 / 8, y: height * 4.9 / 8},
    "Konkani": { x: width * 3.5 / 8, y: height * 5 / 8},
    "Kurukh": { x: width * 4.5 / 8, y: height * 5 / 8},
    "Khandeshi": { x: width * 5.5 / 8, y: height * 5 / 8},
    "Tulu": { x: width * 6.5 / 8, y: height * 5 / 8},

    //Fifth row
    "Meitei (Manipuri)": { x: width * 1.5 / 8, y: height * 6 / 8},
    "Bodo": { x: width * 2.5 / 8, y: height * 6 / 8},
    "Khasi": { x: width * 3.5 / 8, y: height * 6 / 8},
    "Ho": { x: width * 4.5 / 8, y: height * 6 / 8},
    "Mundari": { x: width * 5.5 / 8, y: height * 6 / 8},
    "Garo": { x: width * 6.5 / 8, y: height * 6 / 8},

    //Sixth row
    "Tripuri": { x: width * 1.5 / 8, y: height * 7 / 8},
  };
  // X locations of the year titles.
  var genderTitleX = {
    "Male": width / 3,
    "Female": 2* width / 3,
  };

  var ageTitleX = {
    0: width * 0.75 / 6,
    1: width * 2 / 6,
    2: width * 3.25 / 6,
    3: width * 4.25 / 6,
    4: width * 5.25 / 6,
  };

  var employmentTitleX = {
    0 : width * 0.8 / 5,
    1 : width * 2.10 / 5,
    2 : width * 3.10 / 5,
    3 : width * 4.25 / 5,
  };

  var religionTitleX = {
    "Hindu": width * 1.5 / 6,
    "Muslim": width * 2.75 / 6,
    "Christian": width * 3.75 / 6,
    "Sikh": width * 4.75 / 6,
    "Buddhist": width * 1.5 / 6,
    "Jain": width * 2.5 / 6,
    "Other": width * 3.5 / 6,
    "Not stated": width * 4.5 / 6,
  };

  var religionTitleY = {
    "Hindu": height * 1 / 4,
    "Muslim": height * 1 / 4,
    "Christian": height  * 1 / 4,
    "Sikh": height * 1 / 4,
    "Buddhist": height * 2.5 / 4,
    "Jain": height * 2.5 / 4,
    "Other": height * 2.5 / 4,
    "Not stated": height * 2.5 / 4,
  };

  var ruralurbanTitleX = {
    0: width / 3,
    1: 2* width / 3,
  };

  var sanitationTitleX = {
    0: width / 3,
    1: 2* width / 3,
  };

  var povertyTitleX = {
    0: 0.8 * width / 3,
    1: 2.15 * width / 3,
  };

  var taxTitleX = {
    0: 0.8 * width / 3,
    1: 2.15 * width / 3,
  };

  var stateTitleX = {
    //First row
    "Uttar Pradesh": width * 1.5 / 8,
    "Maharashtra": width * 2.5 / 8,
    "Bihar": width * 3.5 / 8,
    "West Bengal": width * 4.5 / 8,
    "Madhya Pradesh": width * 5.5 / 8,
    "Tamil Nadu": width * 6.5 / 8,

    //Second row
    "Rajasthan": width * 1.5 / 8,
    "Karnataka": width * 2.5 / 8,
    "Gujarat": width * 3.5 / 8,
    "Andhra Pradesh": width * 4.5 / 8,
    "Odisha": width * 5.5 / 8,
    "Telangana": width * 6.5 / 8,

    //Third row
    "Kerala": width * 1.5 / 8,
    "Jharkhand": width * 2.5 / 8,
    "Assam": width * 3.5 / 8,
    "Punjab": width * 4.5 / 8,
    "Chhattisgarh": width * 5.5 / 8,
    "Haryana": width * 6.5 / 8,

    //Fourth row
    "Delhi": width * 1.5 / 8,
    "Jammu and Kashmir": width * 2.5 / 8,
    "Uttarakhand": width * 3.5 / 8,
    "Himachal Pradesh": width * 4.5 / 8,
    "Tripura": width * 5.5 / 8,
    "Meghalaya": width * 6.5 / 8,

    //Fifth row
    "Manipur": width * 1.5 / 8,
    "Nagaland": width * 2.5 / 8,
    "Goa": width * 3.5 / 8,
    "Arunachal Pradesh": width * 4.5 / 8,
    "Puducherry": width * 5.5 / 8,
    "Mizoram": width * 6.5 / 8,

    //Sixth row
    "Chandigarh": width * 1.5 / 8,
    "Sikkim": width * 2.5 / 8,
    "Andaman Nicobar": width * 3.5 / 8,
    "Dadra Nagar Haveli": width * 4.5 / 8,
    "Daman Diu": width * 5.5 / 8,
    "Lakshadweep": width * 6.5 / 8,

  };

  var stateTitleY = {
    //First row
    "Uttar Pradesh": height * 2 / 8,
    "Maharashtra": height * 2 / 8,
    "Bihar": height * 2 / 8,
    "West Bengal": height * 2 / 8,
    "Madhya Pradesh": height * 2 / 8,
    "Tamil Nadu": height * 2 / 8,

    //Second row
    "Rajasthan": height * 3 / 8,
    "Karnataka": height * 3 / 8,
    "Gujarat": height * 3 / 8,
    "Andhra Pradesh": height * 3 / 8,
    "Odisha": height * 3 / 8,
    "Telangana": height * 3 / 8,

    //Third row
    "Kerala": height * 4 / 8,
    "Jharkhand": height * 4 / 8,
    "Assam": height * 4 / 8,
    "Punjab": height * 4 / 8,
    "Chhattisgarh": height * 4 / 8,
    "Haryana": height * 4 / 8,

    //Fourth row
    "Delhi": height * 5 / 8,
    "Jammu and Kashmir": height * 5 / 8,
    "Uttarakhand": height * 5 / 8,
    "Himachal Pradesh": height * 5 / 8,
    "Tripura": height * 5 / 8,
    "Meghalaya": height * 5 / 8,

    //Fifth row
    "Manipur": height * 6 / 8,
    "Nagaland": height * 6 / 8,
    "Goa": height * 6 / 8,
    "Arunachal Pradesh": height * 6 / 8,
    "Puducherry": height * 6 / 8,
    "Mizoram": height * 6 / 8,

    //Sixth row
    "Chandigarh": height * 7 / 8,
    "Sikkim": height * 7 / 8,
    "Andaman Nicobar": height * 7 / 8,
    "Dadra Nagar Haveli": height * 7 / 8,
    "Daman Diu": height * 7 / 8,
    "Lakshadweep": height * 7 / 8,

  };

  var languageTitleX = {
    //First row
    "Hindi": width * 1.5 / 8,
    "Bengali": width * 2.5 / 8,
    "Marathi": width * 3.5 / 8,
    "Telugu": width * 4.6 / 8,
    "Tamil": width * 5.75 / 8,
    "Gujarati": width * 6.75 / 8,

    //Second row
    "Urdu": width * 1.5 / 8,
    "Kannada": width * 2.5 / 8,
    "Odia": width * 3.5 / 8,
    "Malayalam": width * 4.6 / 8,
    "Punjabi": width * 5.75 / 8,
    "Assamese": width * 6.75 / 8,

    //Third row
    "Maithili": width * 1.5 / 8,
    "Bhili/Bhilodi": width * 2.5 / 8,
    "Santali": width * 3.5 / 8,
    "Kashmiri": width * 4.6 / 8,
    "Gondi": width * 5.75 / 8,
    "Nepali": width * 6.75 / 8,

    //Fourth row
    "Sindhi": width * 1.5 / 8,
    "Dogri": width * 2.5 / 8,
    "Konkani": width * 3.5 / 8,
    "Kurukh": width * 4.6 / 8,
    "Khandeshi": width * 5.75 / 8,
    "Tulu": width * 6.75 / 8,

    //Fifth row
    "Meitei (Manipuri)": width * 1.5 / 8,
    "Bodo": width * 2.5 / 8,
    "Khasi": width * 3.5 / 8,
    "Ho": width * 4.6 / 8,
    "Mundari": width * 5.75 / 8,
    "Garo": width * 6.75 / 8,

    //Sixth row
    "Tripuri": width * 1.5 / 8,
  };

  var languageTitleY = {
    //First row
    "Hindi": height * 2 / 8,
    "Bengali": height * 2 / 8,
    "Marathi": height * 2 / 8,
    "Telugu": height * 2 / 8,
    "Tamil": height * 2 / 8,
    "Gujarati": height * 2 / 8,

    //Second row
    "Urdu": height * 3 / 8,
    "Kannada":  height * 3 / 8,
    "Odia": height * 3 / 8,
    "Malayalam": height * 3 / 8,
    "Punjabi": height * 3 / 8,
    "Assamese": height * 3 / 8,

    //Third row
    "Maithili": height * 4 / 8,
    "Bhili/Bhilodi": height * 4 / 8,
    "Santali": height * 4 / 8,
    "Kashmiri": height * 4 / 8,
    "Gondi": height * 4 / 8,
    "Nepali": height * 4 / 8,

    //Fourth row
    "Sindhi": height * 5 / 8,
    "Dogri": height * 5 / 8,
    "Konkani": height * 5 / 8,
    "Kurukh": height * 5 / 8,
    "Khandeshi": height * 5 / 8,
    "Tulu": height * 5 / 8,

    //Fifth row
    "Meitei (Manipuri)": height * 6 / 8,
    "Bodo": height * 6 / 8,
    "Khasi": height * 6 / 8,
    "Ho": height * 6 / 8,
    "Mundari": height * 6 / 8,
    "Garo": height * 6 / 8,

    //Sixth row
    "Tripuri": height * 7 / 8,
  };

  // @v4 strength to apply to the position forces
  var forceStrength = 0.08;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  // Charge function that is called for each node.
  // As part of the ManyBody force.
  // This is what creates the repulsion between nodes.
  //
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  //
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  //
  // Charge is negative because we want nodes to repel.
  // @v4 Before the charge was a stand-alone attribute
  //  of the force layout. Now we can use it as a separate force!
  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  var simulation = d3.forceSimulation()
    .velocityDecay(0.3)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();

  var two_colors_list = ["#ffd8b1", "#3cb44b"];

  var fillColorByGender = d3.scaleOrdinal()
    .domain([1, 0])
    .range(two_colors_list);

  var fillColorByAge = d3.scaleOrdinal()
    .domain([0, 1, 2, 3, 4, 5])
    //.range(["#4169E1", "#7B68EE", "#00BFFF", "#ADD8E6", "#B0C4DE"]);
    .range(["#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231"]);

  var fillColorByReligion = d3.scaleOrdinal()
    .domain(["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other", "Not stated"])
    .range(["#FF8C00", "#228B22", "#7B68EE", "#FFD700", "#FF69B4", "#87CEFA", "#DEB887", "#FF0000"]);

  var fillColorBySanitation = d3.scaleOrdinal()
    .domain([1, 0])
    .range(two_colors_list);

  var fillColorByLiteracy = d3.scaleOrdinal()
    .domain([0, 1])
    .range(two_colors_list);

  var fillColorByRuralurban = d3.scaleOrdinal()
    .domain([1, 0])
    .range(two_colors_list);

  var fillColorByPoverty = d3.scaleOrdinal()
    .domain([1, 0])
    .range(two_colors_list);

  var fillColorByTax = d3.scaleOrdinal()
    .domain([1, 0])
    .range(two_colors_list);

  var fillColorByEmployment = d3.scaleOrdinal()
    .domain([0, 1, 2, 3])
    //.range(["#4169E1", "#7B68EE", "#00BFFF", "#ADD8E6"]);
    .range(["#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231"]);

  var fillColorByState = d3.scaleOrdinal()
    .domain(['Uttar Pradesh', 'Maharashtra', 'Bihar', 'West Bengal',
       'Madhya Pradesh', 'Tamil Nadu', 'Rajasthan', 'Karnataka', 'Gujarat',
       'Andhra Pradesh', 'Odisha', 'Telangana', 'Kerala', 'Jharkhand',
       'Assam', 'Punjab', 'Chhattisgarh', 'Haryana', 'Delhi',
       'Jammu and Kashmir', 'Uttarakhand', 'Himachal Pradesh', 'Tripura',
       'Meghalaya', 'Manipur', 'Nagaland', 'Goa', 'Arunachal Pradesh',
       'Puducherry', 'Mizoram', 'Chandigarh', 'Sikkim',
       'Andaman Nicobar', 'Dadra Nagar Haveli',
       'Daman Diu', 'Lakshadweep'])
    .range(["#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
            "#911eb4", "#42d4f4", "#f032e6", "#bfef45", "#fabebe",
            "#469990", "#e6beff", "#9A6324", "#fffac8", "#800000",
            "#aaffc3", "#808000", "#ffd8b1", "#00f075", "#a9a9a9",
            "#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
            "#911eb4", "#42d4f4", "#f032e6", "#bfef45", "#fabebe",
            "#469990", "#e6beff", "#9A6324", "#fffac8", "#800000",
            "#aaffc3"]);

  var fillColorByLanguage = d3.scaleOrdinal()
    .domain(['Gujarati', 'Bengali', 'Marathi', 'Bhili/Bhilodi', 'Hindi',
       'Telugu', 'Kannada', 'Punjabi', 'Konkani', 'Urdu', 'Maithili',
       'Tamil', 'Odia', 'Assamese', 'Malayalam', 'Gondi', 'Santali',
       'Bodo', 'Sindhi', 'Dogri', 'Khasi', 'Nepali', 'Kashmiri',
       'Tripuri', 'Meitei (Manipuri)', 'Garo', 'Ho', 'Khandeshi', 'Tulu',
       'Kurukh', 'Mundari'])
    .range(["#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#45e2f1",
            "#911eb4", "#42d4f4", "#f032e6", "#bfef45", "#fabebe",
            "#469990", "#e6beff", "#9A6324", "#fffac8", "#800000",
            "#aaffc3", "#808000", "#ffd8b1", "#00f075", "#a9a9a9",
            "#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
            "#911eb4", "#42d4f4", "#f032e6", "#bfef45", "#fabebe",
            "#469990"]);
  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes(rawData) {
    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    var myNodes = rawData.map(function (d) {
      if (width<=400) {
        radiusScale = 2.0; //radiusScale(+d.total_amount),
      } else {
        radiusScale = 3.0;
      }

      return {
        id: d.id,
        gender: d.gender,
        religion: d.religion,
        agegroup: d.agegroup,
        state: d.state,
        ruralurban: d.ruralurban,
        literacy: d.literacy,
        employment: d.employment,
        sanitation: d.sanitation,
        poverty: d.poverty,
        tax: d.tax,
        language: d.language,
        radius: radiusScale,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });

    return myNodes;
  }

  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  var chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    // enter selection to apply our transtition to below.
    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return "#ffffff"; })
      .attr('stroke', function (d) { return "#000000"; })
      .attr('stroke-width', 2);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();
  };

  /*
   * Callback function that is called after every tick of the
   * force simulation.
   * Here we do the acutal repositioning of the SVG circles
   * based on the current x and y values of their bound node data.
   * These x and y values are modified by the force simulation.
   */
  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  /*
   * Provides a x value for each node to be used with the split by year
   * x force.
   */
  //Gender
  function nodeGenderPosX(d) {
    return genderCenters[d.gender].x;
  }
  function nodeGenderPosY(d) {
    return genderCenters[d.gender].y;
  }
  //Age
  function nodeAgePosX(d) {
    return ageCenters[d.agegroup].x;
  }
  function nodeAgePosY(d) {
    return ageCenters[d.agegroup].y;
  }
  //Religion
  function nodeReligionPosX(d) {
    return religionCenters[d.religion].x;
  }
  function nodeReligionPosY(d) {
    return religionCenters[d.religion].y;
  }
  //Sanitation
  function nodeSanitationPosX(d) {
    return sanitationCenters[d.sanitation].x;
  }
  function nodeSanitationPosY(d) {
    return sanitationCenters[d.sanitation].y;
  }
  //Employment
  function nodeEmploymentPosX(d) {
    return employmentCenters[d.employment].x;
  }
  function nodeEmploymentPosY(d) {
    return employmentCenters[d.employment].y;
  }
  //Poverty
  function nodePovertyPosX(d) {
    return povertyCenters[d.poverty].x;
  }
  function nodePovertyPosY(d) {
    return povertyCenters[d.poverty].y;
  }
  //Tax
  function nodeTaxPosX(d) {
    return taxCenters[d.tax].x;
  }
  function nodeTaxPosY(d) {
    return taxCenters[d.tax].y;
  }
  //Rural urban
  function nodeRuralurbanPosX(d) {
    return ruralurbanCenters[d.ruralurban].x;
  }
  function nodeRuralurbanPosY(d) {
    return ruralurbanCenters[d.ruralurban].y;
  }
  //State
  function nodeStatePosX(d) {
    return stateCenters[d.state].x;
  }
  function nodeStatePosY(d) {
    return stateCenters[d.state].y;
  }
  //Language
  function nodeLanguagePosX(d) {
    return languageCenters[d.language].x;
  }
  function nodeLanguagePosY(d) {
    return languageCenters[d.language].y;
  }


  /*
   * Sets visualization in "single group mode".
   */
  function groupBubbles() {
    hideAllTitles();
    showGroupedTitles();

    d3.selectAll(".bubble")
        .attr('fill', function (d) { return "#f1e0d6"; })
        .attr('stroke', function (d) { return "#000000"; });
        //.attr('stroke', function (d) { return "#ffffff"; })

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
    simulation.force('y', d3.forceY().strength(forceStrength).y(center.y));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();

    var div = document.getElementById("footer_text");
    div.innerHTML = "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
  }


  /*
   * Sets visualization in "split by "X" mode".
   */
  function splitBubbles(splitByType) {

    groupBubbles();

    // Gender
    if (splitByType === "gender") {
      hideAllTitles();
      showGenderTitles();
      d3.selectAll(".bubble")
        .transition()
        .delay(100)
        .duration(500)
        .attr('fill', function (d) { return fillColorByGender(d.gender); })
        //.attr('stroke', function (d) { return d3.rgb(fillColorByGender(d.gender)).darker(); });
        .attr('stroke', function (d) { return "#000000"; });

      var timer = d3.timeout(function(duration) {
          // @v4 Reset the 'x' force to draw the bubbles to their year centers
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodeGenderPosX));
          simulation.force('y', d3.forceY().strength(forceStrength).y(nodeGenderPosY));
      }, transitionDelay);

      // Data source
      var div = document.getElementById("footer_text");
      //div.innerHTML = "Data Source: <a href='https://en.wikipedia.org/wiki/List_of_states_and_union_territories_of_India_by_sex_ratio'>https://en.wikipedia.org/wiki/List_of_states_and_union_territories_of_India_by_sex_ratio</a>";
      div.innerHTML = "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
      div.innerHTML += "Data Source: <a href='https://en.wikipedia.org/wiki/Demographics_of_India'>https://en.wikipedia.org/wiki/Demographics_of_India</a>";

    // Age
    } else if (splitByType === "agegroup") {
      hideAllTitles();
      showAgeTitles();
      d3.selectAll(".bubble")
        .transition()
        .delay(100)
        .duration(500)
        .attr('fill', function (d) { return fillColorByAge(d.agegroup); })
        //.attr('stroke', function (d) { return d3.rgb(fillColorByAge(d.agegroup)).darker(); });
        .attr('stroke', function (d) { return "#000000"; });

      var timer = d3.timeout(function(duration) {
          // @v4 Reset the 'x' force to draw the bubbles to their year centers
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodeAgePosX));
          simulation.force('y', d3.forceY().strength(forceStrength).y(nodeAgePosY));
      }, transitionDelay);

      // Data source
      var div = document.getElementById("footer_text");
      div.innerHTML = "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
      div.innerHTML += "Data Source: <a href='https://en.wikipedia.org/wiki/Demographics_of_India'>https://en.wikipedia.org/wiki/Demographics_of_India</a>";

    // Rural urban
    } else if (splitByType === "ruralurban") {
      hideAllTitles();
      showRuralurbanTitles();
      d3.selectAll(".bubble")
        .transition()
        .delay(100)
        .duration(500)
        .attr('fill', function (d) { return fillColorByRuralurban(d.ruralurban); })
        //.attr('stroke', function (d) { return d3.rgb(fillColorByRuralurban(d.ruralurban)).darker(); });
        .attr('stroke', function (d) { return "#000000"; });

      var timer = d3.timeout(function(duration) {
          // @v4 Reset the 'x' force to draw the bubbles to their year centers
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodeRuralurbanPosX));
          simulation.force('y', d3.forceY().strength(forceStrength).y(nodeRuralurbanPosY));
      }, transitionDelay);

      // Data source
      var div = document.getElementById("footer_text");
      div.innerHTML = "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
      div.innerHTML += "Data Source: <a href='https://en.wikipedia.org/wiki/Demographics_of_India'>https://en.wikipedia.org/wiki/Demographics_of_India</a>";

    // Poverty
    } else if (splitByType === "poverty") {
      hideAllTitles();
      showPovertyTitles();
      d3.selectAll(".bubble")
        .transition()
        .delay(100)
        .duration(500)
        .attr('fill', function (d) { return fillColorByPoverty(d.poverty); })
        //.attr('stroke', function (d) { return d3.rgb(fillColorByPoverty(d.poverty)).darker(); });
        .attr('stroke', function (d) { return "#000000"; });

      var timer = d3.timeout(function(duration) {
          // @v4 Reset the 'x' force to draw the bubbles to their year centers
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodePovertyPosX));
          simulation.force('y', d3.forceY().strength(forceStrength).y(nodePovertyPosY));
      }, transitionDelay);

      // Data source
      var div = document.getElementById("footer_text");
      div.innerHTML = "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
      div.innerHTML += "Data Source: <a href='https://en.wikipedia.org/wiki/Poverty_in_India'>https://en.wikipedia.org/wiki/Poverty_in_India</a>";

    // Employment
    } else if (splitByType === "employment") {
      hideAllTitles();
      showEmploymentTitles();
      d3.selectAll(".bubble")
        .transition()
        .delay(100)
        .duration(500)
        .attr('fill', function (d) { return fillColorByEmployment(d.employment); })
        //.attr('stroke', function (d) { return d3.rgb(fillColorByEmployment(d.employment)).darker(); });
        .attr('stroke', function (d) { return "#000000"; });

      var timer = d3.timeout(function(duration) {
          // @v4 Reset the 'x' force to draw the bubbles to their year centers
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodeEmploymentPosX));
          simulation.force('y', d3.forceY().strength(forceStrength).y(nodeEmploymentPosY));
      }, transitionDelay);

      // Data source
      var div = document.getElementById("footer_text");
      div.innerHTML = "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
      div.innerHTML += "Data Source: <a href='https://www.statista.com/statistics/271320/distribution-of-the-workforce-across-economic-sectors-in-india/'>https://www.statista.com/statistics/271320/distribution-of-the-workforce-across-economic-sectors-in-india/</a>";

    // Sanitation
    } else if (splitByType === "sanitation") {
      hideAllTitles();
      showSanitationTitles();
      d3.selectAll(".bubble")
        .transition()
        .delay(100)
        .duration(500)
        .attr('fill', function (d) { return fillColorBySanitation(d.sanitation); })
        //.attr('stroke', function (d) { return d3.rgb(fillColorBySanitation(d.sanitation)).darker(); });
        .attr('stroke', function (d) { return "#000000"; });

      var timer = d3.timeout(function(duration) {
          // @v4 Reset the 'x' force to draw the bubbles to their year centers
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodeSanitationPosX));
          simulation.force('y', d3.forceY().strength(forceStrength).y(nodeSanitationPosY));
      }, transitionDelay);

      var div = document.getElementById("footer_text");
      div.innerHTML = "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
      div.innerHTML += "Data Source: <a href='https://data.worldbank.org/indicator/SH.STA.ODFC.ZS?locations=IN'>https://data.worldbank.org/indicator/SH.STA.ODFC.ZS?locations=IN</a>";

    // State
    } else if (splitByType === "state") {
      hideAllTitles();
      showStateTitles();
      d3.selectAll(".bubble")
        .transition()
        .delay(100)
        .duration(500)
        //.attr('fill', function (d) { return fillColorByGender(d.gender); })
        .attr('fill', function (d) { return fillColorByState(d.state); })
        //.attr('stroke', function (d) { return d3.rgb(fillColorByGender(d.gender)).darker(); });
        .attr('stroke', function (d) { return "#000000"; });

      var timer = d3.timeout(function(duration) {
          // @v4 Reset the 'x' force to draw the bubbles to their year centers
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodeStatePosX));
          simulation.force('y', d3.forceY().strength(forceStrength).y(nodeStatePosY));
      }, transitionDelay);

      // Data source
      var div = document.getElementById("footer_text");
      div.innerHTML = "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
      div.innerHTML += "Data Source: <a href='https://en.wikipedia.org/wiki/Demographics_of_India'>https://en.wikipedia.org/wiki/Demographics_of_India</a>";

    // Language
    } else if (splitByType === "language") {
      hideAllTitles();
      showLanguageTitles();
      d3.selectAll(".bubble")
        .transition()
        .delay(100)
        .duration(500)
        //.attr('fill', function (d) { return fillColorByGender(d.gender); })
        .attr('fill', function (d) { return fillColorByLanguage(d.language); })
        //.attr('stroke', function (d) { return d3.rgb(fillColorByGender(d.gender)).darker(); });
        .attr('stroke', function (d) { return "#000000"; });

      var timer = d3.timeout(function(duration) {
          // @v4 Reset the 'x' force to draw the bubbles to their year centers
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodeLanguagePosX));
          simulation.force('y', d3.forceY().strength(forceStrength).y(nodeLanguagePosY));
      }, transitionDelay);

      var div = document.getElementById("footer_text");
      div.innerHTML = "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
      div.innerHTML += "Data Source: <a href='https://en.wikipedia.org/wiki/Demographics_of_India'>https://en.wikipedia.org/wiki/Demographics_of_India</a>";

    // literacy
    } else if (splitByType === "literacy") {
      hideAllTitles();
      showStateTitles();
      d3.selectAll(".bubble")
        .transition()
        .delay(100)
        .duration(500)
        .attr('fill', function (d) { return fillColorByLiteracy(d.literacy); })
        //.attr('stroke', function (d) { return d3.rgb(fillColorByLiteracy(d.literacy)).darker(); });
        .attr('stroke', function (d) { return "#000000"; });

      var timer = d3.timeout(function(duration) {
          // @v4 Reset the 'x' force to draw the bubbles to their year centers
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodeStatePosX));
          simulation.force('y', d3.forceY().strength(forceStrength).y(nodeStatePosY));
      }, transitionDelay);

      // Data source
      var div = document.getElementById("footer_text");
      // Legend
      div.innerHTML = '<svg height="20" width="20"><circle cx="10" cy="15" r="5" stroke="black" stroke-width="3" fill="#ffd8b1" /></svg>';
      div.innerHTML += 'IlLiterate';
      div.innerHTML +='<svg height="20" width="20"><circle cx="10" cy="15" r="5" stroke="black" stroke-width="3" fill="#3cb44b" /></svg>';
      div.innerHTML += 'Literate';
      div.innerHTML += "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
      div.innerHTML += "<p>Data Source: <a href='https://en.wikipedia.org/wiki/Demographics_of_India'>https://en.wikipedia.org/wiki/Demographics_of_India</a></p>";

    // Tax
    } else if (splitByType === "tax") {
      hideAllTitles();
      showTaxTitles();
      d3.selectAll(".bubble")
        .transition()
        .delay(100)
        .duration(500)
        .attr('fill', function (d) { return fillColorByTax(d.tax); })
        //.attr('stroke', function (d) { return d3.rgb(fillColorByTax(d.tax)).darker(); });
        .attr('stroke', function (d) { return "#000000"; });

      var timer = d3.timeout(function(duration) {
          // @v4 Reset the 'x' force to draw the bubbles to their year centers
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodeTaxPosX));
          simulation.force('y', d3.forceY().strength(forceStrength).y(nodeTaxPosY));
      }, transitionDelay);

      // Data source
      var div = document.getElementById("footer_text");
      div.innerHTML = "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
      div.innerHTML += "Data Source: <a href='https://en.wikipedia.org/wiki/Income_tax_in_India'>https://en.wikipedia.org/wiki/Income_tax_in_India</a>";

    // Religion
    } else if (splitByType === "religion") {
      hideAllTitles();
      showReligionTitles();
      d3.selectAll(".bubble")
        .transition()
        .delay(100)
        .duration(500)
        .attr('fill', function (d) { return fillColorByReligion(d.religion); })
        //.attr('stroke', function (d) { return d3.rgb(fillColorByReligion(d.religion)).darker(); });
        .attr('stroke', function (d) { return "#000000"; }); 

      var timer = d3.timeout(function(duration) {
          // @v4 Reset the 'x' force to draw the bubbles to their year centers
          simulation.force('x', d3.forceX().strength(forceStrength).x(nodeReligionPosX));
          simulation.force('y', d3.forceY().strength(forceStrength).y(nodeReligionPosY));
      }, transitionDelay);

      // Data source
      var div = document.getElementById("footer_text");
      div.innerHTML = "<p class='intro_info'>There are a total of 1324 circles. Each circle represents 1,000,000 Indians.</p>";
      div.innerHTML += "Data Source: <a href='https://en.wikipedia.org/wiki/Demographics_of_India'>https://en.wikipedia.org/wiki/Demographics_of_India</a>";
    }

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();

  }

  /*
   * Hides all title displays.
   */
  function hideAllTitles() {
    hideGroupedTitles();
    hideGenderTitles();
    hideAgeTitles();
    hideReligionTitles();
    hideStateTitles();
    hideLanguageTitles();
    hideEmploymentTitles();
    hideSanitationTitles();
    hidePovertyTitles();
    hideTaxTitles();
    hideRuralurbanTitles();
  }
  function hideGroupedTitles() {
    svg.selectAll('.all').remove();
  }
  function hideGenderTitles() {
    svg.selectAll('.gender').remove();
  }
  function hideAgeTitles() {
    svg.selectAll('.age').remove();
  }
  function hideReligionTitles() {
    svg.selectAll('.religion').remove();
  }
  function hideStateTitles() {
    svg.selectAll('.state').remove();
  }
  function hideLanguageTitles() {
    svg.selectAll('.language').remove();
  }
  function hideEmploymentTitles() {
    svg.selectAll('.employment').remove();
  }
  function hideSanitationTitles() {
    svg.selectAll('.sanitation').remove();
  }
  function hidePovertyTitles() {
    svg.selectAll('.poverty').remove();
  }
  function hideTaxTitles() {
    svg.selectAll('.tax').remove();
  }
  function hideRuralurbanTitles() {
    svg.selectAll('.ruralurban').remove();
  }

  function showGroupedTitles() {
    svg.append('text')
      .attr('class', 'label all')
      .attr('x', function (d) { return width/2; })
      .attr('y', two_title_y)
      .attr('text-anchor', 'middle')
      .text('All Indians');
  }

  /*
   * Shows title displays.
   */
  console.log(height);
  if (width >= 700) {
    var two_title_y = height/2 - 140;
  } else {
    var two_title_y = height/2 - 100;
  }
  console.log(two_title_y);

  function showGenderTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var genderData = d3.keys(genderTitleX);
    var gender = svg.selectAll('.gender')
      .data(genderData);

    gender.enter().append('text')
      .attr('class', 'label gender')
      .attr('x', function (d) { return genderTitleX[d]; })
      .attr('y', two_title_y)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
      //.style("fill", "white");
  }

  function showReligionTitles() {
    var religionData = d3.keys(religionTitleX);
    var religion = svg.selectAll('.religion')
      .data(religionData);

    religion.enter().append('text')
      .attr('class', 'label religion')
      .attr('x', function (d) { return religionTitleX[d]; })
      .attr('y', function (d) { return religionTitleY[d]; })
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }

  function showAgeTitles() {
    var ageData = d3.keys(ageTitleX);
    var ageGroupLabel = ["0-14", "15-24", "25-54", "55-64", "65+"];
    var age = svg.selectAll('.age')
      .data(ageData);

    age.enter().append('text')
      .attr('class', 'label age')
      .attr('x', function (d) { return ageTitleX[d]; })
      .attr('y', two_title_y)
      .attr('text-anchor', 'middle')
      .text(function (d) { return ageGroupLabel[d]; });
  }

  function showEmploymentTitles() {
    var employmentData = d3.keys(employmentTitleX);
    var employmentGroupLabel = ["Agriculture", "Industries", "Services", "Unemployed"];
    var employment = svg.selectAll('.employment')
      .data(employmentData);

    employment.enter().append('text')
      .attr('class', 'label employment')
      .attr('x', function (d) { return employmentTitleX[d]; })
      .attr('y', two_title_y)
      .attr('text-anchor', 'middle')
      .text(function (d) { return employmentGroupLabel[d]; });
  }

  function showPovertyTitles() {
    var povertyData = d3.keys(povertyTitleX);
    var povertyGroupLabel = ["Income less than $3.10 per day", "Income more than $3.10 per day"];
    var poverty = svg.selectAll('.age')
      .data(povertyData);

    poverty.enter().append('text')
      .attr('class', 'label poverty')
      .attr('x', function (d) { return povertyTitleX[d]; })
      .attr('y', two_title_y)
      .attr('text-anchor', 'middle')
      .text(function (d) { return povertyGroupLabel[d]; })
      .call(wrap, 150);
  }

  function showSanitationTitles() {
    var sanitationData = d3.keys(sanitationTitleX);
    var sanitationGroupLabel = ["Open defecation", "Access to toilet"];
    var sanitation = svg.selectAll('.age')
      .data(sanitationData);

    sanitation.enter().append('text')
      .attr('class', 'label sanitation')
      .attr('x', function (d) { return sanitationTitleX[d]; })
      .attr('y', two_title_y)
      .attr('text-anchor', 'middle')
      .text(function (d) { return sanitationGroupLabel[d]; });
  }

  function showTaxTitles() {
    var taxData = d3.keys(taxTitleX);
    var taxGroupLabel = ["People who pay tax", "People who do not pay tax"];
    var tax = svg.selectAll('.age')
      .data(taxData);

    tax.enter().append('text')
      .attr('class', 'label tax')
      .attr('x', function (d) { return taxTitleX[d]; })
      .attr('y', two_title_y)
      .attr('text-anchor', 'middle')
      .text(function (d) { return taxGroupLabel[d]; });
      //.call(wrap, 80);
  }

  function showRuralurbanTitles() {
    var ruralurbanData = d3.keys(ruralurbanTitleX);
    var ruralurbanGroupLabel = ["Rural", "Urban"];
    var ruralurban = svg.selectAll('.age')
      .data(ruralurbanData);

    ruralurban.enter().append('text')
      .attr('class', 'label ruralurban')
      .attr('x', function (d) { return ruralurbanTitleX[d]; })
      .attr('y', two_title_y)
      .attr('text-anchor', 'middle')
      .text(function (d) { return ruralurbanGroupLabel[d]; });
  }

  function showStateTitles() {
    var stateData = d3.keys(stateTitleX);
    var stateGroupLabel = [];
    if (width <= 500) {
      stateGroupLabel = ['UP', 'Maharashtra', 'Bihar', 'West Bengal',
         'MP', 'Tamil Nadu', 'Rajasthan', 'Karnataka', 'Gujarat',
         'Andhra Pradesh', 'Odisha', 'Telangana', 'Kerala', 'Jharkhand',
         'Assam', 'Punjab', 'Chhattisgarh', 'Haryana', 'Delhi',
         'JK', 'Uttarakhand', 'HP', 'Tripura',
         'Meghalaya', 'Manipur', 'Nagaland', 'Goa', 'Arunachal',
         'Puducherry', 'Mizoram', 'Chandigarh', 'Sikkim',
         'Andaman', 'Dadra',
         'Daman Diu', 'Lakshadweep'];
    } else {
      stateGroupLabel = ['Uttar Pradesh', 'Maharashtra', 'Bihar', 'West Bengal',
         'Madhya Pradesh', 'Tamil Nadu', 'Rajasthan', 'Karnataka', 'Gujarat',
         'Andhra Pradesh', 'Odisha', 'Telangana', 'Kerala', 'Jharkhand',
         'Assam', 'Punjab', 'Chhattisgarh', 'Haryana', 'Delhi',
         'Jammu and Kashmir', 'Uttarakhand', 'Himachal Pradesh', 'Tripura',
         'Meghalaya', 'Manipur', 'Nagaland', 'Goa', 'Arunachal Pradesh',
         'Puducherry', 'Mizoram', 'Chandigarh', 'Sikkim',
         'Andaman Nicobar', 'Dadra Nagar Haveli',
         'Daman Diu', 'Lakshadweep'];
    }
    var font_size_scaled = width/100 + 3;
    var state = svg.selectAll('.state')
      .data(stateData);

    state.enter().append('text')
      .attr('class', 'label state')
      .attr('x', function (d) { return stateTitleX[d]; })
      .attr('y', function (d) { return stateTitleY[d]; })
      .attr('text-anchor', 'middle')
      .text(function (d, i) { return stateGroupLabel[i]; })
      .style("font-size", font_size_scaled+"px");
  }
  
  function showLanguageTitles() {
    var languageData = d3.keys(languageTitleX);
    var font_size_scaled = width/100 + 3;
    var language = svg.selectAll('.language')
      .data(languageData);

    language.enter().append('text')
      .attr('class', 'label language')
      .attr('x', function (d) { return languageTitleX[d]; })
      .attr('y', function (d) { return languageTitleY[d]; })
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; })
      .style("font-size", font_size_scaled+"px");
  }

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by X" modes.
   *
   * displayName is expected to be a string and either 'year' or 'all'.
   */
  chart.toggleDisplay = function (displayName) {
    if (displayName === 'gender') {
      splitBubbles("gender");
    } else if (displayName === 'agegroup') {
      splitBubbles("agegroup");
    } else if (displayName === 'religion') {
      splitBubbles("religion");
    } else if (displayName === 'state') {
      splitBubbles("state");
    } else if (displayName === 'language') {
      splitBubbles("language");
    } else if (displayName === 'literacy') {
      splitBubbles("literacy");
    } else if (displayName === 'sanitation') {
      splitBubbles("sanitation");
    } else if (displayName === 'poverty') {
      splitBubbles("poverty");
    } else if (displayName === 'employment') {
      splitBubbles("employment");
    } else if (displayName === 'ruralurban') {
      splitBubbles("ruralurban");
    } else if (displayName === 'tax') {
      splitBubbles("tax");
    } else {
      groupBubbles();
    }
  };


  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data) {
  if (error) {
    console.log(error);
  }
  myBubbleChart('#vis', data);
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

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

// Load the data.
d3.csv('data/india_demographics_shuffled.csv', display);

// setup the buttons.
setupButtons();

//Redraw on window resize

//Helper function for wrappig text
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}
