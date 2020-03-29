function plot_country_water_scarcity_mapbox(map_container) {
    //mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGthcmthbGEwMSIsImEiOiJjamlhOGF1NHUxNGpwM3Ftbm9kOTBtYmlqIn0.eL-ra45PjGsCc1XMc376jg';
    var map1 = new mapboxgl.Map({
        container: map_container,
        style: 'mapbox://styles/mapbox/light-v9',
        //center: [-74.0059, 40.7128],
        //center: [2.1734, 41.3851],
        center: [19.28512573, 33.45550555], //citycenter_latlog(city), //[-73.95397214865059, 40.729869916914076],
        //center: [2.16711400548186, 41.39243462700611],
        zoom: 0
    });

    var color_city_density = d3.scaleThreshold()
                                .domain([0, 50, 200, 500, 750, 1000, 2000, 3000, 5000])
                                .range(['#F2F12D', '#EED322', '#E6B71E', '#DA9C20',
                                        '#CA8323', '#B86B25', '#A25626', '#8B4225', '#723122']);

    map1.on('load', function () {

        map1.addLayer({
            'id': 'density',
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': 'data/countries_water_scarcity.geojson' // replace this with the url of your own geojson
            },
            'layout': {},
            'paint': {
                'fill-color':
                [
                    'interpolate',
                    ['linear'],
                    ['get', 'water_scarcity_rank'],
                    /*
                    0, color_density(0),
                    1000, color_density(1000)
                    */
                    0, '#fee5d9',
                    1, '#fcbba1',
                    2, '#fc9272',
                    3, '#fb6a4a',
                    4, '#de2d26',
                    5, '#a50f15',
                ],
                'fill-opacity': 0.75
            }
        });

        // When a click event occurs on a feature in the states layer, open a popup at the
        // location of the click, with description HTML from its properties.
        map1.on('click', 'density', function (e) {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(e.features[0].properties.country + ": " +e.features[0].properties.water_scarcity_rank)
                .addTo(map1);
        });
        // Change the cursor to a pointer when the mouse is over the states layer.
        map1.on('mouseenter', 'density', function () {
            map1.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map1.on('mouseleave', 'density', function () {
            map1.getCanvas().style.cursor = '';
        });

    });

    // disable map zoom when using scroll
    map1.scrollZoom.disable();

    // Add zoom and rotation controls to the map.
    map1.addControl(new mapboxgl.NavigationControl());
}