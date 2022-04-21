var mobileMode=false;
var map;
var resultNGBE_lyr=null;                        //Capa para almacenar resultados de las búsquedas
var projection = ol.proj.get('EPSG:3857');

/**
 * APIBADASID Calls
 */
const munisActualServer = 'http://localhost/apibadasidv4/public/autoridades/municipios';
const municipioInfoByIdServer = 'http://localhost/apibadasidv4/public/nomenclator/json/entityngbe/id/'
const bboxSearchServer = 'http://localhost/apibadasidv4/public/nomenclator/json/listngbe/bbox?'
const ineSearchServer = 'http://localhost/apibadasidv4/public/nomenclator/json/listngbe/codine/'
const mtn25SearchServer = 'http://localhost/apibadasidv4/public/nomenclator/json/listngbe/mtn25/'
const nameSearchServer  = 'http://localhost/apibadasidv4/public/nomenclator/json/listngbeINSPIRE/name/'


//const munisActualServer = '../apibadasid/general/getAllMunis.php';


/*-------------------------------------------------------------------------------------------------------------------------------------------------*/
/*
Funciones básicas
*/
String.prototype.beginsWith = function (string) {
    return(this.indexOf(string) === 0);
};

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function getFloatNum(valorNumero) {
    if (valorNumero=="") {
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

/*
$("[id^='ngbe']").on("click", function(event) {
    
    console.log("Mostrar información");
});
*/

$("#showPresentacion").on("click", function(event) {
        console.log("Mostrar bienvenida");
        $("#atributosEntityList").hide();
        $("#atributosEntity").hide();
        $("#presentacion").show();
});





function basicMap(){

    loadBasicIGN(true);//Cargamos raster Base IGN apagados excepto la capa por defecto
    //loadBasicOSM(false);//Cargamos raster Overlays OSM apagados

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
    $(".tt-dropdown-menu").css("width", $("#codDictio").css("width"));
    $(".tt-hint").css("width", $("#codDictio").css("width"));
    
 }



$(document).ready(function() {
    console.log("Arranque W/H:" + $(window).width() + "/" + $(window).height());
    if (($(window).width()) < '768'){  
        mobileMode=true;
    } else {  

    }
    //Resizing inicial
    $("#muniselect").css("width", $("#sidebar-container").width()-35);
    $(".tt-dropdown-menu").css("width", $("#sidebar-container").width()-35);    
    $(".tt-hint").css("width", $("#sidebar-container").width()-35);    
    
    
    $("#searchByMTNparam").val("");
    $("#searchByNameparam").val("");
    $("#muniselect").val("");
    $("#searchByIdparam").val("");
    
    console.log(mobileMode);
    basicMap();
    
});