import { appTitle } from "./constants";


/*
Funciones básicas
*/

export const replaceAllOcurrences = (str, find, replace) => {
  return (str.toString().indexOf(find)===-1 ? str.toString() :  str.toString().replace(new RegExp(find, 'g'), replace));
}

export const getFloatNum = (valorNumero) => {
  if (valorNumero==="") {
    return 0;
  }
  if (isNaN(valorNumero)) {
    return 0;
  }
  return parseFloat(valorNumero);
}


/**
 * 
 * @param {*} cadena 
 * @returns 
 */
 export const isEmptyNullString = (cadena) => {
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
export const fixNullValue = (value) => {
  return value === undefined || value === null
    ? '<em>No definido <i class="fa fa-question-circle" aria-hidden="true"></i></em>'
    : value;
};

export const showModalMessage = (message, title) => {

  title = typeof title === "undefined" ? appTitle : title;
  document.getElementById("modal-title").textContent = `${title}`;
  document.getElementById("modal-message").textContent = `${message}`;

  const myModal = new bootstrap.Modal(document.getElementById('myMsgModal'), {keyboard: false})
  myModal.show();

};

/**
 * Helpers para poner bandera junto al idioma
 * Desactivado por problemas políticos. Siempre devuelve la cadena vacía (sin bandera)
 * @param {*} idioma 
 * @returns 
 */
 export const getClassIdioma= (idioma)=>{
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
export const getClassEstatus= (estatus)=>{
    
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