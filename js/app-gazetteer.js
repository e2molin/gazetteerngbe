var mobileMode=false;
var  mapAPICNIG = null;
var resultNGBE_lyr=null; // Capa para almacenar resultados de las búsquedas
var tabulatorResults;
var tabulatorHisto;
var lstIndex=[]; // Almacena los índices de los elementos sobre los que se ha hecho clic sobre el mapa.


/**
 * APIBADASID Calls
 */
 
const domainProduction = "http://10.13.90.93/apibadasidv4/";
const domainDeveloper = "http://localhost/apibadasidv4/";
const modoDeveloper = false;
const domainRoot = modoDeveloper === true ? domainDeveloper:domainProduction;

const urlMunisSearcher = `${domainRoot}public/autoridades/municipios`;//'http://localhost/apibadasidv4/public/autoridades/municipios';
const urlHojaMTNSearcher = `${domainRoot}public/autoridades/hojamtn25`;//'http://localhost/apibadasidv4/public/autoridades/hojamtn25';
const municipioInfoByIdServer = `${domainRoot}public/nomenclator/json/entityngbe/id/`;//'http://localhost/apibadasidv4/public/nomenclator/json/entityngbe/id/'
const bboxSearchServer = `${domainRoot}public/nomenclator/json/listngbe/bbox?`;//'http://localhost/apibadasidv4/public/nomenclator/json/listngbe/bbox?'
const ineSearchServer = `${domainRoot}public/nomenclator/json/listngbe/codine/`;//'http://localhost/apibadasidv4/public/nomenclator/json/listngbe/codine/'
const mtn25SearchServer = `${domainRoot}public/nomenclator/json/listngbe/mtn25/`;//'http://localhost/apibadasidv4/public/nomenclator/json/listngbe/mtn25/'
const nameSearchServer  = `${domainRoot}public/nomenclator/json/listngbeINSPIRE/name/`;//'http://localhost/apibadasidv4/public/nomenclator/json/listngbeINSPIRE/name/'
const urlSearchListById = `${domainRoot}public/nomenclator/json/listngbe/id/`;//'http://localhost/apibadasidv4/public/nomenclator/json/listngbe/id/'
const urlSearchHistoEntityById = `${domainRoot}public/nomenclator/json/entityngbehisto/id/`;//'http://localhost/apibadasidv4/public/nomenclator/json/entityngbehisto/id/'


/*-------------------------------------------------------------------------------------------------------------------------------------------------*/
/*
Funciones básicas
*/
String.prototype.beginsWith = (string) => {
    return(this.indexOf(string) === 0);
};

const replaceAllOcurrences = (str, find, replace) => {
    return (str.toString().indexOf(find)===-1 ? str.toString() :  str.toString().replace(new RegExp(find, 'g'), replace));
}

const getFloatNum = (valorNumero) => {
    if (valorNumero==="") {
      return 0;
    }
    if (isNaN(valorNumero)) {
      return 0;
    }
    return parseFloat(valorNumero);
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------*/


/*----------------------------------------*/
/*Botoneras ------------------------------*/
/*----------------------------------------*/

document.getElementById("showPresentacion").addEventListener("click", () => {
    document.getElementById("tabulatorEntityList").style.display = "none";
    document.getElementById("atributosEntity").style.display = "none";
    document.getElementById("presentacion").style.display = "block";
});

const cleanTabulatorResultsFilter = () => {
    document.getElementById("filter-value").value=``;
    document.getElementById("numResultsFilter").textContent = ``;
    tabulatorResults.clearFilter();
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
        url: 'https://tms-ign-base.idee.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg',
        projection: 'EPSG:3857',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        maxZoom: 19,
    });
      
    const objTMSPNOA = new M.layer.XYZ({
        url: 'https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg',
        projection: 'EPSG:3857',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        maxZoom: 19,
    });

    const objWMTSLidar = new M.layer.WMTS({
        url: 'https://wmts-mapa-lidar.idee.es/lidar',
        name: 'EL.GridCoverageDSM',
        matrixSet: 'GoogleMapsCompatible',
        legend: 'Modelo Digital de Superficies LiDAR',
        transparent: true,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: false,
        format: 'image/png',
    });
      
    const objTMSIGNBaseSoloTextos = new M.layer.XYZ({
        url: 'https://tms-ign-base.idee.es/1.0.0/IGNBaseOrto/{z}/{x}/{-y}.png',
        projection: 'EPSG:3857',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        maxZoom: 19,
    });

    const objWMTSMTN501Edi = new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/primera-edicion-mtn?',
        name: 'mtn50-edicion1',
        legend: 'MTN50 1Edi',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/jpeg',
    });

    const objWMTSMTN251Edi = new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/primera-edicion-mtn?',
        name: 'mtn25-edicion1',
        legend: 'MTN25 1Edi',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/jpeg',
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
      layerId: 0,
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

const createAPICNIGMap = () => {

    M.proxy(false);

    mapAPICNIG = new M.map({
        container: 'mapLienzo',
        controls: [ 'scale', 'rotate' , 'location'],
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




$(window).resize(setDivVisibility);
function setDivVisibility(){
    //console.log("Resize W/H:" + $(window).width() + "/" + $(window).height());
    if (($(window).width()) < '768'){  
         mobileMode=true;
    } else {  
         mobileMode=false;
    } 





    console.log($("#codDictio").css("width"));
    $("#muniselect").css("width", $("#codDictio").css("width"));
    $("#mtnselect").css("width", $("#codDictio").css("width"));
    $(".tt-dropdown-menu").css("width", $("#codDictio").css("width"));
    $(".tt-hint").css("width", $("#codDictio").css("width"));
    
 }

document.addEventListener("DOMContentLoaded", function(event) { 

    console.log(`Arranque W/H: ${window.innerWidth} / ${window.innerHeight}`);
    console.log(`${window.innerWidth<768 ? 'Mobile' : 'desktop'}`)

    //Resizing inicial
    $("#muniselect").css("width", $("#sidebar-container").width()-35);
    $("#mtnselect").css("width", $("#sidebar-container").width()-35);
    $(".tt-dropdown-menu").css("width", $("#sidebar-container").width()-35);    
    $(".tt-hint").css("width", $("#sidebar-container").width()-35);    
    
    
    $("#searchByMTNparam").val("");
    $("#searchByNameparam").val("");
    $("#muniselect").val("");
    $("#mtnselect").val("");
    $("#searchByIdparam").val("");
    
       
    // Lanzar mapa
    //basicMap();
    createAPICNIGMap();

    //initialize table
    const dictioIcon = (cell, formatterParams, onRendered)=>{ //plain text value
        return `<img src="img/icons/${cell.getRow().getData().dictiongbe}.png" alt="${cell.getRow().getData().tipo}">`;
    };
    const mapIcon = (cell, formatterParams)=>{ //plain text value
        return "<i class='fa fa-map'></i>";
    };
    const infoIcon = (cell, formatterParams)=>{ //plain text value
        return "<i class='fa fa-info-circle'></i>";
    };

    const centrarVistaSobreToponimo = (longitud,latitud,zoomLevel)=>{
	
        const formatter = new M.format.WKT();
        const wktEj = `POINT (${longitud} ${latitud})`;
        let coordinates_epsg3857 = formatter.read(wktEj, { 
            dataProjection: 'EPSG:4326', 
            featureProjection: 'EPSG:3857' 
            }).getGeoJSON().geometry.coordinates;

        mapAPICNIG.setZoom(zoomLevel);
        mapAPICNIG.setCenter(coordinates_epsg3857);

    }

    const getInfoResult = (e, cell)=>{
        mostrarInfoByNumEnti(cell.getRow().getData().identidad,true);
        document.getElementById("tabulatorEntityList").style.display = "none";
        document.getElementById("atributosEntity").style.display = "block";
    }

    const zoomToResultPosition=(e,cell)=>{
        centrarVistaSobreToponimo(cell.getRow().getData().dataLon,cell.getRow().getData().dataLat,16);                                    
    }

    const updateFilter = () => {
      // Como usamos filtros Add, eliminamos cualquier versión del filtro por nombres que haya
      tabulatorResults.getFilters().forEach((tabFilter) => {
        if (tabFilter.field === "nombre") {
          tabulatorResults.removeFilter("nombre", "like", tabFilter.value);
        }
      });
      let filterValue = document.getElementById("filter-value").value;
      if (isEmptyNullString(filterValue)){return;}
      tabulatorResults.addFilter("nombre", "like", filterValue);
      let numResultadosFiltrados = tabulatorResults.rowManager.activeRowsCount;
      if (numResultadosFiltrados != tabulatorResults.rowManager.rows.length) {
        document.getElementById(
          "numResultsFilter"
        ).textContent = `Filtrados: ${numResultadosFiltrados}`;
      } else {
        document.getElementById("numResultsFilter").textContent = ``;
      }
      console.log(tabulatorResults.getFilters());
    };

    tabulatorResults = new Tabulator("#example-table", {
        /*data:tabledata,*/ //assign data to table
        /*height:"311px",*/
        layout:"fitColumns",
        columns:[
        {formatter: dictioIcon,width:30, hozAlign:"center"},
        {title:"Nombre", field:"nombre", width:320},
        {title:"Tipo", field:"tipo", hozAlign:"left"},
        {title:"dictiongbe", field:"dictiongbe", visible:false},
        {title:"identidad", field:"identidad", visible:false},
        {title:"dataLon", field:"dataLon", visible:false},
        {title:"dataLat", field:"dataLat", visible:false},
        {formatter:mapIcon, width:30, hozAlign:"center", cellClick:zoomToResultPosition},
        {formatter:infoIcon, width:30, hozAlign:"center", cellClick:getInfoResult},
/*        {title:"Rating", field:"rating", hozAlign:"center"},
        {title:"Favourite Color", field:"col", widthGrow:3},
        {title:"Date Of Birth", field:"dob", hozAlign:"center", sorter:"date", widthGrow:2},
        {title:"Driver", field:"car", hozAlign:"center"},*/
        ],
    });

    tabulatorHisto = new Tabulator("#histodataTable", {
        /*data:tabledata,*/ //assign data to table
        /*height:"311px",*/
        layout:"fitColumns",
        columns:[
        {title:"Fecha", field:"fecha", width:100},
        {title:"Usuario", field:"username", width:100, hozAlign:"left"},
        {title:"Campo", field:"tipocambio", hozAlign:"left"},
        {title:"Antes", field:"oldvalue", hozAlign:"left"},
        {title:"Después", field:"newvalue", hozAlign:"left"},
        ],
    });


    document.getElementById("filter-value").addEventListener("keyup", updateFilter);

    document.getElementById("download-csv").addEventListener("click", function(){
        tabulatorResults.download("csv", "data.csv");
    });

    document.getElementById("download-json").addEventListener("click", function(){
        tabulatorResults.download("json", "data.json");
    });

    document.getElementById("download-html").addEventListener("click", function(){
        tabulatorResults.download("html", "data.html", {style:true});
    })

    document.getElementById("zoom-mapResults").addEventListener("click", function(){
        mapAPICNIG.setBbox(resultNGBE_lyr.getFeaturesExtent());
    })


    

    $('#muniselect').typeahead({
        name: 'combomunis',
        prefetch : urlMunisSearcher
      });
      $('#mtnselect').typeahead({
          name: 'combomtn',
          prefetch : urlHojaMTNSearcher
        });

    document.getElementById("alertnosel").style.display = "none";
    document.getElementById("alertnoselMTN").style.display = "none";
    
});
