# Gazetteer NGBE

![](img/jumbotron.png)

" cat"
"1"
"arg"
"ast"
"car"
"cat"
"cay"
"eus"
"euss"
"gal"
"glg"
"mul"
"oci"
"Oficial"
"soa"
"spa"
"spa/arg"
"spa/eus"
"und"
"val"


https://fontawesome.com/v4/icons/

    $cadSQL = "SELECT id,union_sep2013.codigo_ngbe as codigo_ngbe,id_autonum_union_sep2013,objectid,".
            "identificador_geografico,fuente_idg,idioma_idg,estatus_idg,".
            "nombre_extendido,fuente_extendido,idioma_extendido,estatus_extendido,".
            "nombre_alternativo_2,fuente_alternativo_2,idioma_alternativo_2,estatus_alternativo_2,".
            "nombre_alternativo_3,fuente_alternativo_3,idioma_alternativo_3,estatus_alternativo_3,".
            "nombre_variante_1,fuente_variante_1,idioma_variante_1,estatus_variante_1,".
            "nombre_variante_2,fuente_variante_2,idioma_variante_2,estatus_variante_2,".
            "nombre_variante_3,fuente_variante_3,idioma_variante_3,estatus_variante_3,".
            "ig_recomendado,fuente_ig_recomendada,alternativo_recomendado,".
            "otras_denominaciones,fuente_otras_denominaciones,".
            "forma_no_recomendada,fuente_fnr,forma_erronea,provincias_nombre,supraautonomico,".
            "long_etrs89_regcan95,lat_etrs89_regcan95, hojamtn_25,codigo_ine,x_utm_etrs89_regcan95,y_utm_etrs89_regcan95,huso_etrs89_regcan95,".
			"ttggss,observaciones,texto_previo_btn,orden_comodo,relacion,tratamiento,"
            "diccionario.name_inspire as name_inspire,diccionario.nombre_mostrado as tipo_mostrado,".
            "public.ST_AsGeoJSON(public.ST_Transform((the_geom),3857),6) AS geojson FROM ngbe_elaboracion.union_sep2013 ".
            "LEFT JOIN ngbe_cnig.diccionario ON diccionario.codigo_ngbe=union_sep2013.codigo_ngbe ".
            "WHERE id=".$idEntidad;




                 <!-- Tab panes -->
                  <div class="tab-content" id="itemAttribution">
                    <div role="tabpanel" class="tab-pane active" id="generalAttrib"></div>
                    <div role="tabpanel" class="tab-pane" id="namingAttrib"></div>
                    <div role="tabpanel" class="tab-pane" id="locationAttrib"></div>
                    <div role="tabpanel" class="tab-pane" id="othersAttrib"></div>
                    <div role="tabpanel" class="tab-pane" id="historialAttrib"></div>
                </div></div></div>


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

## Lista de Nomencátores


### Aragón:

* Nomenclátor: https://idearagon.aragon.es/toponimia/
* Visor: https://idearagon.aragon.es/visor/

### Andalucía:

* Nomenclátor: http://www.ideandalucia.es/nomenclator/buscador.jsp?lang=esp
* Visor: http://www.ideandalucia.es/visor/
Asturias:
Nomenclátor:
Visor: https://sigvisor.asturias.es/SITPA/?webmap=e0dded03df464437acca9632c5c4fae7&locale=es
Canarias:
Nomenclátor:
Visor: https://visor.grafcan.es/visorweb/
Cantabria:
Nomenclátor:
Visor: https://mapas.cantabria.es/
Castilla La Mancha:
Nomenclátor: nombres geográficos WFS http://geoservicios.castillalamancha.es/arcgis/rest/services/WFS/Nombres_Geograficos_WFS/MapServer?f=jsapi
Visores: el segundo es el de recuperación de nombres geográficos. https://castillalamancha.maps.arcgis.com/apps/webappviewer/index.html?id=a8ef467d6441455d8e08c9d343908cb6
https://castillalamancha.maps.arcgis.com/apps/webappviewer/index.html?id=64fb9f236c9b4217a13ad10c82cb39df
Castilla y León:
Nomenclátor:
Visor: https://idecyl.jcyl.es/vcig/

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


Otros:
Instituto Hidrográfico de la Marina:
http://ideihm.covam.es/visor.html

Confederaciones hidrográficas (pongo solo algunos ejemplos, los más utilizados):
Duero:
http://www.mirame.chduero.es/DMADuero_09_Viewer/viewerShow.do?action=showViewer&showLayers=11-31-307
Ebro:
http://ide-ebro.chebro.es/Default.vm
Guadalquivir:
https://idechg.chguadalquivir.es/nodo/Nomenclator/index.html
Guadiana:
https://www.chguadiana.es/visorCHG/
Júcar
https://aps.chj.es/siajucar/
Segura:
https://www.chsegura.es/portalchsic/apps/webappviewer/index.html?id=db44c41d2c7448409e9c4bab590e3828&codif=&nombre=Publico
Tajo:
http://visor.chtajo.es/VisorCHT/

