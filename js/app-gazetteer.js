var mobileMode=false;
var map;

var  mapAPICNIG = null;

var resultNGBE_lyr=null; // Capa para almacenar resultados de las búsquedas
var projection = ol.proj.get('EPSG:3857');
var tabulatorResults;
var tabulatorHisto;
var lstIndex=[]; // Almacena los índices de los elementos sobre los que se ha hecho clic sobre el mapa.


/**
 * APIBADASID Calls
 */

 
const domainProduction = "http://10.13.90.93/apibadasidv4/";
const domainDeveloper = "http://localhost/apibadasidv4/";
const modoDeveloper = true;
const domainRoot = modoDeveloper === true ? domainDeveloper:domainProduction;

const urlMunisSearcher = `${domainRoot}public/autoridades/municipios`;//'http://localhost/apibadasidv4/public/autoridades/municipios';
const urlHojaMTNSearcher = `${domainRoot}public/autoridades/hojamtn25`;//'http://localhost/apibadasidv4/public/autoridades/hojamtn25';
const municipioInfoByIdServer = `${domainRoot}public/nomenclator/json/entityngbe/id/`;//'http://localhost/apibadasidv4/public/nomenclator/json/entityngbe/id/'
const bboxSearchServer = `${domainRoot}public/nomenclator/json/listngbe/bbox?`;//'http://localhost/apibadasidv4/public/nomenclator/json/listngbe/bbox?'
const ineSearchServer = `${domainRoot}public/nomenclator/json/listngbe/codine/`;//'http://localhost/apibadasidv4/public/nomenclator/json/listngbe/codine/'
const mtn25SearchServer = `${domainRoot}public/nomenclator/json/listngbe/mtn25/`;//'http://localhost/apibadasidv4/public/nomenclator/json/listngbe/mtn25/'
const nameSearchServer  = `${domainRoot}public/nomenclator/json/listngbeINSPIRE/name/`;//'http://localhost/apibadasidv4/public/nomenclator/json/listngbeINSPIRE/name/'
const urlSearchListById = `${domainRoot}public/nomenclator/json/listngbe/id/`;//'http://localhost/apibadasidv4/public/nomenclator/json/listngbe/id/'
const urlSearchHistoEntityById = `${domainRoot}public/nomenclator/json/entityngbehisto/id/`;//'http://localhost/apibadasidv4/public/nomenclator/json/entityngbehisto/id/'




/*-------------------------------------------------------------------------------------------------------------------------------------------------*/
/*
Funciones básicas
*/
String.prototype.beginsWith = (string) => {
    return(this.indexOf(string) === 0);
};

const replaceAllOcurrences = (str, find, replace) => {
    return (str.toString().indexOf(find)===-1 ? str.toString() :  str.toString().replace(new RegExp(find, 'g'), replace));
}

const getFloatNum = (valorNumero) => {
    if (valorNumero==="") {
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

document.getElementById("showPresentacion").addEventListener("click", () => {
    document.getElementById("tabulatorEntityList").style.display = "none";
    document.getElementById("atributosEntity").style.display = "none";
    document.getElementById("presentacion").style.display = "block";
});

/*document.getElementById("showTabulatorResults").addEventListener("click", () => {
    document.getElementById("atributosEntityList").style.display = "none";
    document.getElementById("atributosEntity").style.display = "none";
    document.getElementById("presentacion").style.display = "none";
    document.getElementById("tabulatorEntityList").style.display = "block";
});

document.getElementById("showTabulatorResults").addEventListener("click", () => {
    document.getElementById("atributosEntityList").style.display = "show";
    document.getElementById("atributosEntity").style.display = "none";
    document.getElementById("presentacion").style.display = "none";
    document.getElementById("tabulatorEntityList").style.display = "none";
});*/


const cleanTabulatorResultsFilter = () => {
    document.getElementById("filter-value").value=``;
    document.getElementById("numResultsFilter").textContent = ``;
    tabulatorResults.clearFilter();
}

const createAPICNIGMap = () => {

    mapAPICNIG = new M.map({
        container: 'mapLienzo',
        controls: ['backgroundlayers', 'scaleline', 'rotate' , 'location'],
        zoom: 5,
        maxZoom: 22,
        minZoom: 4,
        projection: "EPSG:3857*m",
        center: {
            x: -712300,
            y: 4310700,
            draw: false  //Dibuja un punto en el lugar de la coordenada
        },
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
    $("#mtnselect").css("width", $("#codDictio").css("width"));
    $(".tt-dropdown-menu").css("width", $("#codDictio").css("width"));
    $(".tt-hint").css("width", $("#codDictio").css("width"));
    
 }



document.addEventListener("DOMContentLoaded", function(event) { 
    console.log("Arranque W/H:" + $(window).width() + "/" + $(window).height());
    if (($(window).width()) < '768'){  
        mobileMode=true;
    } else {  

    }
    //Resizing inicial
    $("#muniselect").css("width", $("#sidebar-container").width()-35);
    $("#mtnselect").css("width", $("#sidebar-container").width()-35);
    $(".tt-dropdown-menu").css("width", $("#sidebar-container").width()-35);    
    $(".tt-hint").css("width", $("#sidebar-container").width()-35);    
    
    
    $("#searchByMTNparam").val("");
    $("#searchByNameparam").val("");
    $("#muniselect").val("");
    $("#mtnselect").val("");
    $("#searchByIdparam").val("");
    
       
    // Lanzar mapa
    //basicMap();
    createAPICNIGMap();

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

    const centrarVistaSobreToponimo = (longitud,latitud,zoomLevel,mensaje)=>{
	
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
    



    const getInfoResult = (e, cell)=>{
        mostrarInfoByNumEnti(cell.getRow().getData().identidad,true);
        document.getElementById("tabulatorEntityList").style.display = "none";
        document.getElementById("atributosEntity").style.display = "block";
    }

    const zoomToResultPosition=(e,cell)=>{
        centrarVistaSobreToponimo(cell.getRow().getData().dataLon,cell.getRow().getData().dataLat,map.getView().getZoom(),"");                                    
    }

    const updateFilter = () => {
      // Como usamos filtros Add, eliminamos cualquier versión del filtro por nombres que haya
      tabulatorResults.getFilters().forEach((tabFilter) => {
        if (tabFilter.field === "nombre") {
          tabulatorResults.removeFilter("nombre", "like", tabFilter.value);
        }
      });
      let filterValue = document.getElementById("filter-value").value;
      if (isEmptyNullString(filterValue)){return;}
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

    tabulatorResults = new Tabulator("#example-table", {
        /*data:tabledata,*/ //assign data to table
        /*height:"311px",*/
        layout:"fitColumns",
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

    tabulatorHisto = new Tabulator("#histodataTable", {
        /*data:tabledata,*/ //assign data to table
        /*height:"311px",*/
        layout:"fitColumns",
        columns:[
        {title:"Fecha", field:"fecha", width:100},
        {title:"Usuario", field:"username", width:100, hozAlign:"left"},
        {title:"Campo", field:"tipocambio", hozAlign:"left"},
        {title:"Antes", field:"oldvalue", hozAlign:"left"},
        {title:"Después", field:"newvalue", hozAlign:"left"},
        ],
    });


    document.getElementById("filter-value").addEventListener("keyup", updateFilter);

    document.getElementById("download-csv").addEventListener("click", function(){
        tabulatorResults.download("csv", "data.csv");
    });

    document.getElementById("download-json").addEventListener("click", function(){
        tabulatorResults.download("json", "data.json");
    });

    document.getElementById("download-html").addEventListener("click", function(){
        tabulatorResults.download("html", "data.html", {style:true});
    })

    document.getElementById("zoom-mapResults").addEventListener("click", function(){
        mapAPICNIG.setBbox(resultNGBE_lyr.getFeaturesExtent());
    })


    

    $('#muniselect').typeahead({
        name: 'combomunis',
        prefetch : urlMunisSearcher
      });
      $('#mtnselect').typeahead({
          name: 'combomtn',
          prefetch : urlHojaMTNSearcher
        });

    document.getElementById("alertnosel").style.display = "none";
    document.getElementById("alertnoselMTN").style.display = "none";
    
});
