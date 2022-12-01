//create map object

var base = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})

var map = L.map("map", {
    center: [28.21, -25.22],
    zoom: 3
});

base.addTo(map);


//retrieve earthquake data using d3
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson").then(function (data) {
    function styleMarker(feature) {
        return {
            radius: getRad(feature.properties.mag),
            fillColor: getColor(feature.geometry.coordinates[2]),
            opacity: 0.75,
            fillOpacity: 0.8,
            color: "black",
            stroke: true,
            weight: 0.45
        };
    }

    function getRad(magnitude) {
        return magnitude * 3;

    }

    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return "purple";
            case depth > 70:
                return "darkred";
            case depth > 50:
                return "darkorange";
            case depth > 30:
                return "gold";
            case depth > 10:
                return "greenyellow";
            default:
                return "palegreen";
        }

    };

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleMarker,

        onEachFeature: function (feature, layer) {
            layer.on({
                mouseover: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 1
                    });
                },
                mouseout: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.3
                    });
                },
            });

            layer.bindPopup(
                "Location: " + feature.properties.place
                + "<br>Depth: " + feature.geometry.coordinates[2]
                + "<br>Magnitude " + feature.properties.mag
            );
        }
    }).addTo(map);



    var legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "legend info"),
            depth = [-10, 10, 30, 50, 70, 90];
        var colors = ["purple", "darkred", "darkorange", "gold", "greenyellow", "palegreen"]
        
        div.innerHTML += "<h4 style='text-align: center'>Depth</h4>"

        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);
});