//chosen 2.5+ mag earthquakes; past 30 days for dataset
//python -m http.server 8000 --bind 127.0.0.1
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson

  
// tile layer outline
//   L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.",
//     accessToken: API_KEY
//   }).addTo(myMap);

var quakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";
var plateData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
var plateData2 = "data/Plates.geojson";

d3.json(quakeData, function(data) {
    console.log(data)
    createFeatures(data);
});

function createFeatures(quakes) {
    function onEachLayer(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: circleSize(feature.properties.mag), 
            fillOpacity: 0.5,
            color: getColor(feature.properties.mag),
            fillColor: getColor(feature.properties.mag)
        });
    }
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + "</p>");
    }
    var EQs = L.geoJSON(quakes, {
        onEachFeature: onEachFeature,
        pointToLayer: onEachLayer
    });
    createMap(EQs);
}

function createMap(EQs) {
    var EQlayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
        }); 
    var greyscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
        });
    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
        });  
    var baseMaps = {
        "Satellite": EQlayer,
        "Greyscale": greyscale,
        "Outdoor": outdoors
    };
    var overlayMap = {
        "Earthquakes": EQs
    };
    var myMap = L.map("map", {
        center: [0, 0],
        zoom: 2,
        layers: [EQlayer, EQs]
      });
    L.control.layers(baseMaps, overlayMap, {
        collapsed: true
    }).addTo(myMap);

    var info = L.control({
        position: "bottomright"
    });
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend"),
            labels = ["2.5-3", "3-4", "4-5", "5-6", "6-7", "7+"];
        for (var i = 0; i < labels.length; i++) {
            div.innerHTML += '<i style = "background:' + getColor(i) + '"></i>' + labels[i] + '<br>';  
        }
        return div;
    };
    info.addTo(myMap);
};
function getColor(magnitude) {
    if (magnitude >= 7) {
        return "Red";
    }
    else if (magnitude >=6) {
        return "OrangeRed";
    }
    else if (magnitude >=5) {
        return "DarkOrange";
    }
    else if (magnitude >=4) {
        return "Gold";
    }
    else if (magnitude >=3) {
        return "Yellow";
    }
    else {
        return "YellowGreen";
    }
};

function circleSize(magnitude) {
    return magnitude * 2;
}

//plates
d3.json(plateData, function(plates) {
    L.geoJson(plates).addTo(myMap);
});