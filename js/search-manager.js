/**
 * 
 * @param {*} cadena 
 * @returns 
 */

const isEmptyNullString = (cadena) => {
  if (cadena === undefined || cadena === null) {
    return true;
  } else {
    if (cadena === "") {
      return true;
    }
  }
  return false;
};


const fixNullValue = (value) => {
  return value === undefined || value === null
    ? '<em>No definido <i class="fa fa-question-circle" aria-hidden="true"></i></em>'
    : value;
};



/**
 * Procedimiento para las búsquedas por hoja MTN25
 * @returns 
 */
const searchByHojaMTN = () => {

    let userNumMTN = $("#mtnselect").val();
    let numMTN;
    if (isEmptyNullString(userNumMTN)){
        return;
    }

    // Obtenemos de la cadena seleccionada la hoja de búsqueda
    if (userNumMTN.slice(userNumMTN.length-8,userNumMTN.length-7)==='-'){
        numMTN=userNumMTN.slice(userNumMTN.length-6,userNumMTN.length)
    }
    // Detección de hojas BIS
    if (userNumMTN.slice(userNumMTN.length-9,userNumMTN.length-8)==='-'){
        numMTN=userNumMTN.slice(userNumMTN.length-7,userNumMTN.length)
    }

    let codProv= $("#provinCbo").find(":selected").val();
    let codDictio= $("#codDictio").find(":selected").val();
    let urlRequest = mtn25SearchServer + numMTN + "?" + (codDictio != "0.0" ? "codDictio=" + codDictio + "&" : "") + (codProv != "00" ? "codProv=" + codProv + "&" : "");

    $("#presentacion").hide();  
    $("#tabulatorEntityList").hide();
    $("#atributosEntity").hide();
    $("#searchingBar").show();
    $("#spinner_searchid").show();

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

}


/**
 * Procedimiento para las búsquedas por municipio
 * @returns 
 */
const searchByMuni = ()=>{

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
    $("#tabulatorEntityList").hide();
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


const searchByName = () =>{

    let nameEnti = $("#searchByNameparam").val();
    let codProv= $("#provinCbo").find(":selected").val();
    let codDictio= $("#codDictio").find(":selected").val();
    let urlRequest = nameSearchServer + nameEnti + "?" + (codDictio != "0.0" ? "codDictio=" + codDictio + "&" : "") + (codProv != "00" ? "codProv=" + codProv + "&" : "");

    $("#presentacion").hide();  
    $("#tabulatorEntityList").hide();
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

};


const searchByView = () =>{

    let extentMap = ol.proj.transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:3857', 'EPSG:4326');
    let urlRequest = bboxSearchServer + "lonmin=" + extentMap[0] + "&latmin=" + extentMap[1] + "&lonmax=" + extentMap[2] + "&latmax=" + extentMap[3];
    if (map.getView().getZoom()<13){
        alert("El entorno es demasiado grande. Reduzca el nivel de zoom al menos hasta 1:68.000");
        return;
    }
    $("#presentacion").hide();  
    $("#tabulatorEntityList").hide();
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

};



const searchById = () => {
  let idEnti = parseInt($("#searchByIdparam").val());
  if (idEnti === 0) {
    return;
  }

  $("#presentacion").hide();
  $("#tabulatorEntityList").hide();
  $("#atributosEntity").hide();
  $("#searchingBar").show();
  $("#spinner_searchid").show();

  $.ajax({
    url: urlSearchListById + idEnti,
    dataType: "json",
    success: function (resultsRequest) {
      //Pintamos el geoJSOn en el mapa
      console.log(resultsRequest);
      showResultsetList(resultsRequest);
    },
    error: function (e) {
      console.log("Fallo " + e.responseText);
    },
  });
};


/**
 * Helpers para pner bandera junto al idioma
 * @param {*} idioma 
 * @returns 
 */
const getClassIdioma= (idioma)=>{
    return "";
    if (idioma === undefined || idioma === null) {
        return "";
    } else if (idioma === "gal") {
        return `idioma_glg`;  
    } else {
      return `idioma_${idioma}`;
    }

}

/**
 * Helper para colocar la simbología del estatus de la entidad
 * @param {*} estatus 
 * @returns 
 */
const getClassEstatus= (estatus)=>{
    
    if (estatus === undefined || estatus === null) {
        return "";
    } else if (estatus === "Oficial") {
        return `oficial`;  
    } else if (estatus === "Normalizado") {
        return `normalizado`; 
    } else if (estatus === "No Normalizado") {
        return `no-normalizado`; 
    } else {
      return "";
    }

}

document.getElementById("develOne").addEventListener("click", () => {
    alert("Hola");
});



const showResultsetList = (resultsRequest) => {

  //Pintamos el geoJSON en el mapa
//   var format = new ol.format.GeoJSON();
//   resultNGBE_lyr.getSource().clear();
//   resultNGBE_lyr.getSource().addFeatures(
//     format.readFeatures(resultsRequest, {
//       featureProjection: "EPSG:3857",
//     })
//   );

  resultNGBE_lyr = new M.layer.GeoJSON(
    {
        name: "Resultados", 
        source: resultsRequest,
        extract: true
    }
    );
    resultNGBE_lyr.setZIndex(100);
    //resultNGBE_lyr.addFeatures(resultsRequest.features);
    mapAPICNIG.addLayers(resultNGBE_lyr);






  $("#searchingBar").hide();
  $("#atributosEntity").hide();
  $("#spinner_searchid").show();

  document.getElementById("filter-value").value=``;
  document.getElementById("numResultsFilter").textContent = ``;

  let tableData = [];
  for (let i = 0; i < resultsRequest.features.length; i++) {
    tableData.push({
      dictiongbe: resultsRequest.features[i].properties.dictiongbe,
      nombre: resultsRequest.features[i].properties.nombre,
      tipo: resultsRequest.features[i].properties.tipo,
      identidad: resultsRequest.features[i].properties.identidad,
      dataLon: resultsRequest.features[i].geometry.coordinates[0],
      dataLat: resultsRequest.features[i].geometry.coordinates[1],
    });
    console.log(resultsRequest.features[i]);
  }

  tabulatorResults.clearFilter();
  tabulatorResults.setData(tableData);

  document.getElementById("numResults").textContent=resultsRequest.features.length;

  $("#tabulatorEntityList").show();
  $("#spinner_searchspatial").hide();
  $("#spinner_searchid").hide();
};


const mostrarInfoByNumEnti = (idEnti,showBtnResults,panningEntity) => {
    
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
                let itemSelected = resultsRequest.features[0];

                document.getElementById('propNameEntity').textContent = itemSelected.properties.identificador_geografico;
                document.getElementById('propImageDictio').src = `img/icons/${itemSelected.properties.codigo_ngbe}-master.png`;
                document.getElementById('propImageDictio').title = itemSelected.properties.tipo_mostrado;

                let evalNumNombres = 0;
                if (itemSelected.properties.nombre_alternativo_3 !== undefined && itemSelected.properties.nombre_alternativo_3 !== null){
                    evalNumNombres=evalNumNombres+1;
                }
                if (itemSelected.properties.nombre_variante_2 !== undefined && itemSelected.properties.nombre_variante_2 !== null){
                    evalNumNombres=evalNumNombres+1;
                }
                if (itemSelected.properties.nombre_variante_3 !== undefined && itemSelected.properties.nombre_variante_3 !== null){
                    evalNumNombres=evalNumNombres+1;
                }
                if (itemSelected.properties.ig_recomendado !== undefined && itemSelected.properties.ig_recomendado !== null){
                    evalNumNombres=evalNumNombres+1;
                }
                if (itemSelected.properties.alternativo_recomendado !== undefined && itemSelected.properties.alternativo_recomendado !== null){
                    evalNumNombres=evalNumNombres+1;
                }
                if (itemSelected.properties.otras_denominaciones !== undefined && itemSelected.properties.otras_denominaciones !== null){
                    evalNumNombres=evalNumNombres+1;
                }
                if (itemSelected.properties.forma_no_recomendada !== undefined && itemSelected.properties.forma_no_recomendada !== null){
                    evalNumNombres=evalNumNombres+1;
                }                
                if (itemSelected.properties.forma_erronea !== undefined && itemSelected.properties.forma_erronea !== null){
                    evalNumNombres=evalNumNombres+1;
                }

                document.getElementById('numNombres').textContent = evalNumNombres;

                let generalAttribTemplate  = `<h3 class="propTitle">General</h3>
                                        <ul>
                                        <li class="propContent">Identidad nº: <span class="pull-right">${itemSelected.properties.id}</span></li>
                                        <li class="propContent">Clasificación: <span class="pull-right">${itemSelected.properties.codigo_ngbe_text}</span></li>
                                        <li class="${itemSelected.properties.provincias_nombre.length>75 ? "propSubContent":"propContent"}">Provincias: <span class="pull-right">${replaceAllOcurrences(fixNullValue(itemSelected.properties.provincias_nombre),',',', ')}</span></li>
                                        </ul>
                                        <h3 class="propTitle">Identificador geográfico</h3>
                                        <ul>
                                        <li class="propContent">Denominación: <span class="pull-right">${itemSelected.properties.identificador_geografico}</span></li>
                                        <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_idg)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_idg)}</span></li>
                                        <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_idg)}</span></li>
                                        <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_extendido)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_extendido)}</span></li>
                                        </ul>
                                        <h3 class="propSubTitle">Nombre extendido</h3>
                                        <ul>
                                        <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_extendido)}</span></li>
                                        <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_extendido)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_extendido)}</span></li>
                                        <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_extendido)}</span></li>
                                        <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_extendido)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_extendido)}</span></li>
                                        </ul>

                                        <h3 class="propSubTitle">Nombre alternativo 2</h3>
                                        <ul>
                                        <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_alternativo_2)}</span></li>
                                        <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_alternativo_2)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_alternativo_2)}</span></li>
                                        <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_alternativo_2)}</span></li>
                                        <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_alternativo_2)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_alternativo_2)}</span></li>
                                        </ul>

                                        <h3 class="propSubTitle">Nombre variante 1</h3>
                                        <ul>
                                        <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_variante_1)}</span></li>
                                        <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_variante_1)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_variante_1)}</span></li>
                                        <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_variante_1)}</span></li>
                                        <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_variante_1)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_variante_1)}</span></li>
                                        </ul>`;


                let namingAttribTemplate  = `<h3 class="propSubTitle">Nombre alternativo 3</h3>
                                        <ul>
                                        <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_alternativo_3)}</span></li>
                                        <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_alternativo_3)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_alternativo_3)}</span></li>
                                        <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_alternativo_3)}</span></li>
                                        <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_alternativo_3)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_alternativo_3)}</span></li>
                                        </ul>


                                        <h3 class="propSubTitle">Nombre variante 2</h3>
                                        <ul>
                                        <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_variante_2)}</span></li>
                                        <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_variante_2)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_variante_2)}</span></li>
                                        <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_variante_2)}</span></li>
                                        <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_variante_2)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_variante_2)}</span></li>
                                        </ul>

                                        <h3 class="propSubTitle">Nombre variante 3</h3>
                                        <ul>
                                        <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_variante_3)}</span></li>
                                        <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_variante_3)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_variante_3)}</span></li>
                                        <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_variante_3)}</span></li>
                                        <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_variante_3)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_variante_3)}</span></li>
                                        </ul>

                                        <h3 class="propSubTitle">Otras denominaciones</h3>
                                        <ul>
                                        <li class="propContent">Nombre recomendado: <span class="pull-right">${fixNullValue(itemSelected.properties.ig_recomendado)}</span></li>
                                        <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_ig_recomendada)}</span></li>
                                        <li class="propContent">Alternativo recomendado: <span class="pull-right">${fixNullValue(itemSelected.properties.alternativo_recomendado)}</span></li>
                                        <li class="propContent">Otras denominaciones: <span class="pull-right">${fixNullValue(itemSelected.properties.otras_denominaciones)}</span></li>
                                        <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_otras_denominaciones)}</span></li>
                                        <li class="propContent">No recomendado: <span class="pull-right">${fixNullValue(itemSelected.properties.forma_no_recomendada)}</span></li>
                                        <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_fnr)}</span></li>
                                        <li class="propContent">Forma errónea: <span class="pull-right">${fixNullValue(itemSelected.properties.forma_erronea)}</span></li>
                                        </ul>`;




                let locationAttribTemplate  = `<h3 class="propTitle">Geometría</h3>
                                        <ul>
                                        <li class="propContent">Geográficas (epsg:4258): <span class="pull-right">${fixNullValue(itemSelected.properties.long_etrs89_regcan95)} ${fixNullValue(itemSelected.properties.lat_etrs89_regcan95)}</span>
                                        </li>
                                        <li class="propContent">UTM (epsg:258${itemSelected.properties.huso_etrs89_regcan95}): <span class="pull-right">${fixNullValue(itemSelected.properties.x_utm_etrs89_regcan95)} ${fixNullValue(itemSelected.properties.y_utm_etrs89_regcan95)}</span></li>
                                        </ul>
                                        <h3 class="propTitle">Provincias</h3>
                                        <p class="propContent">${replaceAllOcurrences(fixNullValue(itemSelected.properties.provincias_nombre),',',', ')}</p>
                                        <h3 class="propTitle">Códigos INE asociados</h3>
                                        <p class="propContent">${replaceAllOcurrences(fixNullValue(itemSelected.properties.codigo_ine),',',', ')}</p>
                                        <h3 class="propTitle">Hoja MTN25</h3><span class="propContent">${itemSelected.properties.hojamtn_25}</span>`;




                let othersAttribTemplate  = `<h3 class="propTitle">Tema INSPIRE</h3><span class="propContent">https://inspire.ec.europa.eu/codelist/NamedPlaceTypeValue/hydrography</span>
                                        <h3 class="propTitle">Otras codificaciones</h3>
                                        <ul>
                                            <li class="propContent">id_autonum_union_sep2013 <span class="pull-right">${fixNullValue(itemSelected.properties.id_autonum_union_sep2013)}</span></li>
                                            <li class="propContent">objectid <span class="pull-right">${fixNullValue(itemSelected.properties.objectid)}</span></li>
                                        </ul>
                                        <h3 class="propTitle">Proceso de autocorrección</h3>
                                        <ul>
                                            <li class="propContent">Texto previo en BTN <span class="pull-right">${fixNullValue(itemSelected.properties.texto_previo_btn)}</span></li>
                                            <li class="propContent">Código TTGGSS <span class="pull-right">${fixNullValue(itemSelected.properties.ttggss)}</span></li>
                                            <li class="propContent">Relación <span class="pull-right">${fixNullValue(itemSelected.properties.relacion)}</span></li>
                                            <li class="propContent">Tratamiento <span class="pull-right">${fixNullValue(itemSelected.properties.tratamiento)}</span></li>
                                        </ul>
                                    </div>`;
                
                let generalAttribContainer = document.getElementById('generalAttrib');
                generalAttribContainer.innerHTML = generalAttribTemplate;
                let namingAttribContainer = document.getElementById('namingAttrib');
                namingAttribContainer.innerHTML = namingAttribTemplate;
                let locationAttribContainer = document.getElementById('locationAttrib');
                locationAttribContainer.innerHTML = locationAttribTemplate;
                let othersAttribContainer = document.getElementById('othersAttrib');
                othersAttribContainer.innerHTML = othersAttribTemplate;                

                if (panningEntity==true){
                    //map.getView().getZoom()
                                centrarVistaToponimo(map,
                                     resultsRequest.features[0].properties.long_etrs89_regcan95,
                                     resultsRequest.features[0].properties.lat_etrs89_regcan95,
                                     15,resultsRequest.features[0].properties.identificador_geografico);
                }
                $("#showListResults").on("click", function(event) {
                                        $("#atributosEntity").hide();
                                        $("#tabulatorEntityList").show();                    
                }); 
                $("#spinner_searchid").hide();
            },
            error: function(e){
                        console.log(e.responseText);
                    }
    });

    console.log("Petición de histórico");
    
    $.ajax({
        url: urlSearchHistoEntityById + idEnti,
        dataType: 'json',
        success: function(resultsRequest){
            document.getElementById('numRegHisto').textContent = resultsRequest.data.length;
            tabulatorHisto.setData(resultsRequest.data);

        },
        error: function(e){
                    console.log(e.responseText);
                }
    });


}


/**
 * Definición Eventos del UI
 */
document.getElementById("searchByName").addEventListener("click", (e) => {
  searchByName();
});

document.getElementById("searchByView").addEventListener("click", (e) => {
  searchByView();
});

document.getElementById("searchById").addEventListener("click", (e) => {
    searchById();
});

document.getElementById("muniselect").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchByMuni();
  }
});

document.getElementById("mtnselect").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchByHojaMTN();
  }
});

document.getElementById("searchByHojaMTN").addEventListener("click", (e) => {
    searchByHojaMTN();
});

document.getElementById("searchByMuni").addEventListener("click", (e) => {
    searchByMuni();
});






