// ✅ Importación de OpenLayers
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import OSM from 'ol/source/OSM.js';
import { Style, Fill, Stroke } from 'ol/style';
import { transform } from 'ol/proj';
import Overlay from 'ol/Overlay'

// ✅ Capa base OSM
const baseLayer = new TileLayer({
  source: new OSM(),
});

// ✅ Fuente GeoJSON 1 (PIN)
const vectorSource = new VectorSource({
  url: './data/pin_deptos2.geojson',
  format: new GeoJSON(),
});

// ✅ Fuente GeoJSON 2 (IPM)
const vectorSource2 = new VectorSource({
  url: './data/IPM.geojson',
  format: new GeoJSON(),
});

// ✅ Estilos por atributo
const getStyleByPIN = (feature) => {
  const value = feature.get('PIN_PIN') || 0;

  let fillColor;
  if (value < 5000) {
    fillColor = 'rgba(202, 231, 234, 0.5)';
  } else if (value < 50000) {
    fillColor = 'rgba(136, 205, 211, 0.5)';
  } else if (value < 200000) {
    fillColor = 'rgba(0, 170, 173, 0.5)';
  } else if (value < 900000) {
    fillColor = 'rgba(0, 99, 116, 0.5)';
  } else {
    fillColor = 'rgba(255, 0, 0, 0.5)';
  }

  return new Style({
    fill: new Fill({ color: fillColor }),
    stroke: new Stroke({ color: '#ffffff', width: 1 }),
  });
};

const getStyleByIPM = (feature) => {
  const value = feature.get('IPM_Munici') || 0;

  let fillColor;
  if (value < 25) {
    fillColor = 'rgba(250, 196, 149, 0.6)';   // 
  } else if (value < 50) {
    fillColor = 'rgba(245, 163, 90, 0.6)';    // 
  } else if (value < 80) {
    fillColor = 'rgba(207, 124, 67, 0.6)';    // 
  } else if (value > 80) {
    fillColor = 'rgba(169, 106, 72, 0.6)';    // 
   }

  return new Style({
    fill: new Fill({ color: fillColor }),
    stroke: new Stroke({ color: '#ffffff', width: 1 }),
  });
};

// ✅ Capas vectoriales
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: getStyleByPIN,
  visible: false,             // 🔥 Oculta la capa por defecto
});

const vectorLayer2 = new VectorLayer({
  source: vectorSource2,
  style: getStyleByIPM,
  visible: false,             // 🔥 Oculta la capa por defecto
});

// ✅ Mapa principal
const map = new Map({
  target: 'map-content',
  layers: [baseLayer, vectorLayer, vectorLayer2],
  view: new View({
    center: transform([-74.0, 4.5], 'EPSG:4326', 'EPSG:3857'),
    zoom: 6,
  }),
});

// ✅ Popup dinámico
const container = document.createElement('div');
container.className = 'ol-popup';
document.body.appendChild(container);

const popup = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: { duration: 250 },
});

map.addOverlay(popup);

map.on('singleclick', (event) => {
  let foundFeature = false;

  map.forEachFeatureAtPixel(event.pixel, (feature) => {
    const coordinates = event.coordinate;
    const properties = feature.getProperties();

    let content = `<strong>Datos:</strong><br>`;
    for (const key in properties) {
      if (key !== 'geometry') {
        content += `<strong>${key}:</strong> ${properties[key]}<br>`;
      }
    }

    container.innerHTML = content;
    container.style.display = 'block';
    popup.setPosition(coordinates);

    foundFeature = true;
  });

  if (!foundFeature) {
    container.style.display = 'none';
  }
});

map.on('pointermove', (event) => {
  const hit = map.hasFeatureAtPixel(event.pixel);
  map.getViewport().style.cursor = hit ? 'pointer' : '';
});

// ✅ Controles de visibilidad
const controlsContainer = document.createElement('div');
controlsContainer.style.position = 'absolute';
controlsContainer.style.top = '10px';
controlsContainer.style.left = '10px';
controlsContainer.style.background = '#fff';
controlsContainer.style.padding = '10px';
controlsContainer.style.border = '1px solid #ccc';
controlsContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
controlsContainer.style.zIndex = '1000';
controlsContainer.style.borderRadius = '5px';

controlsContainer.innerHTML = `
  <label>
  Capas
  <label>
  <br>
  <label>
    <input type="checkbox" id="layer1">   <!-- 🔥 No marcado por defecto -->
    PIN 
  </label>
  <br>
  <label>
    <input type="checkbox" id="layer2">   <!-- 🔥 No marcado por defecto -->
    IPM 
  </label>
`;

document.body.appendChild(controlsContainer);

// ✅ Leyendas para cada capa
const createLegend = (title, colors) => {
  const legend = document.createElement('div');
  legend.style.position = 'absolute';
  legend.style.bottom = '10px';
  legend.style.right = '10px';
  legend.style.background = '#fff';
  legend.style.padding = '10px';
  legend.style.border = '1px solid #ccc';
  legend.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  legend.style.zIndex = '1000';
  legend.style.borderRadius = '5px';
  legend.style.fontFamily = 'Arial, sans-serif';

  let content = `<strong>${title}</strong>`;
  colors.forEach(([color, label]) => {
    content += `
      <div style="display: flex; align-items: center; margin-top: 5px;">
        <div style="width: 20px; height: 20px; background: ${color}; margin-right: 5px;"></div>
        <span>${label}</span>
      </div>
    `;
  });

  legend.innerHTML = content;
  document.body.appendChild(legend);

  legend.style.display = 'none';  // 🔥 Inicialmente oculta
  return legend;
};

// ✅ Leyendas para cada GeoJSON
const legendPIN = createLegend('PIN 2024', [
  ['rgba(202, 231, 234, 0.5)', '< 5000'],
  ['rgba(136, 205, 211, 0.5)', '5000 - 50000'],
  ['rgba(0, 170, 173, 0.5)', '50000 - 200000'],
  ['rgba(0, 99, 116, 0.5)', '200000 - 900000'],
  ]);

const legendIPM = createLegend('IPM', [
  ['rgba(250, 196, 149, 0.6)', 'IPM < 25'],
  ['rgba(245, 163, 90, 0.6)', 'IPM 25 - 50'],
  ['rgba(207, 124, 67, 0.6)', 'IPM 50 - 80'],
  ['rgba(169, 106, 72, 0.6)', 'IPM > 80']
]);

// ✅ Función para alternar visibilidad
const toggleLayer = (layer, checkboxId, legend) => {
  const checkbox = document.getElementById(checkboxId);
  checkbox.addEventListener('change', (e) => {
    layer.setVisible(e.target.checked);
    legend.style.display = e.target.checked ? 'block' : 'none';
  });
};

toggleLayer(vectorLayer, 'layer1', legendPIN);
toggleLayer(vectorLayer2, 'layer2', legendIPM);
