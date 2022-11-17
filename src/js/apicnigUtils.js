/**
 * Aquí definimos la parte del componente Mapa
 * @returns 
 */


export var mapAPICNIG = null;

export const centrarVistaSobreToponimo = (longitud,latitud,zoomLevel)=>{
	
  const formatter = new M.format.WKT();
  const wktEj = `POINT (${longitud} ${latitud})`;
  let coordinates_epsg3857 = formatter.read(wktEj, { 
      dataProjection: 'EPSG:4326', 
      featureProjection: 'EPSG:3857' 
      }).getGeoJSON().geometry.coordinates;

  mapAPICNIG.setZoom(zoomLevel);
  mapAPICNIG.setCenter(coordinates_epsg3857);

}


const getConfiguredBaseLayersPlugin = () => {

  const objWMTSMapa = new M.layer.WMTS({
      url: 'https://www.ign.es/wmts/mapa-raster',
      name: 'MTN',
      matrixSet: 'GoogleMapsCompatible',
      legend: 'Mapa MTN',
      transparent: false,
      displayInLayerSwitcher: false,
      queryable: false,
      visible: true,
      format: 'image/jpeg',
  });

  const objTMSIGNBase = new M.layer.XYZ({
    url: "https://tms-ign-base.idee.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg",
    projection: "EPSG:3857",
    transparent: false,
    displayInLayerSwitcher: false,
    queryable: false,
    visible: true,
    maxZoom: 19,
  });

  const objTMSPNOA = new M.layer.XYZ({
    url: "https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg",
    projection: "EPSG:3857",
    transparent: false,
    displayInLayerSwitcher: false,
    queryable: false,
    visible: true,
    maxZoom: 19,
  });

  const objWMTSLidar = new M.layer.WMTS({
    url: "https://wmts-mapa-lidar.idee.es/lidar",
    name: "EL.GridCoverageDSM",
    matrixSet: "GoogleMapsCompatible",
    legend: "Modelo Digital de Superficies LiDAR",
    transparent: true,
    displayInLayerSwitcher: false,
    queryable: false,
    visible: false,
    format: "image/png",
  });

  const objTMSIGNBaseSoloTextos = new M.layer.XYZ({
    url: "https://tms-ign-base.idee.es/1.0.0/IGNBaseOrto/{z}/{x}/{-y}.png",
    projection: "EPSG:3857",
    transparent: false,
    displayInLayerSwitcher: false,
    queryable: false,
    visible: true,
    maxZoom: 19,
  });

  const objWMTSMTN501Edi = new M.layer.WMTS({
    url: "https://www.ign.es/wmts/primera-edicion-mtn?",
    name: "mtn50-edicion1",
    legend: "MTN50 1Edi",
    matrixSet: "GoogleMapsCompatible",
    transparent: false,
    displayInLayerSwitcher: false,
    queryable: false,
    visible: true,
    format: "image/jpeg",
  });

  const objWMTSMTN251Edi = new M.layer.WMTS({
    url: "https://www.ign.es/wmts/primera-edicion-mtn?",
    name: "mtn25-edicion1",
    legend: "MTN25 1Edi",
    matrixSet: "GoogleMapsCompatible",
    transparent: false,
    displayInLayerSwitcher: false,
    queryable: false,
    visible: true,
    format: "image/jpeg",
  });

  const objWMTSMTNMinutas = new M.layer.WMTS({
      url: 'https://www.ign.es/wmts/primera-edicion-mtn?',
      name: 'catastrones',
      legend: 'Minutas MTN',
      matrixSet: 'GoogleMapsCompatible',
      transparent: false,
      displayInLayerSwitcher: false,
      queryable: false,
      visible: true,
      format: 'image/jpeg',
  });

  const objWMSPlanimetrias = new M.layer.WMS({
      url: 'https://www.ign.es/wms/minutas-cartograficas?',
      name: 'Minutas',
      legend: 'Planimetrías',
      tiled: false,
      visibility: true,
  }, {})

  const objWMSMTNTradicional = new M.layer.WMS({
      url: 'http://10.67.33.132/wms10-inspire/mapa-raster?',
      name: 'mtn_rasterizado',
      legend: 'Tradicional',
      tiled: true,
      visibility: true,
  }, {})

  return new M.plugin.BackImgLayer({
    position: 'TR',
    layerId: 1,
    layerVisibility: true,
    collapsed: true,
    collapsible: true,
    columnsNumber: 5,
    layerOpts: [
      // Mapa MTN
      {
        id: 'MAPAMTN',
        title: 'Mapa MTN',
        preview: 'img/previewrastermtn.png',
        layers: [objWMTSMapa],
      },

      {
        id: 'mapa',
        preview: 'img/previewcallejero.png',
        title: 'Mapa base',
        layers: [objTMSIGNBase],
      },
      {
        id: 'imagen',
        title: 'PNOA',
        preview: 'img/previewpnoa.png',
        layers: [objTMSPNOA],
      },
      {
        id: 'hibrido',
        title: 'PNOA Híbrido',
        preview: 'img/previewpnoahibrido.png',
        layers: [objTMSPNOA,objTMSIGNBaseSoloTextos],
      },
      // LiDAR Híbrido
      {
        id: 'lidar-hibrido',
        title: 'LiDAR Híbrido',
        preview:  'img/previewlidarhibrido.png',
        layers: [objWMTSLidar,objTMSIGNBaseSoloTextos],
      },
      // LiDAR Híbrido
      {
          id: 'mtntradicional',
          title: 'MTN Tradicional',
          preview:  'img/previewmtntradicional.png',
          layers: [objWMSMTNTradicional],
      },
      //  MTN25 1Edi
      {
        id: 'MTN251Edi',
        preview: 'img/previewmtn25old.png',
        title: 'MTN25 1Edi',
        layers: [objWMTSMTN251Edi],
      },
      //  MTN50 1Edi
      {
        id: 'MTN501Edi',
        preview: 'img/previewmtn50old.png',
        title: 'MTN50 1Edi',
        layers: [objWMTSMTN501Edi],
      },
      //  Minutas
      {
          id: 'minutasmtn',
          preview: 'img/previewminutas.png',
          title: 'Minutas MTN',
          layers: [objWMTSMTNMinutas],
      },
      //  Planimetrías
      {
          id: 'planimetrias',
          preview: 'img/previewplanimetrias.png',
          title: 'Planimetrías',
          layers: [objWMSPlanimetrias],
      },
    ],
  });
}

export const createAPICNIGMap = () => {

  M.proxy(false);

  mapAPICNIG = new M.map({
      container: 'mapLienzo',
      controls: [ 'scale', 'rotate'],
      zoom: 5,
      maxZoom: 22,
      minZoom: 4,
      projection: "EPSG:3857*m",
      center: {
          x: -712300,
          y: 4310700,
          draw: false  //Dibuja un punto en el lugar de la coordenada
      },
  });

  /**
   * Definición de botones
   */
   mapAPICNIG.addPlugin(getConfiguredBaseLayersPlugin());

   mapAPICNIG.addPlugin(new M.plugin.MeasureBar({
                              position: 'TL'
   }));
   mapAPICNIG.addPlugin(new M.plugin.Infocoordinates({
      position: 'TL'
  }));

  mapAPICNIG.addPlugin(new M.plugin.MouseSRS({
      tooltip: "Muestra coordenadas",
      srs: "EPSG:4326",
      label: "WGS84",
      precision: 4,
      geoDecimalDigits: 3,
      utmDecimalDigits: 2,
      activeZ: false
  }));

  mapAPICNIG.addPlugin(new M.plugin.FullTOC({
    position: 'TR',
    collapsed: true,
  }));

  mapAPICNIG.addPlugin(new M.plugin.IGNSearchLocator({
    position: 'TL',
    collapsible: true,
    isCollapsed: true,
  }));

}