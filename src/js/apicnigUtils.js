import previewcallejero from '../img/previewcallejero.png';
import previewrastermtn from '../img/previewrastermtn.png';
import previewpnoa from '../img/previewpnoa.png';
import previewpnoahibrido from '../img/previewpnoahibrido.png';
import previewlidarhibrido from '../img/previewlidarhibrido.png';
import previewmtntradicional from '../img/previewmtntradicional.png';
import previewminutas from '../img/previewminutas.png';
import previewmtn25old from '../img/previewmtn25old.png';
import previewmtn50old from '../img/previewmtn50old.png';
import previewplanimetrias from '../img/previewplanimetrias.png';

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

const PRECHARGED_LYRS = {
  services: [{
      name: 'Camino de Santiago',
      type: 'WMS',
      url: 'https://www.ign.es/wms-inspire/camino-santiago',
    },
    {
      name: 'Redes Geodésicas',
      type: 'WMS',
      url: 'https://www.ign.es/wms-inspire/redes-geodesicas',
    },
    {
      name: 'Planimetrías',
      type: 'WMS',
      url: 'https://www.ign.es/wms/minutas-cartograficas',
    },
  ],
  groups: [{
      name: 'Cartografía',
      services: [{
          name: 'Mapas',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/mapa-raster?',
        },
        {
          name: 'Callejero ',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/ign-base?',
        },
        {
          name: 'Primera edición MTN y Minutas de 1910-1970',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/primera-edicion-mtn?',
        },
        {
          name: 'Planimetrías (1870 y 1950)',
          type: 'WMS',
          url: 'https://www.ign.es/wms/minutas-cartograficas?',
        },
        {
          name: 'Planos de Madrid (1622 - 1960)',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/planos?',
        },
        {
          name: 'Hojas kilométricas (Madrid - 1860)',
          type: 'WMS',
          url: 'https://www.ign.es/wms/hojas-kilometricas?',
        },
        {
          name: 'Cuadrículas Mapa Topográfico Nacional',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/cuadriculas?',
        },

      ],
    },
    {
      name: 'Imágenes',
      services: [{
          name: 'Ortofotos máxima actualidad PNOA',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/pnoa-ma?',
        },
        {
          name: 'Ortofotos históricas y PNOA anual',
          type: 'WMS',
          url: 'https://www.ign.es/wms/pnoa-historico?',
        },
        {
          name: 'Ortofotos provisionales PNOA',
          type: 'WMS',
          url: 'https://wms-pnoa.idee.es/pnoa-provisionales?',
        },
        {
          name: 'Mosaicos de satélite',
          type: 'WMS',
          url: 'https://wms-satelites-historicos.idee.es/satelites-historicos?',
        },
        {
          name: 'Fototeca (Consulta de fotogramas históricos y PNOA)',
          type: 'WMS',
          url: 'https://wms-fototeca.idee.es/fototeca?',
        },
      ],
    },
    {
      name: 'Información geográfica de referencia y temática',
      services: [{
          name: 'Catastro ',
          type: 'WMS',
          url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
        },
        {
          name: 'Unidades administrativas',
          type: 'WMS',
          url: ' https://www.ign.es/wms-inspire/unidades-administrativas?',
        },
        {
          name: 'Nombres geográficos (Nomenclátor Geográfico Básico NGBE)',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/ngbe?',
        },
        {
          name: 'Redes de transporte',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/transportes?',
        },
        {
          name: 'Hidrografía ',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/hidrografia?',
        },
        {
          name: 'Direcciones y códigos postales',
          type: 'WMS',
          url: 'https://www.cartociudad.es/wms-inspire/direcciones-ccpp?',
        },
        {
          name: 'Ocupación del suelo (Corine y SIOSE)',
          type: 'WMTS',
          url: 'https://servicios.idee.es/wmts/ocupacion-suelo?',
        },
        {
          name: 'Ocupación del suelo Histórico (Corine y SIOSE)',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/ocupacion-suelo-historico?',
        },
        {
          name: 'Copernicus Land Monitoring Service',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms/copernicus-landservice-spain?',
        },
        {
          name: 'Información sísmica (terremotos)',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/geofisica?',
        },
        {
          name: 'Red de vigilancia volcánica',
          type: 'WMS',
          url: 'https://wms-volcanologia.ign.es/volcanologia?',
        },
        {
          name: 'Redes geodésicas',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/redes-geodesicas?',
        },
      ],
    },
    {
      name: 'Modelos digitales de elevaciones',
      services: [{
          name: 'Modelo Digital de Superficies (Sombreado superficies y consulta de elevaciones edificios y vegetación)',
          type: 'WMTS',
          url: 'https://wmts-mapa-lidar.idee.es/lidar?',
        },
        {
          name: 'Modelo Digital del Terreno (Sombreado terreno y consulta de altitudes)',
          type: 'WMTS',
          url: 'https://servicios.idee.es/wmts/mdt?',
          white_list: ['EL.ElevationGridCoverage'],
        },
        {
          name: 'Curvas de nivel y puntos acotados',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/mdt?',
          white_list: ['EL.ContourLine', 'EL.SpotElevation'],
        },
      ],
    },

  ],
};


const PRECHARGED_LYRS_AT = {
  groups: [

    {
      name: 'Imágenes',
      services: [
        {
            "name": "Ortofotos máxima actualidad PNOA",
            "type": "WMTS",
            "url": "https://www.ign.es/wmts/pnoa-ma?"
        },
        {
            "name": "Ortofotos históricas y PNOA anual",
            "type": "WMS",
            "url": "https://www.ign.es/wms/pnoa-historico?"
        },
        {
            "name": "Ortofotos provisionales PNOA",
            "type": "WMS",
            "url": "https://wms-pnoa.idee.es/pnoa-provisionales?"
        },
        {
            "name": "Mosaicos de satélite",
            "type": "WMS",
            "url": "https://wms-satelites-historicos.idee.es/satelites-historicos?"
        }
    ],
    },

    {
      name: 'Cartografía y Archivo Topográfico',
      services: [
        {
          name: 'Mapas actuales',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/mapa-raster?',
          // white_list: ['MTN'],
        },
        {
          name: 'Distribuidor Mapa Topográfico Nacional',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/cuadriculas?',
          // white_list: ['Grid-ETRS89-lonlat-50k', 'Grid-ETRS89-lonlat-25k'],
        },
        {
          name: 'Primeras ediciones MTN y Minutas de MTN (1910 - 1970)',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/primera-edicion-mtn?',
          // white_list: ['mtn50-edicion1', 'mtn25-edicion1', 'catastrones'],
        },
        {
          name: 'Planimetrías (1870-1950)',
          type: 'WMS',
          url: 'https://www.ign.es/wms/minutas-cartograficas',
          // white_list: ['Minutas'],
        },
        {
          name: 'Hojas Kilométricas (1860 - 1869)',
          type: 'WMS',
          url: 'https://www.ign.es/wms/hojas-kilometricas',
          // white_list: ['Mapas', 'Parcelas_Catastrales'],
        },
        {
          name: "Planos de Madrid (1622 - 1960)",
          type: "WMTS",
          url: "https://www.ign.es/wmts/planos?"
      }
      ],
    },
    {
      name: 'Divisiones administrativas',
      services: [
        {
          name: 'Líneas Límite',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
          // white_list: ['AU.AdministrativeUnit'],
        },
        {
          name: 'Línea de costa',
          type: 'WMS',
          url: 'https://ideihm.covam.es/ihm-inspire/wms-hidrografia-p',
          // white_list: ['HY'],
        },
        {
          name: 'Límites marítimos',
          type: 'WMS',
          url: 'https://ideihm.covam.es/ihm-inspire/wms-unidadesmaritimas',
          // white_list: ['LBR', 'ZEEE', 'ZEEE_textos', 'PC', 'MT'],
        },
      ],
    },

    {
      name: "Modelos digitales de elevaciones",
      services: [
          {
              name: "Modelo Digital de Superficies (Sombreado superficies y consulta de elevaciones edificios y vegetaciÃ³n)",
              type: "WMTS",
              url: "https://wmts-mapa-lidar.idee.es/lidar?"
          },
          {
              name: "Modelo Digital del Terreno (Sombreado terreno y consulta de altitudes)",
              type: "WMTS",
              url: "https://servicios.idee.es/wmts/mdt?"
          },
          {
              name: "Curvas de nivel y puntos acotados",
              type: "WMS",
              url: "https://servicios.idee.es/wms-inspire/mdt?",
              // white_list: [
              //     "EL.ContourLine",
              //     "EL.SpotElevation"
              // ]
          }
          
      ]
    },

    {
      name: 'Otras capas',
      services: [
        {
          name: 'Catastro',
          type: 'WMS',
          url: 'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
          // white_list: ['Catastro'],
        },
        {
          name: 'Topónimos',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/ign-base?',
          // white_list: ['IGNBaseOrto'],
        },
        {
          name: 'Redes de transporte',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/transportes',
          // white_list: ['TN.RoadTransportNetwork.RoadLink'],
        },
        {
          name: 'Ocupación del suelo (CORINE y SIOSE)',
          type: 'WMTS',
          url: 'https://servicios.idee.es/wmts/ocupacion-suelo?',
          // white_list: ['LC.LandCoverSurfaces'],
        },
        {
          name: "Ocupación del suelo histórico (Corine y SIOSE)",
          type: "WMS",
          url: "https://servicios.idee.es/wms-inspire/ocupacion-suelo-historico?"
        },
        {
          name: "Copernicus Land Monitoring Service",
          type: "WMS",
          url: "https://servicios.idee.es/wms/copernicus-landservice-spain?"
      }
      ],
    },
  ],
};



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
        preview: previewrastermtn,
        layers: [objWMTSMapa],
      },

      {
        id: 'mapa',
        preview: previewcallejero,
        title: 'Mapa base',
        layers: [objTMSIGNBase],
      },
      {
        id: 'imagen',
        title: 'PNOA',
        preview: previewpnoa,
        layers: [objTMSPNOA],
      },
      {
        id: 'hibrido',
        title: 'PNOA Híbrido',
        preview: previewpnoahibrido,
        layers: [objTMSPNOA,objTMSIGNBaseSoloTextos],
      },
      // LiDAR Híbrido
      {
        id: 'lidar-hibrido',
        title: 'LiDAR Híbrido',
        preview:  previewlidarhibrido,
        layers: [objWMTSLidar,objTMSIGNBaseSoloTextos],
      },
      // LiDAR Híbrido
      {
          id: 'mtntradicional',
          title: 'MTN Tradicional',
          preview:  previewmtntradicional,
          layers: [objWMSMTNTradicional],
      },
      //  MTN25 1Edi
      {
        id: 'MTN251Edi',
        preview: previewmtn25old,
        title: 'MTN25 1Edi',
        layers: [objWMTSMTN251Edi],
      },
      //  MTN50 1Edi
      {
        id: 'MTN501Edi',
        preview: previewmtn50old,
        title: 'MTN50 1Edi',
        layers: [objWMTSMTN501Edi],
      },
      //  Minutas
      {
          id: 'minutasmtn',
          preview: previewminutas,
          title: 'Minutas MTN',
          layers: [objWMTSMTNMinutas],
      },
      //  Planimetrías
      {
          id: 'planimetrias',
          preview: previewplanimetrias,
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

  // mapAPICNIG.addPlugin(new M.plugin.FullTOC({
  //   position: 'TR',
  //   collapsed: true,
  // }));

  console.log(PRECHARGED_LYRS);

  mapAPICNIG.addPlugin(new M.plugin.Layerswitcher({
    position: 'TR',
    collapsed: true,
    collapsible: true,
    showCatalog: true,
    https:true,
    http: true,
    precharged: PRECHARGED_LYRS_AT,
    isDraggable: false,
    tooltip: "Gestor de capas",
    isMoveLayers: false,
    modeSelectLayers: 'eyes', //'radio'
    useProxy:'true',
    displayLabel: 'false'
  }));


  mapAPICNIG.addPlugin(new M.plugin.IGNSearchLocator({
    position: 'TL',
    collapsible: true,
    isCollapsed: true,
  }));

}