/*
Mapas base
*/
//Mapas base IGN
var ignBaseWMTS_lyr;        //Mapa01
var rasterMTN_lyr;          //Mapa02
var pnoaWMTS_lyr;           //Mapa03
var elevaciones_lyr         //Mapa04
var primeraEdiBase_lyr;     //Mapa05

//Mapas base OSM
var basicOSM_lyr;           //Mapa09
var mapQuest_lyr;           //Mapa10
var blackWhiteOSM_lyr;      //Mapa07
var waterColorOSM_lyr;      //Mapa08
//Capas vectoriales
var gridMTN50Pen;           //Overlay16
var gridMTN50Can;           //Overlay16
var gridMTN25Pen;           //Overlay11
var gridMTN25Can;           //Overlay17
var siglimoverlay;          //Overlay18
var wmsSourceSIGLIM;
var cadastralOverlay;       //Overlay19

var wmsSourceMinutas;
var minutasCarto_lyr;       //Overlay06


//Capas de los vuelos históricos del PNOA
var overlayPNOAGroup;
var overlayPNOAList = new Array();
var overlayPNOAListLeft = new Array();
var overlayPNOAListRight = new Array();
var overlaysHTMLTags =new Array();
var overlayNames = new Array();

//Capas base del IGN
var baseIGNList = new Array();


/*
Mapas overlay
*/

var costasFly_lyr;          //Overlay12
var americanFlyA_lyr;       //Overlay04
var americanFlyB_lyr;       //Overlay11
var interministerialFly_lyr;//Overlay13
var nacionalFly_lyr;        //Overlay14

var wmsSourceMinutas;
var minutasCarto_lyr;       //Overlay06
var wmsSourcePrimeraEdi;
var primeraEdi_lyr;         //Overlay15
var wmsSourceHK;            //No utilizado hasta que se active el WMS
var HKCarto_lyr;            //No utilizado hasta que se active el WMS



var mobileMode;

/*----------------------------------------------------------------------------------------------------
Definición de estilos
----------------------------------------------------------------------------------------------------*/
//Estilos por defecto
var defaultFillStyle = new ol.style.Fill({
                            color: "rgba(255,255,255,0.4)"
                    });
var defaultStrokeStyle = new ol.style.Stroke({
                            color: "#3399CC",
                            width: 1.25
                    });
var defaultStyle = new ol.style.Style({
                    image: new ol.style.Circle({
                                    stroke: defaultStrokeStyle, 
                                    fill: defaultFillStyle,
                                    radius:5
                    }),
                    stroke: defaultStrokeStyle,
                    fill: defaultFillStyle
});


var basicIconStyle = new ol.style.Style({
    image: new ol.style.Icon(({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      opacity: 0.75,
      src: 'img/icons/0.0.0.png'
   }))
});

var customNGBEStyle = function(feature, resolution) {
    console.log(resolution);
    var pathIcon='img/icons/' + feature.get('dictiongbe') + '.png';
    return [new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [0, 0],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: pathIcon
        }))
    })];
};






function setInitialView(){
    
    if ( mobileMode==true){
            console.log("Vista de Ajuste para móvil");
            var initialView = new ol.View({
                projection: 'EPSG:3857', 
                center: ol.proj.transform([-6.02, 37.80], 'EPSG:4326', 'EPSG:3857'),
                zoom: 4,minZoom: 4, maxZoom: 19
            });
    }else{
            console.log("Vista de Ajuste standard");
            var initialView = new ol.View({
                projection: 'EPSG:3857', 
                center: ol.proj.transform([-6.02, 37.80], 'EPSG:4326', 'EPSG:3857'),
                zoom: 5,minZoom: 4, maxZoom: 19
            });
    }
    map.setView(initialView);
}

function setInitialView2Map(mapOL3){
    
    if ( mobileMode==true){
            console.log("Vista de Ajuste para móvil de otro mapa");
            var initialView = new ol.View({
                projection: 'EPSG:3857', 
                center: ol.proj.transform([-8, 38], 'EPSG:4326', 'EPSG:3857'),
                zoom: 4,minZoom: 4, maxZoom: 19
            });
            mapOL3.setView(initialView);
    }
}

function setLonLatView(Lon, Lat,zoomLevel){
        var lonlatView = new ol.View({
                projection: 'EPSG:3857', 
                center: ol.proj.transform([Lon, Lat], 'EPSG:4326', 'EPSG:3857'),
                zoom: zoomLevel,minZoom: 4, maxZoom: 19
        });
        map.setView(lonlatView);
}

function setPeninsularView(){
        var peninView = new ol.View({
                projection: 'EPSG:3857', 
                center: ol.proj.transform([-3.7350, 40.3750], 'EPSG:4326', 'EPSG:3857'),
                zoom: 7,minZoom: 4, maxZoom: 19
        });
        map.setView(peninView);
}

function setBalearesView(){
        var balearesView = new ol.View({
                projection: 'EPSG:3857', 
                center: ol.proj.transform([2.7740, 39.5722], 'EPSG:4326', 'EPSG:3857'),
                zoom: 9,minZoom: 4, maxZoom: 19
        });
        map.setView(balearesView);
}
function setCanariasView(){
        var canariasView = new ol.View({
                projection: 'EPSG:3857', 
                center: ol.proj.transform([-16.1115, 28.2950], 'EPSG:4326', 'EPSG:3857'),
                zoom: 8,minZoom: 4, maxZoom: 19
        });
        map.setView(canariasView);
}



/*
-----------------------------------------------------------------------------------------------------------------------------------------------------
CARGA DE CAPAS DE CARTOGRAFÍA
-----------------------------------------------------------------------------------------------------------------------------------------------------
Capas base IGN
-----------------------------------------------------------------------------------------------------------------------------------------------------
*/
function loadBasicIGN(visibilityDefault){
	var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
	var resolutions = new Array(19);
	var matrixIds = new Array(19);
	for (var z = 0; z < 19; ++z) {
		  // generate resolutions and matrixIds arrays for this WMTS
		  resolutions[z] = size / Math.pow(2, z);
		  matrixIds[z] = z;
	}
	var attributionPNOA = new ol.Attribution({
			html: 'PNOA cedido por &copy; <a href="http://www.ign.es" target="_blank">Instituto Geográfico Nacional</a>'
	});
		
	var attributionIGNBase = new ol.Attribution({
			html: 'IGN Base - &copy; <a href="http://www.ign.es" target="_blank">Instituto Geográfico Nacional</a>'
	});
     
   var attributionIGNRaster = new ol.Attribution({
			html: 'Cartografía raster - &copy; <a href="http://www.ign.es"  target="_blank">Instituto Geográfico Nacional</a>'
	});
     
    var attributionIGNMTNPrimEdi = new ol.Attribution({
			html: 'Primera edición del MTN50 - &copy; <a href="http://www.ign.es"  target="_blank">Instituto Geográfico Nacional</a>'
	});    
     
    //Ponemos IGNBase como el mapa de fondo por defecto Por esa es la unica que no se regula con visibilityDefault
	ignBaseWMTS_lyr = new ol.layer.Tile({
			  title: 'IGN Base',
              type: 'base',
              visible: visibilityDefault,			  
			  extent: projectionExtent,
			  opacity: 1.0,
			  source: new ol.source.WMTS({
			    attributions: [attributionIGNBase],
				url: 'http://www.ign.es/wmts/ign-base',
                layer: 'IGNBaseTodo',
				matrixSet: 'EPSG:3857',
				format: 'image/jpeg',
				projection: projection,
				tileGrid: new ol.tilegrid.WMTS({
				  origin: ol.extent.getTopLeft(projectionExtent),
				  resolutions: resolutions,
				  matrixIds: matrixIds
				}),
				style: 'default'
			  })
	});
    ignBaseWMTS_lyr.set("keyname","ignbase");
    ignBaseWMTS_lyr.set("alias","Callejero");
    baseIGNList.push(ignBaseWMTS_lyr);

    pnoaWMTS_lyr=new ol.layer.Tile({
                    title: 'PNOA',
                    type: 'base',
                    visible: false,			  
                    extent: projectionExtent,
                    opacity: 1.0,
                    source: new ol.source.XYZ({
										attributions: [attributionPNOA],
                                        url: 'http://www.ign.es/wmts/pnoa-ma?request=getTile&layer=OI.OrthoimageCoverage&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
										//url: './php/tesel-pnoa-mr.php?z={z}&x={x}&y={y}'
							})
    });
    pnoaWMTS_lyr.set("keyname","ignpnoa");
    pnoaWMTS_lyr.set("alias","Imagen");
    baseIGNList.push(pnoaWMTS_lyr);
    
    //Hago la petición mediante un PHP para tener control sobre el orden de los parámetros de la llamada al WMTS
    //En el PHP ordeno los parámetros como lo espera CloudFront 
    //Al final evito el PHP y directamente pinto los datos del CloudFront
    rasterMTN_lyr=new ol.layer.Tile({
                    title: 'Cartografía raster',
                    type: 'base',
                    visible: false,			  
                    extent: projectionExtent,
                    opacity: 1.0,
                    source: new ol.source.XYZ({
										attributions: [attributionIGNRaster],
                                        url: 'http://www.ign.es/wmts/mapa-raster?request=getTile&layer=MTN&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileCol={x}&TileRow={y}&format=image/jpeg'
										//url: './php/tesel-igncartoraster.php?z={z}&x={x}&y={y}'
                        
							})
    });
    rasterMTN_lyr.set("keyname","ignraster");
    rasterMTN_lyr.set("alias","Mapa");
    baseIGNList.push(rasterMTN_lyr);
    
	primeraEdiBase_lyr=new ol.layer.Tile({
							title: 'Serie MTN Primera Edición base',
							type: 'base',
							visible: false,
                            opacity: 1.0,
							source: new ol.source.TileWMS({
								url: 'http://www.ign.es/wms/primera-edicion-mtn',
                                attributions: [attributionIGNMTNPrimEdi],
								params: {"LAYERS": "MTN50", "TILED": "true"}
							})
	});
    primeraEdiBase_lyr.set("keyname","ignMTN50ed1");
    primeraEdiBase_lyr.set("alias","MTN50 1ª edición");
    baseIGNList.push(primeraEdiBase_lyr);
    
    elevaciones_lyr = new ol.layer.Tile({
      title: "LiDAR",
      type: "base",
      visible: false,
      opacity: 1.0,
      source: new ol.source.WMTS({
        attributions: [attributionPNOA],
        url: "https://wmts-mapa-lidar.idee.es/lidar",
        layer: "EL.GridCoverageDSM",
        matrixSet: "EPSG:3857",
        format: "image/png",
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
        style: "default",
      }),
    });

    elevaciones_lyr.set("keyname", "ignmdt");
    elevaciones_lyr.set("alias", "Imagen");
    baseIGNList.push(elevaciones_lyr);
    
    wmsSourceMinutas = new ol.source.TileWMS({
				            attributions: [new ol.Attribution({
		                                          html: 'Archivo Topográfico - Minutas cartográficas - '
	                        })],          
                            url: 'http://www.ign.es/wms/minutas-cartograficas',
                            params: {"LAYERS": "Minutas", "TILED": "true"},
                            serverType: 'geoserver',
                            crossOrigin: ''
    });

    
    minutasCarto_lyr=new ol.layer.Tile({
							title: 'Minutas cartográficas',
                            type: 'base',
                            visible: false,	
                            opacity: 1.0,
							source: wmsSourceMinutas
    });     
    minutasCarto_lyr.set("keyname","ignminutas");
    minutasCarto_lyr.set("alias","Minutas");
    baseIGNList.push(minutasCarto_lyr);    
    
    
    
}

/*
-----------------------------------------------------------------------------------------------------------------------------------------------------
Capas base ISM
-----------------------------------------------------------------------------------------------------------------------------------------------------
*/
function loadBasicOSM(visibilityDefault){

    waterColorOSM_lyr= new ol.layer.Tile({
                        title: 'OSM Acuarela',
                        type: 'base',
                        visible: visibilityDefault,
                        source: new ol.source.Stamen({
                            layer: 'watercolor'
                        })
                    });
    waterColorOSM_lyr.set("keyname","osmacuarela");
    waterColorOSM_lyr.set("alias","OSM Acuarela");    
    blackWhiteOSM_lyr= new ol.layer.Tile({
                        title: 'OSM Toner',
                        type: 'base',
                        visible: visibilityDefault,
                        source: new ol.source.Stamen({
                            layer: 'toner'
                        })
                    });
    blackWhiteOSM_lyr.set("keyname","osmatoner");
    blackWhiteOSM_lyr.set("alias","OSM Tóner");     
    basicOSM_lyr=new ol.layer.Tile({
                        title: 'OSM Básico',
                        type: 'base',
                        visible: visibilityDefault,
                        source: new ol.source.OSM()
                    });
    basicOSM_lyr.set("keyname","osmbasic");
    basicOSM_lyr.set("alias","OSM Básico"); 

    mapQuest_lyr = new ol.layer.Tile({
                title: 'MapQuest',
                type: 'base',
                visible: visibilityDefault,
                opacity: 1.0,
                source: new ol.source.MapQuest({
                    layer: 'osm'
                })
    });			
    mapQuest_lyr.set("keyname","mapquest");
    mapQuest_lyr.set("alias","MapQuest");     
}

/*
-----------------------------------------------------------------------------------------------------------------------------------------------------
Capas vectoriales IGN
-----------------------------------------------------------------------------------------------------------------------------------------------------
*/
function vectorOverLays(visibilityDefault){
 
    gridMTN50Pen=new ol.layer.Tile({
							title: 'Distribuidor MTN50 Península y Baleares',
							visible: visibilityDefault,
							source: new ol.source.TileWMS({
								url: 'http://www.ign.es/wms-inspire/cuadriculas',
								params: {"LAYERS": "Grid-ETRS89-lonlat-50k", "TILED": "true"}
							})
				});
    gridMTN50Pen.set('keyname','gridMTN50Pen');
    gridMTN50Pen.set("alias","Cuadrícula MTN50 Península"); 

    gridMTN50Can=new ol.layer.Tile({
							title: 'Distribuidor MTN50 Islas Canarias',
							visible: visibilityDefault,
							source: new ol.source.TileWMS({
								url: 'http://www.ign.es/wms-inspire/cuadriculas',
								params: {"LAYERS": "Grid-REGCAN95-lonlat-50k", "TILED": "true"}
							})
				}); 
    gridMTN50Can.set('keyname','gridMTN50Can');
    gridMTN50Can.set("alias","Cuadrícula MTN50 Canarias"); 

    gridMTN25Pen=new ol.layer.Tile({
							title: 'Distribuidor MTN25 Península y Baleares',
							visible: visibilityDefault,
							source: new ol.source.TileWMS({
								url: 'http://www.ign.es/wms-inspire/cuadriculas',
								params: {"LAYERS": "Grid-ETRS89-lonlat-25k", "TILED": "true"}
							})
				});
    gridMTN25Pen.set('keyname','gridMTN25Pen');
    gridMTN25Pen.set("alias","Cuadrícula MTN25 Península"); 

    gridMTN25Can=new ol.layer.Tile({
							title: 'Distribuidor MTN25 Islas Canarias',
							visible: visibilityDefault,
							source: new ol.source.TileWMS({
								url: 'http://www.ign.es/wms-inspire/cuadriculas',
								params: {"LAYERS": "Grid-REGCAN95-lonlat-25k", "TILED": "true"}
							})
				});
    gridMTN25Can.set('keyname','gridMTN25Can');
    gridMTN25Can.set("alias","Cuadrícula MTN25 Canarias"); 


    wmsSourceSIGLIM = new ol.source.TileWMS({
        url: 'http://www.ign.es/wms-inspire/unidades-administrativas',
        params: {"LAYERS": "AU.AdministrativeBoundary", "TILED": "true"},
        serverType: 'geoserver',
        crossOrigin: ''
    });    
    siglimoverlay=new ol.layer.Tile({
							title: 'BDLJE',
							visible: visibilityDefault,
							source: new ol.source.TileWMS({
								url: 'http://www.ign.es/wms-inspire/unidades-administrativas',
								params: {"LAYERS": "AU.AdministrativeUnit","STYLES":"ua-comparador","FORMAT":"image/png", "TILED": "true"}
							})
				});
	siglimoverlay.set('keyname','siglimoverlay');			
    siglimoverlay.set("alias","División administrativa"); 
    
    var attributionCadastral = new ol.Attribution({
			html: '&copy; <a href="http://www.catastro.minhap.gob.es/esp/wms.asp"  target="_blank">Dirección General del Catastro</a>'
	});    
    //La capa de catastro se pide sin teselar, porque la OVC restringe las peticiones teseladas
    /*cadastralOverlay=new ol.layer.Tile({
							title: 'Catastro',
							visible: visibilityDefault,
                            source: new ol.source.XYZ({
										url: './php/cadastral.php?z={z}&x={x}&y={y}'
                        
							})        
				});*/
    cadastralOverlay=new ol.layer.Image({
							title: 'Catastro',
							visible: visibilityDefault,
                            source: new ol.source.ImageWMS({
                                    attributions: [attributionCadastral],
                                    url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
                                    params: {'VERSION': '1.1.1','LAYERS': 'Catastro','SRS': 'EPSG:3857','TILED': 'false'},
                                    serverType: 'geoserver'
                            })        
				});
	cadastralOverlay.set('keyname','cadastralOverlay');			
    cadastralOverlay.set("alias",'Catastro');
    /*
    setLayerZindex(map,'gridMTN50Pen',100);
    setLayerZindex(map,'gridMTN50Can',101);
    setLayerZindex(map,'gridMTN25Pen',102);
    setLayerZindex(map,'gridMTN25Can',103);
    setLayerZindex(map,'siglimoverlay',104);
    setLayerZindex(map,'cadastralOverlay',105);
    */
}


function loadOverlays(visibilityDefault){
        $.getJSON('overlays.json', { get_param: 'value' }, function(data) {
            $.each(data, function(index, element) {
                console.log("Paso");
              oPNOA_lyr=new ol.layer.Tile({
                                title: element.title,
                                visible: visibilityDefault,
                                source: new ol.source.TileWMS({
                                    attributions: [new ol.Attribution({
                                                      html: 'PNOA - ' + element.year + ' cedido por &copy; <a href="http://www.ign.es" target="_blank">Instituto Geográfico Nacional</a>'
                                    })],
                                    url: element.urlsource,
                                    params: {"LAYERS": element.layers, "TILED": "true"}
                                 })
              });
              oPNOA_lyr.set('keyname',element.layerkey);
              oPNOA_lyr.set('alias',element.alias);
              oPNOA_lyr.set('year',element.year);
              overlayPNOAListLeft.push(oPNOA_lyr);
              overlayPNOAListRight.push(oPNOA_lyr);
              //Preparamos los controles para la web
            /*  
            overlaysHTMLTags.push("<div class=\"col-md-6 col-sm-6 col-xs-6\" style=\"margin-top:15px;\">" +
                        "<input class=\"toolboxPNOA\" data-onstyle=\"success\" data-toggle=\"toggle\" data-on=\"<img src='img/eye16.png'/> <small>" + element.title + "</small>\" data-off=\"" + element.title + "\" type=\"checkbox\" data-width=\"100\" data-size=\"mini\" id=\"" + element.layerkey + "\">" + 
                        "</div>");
              overlayNames.push(element.layerkey);
              */
            });
            //Una vez leidas las capas PNOA, las disponemos en el layout
            prepararPanelesCapasPNOA();
        });
}


function rasterOverlays(visibilityDefault){

    $.getJSON('overlays.json', { get_param: 'value' }, function(data) {
        var pnoaHTMLList = [];
        var ctrlNames = [];
        $.each(data, function(index, element) {
          oPNOA_lyr=new ol.layer.Tile({
							title: element.title,
							visible: visibilityDefault,
							source: new ol.source.TileWMS({
                                attributions: [new ol.Attribution({
		                                          html: 'PNOA - Vuelo Histórico - &copy; <a href="http://www.ign.es" target="_blank">Instituto Geográfico Nacional</a>'
	                            })],
								url: element.urlsource,
								params: {"LAYERS": element.layers, "TILED": "true"}
							 })
          });
          oPNOA_lyr.set('keyname',element.layerkey);
          oPNOA_lyr.set('alias',element.alias);
          oPNOA_lyr.set('year',element.year);
          overlayPNOAList.push(oPNOA_lyr);
          //Preparamos los controles para la web
          pnoaHTMLList.push("<div class=\"col-md-6 col-sm-6 col-xs-6\" style=\"margin-top:15px;\">" +
                    "<input class=\"toolboxPNOA\" data-onstyle=\"success\" data-toggle=\"toggle\" data-on=\"<img src='img/eye16.png'/> <small>" + element.title + "</small>\" data-off=\"" + element.title + "\" type=\"checkbox\" data-width=\"100\" data-size=\"mini\" id=\"" + element.layerkey + "\">" + 
                    "</div>");
          ctrlNames.push(element.layerkey);
        });
        overlayPNOAGroup=new ol.layer.Group({'title': 'Vuelos PNOA'});
        overlayPNOAGroup.setLayers(new ol.Collection(overlayPNOAList));
        map.addLayer(overlayPNOAGroup);
        var containerPNOAlyr = document.getElementById('pnoaLayerList');
        containerPNOAlyr.innerHTML = pnoaHTMLList.join('');
        //Como metemos componentes Bootstrap-Toggle, es necesario inicalizarlos, porque si no aparecen como inputbox normales sin customizar
        for (var i = 0, len = ctrlNames.length; i < len; i++) {
            $('#' + ctrlNames[i]).bootstrapToggle();
        }
        $(".toolboxPNOA").change(function() {
                var id = $(this).prop('id');
                var value_id = $(this).prop('checked');
                setLayerVisibleByKey(map,id,value_id);
            
        });
        //Por último las capas ventoriales las ponemos arriba del todo
        //dvmListLayersOnConsole(map);
        
        setLayerZindex(map,'gridMTN50Pen',100);
        setLayerZindex(map,'gridMTN50Can',101);
        setLayerZindex(map,'gridMTN25Pen',102);
        setLayerZindex(map,'gridMTN25Can',103);
        setLayerZindex(map,'siglimoverlay',104);
        setLayerZindex(map,'cadastralOverlay',105);
        
    });
    console.log("Cargo 2"); 
}

function rasterBaseLayers(visibilityDefault){

    $.getJSON('overlays.json', { get_param: 'value' }, function(data) {
        var pnoaHTMLList = [];
        var ctrlNames = [];
        $.each(data, function(index, element) {
          oPNOA_lyr=new ol.layer.Tile({
							title: element.title,
							visible: visibilityDefault,
							source: new ol.source.TileWMS({
                                attributions: [new ol.Attribution({
		                                          html: 'PNOA - ' + element.year + ' cedido por &copy; <a href="http://www.ign.es" target="_blank">Instituto Geográfico Nacional</a>'
	                            })],
								url: element.urlsource,
								params: {"LAYERS": element.layers, "TILED": "true"}
							 })
          });
          oPNOA_lyr.set('keyname',element.layerkey);
          oPNOA_lyr.set('alias',element.alias);
          overlayPNOAList.push(oPNOA_lyr);
          //Preparamos los controles para la web
          pnoaHTMLList.push("<div class=\"col-md-6 col-sm-6 col-xs-6\" style=\"margin-top:15px;\">" +
                    "<input class=\"toolboxPNOA\" data-onstyle=\"success\" data-toggle=\"toggle\" data-on=\"<img src='img/eye16.png'/> <small>" + element.title + "</small>\" data-off=\"" + element.title + "\" type=\"checkbox\" data-width=\"100\" data-size=\"mini\" id=\"" + element.layerkey + "\">" + 
                    "</div>");
          ctrlNames.push(element.layerkey);
        });
        prepararPanelesCapasPNOA();
    });
    
}

