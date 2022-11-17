import { urlCodigosNGBE,urlProvincias } from './constants';

export var diccionarioNGBE = [];
export var rcdProvincias = [];

/**
 * Obtención del diccionario NGBE
 */

const cargarDiccionarioNGBE = () => {

  fetch(`${urlCodigosNGBE}`)
  .then(res => res.json())
  .then(response =>{
    diccionarioNGBE = response.data;
    let optionsDictionario = [];
    let imagesDictionario = [];
    let headerDictio = '';
    optionsDictionario.push(`<option value="0.0">Ver todas las clases</option>`);
    diccionarioNGBE.forEach((item) => {
      optionsDictionario.push(`<option value="${item.codigo_ngbe}">${item.nombre_mostrado}</option>`);
      if (headerDictio!==item.categoria1){
        imagesDictionario.push(`<h4>${item.categoria1}</h4>`);
        headerDictio=item.categoria1;
      }
      imagesDictionario.push(`<img class="" style="width:48px;" src="/img/icons/${item.codigo_ngbe}-master.png" title="${item.nombre_mostrado}">`)

    });
    document.getElementById('codDictio').innerHTML  = optionsDictionario.join('');
    document.getElementById('modal-message-dictiocodes').innerHTML  = imagesDictionario.join('');

  })
  .catch((err)=>{
      console.log(`No se pudo acceder a las clases del diccionario NGBE ${err}`);
  });

}

/**
 * 
 */
const cargarProvincias = () => {

  fetch(`${urlProvincias}`)
  .then(res => res.json())
  .then(response =>{
    rcdProvincias = response.data;
    let optionsProvincias = [];
    optionsProvincias.push(`<option value="00">Todas las provincias</option>`);
    rcdProvincias.forEach((item) => {
      optionsProvincias.push(` <option value="${item.codine}">${item.nombreprovincia}</option>`);
    });
    document.getElementById('provinCbo').innerHTML  = optionsProvincias.join('');
  })
  .catch((err)=>{
      console.log(`No se pudo acceder a la lista de provincias ${err}`);
  });

}

export { cargarDiccionarioNGBE , cargarProvincias };
