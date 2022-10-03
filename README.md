# Gazetteer NGBE

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


