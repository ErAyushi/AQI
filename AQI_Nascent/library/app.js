//define openlayers view
var view = new ol.View({
  center: [80.02, 18.04],
  projection: 'EPSG:4326',
  zoom: 4.52
});
//define openlayers map
var map = new ol.Map({
  target: document.getElementById('map'),
  view: view
});
//define openlayers layer basemap
var osmLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});
//add osmBasemap in map
map.addLayer(osmLayer);

var aqi_cities = new ol.layer.Tile({
  title: 'aqi_cities',
  visible: true,
  source: new ol.source.TileWMS({
    url: 'http://192.168.20.97:8080/geoserver/project/wms',
    params: {
      'LAYERS': `project:India_Boundary`, 'TILED': true,
    },
    servertype: 'geoserver'
  })
});
map.addLayer(aqi_cities)
var India = new ol.layer.Tile({
  title: 'India',
  visible: true,
  source: new ol.source.TileWMS({
    url: 'http://192.168.20.97:8080/geoserver/project/wms',
    params: {
      'LAYERS': ` 	project:aqi_cities1 `, 'TILED': true,
    },
    servertype: 'geoserver'
  })
});
map.addLayer(India);

/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});
map.addOverlay(overlay);


/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

map.on('click', function (evt) {
  debugger
  var cordinate = evt.coordinate;
  var month = document.getElementById('month').value;
  var year = document.getElementById('year').value;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "date": `03-${month}-${year}`
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.20.56:8006/predicts", requestOptions)
    .then(response => response.text())
    .then(result => {
      debugger
      var data = JSON.parse(result);
      var predict = data.data.predict;
      content.innerHTML = '<p>Air Quality Index:</p><code>' + predict + '</code>';
      overlay.setPosition(cordinate)
    })
    .catch(error => console.log('error', error));
});
