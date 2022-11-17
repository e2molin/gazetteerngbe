import { centrarVistaSobreToponimo } from './apicnigUtils';
import { isEmptyNullString } from "./helpers";
import { mostrarInfoByNumEnti } from './search-manager';

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
  document.getElementById("tabulatorEntityList").classList.add("d-none");
  document.getElementById("atributosEntity").classList.remove("d-none");

}

const zoomToResultPosition=(e,cell)=>{
  centrarVistaSobreToponimo(cell.getRow().getData().dataLon,cell.getRow().getData().dataLat,16);                                    
}

export const cleanTabulatorResultsFilter = () => {
  document.getElementById("filter-value").value=``;
  document.getElementById("numResultsFilter").textContent = ``;
  tabulatorResults.clearFilter();
}

export const updateFilter = () => {
  // Como usamos filtros Add, eliminamos cualquier versión del filtro por nombres que haya
  tabulatorResults.getFilters().forEach((tabFilter) => {
    if (tabFilter.field === "nombre") {
      tabulatorResults.removeFilter("nombre", "like", tabFilter.value);
    }
  });
  let filterValue = document.getElementById("filter-value").value;
  if (isEmptyNullString(filterValue)){
    filterValue=``;
  }
  tabulatorResults.addFilter("nombre", "like", filterValue);
  let numResultadosFiltrados = tabulatorResults.rowManager.activeRowsCount;
  if (numResultadosFiltrados != tabulatorResults.rowManager.rows.length) {
    document.getElementById(
      "numResultsFilter"
    ).textContent = `Filtrados: ${numResultadosFiltrados}`;
  } else {
    document.getElementById("numResultsFilter").textContent = ``;
  }
  console.log(tabulatorResults.getFilters());
};



export const launchTabulatorResults = () =>{

  tabulatorResults = new Tabulator("#example-table", {
    /*data:tabledata,*/ //assign data to table
    /*height:"311px",*/
    /*layout:"fitColumns",*/
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


}

export const launchTabulatorHisto = () =>{

  tabulatorHisto = new Tabulator("#histodataTable", {
    /*data:tabledata,*/ //assign data to table
    /*height:"311px",*/
    /*layout:"fitColumns",*/
    columns:[
    {title:"Fecha", field:"fecha", width:100},
    {title:"Usuario", field:"username", width:100, hozAlign:"left"},
    {title:"Campo", field:"tipocambio", hozAlign:"left"},
    {title:"Antes", field:"oldvalue", hozAlign:"left"},
    {title:"Después", field:"newvalue", hozAlign:"left"},
    ],
  });

}

export var tabulatorResults;
export var tabulatorHisto;
