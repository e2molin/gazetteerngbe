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

/**
 * 
 * @param {*} value 
 * @returns 
 */
const fixNullValue = (value) => {
  return value === undefined || value === null
    ? '<em>No definido <i class="fa fa-question-circle" aria-hidden="true"></i></em>'
    : value;
};

const showModalMessage = (message, title) => {

  title = typeof title === "undefined" ? appTitle : title;
  document.getElementById("modal-title").textContent = `${title}`;
  document.getElementById("modal-message").textContent = `${message}`;

  const myModal = new bootstrap.Modal(document.getElementById('myMsgModal'), {keyboard: false})
  myModal.show();

};

/**
 * Procedimiento para las búsquedas por hoja MTN25
 * @returns 
 */
const searchByHojaMTN = () => {

    let userNumMTN = document.getElementById("mtnselect").value;
    let numMTN='';
    if (isEmptyNullString(userNumMTN)){
      document.getElementById("alertnoselmtn").classList.remove("d-none");
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

    if (isEmptyNullString(numMTN)){
      document.getElementById("alertnoselmtn").classList.remove("d-none");
      return;
    }

    let codProv = document.getElementById("provinCbo").value;
    let codDictio = document.getElementById("codDictio").value;
    let urlRequest = mtn25SearchServer + numMTN + "?" + (codDictio != "0.0" ? "codDictio=" + codDictio + "&" : "") + (codProv != "00" ? "codProv=" + codProv + "&" : "");
    
    document.getElementById("alertnoselmtn").classList.add("d-none");
    document.getElementById("presentacion").classList.add("d-none");
    document.getElementById("tabulatorEntityList").classList.add("d-none");
    document.getElementById("atributosEntity").classList.add("d-none");
    document.getElementById("searchingBar").classList.remove("d-none");
    document.getElementById("spinner_searchMTN").classList.remove("d-none");
    

    const options =  {
        method:'GET', /* Por defecto, pero lo pongo como dejemplo de cómo se puede parametrizar */
    }

    fetch(urlRequest,options)
      .then(res => res.json())
      .then(response =>{
          console.log(response);
          showResultsetList(response);
      })
      .catch(err=>{
          console.log(err);
      });

}

/**
 * Procedimiento para las búsquedas por municipio
 * @returns 
 */
const searchByMuni = (codigoINE = '') => {
  
  let nameMuni = document.getElementById("muniselect").value;
  let codDictio = document.getElementById("codDictio").value;
  let codMuni ="";
  if (!isEmptyNullString(codigoINE)){
    codMuni = codigoINE;
  }else{
    if (isEmptyNullString(nameMuni)) {
      document.getElementById("alertnoselmuni").classList.remove("d-none");
      return;
    } else {
      document.getElementById("alertnoselmuni").classList.add("d-none");
    }
  }

  if (codigoINE===''){
    codMuni = nameMuni.substring(nameMuni.length - 6, nameMuni.length - 1);
  } else {
    codMuni = codigoINE;
  }
  
  let urlRequest = `${ineSearchServer}${codMuni}?${(codDictio != "0.0" ? "codDictio=" + codDictio + "&" : "")}`;

  document.getElementById("presentacion").classList.add("d-none");
  document.getElementById("tabulatorEntityList").classList.add("d-none");
  document.getElementById("atributosEntity").classList.add("d-none");
  document.getElementById("searchingBar").classList.remove("d-none");
  document.getElementById("spinner_searchMuni").classList.remove("d-none");

  fetch(urlRequest)
  .then(res => res.json())
  .then(response =>{
      showResultsetList(response);
  })
  .catch(err=>{
      console.log(err);
  });

};

/**
 * Procedimiento para las búsquedas por nombre
 * @returns
 */
const searchByName = () => {

  let nameEnti = document.getElementById("searchByNameparam").value;
  if (isEmptyNullString(nameEnti)) {
    document.getElementById("alertnoselname").classList.remove("d-none");
    return;
  }

  let codProv = document.getElementById("provinCbo").value;
  let codDictio = document.getElementById("codDictio").value;
  let typeSearch = document.getElementById("searchByNameType").value;

  let urlRequest = `${nameSearchServer}${nameEnti}?${codDictio != "0.0" ? "codDictio=" + codDictio + "&" : ""}${codProv != "00" ? "codProv=" + codProv + "&" : ""}typeSearch=${typeSearch}&`;

  document.getElementById("presentacion").classList.add("d-none");
  document.getElementById("tabulatorEntityList").classList.add("d-none");
  document.getElementById("atributosEntity").classList.add("d-none");
  document.getElementById("searchingBar").classList.remove("d-none");
  document.getElementById("spinner_searchName").classList.remove("d-none");

  fetch(urlRequest)
  .then(res => res.json())
  .then(response =>{
      showResultsetList(response);
  })
  .catch(err=>{
      console.log(err);
  });

};

const searchByView = () => {

  const formatter = new M.format.WKT();
  const bboxMin = `POINT (${mapAPICNIG.getBbox().x.min} ${
    mapAPICNIG.getBbox().y.min
  })`;
  const bboxMax = `POINT (${mapAPICNIG.getBbox().x.max} ${
    mapAPICNIG.getBbox().y.max
  })`;

  let bboxMin_epsg4326 = formatter
    .read(bboxMin, {
      dataProjection: "EPSG:3857",
      featureProjection: "EPSG:4326",
    })
    .getGeoJSON().geometry.coordinates;

  let bboxMax_epsg4326 = formatter
    .read(bboxMax, {
      dataProjection: "EPSG:3857",
      featureProjection: "EPSG:4326",
    })
    .getGeoJSON().geometry.coordinates;

  let urlRequest =
    bboxSearchServer +
    "lonmin=" +
    bboxMin_epsg4326[0] +
    "&latmin=" +
    bboxMin_epsg4326[1] +
    "&lonmax=" +
    bboxMax_epsg4326[0] +
    "&latmax=" +
    bboxMax_epsg4326[1];

  if (mapAPICNIG.getZoom() < 13) {
    showModalMessage(
      "El entorno es demasiado grande. Reduzca el nivel de zoom al menos hasta 1:68.000 (nivel>=13)"
    );
    return;
  }
  document.getElementById("presentacion").classList.add("d-none");
  document.getElementById("tabulatorEntityList").classList.add("d-none");
  document.getElementById("atributosEntity").classList.add("d-none");
  document.getElementById("searchingBar").classList.remove("d-none");
  document.getElementById("spinner_searchspatial").style.display = "block";

  fetch(urlRequest)
  .then(res => res.json())
  .then(response =>{
      showResultsetList(response);
  })
  .catch(err=>{
      console.log(err);
  });

};

const searchByBuffer = () => {

  let radioSearch = document.getElementById("searchByRadioparam").value;
  const formatter = new M.format.WKT();
  const centerMap = `POINT (${mapAPICNIG.getCenter().x} ${mapAPICNIG.getCenter().y})`;

  let center_epsg4326 = formatter.read(centerMap, {dataProjection: "EPSG:3857",featureProjection: "EPSG:4326",}).getGeoJSON().geometry.coordinates;
  let urlRequest = urlBufferSearch + "loncenter=" + center_epsg4326[0] + "&latcenter=" + center_epsg4326[1] + "&metersradio=" + radioSearch;

  if (radioSearch > 50000) {
    showModalMessage(
      "El radio de búsqueda es demasiado grande. Reduzca el radio por debajo de 50 Km"
    );
    return;
  }
  document.getElementById("presentacion").classList.add("d-none");
  document.getElementById("tabulatorEntityList").classList.add("d-none");
  document.getElementById("atributosEntity").classList.add("d-none");
  document.getElementById("searchingBar").classList.remove("d-none");
  document.getElementById("spinner_searchspatial").classList.remove("d-none");

  fetch(urlRequest)
  .then(res => res.json())
  .then(response =>{
      showResultsetList(response);
  })
  .catch(err=>{
      console.log(err);
  });


};


const searchById = () => {

  let idEnti = parseInt(document.getElementById("searchByIdparam").value);
  if (idEnti === 0) {
    document.getElementById("alertnoselid").classList.remove("d-none");
    return;
  }
  if (isNaN(idEnti)){
    document.getElementById("alertnoselid").classList.remove("d-none");
    return;
  }
  
  document.getElementById("presentacion").classList.add("d-none");
  document.getElementById("tabulatorEntityList").classList.add("d-none");
  document.getElementById("atributosEntity").classList.add("d-none");
  document.getElementById("searchingBar").classList.remove("d-none");
  document.getElementById("spinner_searchId").classList.remove("d-none");

  fetch(`${urlSearchListById}${idEnti}`)
  .then(res => res.json())
  .then(response =>{
      showResultsetList(response);
  })
  .catch((err)=>{
      console.log(err);
  });



};


/**
 * Helpers para poner bandera junto al idioma
 * Desactivado por problemas políticos. Siempre devuelve la cadena vacía (sin bandera)
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

  console.log("Desarrollo");

});



const showResultsetList = (resultsRequest) => {



  if (resultsRequest.totalFeatures=== 0){
    document.getElementById("spinner_searchspatial").classList.add("d-none");
    document.getElementById("spinner_searchMuni").classList.add("d-none");
    document.getElementById("spinner_searchMTN").classList.add("d-none");
    document.getElementById("spinner_searchId").classList.add("d-none");
    document.getElementById("spinner_searchName").classList.add("d-none");
    document.getElementById("searchingBar").classList.add("d-none");
    showModalMessage(
      "No se encuentran resultados"
    );
    document.getElementById("tabulatorEntityList").classList.remove("d-none");
    document.getElementById("atributosEntity").classList.add("d-none");
    return;
  }


  // Borro la capa de resultados si existe
  mapAPICNIG.getLayers().forEach((lyr) => {
    if (lyr.getImpl().name==='resultNGBE'){
      mapAPICNIG.removeLayers(lyr);
    }
  });


  


  
  // Creo la nueva capa de resultados a partir de la informaicón recibida
  resultNGBE_lyr = new M.layer.GeoJSON({
        name: "resultNGBE", 
        source: resultsRequest,
        extract: false // Así no sale el popup al hacer clic sobre un elemento
  });
  resultNGBE_lyr.setZIndex(115);

  // Fijamos estilo en función del icono
  resultNGBE_lyr.setStyle(new M.style.Point({
      radius: 10,
      icon: {
        src: (feature) => {
          const type = feature.getAttribute('dictiongbe');
          if (!isEmptyNullString(type)) {
            return `img/icons/${type}.png`;
          } else {
            return `img/icons/0.0.0.png`;
          }
        },
        snaptopixel: true,
      },
    }));


    // Al hacer clic sobre un elemento
    resultNGBE_lyr.on(M.evt.SELECT_FEATURES, (features) => {
      if (features.length===1){
        mostrarInfoByNumEnti(features[0].getAttribute('identidad'),true,false);
        document.getElementById("tabulatorEntityList").classList.add("d-none");
        document.getElementById("atributosEntity").classList.remove("d-none");
      }else if (features.length>1){
        lstIndex = [];
        cleanTabulatorResultsFilter();
        features.forEach((feature,index) => {
          lstIndex.push(feature.getAttribute('identidad'));
        })
        tabulatorResults.setFilter("identidad", "in", lstIndex);
        document.getElementById("tabulatorEntityList").classList.remove("d-none");
        document.getElementById("atributosEntity").classList.add("d-none");
      }else{
        cleanTabulatorResultsFilter();
        document.getElementById("tabulatorEntityList").classList.remove("d-none");
        document.getElementById("atributosEntity").classList.add("d-none");
      }
    });

    // Añadimos la capa al mapa
    mapAPICNIG.addLayers(resultNGBE_lyr);

    resultNGBE_lyr.on(M.evt.LOAD, () => {

      mapAPICNIG.setBbox(resultNGBE_lyr.getFeaturesExtent());
      mapAPICNIG.getLayers().forEach((lyr) => {

      });
    });

  document.getElementById("tabulatorEntityList").classList.add("d-none");
  document.getElementById("atributosEntity").classList.add("d-none");
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
  }

  tabulatorResults.clearFilter();
  tabulatorResults.setData(tableData);

  document.getElementById("spinner_searchspatial").classList.add("d-none");
  document.getElementById("spinner_searchMuni").classList.add("d-none");
  document.getElementById("spinner_searchMTN").classList.add("d-none");
  document.getElementById("spinner_searchId").classList.add("d-none");
  document.getElementById("spinner_searchName").classList.add("d-none");
  document.getElementById("searchingBar").classList.add("d-none");
  document.getElementById("numResults").textContent=resultsRequest.features.length;

  if (resultsRequest.features.length===1){
    mostrarInfoByNumEnti(resultsRequest.features[0].properties.identidad,true,false);
    document.getElementById("tabulatorEntityList").classList.add("d-none");
    document.getElementById("atributosEntity").classList.remove("d-none");
  }else{
    document.getElementById("atributosEntity").classList.add("d-none");
    document.getElementById("tabulatorEntityList").classList.remove("d-none");
  }

};

const mostrarInfoByNumEnti = (idEnti,showBtnResults,panningEntity) => {
    
    let attributeDisplay="";
    document.getElementById("spinner_searchEntityData").classList.remove("d-none");
    //Tratamiento de parámetros opcionales
    panningEntity = (typeof panningEntity === 'undefined') ? false : panningEntity;
    

    fetch(`${municipioInfoByIdServer}${idEnti}`)
    .then(res => res.json())
    .then(resultsRequest =>{
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

              let generalAttribTemplate  = `<h4 class="propTitle">General</h4>
                                      <ul>
                                      <li class="propContent">Identidad nº: <span class="pull-right">${itemSelected.properties.id}</span></li>
                                      <li class="propContent">Clasificación: <span class="pull-right">${itemSelected.properties.codigo_ngbe_text}</span></li>
                                      <li class="${itemSelected.properties.provincias_nombre.length>75 ? "propSubContent":"propContent"}">Provincias: <span class="pull-right">${replaceAllOcurrences(fixNullValue(itemSelected.properties.provincias_nombre),',',', ')}</span></li>
                                      <li class="propContent">
                                        Permalink: <span class="pull-right"><a href="${appURLCanonical}?identidad=${itemSelected.properties.id}" target="_blank">Enlace externo <i class="fa fa-external-link" aria-hidden="true"></i></a></span>
                                      </li>
                                      </ul>
                                      <h4 class="propTitle">Identificador geográfico</h4>
                                      <ul>
                                      <li class="propContent">Denominación: <span class="pull-right">${itemSelected.properties.identificador_geografico}</span></li>
                                      <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_idg)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_idg)}</span></li>
                                      <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_idg)}</span></li>
                                      <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_extendido)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_extendido)}</span></li>
                                      </ul>
                                      <h4 class="propSubTitle">Nombre extendido</h4>
                                      <ul>
                                      <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_extendido)}</span></li>
                                      <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_extendido)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_extendido)}</span></li>
                                      <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_extendido)}</span></li>
                                      <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_extendido)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_extendido)}</span></li>
                                      </ul>

                                      <h4 class="propSubTitle">Nombre alternativo 2</h4>
                                      <ul>
                                      <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_alternativo_2)}</span></li>
                                      <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_alternativo_2)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_alternativo_2)}</span></li>
                                      <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_alternativo_2)}</span></li>
                                      <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_alternativo_2)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_alternativo_2)}</span></li>
                                      </ul>

                                      <h4 class="propSubTitle">Nombre variante 1</h4>
                                      <ul>
                                      <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_variante_1)}</span></li>
                                      <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_variante_1)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_variante_1)}</span></li>
                                      <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_variante_1)}</span></li>
                                      <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_variante_1)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_variante_1)}</span></li>
                                      </ul>`;


              let namingAttribTemplate  = `<h4 class="propSubTitle">Nombre alternativo 3</h4>
                                      <ul>
                                      <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_alternativo_3)}</span></li>
                                      <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_alternativo_3)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_alternativo_3)}</span></li>
                                      <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_alternativo_3)}</span></li>
                                      <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_alternativo_3)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_alternativo_3)}</span></li>
                                      </ul>


                                      <h4 class="propSubTitle">Nombre variante 2</h4>
                                      <ul>
                                      <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_variante_2)}</span></li>
                                      <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_variante_2)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_variante_2)}</span></li>
                                      <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_variante_2)}</span></li>
                                      <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_variante_2)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_variante_2)}</span></li>
                                      </ul>

                                      <h4 class="propSubTitle">Nombre variante 3</h4>
                                      <ul>
                                      <li class="propContent">Denominación: <span class="pull-right">${fixNullValue(itemSelected.properties.nombre_variante_3)}</span></li>
                                      <li class="propContent">Idioma: <img class="pull-right ${getClassIdioma(itemSelected.properties.idioma_variante_3)}"><span class="pull-right">${fixNullValue(itemSelected.properties.idioma_variante_3)}</span></li>
                                      <li class="propContent">Fuente: <span class="pull-right">${fixNullValue(itemSelected.properties.fuente_variante_3)}</span></li>
                                      <li class="propContent">Estatus: <img class="pull-right ${getClassEstatus(itemSelected.properties.estatus_variante_3)}"><span class="pull-right">${fixNullValue(itemSelected.properties.estatus_variante_3)}</span></li>
                                      </ul>

                                      <h4 class="propSubTitle">Otras denominaciones</h4>
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

              let codesINE=itemSelected.properties.codigo_ine;
              let linksToMunis = [];
              // Tengo que coger los cinco primeros caracteres para poder manejar los INE largos
              codesINE.toString().split(",").forEach((elem)=> linksToMunis.push(`<a href="${appURLCanonical}?codigoine=${elem.slice(0, 5)}" target="_blank">${elem}</a>`));

              let locationAttribTemplate  = `<h4 class="propTitle">Geometría</h4>
                                      <ul>
                                      <li class="propContent">Geográficas (epsg:4258): <span class="pull-right">${fixNullValue(itemSelected.properties.long_etrs89_regcan95)} ${fixNullValue(itemSelected.properties.lat_etrs89_regcan95)}</span>
                                      </li>
                                      <li class="propContent">UTM (epsg:258${itemSelected.properties.huso_etrs89_regcan95}): <span class="pull-right">${fixNullValue(itemSelected.properties.x_utm_etrs89_regcan95)} ${fixNullValue(itemSelected.properties.y_utm_etrs89_regcan95)}</span></li>
                                      </ul>
                                      <h4 class="propTitle">Provincias</h4>
                                      <p class="propContent">${replaceAllOcurrences(fixNullValue(itemSelected.properties.provincias_nombre),',',', ')}</p>
                                      <h3 class="propTitle">Códigos INE asociados</h3>
                                      <p class="propContent">${replaceAllOcurrences(fixNullValue(linksToMunis.join(', ')),',',', ')}</p>
                                      <h4 class="propTitle">Hoja MTN25</h4><span class="propContent">${itemSelected.properties.hojamtn_25}</span>`;

              let othersAttribTemplate  = `<h4 class="propTitle">Tema INSPIRE</h4>
                                      <span class="propContent">
                                        https://inspire.ec.europa.eu/codelist/NamedPlaceTypeValue/hydrography
                                        <a href="https://inspire.ec.europa.eu/codelist/NamedPlaceTypeValue/hydrography" target="_blank"><i class="fa fa-external-link" aria-hidden="true"></i></a>
                                      </span>
                                      <h4 class="propTitle">Otras codificaciones</h4>
                                      <ul>
                                          <li class="propContent">id_autonum_union_sep2013 <span class="pull-right">${fixNullValue(itemSelected.properties.id_autonum_union_sep2013)}</span></li>
                                          <li class="propContent">objectid <span class="pull-right">${fixNullValue(itemSelected.properties.objectid)}</span></li>
                                      </ul>
                                      <h4 class="propTitle">Proceso de autocorrección</h4>
                                      <ul>
                                          <li class="propContent">Texto previo en BTN <span class="pull-right">${fixNullValue(itemSelected.properties.texto_previo_btn)}</span></li>
                                          <li class="propContent">Código TTGGSS <span class="pull-right">${fixNullValue(itemSelected.properties.ttggss)}</span></li>
                                          <li class="propContent">Relación <span class="pull-right">${fixNullValue(itemSelected.properties.relacion)}</span></li>
                                          <li class="propContent">Tratamiento <span class="pull-right">${fixNullValue(itemSelected.properties.tratamiento)}</span></li>
                                      </ul>
                                  </div>`;
              
              let generalAttribContainer = document.getElementById('general-tab-pane');
              generalAttribContainer.innerHTML = generalAttribTemplate;
              let namingAttribContainer = document.getElementById('naming-tab-pane');
              namingAttribContainer.innerHTML = namingAttribTemplate;
              let locationAttribContainer = document.getElementById('locate-tab-pane');
              locationAttribContainer.innerHTML = locationAttribTemplate;
              let othersAttribContainer = document.getElementById('others-tab-pane');
              othersAttribContainer.innerHTML = othersAttribTemplate;                

              if (panningEntity===true){
                                  centrarVistaSobreToponimo(resultsRequest.features[0].properties.long_etrs89_regcan95,
                                                            resultsRequest.features[0].properties.lat_etrs89_regcan95,15);
              }
              document.getElementById("showListResults").addEventListener("click", () => {
                document.getElementById("tabulatorEntityList").classList.remove("d-none");
                document.getElementById("atributosEntity").classList.add("d-none");
              });
              document.getElementById("spinner_searchEntityData").classList.add("d-none");
    })
    .catch((err)=>{
        console.log(err);
    });



    fetch(`${urlSearchHistoEntityById}${idEnti}`)
    .then(res => res.json())
    .then(response =>{
      console.log(response)
      document.getElementById('numRegHisto').textContent = response.data.length;
      tabulatorHisto.setData(response.data);
    })
    .catch((err)=>{
        console.log(err);
    });


    // Obtenemos discrepancias de la entidad
    fetch(`${urlDiscrepancias}${idEnti}`)
    .then(res => res.json())
    .then(response =>{
      let lstDiscrepancias = [];
      response.data.forEach((element) => {

        let estadoTexto = "";
        let estadoColor = "";
        if (element.estado===0){
          estadoColor="bg-primary text-white";
          estadoTexto="Pendiente de resolución";
        }else if (element.estado===1){
          estadoColor="bg-success text-white";
          estadoTexto="Aceptado";
        }else if (element.estado===2){
          estadoColor="bg-danger text-white";
          estadoTexto="Rechazado";
        }else if (element.estado===3){
          estadoColor="fw-bold bg-warning text-white";
          estadoTexto="Alternativo";
        }else if (element.estado===4){
          estadoColor="bg-danger text-white fw-bold";
          estadoTexto="Eliminar";
        }else if (element.estado===6){
          estadoColor="bg-info text-black";
          estadoTexto="Estudiar";
        }else{
          estadoColor="bg-dark text-white";
          estadoTexto=`Desconocido!!! -> ${element.estado}`;
        }


        lstDiscrepancias.push(`<div class="col-md-12 mb-2">
                        <div class="card shadow-0 border rounded-3">
                          <div class="card-body">
                            <div class="row">
                                <h6><i class="fa fa-tag" aria-hidden="true"></i> ${element.varfield} <img class="${element.nombretabla}"> <span class="text-muted" style="font-size:10px;">${element.nombretabla}</span></h6>
                                <div class="col-md-8">
                                    <ul>
                                      <li class="text-dark"><i class="fa fa-database" aria-hidden="true" title="Consolidado"></i> ${element.oldvalue.split("#")[0]}</li>
                                      <li class="text-primary"><i class="fa fa-paper-plane" aria-hidden="true" title="Enviado"></i> ${element.oldvalue.split("#")[1]}</li>
                                      <li class="text-success"><i class="fa fa-lightbulb-o" aria-hidden="true" title="Propuesto"></i> ${element.newvalue}</li>
                                    </ul>
                                </div>
                                <div class="col-md-4">
                                  <ul>
                                    <li><i class="fa fa-user" aria-hidden="true" title="Usuario"></i> ${isEmptyNullString(element.usuario) ? '' : element.usuario}</li>
                                    <li><i class="fa fa-calendar" aria-hidden="true" title="Fecha"></i> ${element.vardate}</li>
                                    <li><i class="fa fa-gavel" aria-hidden="true" title="Estado"></i> <span class="${estadoColor}">${estadoTexto}</span></li>
                                  </ul>
                                </div>
                                <details class="mb-4 mb-md-0">
                                  <summary><i class="fa fa-comments" aria-hidden="true"></i> Comentarios</summary>
                                  <span class="fst-italic">${isEmptyNullString(element.comentario) ? 'Nada que comentar' : element.comentario}</span>
                                </details>
                            </div>
                          </div>
                        </div>
                      </div>`);
      });
      document.getElementById('discrepancia-tab-pane').innerHTML  = lstDiscrepancias.join('');//response.data.length;
      document.getElementById('numRegDiscrepancias').textContent = lstDiscrepancias.length;
    })
    .catch((err)=>{
        console.log(err);
    });

    document.getElementById("tabulatorEntityList").classList.add("d-none");
    document.getElementById("atributosEntity").classList.remove("d-none");

}

/**
 * Definición Eventos del UI
 */

 document.getElementById("searchByRadio").addEventListener("click", (e) => {
  searchByBuffer();
});

document.getElementById("searchByView").addEventListener("click", (e) => {
  searchByView();
});

document.getElementById("searchByMuni").addEventListener("click", (e) => {
  searchByMuni();
});

document.getElementById("muniselect").addEventListener("keyup", (event) => {
  document.getElementById("alertnoselmuni").classList.add("d-none");
  if (event.key === "Enter") {
    searchByMuni();
  }
});

document.getElementById("searchByHojaMTN").addEventListener("click", (e) => {
  searchByHojaMTN();
});

 document.getElementById("mtnselect").addEventListener("keyup", (event) => {
  document.getElementById("alertnoselmtn").classList.add("d-none");
   if (event.key === "Enter") {
    searchByHojaMTN();
   }
 });

 document.getElementById("searchById").addEventListener("click", (e) => {
  document.getElementById("alertnoselid").classList.add("d-none");
   searchById();
});

document.getElementById("searchByName").addEventListener("click", (e) => {
  searchByName();
});
document.getElementById("searchByNameparam").addEventListener("keyup", (event) => {
 document.getElementById("alertnoselname").classList.add("d-none");
 if (event.key === "Enter") {
   searchByName();
 }
});

document.getElementById("clean-filter").addEventListener("click", (e) => {
    cleanTabulatorResultsFilter();
});


