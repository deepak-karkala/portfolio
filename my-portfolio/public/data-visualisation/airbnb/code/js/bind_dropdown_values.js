var cities = ['Barcelona', 'Paris', 'Austin', 'Melbourne',
       'Mallorca', 'Dublin', 'New Orleans', 'Asheville',
       'Seattle', 'Chicago', 'Montreal', 'Los Angeles',
       'Portland', 'Sydney', 'Madrid', 'Geneva',
       'Boston', 'Antwerp', 'Vienna', 'Vancouver', 'San Diego',
       'Venice', 'Denver', 'Washington, D.C.', 'Toronto', 'Edinburgh',
       'London', 'San Francisco', 'Berlin', 'Rome', 'Amsterdam',
       'New York City', 'Manchester', 'Copenhagen', 'Quebec City',
       'Athens', 'Oakland', 'Nashville', 'Brussels'];
var option = '';

cities.sort(function(a, b){
    if(a < b) { return -1; }
    if(a > b) { return 1; }
    return 0;
});

for (i=0;i<cities.length;i++){
   option += '<option value="'+ cities [i] + '">' + cities [i] + '</option>';
}

$('#select_city').append(option);
$('#select_city_tophosts').append(option);
selectElement("select_city", "New York City");
selectElement("select_city_tophosts", "Amsterdam");

function selectElement(id, valueToSelect) {
    var element = document.getElementById(id);
    element.value = valueToSelect;
}