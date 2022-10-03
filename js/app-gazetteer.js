var mobileMode=false;
var map;

var  mapAPICNIG = null;

var resultNGBE_lyr=null; // Capa para almacenar resultados de las búsquedas
var projection = ol.proj.get('EPSG:3857');
var tabulatorResults;
var tabulatorHisto;

/**
 * APIBADASID Calls
 */

 
const domainProduction = "http://10.13.90.93/apibadasidv4/";
const domainDeveloper = "http://localhost/apibadasidv4/";
const modoDeveloper = true;
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

/*document.getElementById("showTabulatorResults").addEventListener("click", () => {
    document.getElementById("atributosEntityList").style.display = "none";
    document.getElementById("atributosEntity").style.display = "none";
    document.getElementById("presentacion").style.display = "none";
    document.getElementById("tabulatorEntityList").style.display = "block";
});

document.getElementById("showTabulatorResults").addEventListener("click", () => {
    document.getElementById("atributosEntityList").style.display = "show";
    document.getElementById("atributosEntity").style.display = "none";
    document.getElementById("presentacion").style.display = "none";
    document.getElementById("tabulatorEntityList").style.display = "none";
});*/

const  basicMap = () => {

    loadBasicIGN(true);//Cargamos raster Base IGN apagados excepto la capa por defecto

    map = new ol.Map({
            layers: [primeraEdiBase_lyr,elevaciones_lyr,ignBaseWMTS_lyr,rasterMTN_lyr,pnoaWMTS_lyr,minutasCarto_lyr],
            target: document.getElementById('mapCanvas'),
            logo: false,/*Con esto quitamos el logo de OpenLayers del control de atributos*/
            controls: ol.control.defaults({
                        zoom: ( mobileMode == true ) ? false : true,
                        attribution: ( mobileMode == true ) ? false : true,
						attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
						                    collapsible: true,
                                            tipLabel: 'Créditos',
                                            label:'C'   /*Texto del botón, por defecto es C*/
			                             })
		  }).extend(
                  ( mobileMode == true ) ? [] : []),
		  view: new ol.View({
              projection: 'EPSG:3857', 
              center: ol.proj.transform([-7, 38], 'EPSG:4326', 'EPSG:3857'),
              zoom: 5,minZoom: 4, maxZoom: 19
		  })
    });
    
    //Esta capa almacena los resultados que se muestran
    resultNGBE_lyr = new ol.layer.Vector({
                                    title: 'Resultados',
                                    source: new ol.source.Vector(),
                                    style: customNGBEStyle
    });     
    resultNGBE_lyr.getSource().on("change", function () {
            switch (resultNGBE_lyr.getSource().getState()) {
                case "ready":
                    console.log("Resultados geoJSON cargados: " + resultNGBE_lyr.getSource().getFeatures().length);
                    break;
                case "loading":
                    console.log("Cargando resultados en geoJSON");
                    break;
                default:
                    //$("#ajaxSpinnerImage").hide();
            }
        });          
    map.addLayer(resultNGBE_lyr);  

    
/*Controles */
    var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Capas disponibles' // Optional label for button
    });
    map.addControl(layerSwitcher);
    
    var myScaleLine = new ol.control.ScaleLine()
    map.addControl(myScaleLine);   
    console.log("Terminado");

    var myRotateControl = new ol.control.Rotate()
    map.addControl(myRotateControl);    

    var mousePositionControl = new ol.control.MousePosition({
        className:'ol-mouse-position',                      //Es la clase que define el formato de la etiqueta que contiene las coordendas que se muestran. Valor por defecto
        coordinateFormat: function(coordinate) {
            if (mobileMode==false){
                return ol.coordinate.format(coordinate, dvmGetEscalaNormalizada(map.getView().getZoom()) + '. WGS84 ({x}, {y})', 4);    
            } else {
                return ol.coordinate.format(ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326'), dvmGetEscalaNormalizada(map.getView().getZoom()) + '. Centro WGS84 ({x}, {y})', 4);
            }
        },
        projection:"EPSG:4326",                              //Proyección en que se muestran los datos 
        //target: document.getElementById('mouse-position'), //Contenedor donde se almacenan las coordenadas si estÃ¡ fuera del mapa
        undefinedHTML: '&nbsp;'                            //Valor mostrado cuando no se calculan coordendas.
    });
    map.addControl(mousePositionControl); 
    
    //Declaración de eventos de mapa
    map.on('pointermove', function(evt) {
        //onPointerHover(evt);
        $("#hoverDescript").hide();
        if (evt.dragging) {return;}
        var pixelHover = map.getEventPixel(evt.originalEvent);
        map.forEachFeatureAtPixel(pixelHover, function(feature, layer) {
                $("#hoverDescript").html(feature.get('nombre'));
                $("#hoverDescript").show();
        });
        var hit = map.hasFeatureAtPixel(pixelHover);
        map.getTarget().style.cursor = hit ? 'pointer' : '';
    }); 
       
    
    map.on('singleclick', function(evt) {
            var pixelClic = map.getEventPixel(evt.originalEvent);
            map.forEachFeatureAtPixel(pixelClic, function(feature, layer) {
                //console.log(layer);
                //console.log(feature.get('identidad'));
                mostrarInfoByNumEnti(feature.get('identidad'),true,false);
                $("#atributosEntity").show();
                $("#atributosEntityList").hide();                
                return;
            });
    });        
    
    
    
}


function apicnigBasicMap(){

    mapAPICNIG = new M.map({
        container: 'mapLienzo',
        controls: ['backgroundlayers', 'scaleline', 'rotate' , 'location'],
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

    // var layer = new M.layer.GeoJSON(
    //     {
    //         name: "Provincias", 
    //         url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json",

    //     }
    // );

    return;
    let puntosresult = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
            "type": "Point",
            "coordinates": [
            -5.404296,
            36.970703
            ]
            },
            "properties": {
            "identidad": 2413825,
            "tipo": "Curso natural de agua (5.1)",
            "dictiongbe": 5.1,
            "nombre": "Arroyo de Magallanes"
            }
            },
            {
            "type": "Feature",
            "geometry": {
            "type": "Point",
            "coordinates": [
            -6.224976,
            36.892702
            ]
            },
            "properties": {
            "identidad": 2412230,
            "tipo": "Curso artificial de agua (5.3)",
            "dictiongbe": 5.3,
            "nombre": "Caño de Magallanes"
            }
            },]
    };

    resultNGBE_lyr = new M.layer.GeoJSON(
        {
            name: "Provincias", 
            /*url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json",*/
            source: puntosresult,
            extract: true
        }
    );
    resultNGBE_lyr.setZIndex(100);
    mapAPICNIG.addLayers(resultNGBE_lyr);



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
    console.log("Arranque W/H:" + $(window).width() + "/" + $(window).height());
    if (($(window).width()) < '768'){  
        mobileMode=true;
    } else {  

    }
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
    
    console.log(mobileMode);

    
    // Lanzar mapa
    //basicMap();
    apicnigBasicMap();

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

    const getInfoResult = (e, cell)=>{
        mostrarInfoByNumEnti(cell.getRow().getData().identidad,true);
        $("#atributosEntity").show();
        $("#atributosEntityList").hide();
        $("#tabulatorEntityList").hide();
    }

    const zoomToResultPosition=(e,cell)=>{
        centrarVistaToponimo(map,cell.getRow().getData().dataLon,cell.getRow().getData().dataLat,map.getView().getZoom(),"");                                    
    }

    const updateFilter = () => {
      let filterValue = document.getElementById("filter-value").value;
      tabulatorResults.setFilter("nombre", "like", filterValue);
      let numResultadosFiltrados = tabulatorResults.rowManager.activeRowsCount;
      if (numResultadosFiltrados != tabulatorResults.rowManager.rows.length) {
        document.getElementById(
          "numResultsFilter"
        ).textContent = `Filtrados: ${numResultadosFiltrados}`;
      } else {
        document.getElementById("numResultsFilter").textContent = ``;
      }
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
      /*$("#deslintable").hide();*/
    /*  $("#alertnosel").hide();*/
      /*$("#alertnoselMTN").hide();*/

    

    
});
