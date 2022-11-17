import { isEmptyNullString, replaceAllOcurrences, getFloatNum } from "./helpers";
import { cargarDiccionarioNGBE, cargarProvincias } from "./datasets";
import { modoDeveloper, urlMunisSearcher, urlHojaMTNSearcher } from "./constants";
import * as mapUtils from './apicnigUtils';
import { searchByBuffer, searchById, searchByMuni, searchByName, searchByView, searchByHojaMTN } from './search-manager';
import { launchTabulatorResults, launchTabulatorHisto, updateFilter, tabulatorResults, cleanTabulatorResultsFilter } from "./tableresulsets";

var mobileMode=false;
var lstIndex=[]; // Almacena los índices de los elementos sobre los que se ha hecho clic sobre el mapa.

/*----------------------------------------*/
/*Botoneras ------------------------------*/
/*----------------------------------------*/

document.getElementById("showPresentacion").addEventListener("click", () => {
    document.getElementById("tabulatorEntityList").classList.add("d-none");
    document.getElementById("atributosEntity").classList.add("d-none");
    document.getElementById("presentacion").classList.remove("d-none");
});

document.getElementById("showLegend").addEventListener("click", () => {
  
  const myModal = new bootstrap.Modal(document.getElementById('modalDictio'), {keyboard: false})
  myModal.show();

});

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
  if (event.target.value === ''){
    document.getElementById("autoComplete_list_1").hidden = true;
  }
  if (event.key === "Enter") {
    searchByMuni();
  }
});

document.getElementById("searchByHojaMTN").addEventListener("click", (e) => {
  searchByHojaMTN();
});

 document.getElementById("mtnselect").addEventListener("keyup", (event) => {
  document.getElementById("alertnoselmtn").classList.add("d-none");
  if (event.target.value === ''){
    document.getElementById("autoComplete_list_2").hidden = true;
  }  
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

document.getElementById("develOne").addEventListener("click", () => {

  console.log("Desarrollo");

});

window.addEventListener('resize', () => {

  if (window.innerWidth < '768'){  
    mobileMode=true;
  } else {  
    mobileMode=false;
  } 

});


document.addEventListener("DOMContentLoaded", function(event) { 

    console.log(`Arranque W/H: ${window.innerWidth} / ${window.innerHeight}`);
    console.log(`${window.innerWidth<768 ? 'Mobile' : 'desktop'}`)
    
    // Cargamos el diccionario NGBE
    cargarDiccionarioNGBE();

    // Cargamos la lista de provincias
    cargarProvincias()

    // Lanzar mapa
    mapUtils.createAPICNIGMap();

    launchTabulatorResults();
    launchTabulatorHisto();

    const configAutoCompleteMunis = {
        selector: "#muniselect",
        placeHolder: "Buscar municipio...",
        data: {
            src: async (query) => {
              try {
                const source = await fetch(`${urlMunisSearcher}`);
                const data = await source.json();
                return data;
              } catch (error) {
                return error;
              }
            },
            cache: false,
        },
        searchEngine: "strict", // loose
        diacritics: true, // True: unaccent search false: accent search
        resultsList: {
                      element: (list, data) => {
                          const info = document.createElement("p");
                          if (data.results.length) {
                              info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
                          } else {
                              info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
                          }
                          list.prepend(info);
                      },
                      noResults: true,
                      maxResults: 15,
                      tabSelect: true,
        },            
        resultItem: {
          element: (item, data) => {
              // Modify Results Item Style
              item.style = "display: flex; justify-content: space-between;";
              item.innerHTML = `
              <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                ${data.match}
              </span>`;
            },              
            highlight: true
        },
        events: {
            input: {
                selection: (event) => {
                    const selection = event.detail.selection.value;
                    autoCompleteMunis.input.value = selection;
                }
            }
        }
    }

    const configAutoCompleteMTNs = {
      selector: "#mtnselect",
      placeHolder: "Buscar hoja MTN25...",
      data: {
          src: async (query) => {
            try {
              // Fetch Data from external Source
              const source = await fetch(`${urlHojaMTNSearcher}`);
              // Data should be an array of `Objects` or `Strings`
              const data = await source.json();
              return data;
            } catch (error) {
              return error;
            }
          },
          cache: false,
      },
      searchEngine: "strict", // loose
      diacritics: true, // True: unaccent search false: accent search
      resultsList: {
                    element: (list, data) => {
                        const info = document.createElement("p");
                        if (data.results.length) {
                            info.innerHTML = `Mostrando <strong>${data.results.length}</strong> de <strong>${data.matches.length}</strong> resultados`;
                        } else {
                            info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
                        }
                        list.prepend(info);
                    },
                    noResults: true,
                    maxResults: 15,
                    tabSelect: true,
      },            
      resultItem: {
        element: (item, data) => {
            item.style = "display: flex; justify-content: space-between;";
            item.innerHTML = `
            <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
              ${data.match}
            </span>`;
          },              
          highlight: true
      },
      events: {
          input: {
              selection: (event) => {
                  const selection = event.detail.selection.value;
                  autoCompleteMTNs.input.value = selection;
              }
          }
      }
    } 

    const autoCompleteMunis = new autoComplete(configAutoCompleteMunis);
    const autoCompleteMTNs = new autoComplete(configAutoCompleteMTNs);

    document.getElementById("tabulatorEntityList").classList.add("d-none");
    document.getElementById("atributosEntity").classList.add("d-none");
    document.getElementById("presentacion").classList.remove("d-none");
    if (modoDeveloper){
      document.getElementById("develPanel").classList.remove("d-none");
    }

   // Detección del permalink de entidad
    let paramSearch=window.location.search;
    if (!isEmptyNullString(paramSearch)){
      if (paramSearch.indexOf('?identidad=')>=0){
        let idEntidadSearch = paramSearch.replace('?identidad=','');
        // console.log(`Permalink entidad ${paramSearch.replace('?identidad=','')}`);
        document.getElementById("searchByIdparam").value=idEntidadSearch;
        searchById();
      }else if(paramSearch.indexOf('?codigoine=')>=0){
        let codigoINESearch = paramSearch.replace('?codigoine=','');
        // console.log(`Permalink códigoINE ${paramSearch.replace('?codigoine=','')}`);
        searchByMuni(codigoINESearch);        
      }
    }




});