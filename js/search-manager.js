

function showResultsetList(resultsRequest){
    
    
    //Pintamos el geoJSOn en el mapa
    var format = new ol.format.GeoJSON();
    resultNGBE_lyr.getSource().clear();
    resultNGBE_lyr.getSource().addFeatures(format.readFeatures(resultsRequest, {
                featureProjection: 'EPSG:3857'
            }));
    //Ahora cargo el panel con los resultados
    var info = [];
    $("#searchingBar").hide();
    $("#atributosEntityList").show();
    info.push("<h2>Topónimos encontrados  <small>(" + resultsRequest.features.length + ")</small></h2>");
    info.push("<ul id=\"listsElem\" class=\"list-group\">");
    for(var i = 0; i < resultsRequest.features.length; i++) {
        info.push("<li class=\"list-group-item\">" + resultsRequest.features[i].properties.nombre + 
            "<span class=\"pull-right\"><button id=\"ngbe" +  resultsRequest.features[i].properties.identidad + "\" " + 
            "type=\"button\" class=\"btn btn-xs btn-secondary showAttribNGBE\"><i class=\"fa fa-info-circle \"></i></button>" + 
            "<button id=\"ngbecoo" +  resultsRequest.features[i].properties.identidad + "\"  type=\"button\" class=\"btn btn-xs btn-secondary panningNGBE\" " +
            "data-lat=\"" + resultsRequest.features[i].geometry.coordinates[1] + "\" " + 
            "data-lon=\"" + resultsRequest.features[i].geometry.coordinates[0] + "\"><i class=\"fa fa-map \"></i></button>" +
            "</span>" + 
            "<img class=\"pull-right tipoimg-ngbe\" src=\"img/icons/" + resultsRequest.features[i].properties.dictiongbe + ".png\" title=\"" + resultsRequest.features[i].properties.tipo + "\">" + 
            "<span class=\"pull-right tipotxt-ngbe\"><small><em>" + resultsRequest.features[i].properties.tipo + "</em></small></span> " + 
            "</li>");
    }
    info.push("</ul>");
    var containerAtrib = document.getElementById('atributosEntityList');
    containerAtrib.innerHTML = '&nbsp;';                            
    containerAtrib.innerHTML = info.join('') || '(unknown)';
    $("#atributosEntity").hide();
    $("#atributosEntityList").show();    
    $("#spinner_searchid").hide();
    //Como hemos metido los botnes en este proceso, aquí definimos el evento
    $(".panningNGBE").on("click", function(event) {
            console.log("centro coordendas en: " + $(this).attr("data-lat") + "," + $(this).attr("data-lon"));
            centrarVistaToponimo(map,
                                $(this).attr("data-lon"),
                                $(this).attr("data-lat"),
                                map.getView().getZoom(),"");                                    
    });    
    $(".showAttribNGBE").on("click", function(event) {
            var idEntidad = replaceAll($(this).attr('id'),"ngbe","");
            console.log("id:" + $(this).attr('id'));
            console.log("Consulto detalle:" + idEntidad);
            mostrarInfoByNumEnti(idEntidad,true);
            $("#atributosEntity").show();
            $("#atributosEntityList").hide();
    });      
    $("#spinner_searchspatial").hide();
    $("#spinner_searchid").hide();
}



function mostrarInfoByNumEnti(idEnti,showBtnResults,panningEntity){
    
    var attributeDisplay="";
    $("#spinner_searchid").show();
    //Tratamiento de parámetros opcionales
    panningEntity = (typeof panningEntity === 'undefined') ? true : panningEntity;
    console.log("Hacer panning:" + panningEntity);
    if (showBtnResults == false) {
        attributeDisplay="display:none;"
    }
    
    $.ajax({
        //url: 'apinomen2/public/entityngbe/json/id/' + idEnti,
        url: municipioInfoByIdServer + idEnti,
            dataType: 'json',
            success: function(resultsRequest){
                console.log(resultsRequest);
                console.log(municipioInfoByIdServer + idEnti);
                console.log("Encontrados: " + resultsRequest.features.length);
                console.log("Elemento primero: " + resultsRequest.features[0].properties.identificador_geografico);
                var fichaEntity="<h2 id=\"nameEntity\">" + resultsRequest.features[0].properties.identificador_geografico + "</h2>" + 
                    "<button id=\"showListResults\" type=\"button\" class=\"btn btn-xs btn-secondary pull-right\" style=\"" + attributeDisplay + "\">Ver resultados</button>" + 
                    "<h2><small>Atributos</small></h2>" + 
                    "<h3 class=\"propTitle\">Identidad nº</h3>" + 
                    "<span class=\"propContent\">" + idEnti + "</span>" + 
                    "<h3 class=\"propTitle\">Geometría</h3>" +
                    "<ul>" + 
                        "<li class=\"propContent\">Geográficas (epsg:4258): <span class=\"pull-right\">" +  resultsRequest.features[0].properties.long_etrs89_regcan95 + " " + resultsRequest.features[0].properties.lat_etrs89_regcan95 + "</span></li>" + 
                        "<li class=\"propContent\">UTM (epsg:258" + resultsRequest.features[0].properties.huso_etrs89_regcan95 + "): <span class=\"pull-right\">" + resultsRequest.features[0].properties.x_utm_etrs89_regcan95 + " " + resultsRequest.features[0].properties.y_utm_etrs89_regcan95 + "</span></li>" +
                    "</ul>" + 
                    "<h3 class=\"propTitle\">Clasificación local</h3>" + 
                    "<span class=\"propContent\">" + resultsRequest.features[0].properties.tipo_mostrado + "</span>" +
                    "<img class=\"pull-right\" style=\"width:48px; \" src=\"img/icons/" + resultsRequest.features[0].properties.codigo_ngbe + "-master.png\" title=\"" + resultsRequest.features[0].properties.tipo_mostrado + "\">" +
                    "<h3 class=\"propTitle\">Hoja MTN25</h3>" + 
                    "<span class=\"propContent\">" + resultsRequest.features[0].properties.hojamtn_25 + "</span>" + 
                    "<h3 class=\"propTitle\">Códigos INE asociados</h3>" + 
                    "<span class=\"propContent\">" + resultsRequest.features[0].properties.codigo_ine + "</span>" + 
                    "<h3 class=\"propTitle\">Identificador geográfico</h3>" + 
                    "<ul>" + 
                        "<li class=\"propContent\">Idioma: <span class=\"pull-right\">" + resultsRequest.features[0].properties.idioma_idg + "</span></li>" + 
                        "<li class=\"propContent\">Fuente: <span class=\"pull-right\">" + resultsRequest.features[0].properties.fuente_idg + "</span></li>" +
                        "<li class=\"propContent\">Nombre: <span class=\"pull-right\">" + resultsRequest.features[0].properties.identificador_geografico + "</span></li>" +
                    "</ul>";

                
                if (resultsRequest.features[0].properties.nombre_extendido!=null){
                    fichaEntity= fichaEntity + "<h3 class=\"propTitle\">Nombre extendido</h3>" + 
                        "<ul>" + 
                        "<li class=\"propContent\">Fuente: <span class=\"pull-right\">" + resultsRequest.features[0].properties.fuente_extendido + "</span></li>" +
                        "<li class=\"propContent\">Nombre: <span class=\"pull-right\">" + resultsRequest.features[0].properties.nombre_extendido + "</span></li>" +
                    "</ul>";
                }
                
                if (resultsRequest.features[0].properties.nombre_alternativo_2!=null){
                    fichaEntity= fichaEntity + "<h3 class=\"propTitle\">Nombre alternativo II</h3>" + 
                        "<ul>" + 
                        "<li class=\"propContent\">Fuente: <span class=\"pull-right\">" + resultsRequest.features[0].properties.fuente_alternativo_2 + "</span></li>" +
                        "<li class=\"propContent\">Nombre: <span class=\"pull-right\">" + resultsRequest.features[0].properties.nombre_alternativo_2 + "</span></li>" +
                    "</ul>";
                }                

                if (resultsRequest.features[0].properties.nombre_alternativo_3!=null){
                    fichaEntity= fichaEntity + "<h3 class=\"propTitle\">Nombre alternativo II</h3>" + 
                        "<ul>" + 
                        "<li class=\"propContent\">Fuente: <span class=\"pull-right\">" + resultsRequest.features[0].properties.fuente_alternativo_3 + "</span></li>" +
                        "<li class=\"propContent\">Nombre: <span class=\"pull-right\">" + resultsRequest.features[0].properties.nombre_alternativo_3 + "</span></li>" +
                    "</ul>";
                }
                
                if (resultsRequest.features[0].properties.nombre_variante_1!=null){
                    fichaEntity= fichaEntity + "<h3 class=\"propTitle\">Nombre variante I</h3>" + 
                        "<ul>" + 
                        "<li class=\"propContent\">Fuente: <span class=\"pull-right\">" + resultsRequest.features[0].properties.fuente_variante_1 + "</span></li>" +
                        "<li class=\"propContent\">Nombre: <span class=\"pull-right\">" + resultsRequest.features[0].properties.nombre_variante_1 + "</span></li>" +
                    "</ul>";
                }                

                if (resultsRequest.features[0].properties.nombre_variante_2!=null){
                    fichaEntity= fichaEntity + "<h3 class=\"propTitle\">Nombre variante II</h3>" + 
                        "<ul>" + 
                        "<li class=\"propContent\">Fuente: <span class=\"pull-right\">" + resultsRequest.features[0].properties.fuente_variante_2 + "</span></li>" +
                        "<li class=\"propContent\">Nombre: <span class=\"pull-right\">" + resultsRequest.features[0].properties.nombre_variante_2 + "</span></li>" +
                    "</ul>";
                }                

                if (resultsRequest.features[0].properties.nombre_variante_3!=null){
                    fichaEntity= fichaEntity + "<h3 class=\"propTitle\">Nombre variante III</h3>" + 
                        "<ul>" + 
                        "<li class=\"propContent\">Fuente: <span class=\"pull-right\">" + resultsRequest.features[0].properties.fuente_variante_3 + "</span></li>" +
                        "<li class=\"propContent\">Nombre: <span class=\"pull-right\">" + resultsRequest.features[0].properties.nombre_variante_3 + "</span></li>" +
                    "</ul>";
                }                
                
                var containerAtrib = document.getElementById('atributosEntity');
                containerAtrib.innerHTML = '&nbsp;';                            
                containerAtrib.innerHTML = fichaEntity;
                if (panningEntity==true){
                                centrarVistaToponimo(map,
                                     resultsRequest.features[0].properties.long_etrs89_regcan95,
                                     resultsRequest.features[0].properties.lat_etrs89_regcan95,
                                     map.getView().getZoom(),resultsRequest.features[0].properties.identificador_geografico);
                }
                $("#showListResults").on("click", function(event) {
                                        $("#atributosEntity").hide();
                                        $("#atributosEntityList").show();                    
                }); 
                $("#spinner_searchid").hide();
            },
            error: function(e){
                        console.log(e.responseText);
                    }
            });
}


/*-------------------------------------------------------------------
Búsqueda por número de entidad
-------------------------------------------------------------------*/
$("#searchById").on("click", function(event) {

    console.info("searchById v2");
    //var nameMuni = $("#muniselect").val();
    var idEnti = parseInt($("#searchByIdparam").val());
    if (idEnti===0){
        console.log("Nada que buscar");
        return;
    }else{
        console.log("Buscar por id: " + idEnti);
    }

    
    $("#presentacion").hide();  
    $("#atributosEntityList").hide();
    $("#atributosEntity").hide();
    $("#searchingBar").show();
    $("#spinner_searchid").show();

    $.ajax({
            /*url: 'apinomen2/public/listngbe/json/id/' + idEnti,
            url: 'apinomen2/public/entityngbe/json/id/' + idEnti,*/
            url: municipioInfoByIdServer + idEnti,            
            dataType: 'json',
            success: function(resultsRequest){
                                //Pintamos el geoJSOn en el mapa
                                showResultsetList(resultsRequest);
            },
            error: function(e){
                    console.log(e.responseText);
            }
    });

});

/*-------------------------------------------------------------------
Búsqueda por entorno de la vista del mapa
-------------------------------------------------------------------*/
$("#searchByView").on("click", function(event) {

        var extentMap = ol.proj.transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:3857', 'EPSG:4326');
        //var urlRequest = "apinomen2/public/listngbe/json/bbox?lonmin=" + extentMap[0] + "&latmin=" + extentMap[1] + "&lonmax=" + extentMap[2] + "&latmax=" + extentMap[3];
        let urlRequest = bboxSearchServer + "lonmin=" + extentMap[0] + "&latmin=" + extentMap[1] + "&lonmax=" + extentMap[2] + "&latmax=" + extentMap[3];
        console.log("searchByView: " + extentMap);
        if (map.getView().getZoom()<13){
            alert("El entorno es demasiado grande. Reduzca el nivel de zoom al menos hasta 1:68.000");
            return;
        }
        $("#presentacion").hide();  
        $("#atributosEntityList").hide();
        $("#atributosEntity").hide();
        $("#searchingBar").show();
        $("#spinner_searchspatial").show();
        $.ajax({
            url: urlRequest,
            dataType: 'json',
            success: function(resultsRequest){
                                //Pintamos el geoJSON en el mapa
                                showResultsetList(resultsRequest);

            },
            error: function(e){
                    console.log(e.responseText);
            }
        });

});

/*-------------------------------------------------------------------
Búsqueda por municipio seleccionado
-------------------------------------------------------------------*/
function searchByMuni(){

    console.info("searchByName");
    let nameMuni = $("#muniselect").val();
    let codDictio= $("#codDictio").find(":selected").val();
    if (nameMuni==""){
        console.log("Nada que buscar");
        return;
    }else{
        console.log("Buscar por municipio: " + nameMuni);
    }

    let codMuni = nameMuni.substring(nameMuni.length-6,nameMuni.length-1);
    let urlRequest = ineSearchServer + codMuni + "?" + (codDictio != "0.0" ? "codDictio=" + codDictio + "&" : "");

    $("#presentacion").hide();  
    $("#atributosEntityList").hide();
    $("#atributosEntity").hide();
    $("#searchingBar").show();
    $("#spinner_searchid").show();

    $.ajax({
            url: urlRequest,
            dataType: 'json',
            success: function(resultsRequest){
                                //Pintamos el geoJSON en el mapa
                                showResultsetList(resultsRequest);
            },
            error: function(e){
                    console.log(e.responseText);
            }
    });
}

/*-------------------------------------------------------------------
Búsqueda por distribuidor MTN25
-------------------------------------------------------------------*/
$("#searchByMTN").on("click", function(event) {
    console.info("searchByMTN");
    let numMTN = $("#searchByMTNparam").val();
    let codProv= $("#provinCbo").find(":selected").val();
    let codDictio= $("#codDictio").find(":selected").val();

    let urlRequest = mtn25SearchServer + numMTN + "?" + (codDictio != "0.0" ? "codDictio=" + codDictio + "&" : "") + (codProv != "00" ? "codProv=" + codProv + "&" : "");

    $("#presentacion").hide();  
    $("#atributosEntityList").hide();
    $("#atributosEntity").hide();
    $("#searchingBar").show();
    $("#spinner_searchid").show();

    console.log(urlRequest);

    $.ajax({
        url: urlRequest,
        dataType: 'json',
        success: function(resultsRequest){
                            showResultsetList(resultsRequest);
        },
        error: function(e){
                console.log(e.responseText);
        }
    });

});

/*-------------------------------------------------------------------
Búsqueda por nombre del topónimo
-------------------------------------------------------------------*/
$("#searchByName").on("click", function(event) {
        console.info("searchByName");
        let nameEnti = $("#searchByNameparam").val();
        let codProv= $("#provinCbo").find(":selected").val();
        let codDictio= $("#codDictio").find(":selected").val();

        let urlRequest = nameSearchServer + nameEnti + "?" + (codDictio != "0.0" ? "codDictio=" + codDictio + "&" : "") + (codProv != "00" ? "codProv=" + codProv + "&" : "");

        $("#presentacion").hide();  
        $("#atributosEntityList").hide();
        $("#atributosEntity").hide();
        $("#searchingBar").show();
        $("#spinner_searchid").show();

        $.ajax({
            url: urlRequest,
            dataType: 'json',
            success: function(resultsRequest){
                                //Pintamos el geoJSOn en el mapa
                                showResultsetList(resultsRequest);
            },
            error: function(e){
                    console.log(e.responseText);
            }
        });
    
});



$("#muniselect").keyup(function (e) {
    if (e.keyCode == 13) {
        searchByMuni();
    }
});
$("#searchByMuni").on("click", function(event) {
        searchByMuni();
});


/*-------------------------------------------------------------------
Prepara los datos para la b´suqeuda de municipios
-------------------------------------------------------------------*/
$(document).ready(function() {
		$('input.combomunis').typeahead({
		  name: 'combomunis',
          prefetch : munisActualServer
		});
        console.log("Paso");
        console.log(munisActualServer);
        $("#deslintable").hide();
        $("#alertnosel").hide();
});




