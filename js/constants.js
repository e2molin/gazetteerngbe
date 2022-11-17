/**
 * APIBADASID Calls
*/

const domainProduction = "http://10.13.90.93/apibadasidv4/";
const domainDeveloper = "http://localhost/apibadasidv4/";
export const modoDeveloper = false;
const domainRoot = modoDeveloper === true ? domainDeveloper:domainProduction;

export const urlMunisSearcher = `${domainRoot}public/autoridades/municipios`;                         // http://localhost/apibadasidv4/public/autoridades/municipios
export const urlHojaMTNSearcher = `${domainRoot}public/autoridades/hojamtn25`;                        // http://localhost/apibadasidv4/public/autoridades/hojamtn25
export const urlCodigosNGBE = `${domainRoot}public/nomenclator/json/codigosngbeinspire`;              // http://localhost/apibadasidv4/public/nomenclator/json/codigosngbeinspire
export const urlProvincias = `${domainRoot}public/autoridades/json/provincias`;                       // http://localhost/apibadasidv4/public/nomenclator/json/provincias
export const municipioInfoByIdServer = `${domainRoot}public/nomenclator/json/entityngbe/id/`;         // http://localhost/apibadasidv4/public/nomenclator/json/entityngbe/id/
export const bboxSearchServer = `${domainRoot}public/nomenclator/json/listngbe/bbox?`;                // http://localhost/apibadasidv4/public/nomenclator/json/listngbe/bbox?
export const ineSearchServer = `${domainRoot}public/nomenclator/json/listngbe/codine/`;               // http://localhost/apibadasidv4/public/nomenclator/json/listngbe/codine/
export const mtn25SearchServer = `${domainRoot}public/nomenclator/json/listngbe/mtn25/`;              // http://localhost/apibadasidv4/public/nomenclator/json/listngbe/mtn25/
export const nameSearchServer  = `${domainRoot}public/nomenclator/json/listngbeINSPIRE/name/`;        // http://localhost/apibadasidv4/public/nomenclator/json/listngbeINSPIRE/name/
export const urlSearchListById = `${domainRoot}public/nomenclator/json/listngbe/id/`;                 // http://localhost/apibadasidv4/public/nomenclator/json/listngbe/id/
export const urlSearchHistoEntityById = `${domainRoot}public/nomenclator/json/entityngbehisto/id/`;   // http://localhost/apibadasidv4/public/nomenclator/json/entityngbehisto/id/
export const urlBufferSearch = `${domainRoot}public/nomenclator/json/listngbe/buffer?`;               // http://localhost/apibadasidv4/public/nomenclator/json/listngbe/buffer?
export const urlDiscrepancias = `${domainRoot}public/nomenclator/json/entityngbediscrepancias/id/`;   // http://localhost/apibadasidv4/public/nomenclator/json/entityngbediscrepancias/id/

export const appTitle= "Gazetteer NGBE";
export const appURLCanonical = "http://sapignmad200.ign.fomento.es/runtime/gazetteerngbe/index.html"
