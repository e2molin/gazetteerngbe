var resultToponim_lyr;

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;
    // Test values; Uncomment to check result …
    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
    // IE 12 / Spartan
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
    // Edge (IE 12+)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

      var msie = ua.indexOf('MSIE ');
      if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }

      var trident = ua.indexOf('Trident/');
      if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }

      var edge = ua.indexOf('Edge/');
      if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }

      // other browser
      return false;
}

function dvmGetEscalaNormalizada(nivelZoom){
    
    switch(nivelZoom) {
                    case 20:
                        return "Escala 1:500";
                        break;
                    case 19:
                        return "Escala 1:1.000";
                        break;
                    case 18:
                        return "Escala 1:2.000";
                        break;
                    case 17:
                        return "Escala 1:4.250";
                        break;
                    case 16:
                        return "Escala 1:8.500";
                        break;
                    case 15:
                        return "Escala 1:17.000";
                        break;
                    case 14:
                        return "Escala 1:34.000";
                        break;
                    case 13:
                        return "Escala 1:68.000";
                        break;
                    case 12:
                        return "Escala 1:136.500";
                        break; 
                    case 11:
                        return "Escala 1:273.000";
                        break; 
                    case 10:
                        return "Escala 1:546.000";
                        break; 
                    case 9:
                        return "Escala 1:1.100.000";
                        break; 
                    case 8:
                        return "Escala 1:2.185.000";
                        break; 
                    case 7:
                        return "Escala 1:4.370.000";
                        break; 
                    case 6:
                        return "Escala 1:8.735.000";
                        break; 
                    case 5:
                        return "Escala 1:17.471.000";
                        break; 
                    case 4:
                        return "Escala 1:34.942.000";
                        break; 
                    default:
                        return "Zoom " + nivelZoom;
                        break;
                }
}


/*
Lista por consola las capas del mapa y sus propiedades
*/
function dvmListLayersOnConsole(mapOL3){
    
    console.log("Lista por consola las capas del mapa y sus propiedades");
    var listaGrupos=mapOL3.getLayers();
    //Recorremos todas las capas y escribimos su nombre
    listaGrupos.forEach(function(grupoLayers, i) {
            
            if (grupoLayers instanceof ol.layer.Group) {
                console.log("Título grupo: " + grupoLayers.getProperties()['title']);
                grupoLayers.getLayers().forEach(function(sublayer, j) {
                    if (sublayer instanceof ol.layer.Base){
                        //console.log(sublayer.getProperties());
                        //console.log("Título base: " + sublayer.getProperties()['title'] + "/" + sublayer.getProperties()['keyname']);        
                        console.log("Base: " + sublayer.getProperties()['keyname']);
                    }
                });
            }
            if (grupoLayers instanceof ol.layer.Base) {
                console.log("Base: " + grupoLayers.getProperties()['keyname']);
            }
    });
    
}

/*
Lista por consola las propiedades geométricas del mapa mostrado
*/
function dvmListMapGemPropertiesOnConsole(mapOL3){
    
    var pixelExtent = mapOL3.getSize();
    console.log("Coordenadas pixel del lienzo");
	console.log(pixelExtent);   
    //Extensión del lienzo
	var extent = mapOL3.getView().calculateExtent(mapOL3.getSize());
    console.log("Coordenadas en SRID del lienzo.(epsg:3857)");
	console.log(extent);
    console.log("Coordenadas en epsg:4326 del lienzo");
	extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
    console.log(extent);
	
	//Centro del lienzo
	var centro = mapOL3.getView().getCenter();//Devuelve un ol.Coordinate en el sistema de proyección, en nuestro caso 3857
    console.log("Coordenadas en SRID del centro del lienzo.(epsg:3857)");
	console.log(centro);
    console.log("Coordenadas en epsg:4326 del centro del lienzo");
	centro = ol.proj.toLonLat(centro, 'EPSG:3857');//Devuelve un ol.Coordinate transformado a 4326
	console.log(centro);

    //Centro del lienzo
    console.log("Nivel de Zoom: " + mapOL3.getView().getZoom());

}

/*
Lista por consola información del punto pinchado
*/
function dvmShowInfoClicOnConsole(mapOL3,eventClic){
    
    //Obtenemos el pixel pinchado
    var pixel = mapOL3.getEventPixel(eventClic.originalEvent);
    console.log("Punto pinchado en coordenadas pixel del lienzo (Left,Top): " + pixel);
    //Obtenemos coordenadas correspondientes al pixel pinchado
	var pointClick = mapOL3.getCoordinateFromPixel(pixel);	
	console.log("Punto pinchado en coordenadas del lienzo: " + pointClick);
	pointClick = ol.proj.toLonLat(pointClick, 'EPSG:3857');//Devuelve un ol.Coordinate transformado a 4326
	console.log("Punto pinchado en coordenadas epsg:4326: " + pointClick);
    console.log("Coordenada X en coordenadas epsg:4326: " + pointClick[0]);
    console.log("Coordenada Y en coordenadas epsg:4326: " + pointClick[1]);
    
}

/*
Apaga todas las capas que son base
*/
function dvmSetAllBaseLayerNoVisible(mapOL3){
    
    console.log("Apaga todas las capas que son base");
    var listaGrupos=mapOL3.getLayers();
    //Recorremos todas las capas y escribimos su nombre
    listaGrupos.forEach(function(grupoLayers, i) {
            //console.log("Título grupo: " + grupoLayers.getProperties()['title']);
            if (grupoLayers instanceof ol.layer.Group) {
                grupoLayers.getLayers().forEach(function(sublayer, j) {
                    if (sublayer instanceof ol.layer.Base){
                         if (sublayer.getProperties()['type']=='base'){
                             sublayer.setVisible(false);
                         }
                        //console.log(sublayer.getProperties());
                        //console.log("Título base: " + sublayer.getProperties()['title']);        
                    }
            });
        }
    });
}

/*
Nos dice si una capa existe o no existe
*/
function dvmIsLayerVisible(mapOL3,layerNombre){
    
    var listaGrupos=mapOL3.getLayers();
    var resultado=-99;
    //Recorremos todas las capas y escribimos su nombre
    listaGrupos.forEach(function(grupoLayers, i) {
            if (grupoLayers instanceof ol.layer.Group) {
                grupoLayers.getLayers().forEach(function(sublayer, j) {
                    if (sublayer instanceof ol.layer.Base){
                        if (sublayer.getProperties()['title']==layerNombre){
                            resultado=sublayer.getProperties()['visible'];
                            return resultado;
                        }
                    }
            });
        }
    });
    return resultado;
}

function dvmIsLayerVisibleByKey(mapOL3,layerKey){
    
    var listaGrupos=mapOL3.getLayers();
    var resultado=-99;
    //Recorremos todas las capas y escribimos su nombre
    listaGrupos.forEach(function(grupoLayers, i) {
            //Si el elemento está en un grupo
            if (grupoLayers instanceof ol.layer.Group) {
                grupoLayers.getLayers().forEach(function(sublayer, j) {
                    if (sublayer instanceof ol.layer.Base){
                        if (sublayer.getProperties()['keyname']==layerKey){
                            resultado=sublayer.getProperties()['visible'];
                            return resultado;
                        }
                    }
                });
            }
            //Si el elemento no está en un grupo y es una capa base
            if (grupoLayers instanceof ol.layer.Base) {
                        if (grupoLayers.getProperties()['keyname']==layerKey){
                            resultado=grupoLayers.getProperties()['visible'];
                            return resultado;
                        }
            }
    });
    return resultado;
}


function setLayerVisibleByKey(mapOL3,layerKey,visibleValue){
    
    var listaGrupos=mapOL3.getLayers();
    var resultado=-99;
    //Recorremos todas las capas y escribimos su nombre
    listaGrupos.forEach(function(grupoLayers, i) {
            if (grupoLayers instanceof ol.layer.Group) {
                grupoLayers.getLayers().forEach(function(sublayer, j) {
                    if (sublayer instanceof ol.layer.Base){
                        if (sublayer.getProperties()['keyname']==layerKey){
                            sublayer.setVisible(visibleValue);
                        }
                    }
            });
        }
    });
}

function setLayerZindex(mapOL3,layerKey,stackValue){
    
    var listaGrupos=mapOL3.getLayers();
    var resultado=-99;
    //Recorremos todas las capas y escribimos su nombre
    listaGrupos.forEach(function(grupoLayers, i) {
            if (grupoLayers instanceof ol.layer.Group) {
                grupoLayers.getLayers().forEach(function(sublayer, j) {
                    if (sublayer instanceof ol.layer.Base){
                        if (sublayer.getProperties()['keyname']==layerKey){
                            sublayer.setZIndex(stackValue);
                            console.log("Establezco (" + layerKey + "." + stackValue + ")");
                        }
                    }
            });
        }
    });
}





//Trabaja con las capas del grupo Vuelod PNOA. Pasamos la keyname de la capa, la enciende y apaga las demás
function setLayerPNOAVisibleByKeyAndOFFTheOthers(mapOL3,layerKey){
    
    var listaGrupos=mapOL3.getLayers();
    var resultado=-99;
    //Recorremos todas las capas y escribimos su nombre
    listaGrupos.forEach(function(grupoLayers, i) {
            if (grupoLayers instanceof ol.layer.Group) {
                if (grupoLayers.getProperties()['title']!="Vuelos PNOA"){return;};
                grupoLayers.getLayers().forEach(function(sublayer, j) {
                    if (sublayer instanceof ol.layer.Base){
                        if (sublayer.getProperties()['keyname']==layerKey){
                            sublayer.setVisible(1);
                            $('#'+sublayer.getProperties()['keyname']).bootstrapToggle('on');
                        }else{
                            sublayer.setVisible(0);
                            $('#'+sublayer.getProperties()['keyname']).bootstrapToggle('off');
                        }
                    }
            });
        }
    });
}

function setLayerPNOAVisibilityAndOpacityByKey(mapOL3,layerKey,valueVisibility,valueOpacity,offOthers){
    
    var listaGrupos=mapOL3.getLayers();
    var resultado=-99;
    //Recorremos todas las capas y escribimos su nombre
    listaGrupos.forEach(function(grupoLayers, i) {
            if (grupoLayers instanceof ol.layer.Group) {
                if (grupoLayers.getProperties()['title']!="Vuelos PNOA"){return;};
                grupoLayers.getLayers().forEach(function(sublayer, j) {
                    if (sublayer instanceof ol.layer.Base){
                        if (sublayer.getProperties()['keyname']==layerKey){
                            sublayer.setVisible(valueVisibility);
                            sublayer.setOpacity(valueOpacity);
                            console.log(sublayer.getProperties()['keyname'] + "/" + valueVisibility + "/" + valueOpacity );
                            if (valueVisibility==1){
                                $('#'+sublayer.getProperties()['keyname']).bootstrapToggle('on');    
                            }else{
                                $('#'+sublayer.getProperties()['keyname']).bootstrapToggle('off');
                            }
                        }else{
                            if (offOthers){
                                    sublayer.setVisible(0);
                                    $('#'+sublayer.getProperties()['keyname']).bootstrapToggle('off');
                            }
                        }
                    }
                });
        }
    });
}





function addPointInfo(mapOL3,longitud,latitud,mensaje){
    
    
    var pos = ol.proj.fromLonLat([longitud, latitud]);
    
    var jQueryElement = $('<div></div>');
    jQueryElement.addClass("myclass");
    jQueryElement.css({cursor: 'pointer'});
    jQueryElement.html("<img class='location-popover' src='./img/pushpin.png'>")
    jQueryElement.on('click', function (e) { 
                $(".location-popover").not(this).popover('hide'); 
    });
    jQueryElement.popover({
              'placement': 'top',
              'html': true,
              'content':'<strong>' + mensaje + '</strong>'
    });

    resultToponim_lyr = new ol.Overlay ({
            element: jQueryElement.get(0),
            position: pos,
            positioning: "top-center",
            stopEvent: false
    });
   
    mapOL3.addOverlay(resultToponim_lyr);
    
}

function removePointInfoLayer(mapOL3){
    
    mapOL3.removeOverlay(resultToponim_lyr);
    
}

/*
Función para centrar en una vista y nivel de zoom
*/
function centrarVista(mapOL3,longitud,latitud,zoomLevel){
	
	var panning=new ol.View({
          center: ol.proj.transform([parseFloat(longitud), parseFloat(latitud)], 'EPSG:4326', 'EPSG:3857'),
          zoom: zoomLevel
        });
	mapOL3.setView(panning);	
	
}


function centrarVistaReferenciaCatastral(mapOL3,referenceCadastral,zoomLevel){
	
    var dataRequest;
    var lonRef;
    var latRef;
    dataRequest="http://localhost:1976/projects/pnoahisto/php/getPosByRefCadastral.php?refcadastral=" + referenceCadastral;
    console.log("centrarVistaReferenciaCatastral");
    $.ajax({
                        url: dataRequest,
                        type: 'GET',
                        dataType: 'xml',
                        success: function(resultResponse){
                            $(resultResponse).find("geo").each(function(){
                                    $(this).find("xcen").each(function(){
                                        lonRef = $(this).text();
                                    });
                                    $(this).find("ycen").each(function(){
                                        latRef = $(this).text();
                                    });
                                    centrarVistaToponimo(mapOL3,lonRef,latRef,zoomLevel,"Referencia catastral: " + referenceCadastral);
                            });
                            
                        },
                        error: function(e){
                                    console.log("Error: " + e.responseText);
                        }
    });
}

function centrarVistaReferenciaCatastralDual(mapOL3,mapOL3Syncro,referenceCadastral,zoomLevel){
	
    var dataRequest;
    var lonRef;
    var latRef;
    dataRequest="http://localhost:1976/projects/pnoahisto/php/getPosByRefCadastral.php?refcadastral=" + referenceCadastral;
    console.log("centrarVistaReferenciaCatastral");
    $.ajax({
                        url: dataRequest,
                        type: 'GET',
                        dataType: 'xml',
                        success: function(resultResponse){
                            $(resultResponse).find("geo").each(function(){
                                    $(this).find("xcen").each(function(){
                                        lonRef = $(this).text();
                                    });
                                    $(this).find("ycen").each(function(){
                                        latRef = $(this).text();
                                    });
                                    centrarVistaToponimo(mapOL3,lonRef,latRef,zoomLevel,"Referencia catastral: " + referenceCadastral);
                                    mapOL3Syncro.setView(mapOL3.getView());
                            });
                            
                        },
                        error: function(e){
                                    console.log("Error: " + e.responseText);
                        }
    });
}

function centrarVistaToponimo(mapOL3,longitud,latitud,zoomLevel,mensaje){
	
    console.log("centrarVistaToponimo.Longitud:" + longitud);
    console.log("centrarVistaToponimo.Latitud:" + latitud);
    removePointInfoLayer(mapOL3);
    addPointInfo(mapOL3,parseFloat(longitud),parseFloat(latitud),mensaje);
	var panning=new ol.View({
          center: ol.proj.transform([parseFloat(longitud), parseFloat(latitud)], 'EPSG:4326', 'EPSG:3857'),
          zoom: zoomLevel,
          minZoom: 4,
          maxZoom: 18        
        });
	mapOL3.setView(panning);
    console.log("Efectuado");
}


