

## Revisión 20230906

Issue: https://github.com/e2molin/gazetteerngbe/issues/10

Se ha detectado que en la información de detalle de la entidad, las entidades asociadas a un único código INE perteneciente a una provincia con un INE con ceros a la izquierda, pierden el cero a la izquierda al mostrarse en pantalla.

Esto es porque cuando hacemos peticiones a la API para el detalle de una entidad

http://10.13.90.93/apibadasidv4/public/nomenclator/json/entityngbe/id/1999706

cuando formateamos el objeto en JSON usando la función `json_encode` de **PHP**, usamos el flag `JSON_NUMERIC_CHECK` para que las cadenas que parezcan un número se codifiquen como numéricas. Esto nos supone un problema con los códigos INE, porque tienen ceros a la izquierda (leading zeros).

Para conservarlos lo que hacemos es en la petición SQL concatenamos al principio la letra `C`, para que al generarse el JSON se mantenga losd ceros a la izquierda (se codifica como cadena). 	Tenemos que recordar que luego al tratar el dato recibido hay que eliminar la `C` del inicio.

Para ello al recibir el dato en Javascript hacemos esta comprobación:

```javascript
let codesINE = itemSelected.properties.codigo_ine.slice(0,1) === "C" ?
              itemSelected.properties.codigo_ine.slice(1):
              itemSelected.properties.codigo_ine;
```
