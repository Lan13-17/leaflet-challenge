// Creating the map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Assemble the query URL.
  let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'
  
  
  // Get the data with d3.
  d3.json(queryUrl).then(function(data) {
  
    // Create a new marker cluster group.
    let layer = L.layerGroup();

    function markerColor(depth) {
        if (depth <= 10) {
            return "green"
        }
        else if (depth <= 30) {
            return "greenyellow"
        }
        else if (depth <= 50) {
            return "yellow"
        }
        else if (depth <= 70) {
            return "orange"
        }
        else if (depth <= 90) {
            return "darkorange"
        }
        else {
            return "red"
        }
    }

    // Get features data
    let feature = data.features;

    // Loop through the data
    for (let i = 0; i < feature.length; i++) {
      layer.addLayer(L.circle([feature[i].geometry.coordinates[1],feature[i].geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: "white",
        fillColor: markerColor(feature[i].geometry.coordinates[2]),
        radius: feature[i].properties.mag*10000
        }).bindPopup(`<h3>${feature[i].properties.place}</h3><hr><p>${new Date(feature[i].properties.time)}</p><p>Magnitude: ${feature[i].properties.mag}</p><p>Depth: ${feature[i].geometry.coordinates[2]}</p>`));
      }
  
    // Add the layer to the map
    myMap.addLayer(layer);

    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let labels = ["-10 - 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "90+"];
        let colors = ["green", "yellowgreen", "yellow", "orange", "darkorange", "red"];

        let legendInfo = "<table style=\"background-color: white\">" +
         "<tr>" +
            "<th>Depth</th>" +
            "<th>Color</th>" +
        "</tr>" +
        "<tr>" +
            "<td>" + labels[0] + "</td>" +
            "<td style=\"background-color: " + colors[0] + "\"></td>" +
        "</tr>" +
        "<tr>" +
            "<td>" + labels[1] + "</td>" +
            "<td style=\"background-color: " + colors[1] + "\"></td>" +
        "</tr>" +
        "<tr>" +
            "<td>" + labels[2] + "</td>" +
            "<td style=\"background-color: " + colors[2] + "\"></td>" +
        "</tr>" +
        "<tr>" +
            "<td>" + labels[3] + "</td>" +
            "<td style=\"background-color: " + colors[3] + "\"></td>" +
        "</tr>" +
        "<tr>" +
            "<td>" + labels[4] + "</td>" +
            "<td style=\"background-color: " + colors[4] + "\"></td>" +
        "</tr>" +
        "<tr>" +
            "<td>" + labels[5] + "</td>" +
            "<td style=\"background-color: " + colors[5] + "\"></td>" +
        "</tr>" +
        "</table>";

        div.innerHTML = legendInfo;

        return div;
    }
    legend.addTo(myMap);
  });