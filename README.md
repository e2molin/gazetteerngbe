# Gazetteer NGBE

![](img/jumbotron.png)

Aplicación web para la consulta del NGBE. El Nomenclátor Geográfico Nacional se define como un registro dinámico de información que recoge las denominaciones oficiales referenciadas geográficamente que deben utilizarse en la cartografía oficial.

## Opciones de búsqueda

### Espaciales

* Por vista del mapa: topónimos dentro del bounding Box del mapa. El entorno de búsqueda debe ser de un nivel de zoom >=13.
* Por buffer: calcula el centro del mapa y devuelve los topónimos dentro de un radio de búsqueda <= 50 Km.
  
### Textuales

* Topónimos contenidos dentro de un municipio. Busqueda del municipio con *autocomplete*.
* Topónimos contenidos dentro de una hoja del MTN25. Busqueda de la hoja con *autocomplete*.
* Búsqueda por identificados espacial.
* Búsqueda por nombre del topónimo.
  * Cadena de texto contenida
  * Cadena de texto al principio del nombre del topónimo
  * Cadena de texto al final del nombre del topónimo
  * Cadena de texto exacta al topónimo

Los resultados pueden filtrarse por provincia o por clase.








## localStorage

Así obtenemos todas las claves almacenadas en `localStorage`

```javascript

for (var i = 0; i < localStorage.length; i++) {   
    key = localStorage.key(i);
    console.log(key)

}

// Así obtenemos el valor a sociado a una clave
value = localStorage.getItem(key);

// Así eliminamos la almacenada en una determinada clave
localStorage.removeItem(key); 

```

En nuestro caso, la librería **typeahead** almacena en el localStorage los arrays con los valores para mostrar en el autonumérico. Para el caso del municipio, el HTML y el Jacascript son:;

```html
<input type="text" id="muniselect" name="muniselect" class="combomunis" placeholder="Introduce un municipio y pulsa buscar">
```

```javascript
$('#muniselect').typeahead({
name: 'combomunis',
prefetch : 'http://localhost/apibadasidv4/public/autoridades/municipios'
});
```

Esto genera una clave en el **localStorage** llamada *__combomunis__itemHash* que almacena los valores retornados por la llamada a la API BADASID. Para borara de la caché estos valores, podemos usar:

```javascript
localStorage.clear(); /* Borra todo lo allacenado en localStorage */ 
localStorage.removeItem('__combomunis__itemHash'); /* Borra úncaimente valores de la clave */
```

## Lista de Nomenclátores

### Aragón:

* Nomenclátor: https://idearagon.aragon.es/toponimia/
* Visor: https://idearagon.aragon.es/visor/

### Andalucía:

* Nomenclátor: http://www.ideandalucia.es/nomenclator/buscador.jsp?lang=esp
* Visor: http://www.ideandalucia.es/visor/

### Asturias:

* Nomenclátor:
* Visor: https://sigvisor.asturias.es/SITPA/?webmap=e0dded03df464437acca9632c5c4fae7&locale=es

> https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=Oviedo, Asturias, Principado de Asturias, ESP&f=json&outSR={"wkid":25830,"latestWkid":25830}&outFields=*&maxLocations=6

### Canarias:

* Nomenclátor:
* Visor: https://visor.grafcan.es/visorweb/

### Cantabria:

* Nomenclátor:
* Visor: https://mapas.cantabria.es/
 
### Castilla La Mancha:

* Nomenclátor: nombres geográficos WFS http://geoservicios.castillalamancha.es/arcgis/rest/services/WFS/Nombres_Geograficos_WFS/MapServer?f=jsapi
* Visores: https://castillalamancha.maps.arcgis.com/home/index.html

### Castilla y León:

* Nomenclátor:
* Visor: https://idecyl.jcyl.es/vcig/

### Catalunya:

* Nomenclátor: https://icgc-portal.maps.arcgis.com/apps/webappviewer/index.html?id=2e86bfc12b17492dad96a186329ce92a
* Visor: http://www.icc.cat/vissir/

> https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=guixols&maxSuggestions=6&location=%7B%22x%22%3A178502.105134977%2C%22y%22%3A5097900.8594984235%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&distance=50000

### Comunitat Valenciana:

* Nomenclátor: http://www.avl.gva.es/corpus-toponimic-valencia
* Visor: https://visor.gva.es/visor/

> https://descargas.icv.gva.es/server_api/buscador/solrclient.php?start=0&limit=40&callback=jQuery112406323839692766491_1664973414562&query=altea&_=1664973414563
> 
### Extremadura:

* Nomenclátor:
* Visor: http://www.ideex.es/IDEEXVisor/


### Galicia:

* Nomenclátor: https://toponimia.xunta.gal/gl
* Visores: 
  * http://mapas.xunta.gal/visores/pba/?locale=es
  * http://mapas.xunta.gal/visores/basico/

Ejemplos de petición:

> https://ideg.xunta.gal/servizos/rest/services/PBA/NomenclatorPBA_2021_Geocoder_gdb/GeocodeServer/suggest?f=json&text=monte&maxSuggestions=10
> https://ideg.xunta.gal/servizos/rest/services/PBA/NomenclatorPBA_2021_Geocoder_gdb/GeocodeServer/findAddressCandidates?SingleLineCityName=Monte%20da%20Rabadeira%2C%20O%2C%20Arteixo&f=json&outSR=%7B%22wkid%22%3A25829%2C%22latestWkid%22%3A25829%7D&outFields=City%2CState&magicKey=GST7YMc0AM9UOsKtGTyVGST7YMc0AM9UOsEbDSE0DMcQHhpnYUSaQ5NJEYpLYMytHSWnDMyAETc7OSh0YTphOSpVCZ50HYW_nsNJQsba&maxLocations=10
> https://ideg.xunta.gal/servizos/rest/services/PBA/NomenclatorPBA_2021_Geocoder_gdb/GeocodeServer/findAddressCandidates?SingleLineCityName=Monte&f=json&

### Illes Balears:

* Nomenclátor: http://ideib.caib.es/cataleg/srv/cat/catalog.search;jsessionid=4BA8EAA574F968F578F86EBB2A341B47#/metadata/BA70AF10-6160-4E40-8051-8AA915D64715
* Visor: https://ideib.caib.es/visor/

### La Rioja:

* Nomenclátor: https://ias1.larioja.org/iderioja/ANONIMO_INSPIRE;jsessionid=D4994AB38EA39C2612BC94B0D2B8DD0F.jvm2;jsessionid=3F6810590AD19D4FCA1E1D3DB818D1F9.jvm2?idSesionVirtual=0923c7e4b3a3f29f118792f960be7d3ea85f7b6a
* Visores: 
  * https://www.iderioja.larioja.org/geovisor/index_fs.php?lang=es
  * https://visor2.iderioja.larioja.org/mapa.php#

### Madrid:

* Nomenclátor:
* Visores: 
  * https://idem.madrid.org/visor/?v=CartoMadrid&ZONE=432488.91350807,4470367.434433571,10
  * http://idem.madrid.org/cartografia/sitcm/html/visor.htm

### Murcia:

* Nomenclátor: https://sitmurcia.carm.es/web/sitmurcia/nombres-geograficos
* Visor: https://visoriderm.carm.es/mapstore/#/viewer/openlayers/1/?

Usa el buscador de OSM.

* https://nominatim.openstreetmap.org/?q=les%20vieilles%20villes&format=json&bounded=0&polygon_geojson=1&priority=5&returnFullData=false
* https://nominatim.openstreetmap.org/?q=lor&format=json&bounded=0&polygon_geojson=1&priority=5&returnFullData=false

### Navarra:
* Nomenclátor: https://sitna.navarra.es/geoportal/Busquedas/PorToponimo.aspx
* Visor: https://idena.navarra.es/navegar/#ZXh0fGJhc2V8Y2FydG9ncmFmaWF8bGF5ZXJzXl42MDE4NzMuMjA4fDQ3MzIyMDQuMzM3fDY0MjgzMy4yMDh8NDc2MDMzMi4zMzdeJDB8QDR8NXw2fDddfDF8MnwzfEBdXQ==

### País Vasco:

Nomenclátor: el primero del Gobierno Vasco, el segundo de la Real Academia de la Lengua Vasca

* Gobierno vasco: https://www.euskadi.eus/app/nomenclator-geografico-cae/puerto/araba-alava/oficial/consultanomenclator/codcon-3/codtipoent-702080/codprov-1/oficial-s
* Academia de la Lengua Vasca : https://www.euskaltzaindia.eus/index.php?option=com_ecoeoda&task=lekuaPortada&Itemid=794&lang=es
* Visor: https://www.geo.euskadi.eus/s69-bisorea/es/x72aGeoeuskadiWAR/index.jsp
* Consulta

> https://www.euskadi.eus/app/nomenclator-geografico-cae/pozonagusia/oficial/consultanomenclator/top-**mallutz**


### Instituto Hidrográfico de la Marina

* http://ideihm.covam.es/visor.html

### Confederaciones hidrográficas

#### Duero:
* http://www.mirame.chduero.es/DMADuero_09_Viewer/viewerShow.do?action=showViewer&showLayers=11-31-307

#### Ebro:
* http://ide-ebro.chebro.es/Default.vm

#### Guadalquivir:
* https://idechg.chguadalquivir.es/nodo/Nomenclator/index.html

#### Guadiana:
* https://www.chguadiana.es/visorCHG/

#### Júcar
* https://aps.chj.es/siajucar/

#### Segura:
* https://www.chsegura.es/portalchsic/apps/webappviewer/index.html?id=db44c41d2c7448409e9c4bab590e3828&codif=&nombre=Publico

#### Tajo:
* http://visor.chtajo.es/VisorCHT/



@@@ Lo dejo
Accediendo al diccio0nario completo

SELECT 
diccionario_codigo_ngbe.iddic,diccionario_codigo_ngbe.codigo_ngbe,
diccionario_codigo_ngbe.categoria1,diccionario_codigo_ngbe.categoria2,diccionario_codigo_ngbe.categoria3,
resumen, diccionario.*
FROM ngbe_elaboracion.diccionario_codigo_ngbe 
left join ngbe_cnig.diccionario  on diccionario_codigo_ngbe.codigo_ngbe=diccionario.codigo_ngbe

## Apuntes

### Uso de fetch en peticiones API

AJAX correponde a la abreviatura de **Asynchronous JavaScript and XML**. AJAX es una técnica de desarrollo web que nos permite actualziar el contenido de una web sin recargar la página completa.
El XML presente en el nombre se debe a aque inicialmente las transferencias de datos se hacían utilizaban este lenguaje de marcado. Hoy en día, este formato ha sido sustituído mayoritariamente por JSON.
Javascript tiene un objeto llamado XMLHttpRequest() que podemos utilizar para hacer estas peticiones. Sin embargo, su complejidad fue unos de los motivos por los que **jQuery** se hizo tan popular, ya que simplificaba
las llamadas.

Actualmente lo mejor es utilizar **Fetch API**. La API Fetch proporciona una interfaz para recuperar recursos. Fetch devuelve una promesa, que tenemos que manejar. Esta respuesta que devuelve, contiene entre sus propiedades un *status* para comprobar cómo ha ido la petición, y un **body**, que es una clase ReadableStream.

```javascript  
const options =  {
        method:'GET', /* Por defecto, pero lo pongo como dejemplo de cómo se puede parametrizar */
}

fetch(urlRequest,options)
  .then(res => res.json()) /* Retorno implícito de un arrow function */
  .then(response =>{
    console.log(response);
    showResultsetList(response);
  })
  .catch(err=>{
    console.log(err);
  });


fetch(urlRequest,options)
  .then(res => {
    /* Retorno explícito de un arrow function */
    // Comprobamos el valor de un header en particular 👇
    console.log(res.headers.get("Content-Type")); 
    // Listamos todos los headers recibidos 👇
    for (const [key, val] of response.headers){ 
      console.log(key,val)
    }
    return res.json()
  })
  .then(response =>{
          console.log(response);
          showResultsetList(response);
  })
  .catch(err=>{
          console.log(err);
  });
```

Esto que vemos aquí es una petición GET, pero podemos mandar una petción POST

```javascript
// Los datos que queremos enviar
const payload ={
  id: 1354654,
  name: "Esteban",
  color: "red",
}

const options = {
  method: "POST",
  headers: {
    "Content-type": "application/json; charsert=UTF-8"
  },
  body: JSON.stringify(payload),
}


fetch(url, options)
    .then(res => console.log(res)) /* Retorno implícito de un arrow function */
    .catch(err=>{
      /* Retorno explícito de un arrow function */
      console.log(err);
    });
```




RApidapi.com

https://fontawesome.com/v4/icons/

https://www.youtube.com/watch?v=FJ-w0tf3d_w



                  <div class="col-md-6">
                    <div class="card shadow-0 border rounded-3">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-12">
                            <h6>identificador_geografico <img class="idioma_ast pull-right"></h6>
                            <div class="d-flex flex-row">
                              <div class="mt-1 mb-0 text-muted">
                                <ul>
                                  <li class="text-dark"><i class="fa fa-database" aria-hidden="true" title="Consolidado"></i> Añarbeko urtegia</li>
                                  <li class="text-primary"><i class="fa fa-paper-plane" aria-hidden="true" title="Enviado"></i> Embalse de Añarbe</li>
                                  <li class="text-success"><i class="fa fa-lightbulb-o" aria-hidden="true" title="Propuesto"></i> Añarbeko urtegia</li>
                                </ul>
                              </div>
                            </div>

                            <div class="mb-2 text-dark">
                              <ul>
                                <li>Usuario: e2molin</li>
                                <li>vardate: 2018-12-13 00:00:00</li>
                                <li>Estado: <span class="bg-success text-white">Aceptado</span> <span class="bg-danger text-white">Rechazado</span> <span class="bg-warning text-white">Pending</span></li>
                              </ul>
                            </div>
                            <details  class="mb-4 mb-md-0">
                              <summary><i class="fa fa-comments" aria-hidden="true"></i> Details</summary>
                              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam, obcaecati corrupti consectetur libero est natus facilis veniam minima tempore culpa fugit cum alias voluptates aspernatur nostrum quod ullam, dolore amet.
                            </details>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


              <div class="col-md-12">
                <div class="card shadow-0 border rounded-3">
                  <div class="card-body">
                    <div class="row">
                      
                        <h6>identificador_geografico <img class="idioma_ast pull-right"></h6>
                          <div class="col-md-6">
                            <ul>
                              <li class="text-dark"><i class="fa fa-database" aria-hidden="true" title="Consolidado"></i> Añarbeko urtegia</li>
                              <li class="text-primary"><i class="fa fa-paper-plane" aria-hidden="true" title="Enviado"></i> Embalse de Añarbe</li>
                              <li class="text-success"><i class="fa fa-lightbulb-o" aria-hidden="true" title="Propuesto"></i> Añarbeko urtegia</li>
                            </ul>
                          </div>

                          <div class="col-md-6">
                            <ul>
                              <li>Usuario: e2molin</li>
                              <li>vardate: 2018-12-13 00:00:00</li>
                              <li>Estado: <span class="bg-success text-white">Aceptado</span> <span class="bg-danger text-white">Rechazado</span> <span class="bg-warning text-white">Pending</span></li>
                            </ul>
                        </div>
                        <details  class="mb-4 mb-md-0">
                          <summary><i class="fa fa-comments" aria-hidden="true"></i> Details</summary>
                          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam, obcaecati corrupti consectetur libero est natus facilis veniam minima tempore culpa fugit cum alias voluptates aspernatur nostrum quod ullam, dolore amet.
                        </details>
                      </div>
                    </div>
                  </div>
                </div>
              </div>