// ✅ Capa base OSM
const baseLayer = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

// ✅ Fuente GeoJSON 1 (PA2019)
const vectorSource = new ol.source.Vector({
  url: './data/PA2019.geojson',
  format: new ol.format.GeoJSON(),
});

// ✅ Fuente GeoJSON 2 (PA2020)
const vectorSource3 = new ol.source.Vector({
  url: './data/PA2020.geojson',
  format: new ol.format.GeoJSON(),
});

// ✅ Fuente GeoJSON 3 (PA2021)
const vectorSource4 = new ol.source.Vector({
  url: './data/PA2021.geojson',
  format: new ol.format.GeoJSON(),
});

// ✅ Fuente GeoJSON 4 (PA2021)
const vectorSource5 = new ol.source.Vector({
  url: './data/PA2022.geojson',
  format: new ol.format.GeoJSON(),
});


// ✅ Estilos por atributo
const getStyleByPA19 = (feature) => {
  const value = feature.get('PA2019') || 0;

  // 🚫 No mostrar si el valor es 0, null o undefined
  if (!value || value === 0) {
    return null;
  }

  let fillColor;
  if (value < 20) {
    fillColor = 'rgba(202, 231, 234, 0.8)';
  } else if (value < 100) {
    fillColor = 'rgba(136, 205, 211, 0.8)';
  } else if (value < 500) {
    fillColor = 'rgba(0, 170, 173, 0.8)';
  } else if (value < 2500) {
    fillColor = 'rgba(0, 99, 116, 0.8)';
  } else {
    fillColor = 'rgba(255, 0, 0, 0.8)';
  }

  return new ol.style.Style({
    fill: new ol.style.Fill({ color: fillColor }),
    stroke: new ol.style.Stroke({ color: '#ffffff', width: 1 }),
  });
};

const getStyleByPA20 = (feature) => {
  const value = feature.get('PA2020') || 0;

  // 🚫 No mostrar si el valor es 0, null o undefined
  if (!value || value === 0) {
    return null;
  }

  let fillColor;
  if (value < 200) {
    fillColor = 'rgba(250, 209, 207, 0.8)';
  } else if (value < 500) {
    fillColor = 'rgba(242, 144, 142, 0.8)';
  } else if (value < 1000) {
    fillColor = 'rgba(231, 63, 84, 0.8)';
  } else if (value < 3500) {
    fillColor = 'rgba(187, 50, 87, 0.8)';
  } else {
    fillColor = 'rgba(255, 0, 0, 0.8)';
  }

  return new ol.style.Style({
    fill: new ol.style.Fill({ color: fillColor }),
    stroke: new ol.style.Stroke({ color: '#ffffff', width: 1 }),
  });
};

const getStyleByPA21 = (feature) => {
  const value = feature.get('PA2021') || 0;

  // 🚫 No mostrar si el valor es 0, null o undefined
  if (!value || value === 0) {
    return null;
  }

  let fillColor;
  if (value < 200) {
    fillColor = 'rgba(250, 211, 175, 0.8)';
  } else if (value < 1000) {
    fillColor = 'rgba(248, 179, 119, 0.8)';
  } else if (value < 2000) {
    fillColor = 'rgba(243, 144, 62, 0.8)';
  } else if (value < 3500) {
    fillColor = 'rgba(169, 106, 72, 0.8)';
  } else {
    fillColor = 'rgba(255, 0, 0, 0.8)';
  }

  return new ol.style.Style({
    fill: new ol.style.Fill({ color: fillColor }),
    stroke: new ol.style.Stroke({ color: '#ffffff', width: 1 }),
  });
};

const getStyleByPA22 = (feature) => {
  const value = feature.get('PA2022');

  // 🚫 No mostrar si el valor es 0, null o undefined
  if (!value || value === 0) {
    return null;
  }

  let fillColor;
  if (value < 500) {
    fillColor = 'rgba(160, 206, 240, 0.8)';
  } else if (value < 1000) {
    fillColor = 'rgba(62, 157, 216, 0.8)';
  } else if (value < 5000) {
    fillColor = 'rgba(0, 117, 191, 0.8)';
  } else if (value < 14000) {
    fillColor = 'rgba(0, 83, 130, 0.8)';
  } else {
    fillColor = 'rgba(255, 0, 0, 0.8)';  // ✅ Corregido: tenía `07`
  }

  return new ol.style.Style({
    fill: new ol.style.Fill({ color: fillColor }),
    stroke: new ol.style.Stroke({ color: '#ffffff', width: 1 }),
  });
};


// ✅ Capas vectoriales
const vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: getStyleByPA19,
  visible: false,
});

const vectorLayer3 = new ol.layer.Vector({
  source: vectorSource3,
  style: getStyleByPA20,
  visible: false,
});

const vectorLayer4 = new ol.layer.Vector({
  source: vectorSource4,
  style: getStyleByPA21,
  visible: false,
});

const vectorLayer5 = new ol.layer.Vector({
  source: vectorSource5,
  style: getStyleByPA22,
  visible: false,
});


// ✅ Mapa principal
const map = new ol.Map({
  target: 'map-content',
  layers: [baseLayer, vectorLayer,vectorLayer3, vectorLayer4, vectorLayer5],
  view: new ol.View({
    center: ol.proj.transform([-74.0, 4.5], 'EPSG:4326', 'EPSG:3857'),
    zoom: 6,
  }),
});


// ✅ Popup dinámico
const container = document.createElement('div');
container.className = 'ol-popup';
document.body.appendChild(container);

const popup = new ol.Overlay({       // 🛠️ Cambia "Overlay" por "ol.Overlay"
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
  <label><strong>Personas afectadas por eventos naturales*</strong></label>
<br>
<label><em>(Active la capa que desea ver)</em></label>
<br>
<label>
  <input type="checkbox" id="layer19">
  2019
</label>
<br>
<label>
  <input type="checkbox" id="layer20">
  2020
</label>
<br>
<label>
  <input type="checkbox" id="layer21">
  2021
</label>
<br>
<label>
  <input type="checkbox" id="layer22">
  2022
</label>
<br>
<label><em>*UNGRD. Datos abiertos, 2025</em></label>
<br>
<label><em>Procesamiento EGI OIM</em></label>
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
const legendPA19 = createLegend('Personas afectadas 2019', [
  ['rgba(202, 231, 234, 0.5)', '< 20'],
  ['rgba(136, 205, 211, 0.5)', '20 - 100'],
  ['rgba(0, 170, 173, 0.5)', '100 - 500'],
  ['rgba(0, 99, 116, 0.5)', '500 - 2500'],
  ]);

  const legendPA20 = createLegend('Personas afectadas 2020', [
    ['rgba(250, 209, 207, 0.5)', '< 200'],
    ['rgba(242, 144, 142, 0.5)', '200 - 500'],
    ['rgba(231, 63, 84, 0.5)', '500 - 2000'],
    ['rgba(187, 50, 87, 0.5)', '2000 - 3500'],
    ]);

    const legendPA21 = createLegend('Personas afectadas 2021', [
      ['rgba(250, 211, 175, 0.5)', '< 200'],
      ['rgba(248, 179, 119, 0.5)', '200 - 1000'],
      ['rgba(243, 144, 62, 0.5)', '1000 - 2000'],
      ['rgba(169, 106, 72, 0.5)', '2000 - 3500'],
      ]);

  const legendPA22 = createLegend('Personas afectadas 2022', [
        ['rgba(160, 206, 240, 0.5)', '< 500'],
        ['rgba(62, 157, 216, 0.5)', '500 - 1000'],
        ['rgba(0, 117, 191, 0.5)', '1000 - 5000'],
        ['rgba(0, 83, 130, 0.5)', '5000 - 14000'],
        ]);


// ✅ Función para alternar visibilidad
const toggleLayer = (layer, checkboxId, legend) => {
  const checkbox = document.getElementById(checkboxId);
  checkbox.addEventListener('change', (e) => {
    layer.setVisible(e.target.checked);
    legend.style.display = e.target.checked ? 'block' : 'none';
  });
};

toggleLayer(vectorLayer, 'layer19', legendPA19);
toggleLayer(vectorLayer3, 'layer20', legendPA20);
toggleLayer(vectorLayer4, 'layer21', legendPA21);
toggleLayer(vectorLayer5, 'layer22', legendPA22);


vectorSource5.on('featuresloadend', () => {
  console.log('GeoJSON 2022 cargado correctamente');
});

