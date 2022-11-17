# 💻 Apuntes de desarrollo

## 🎨 Apuntes de CSS

![](img/css-cheatsheet.jpg)


## Introduciendo Vite

npm create vite@latest vanillajs-app --template vanilla

```bash
  cd vanillajs-app
  npm install
  npm run dev
  
  code .
```

Con esto ya gtemso un boilerplate de una app con vanilla-js

Por organización del código, me gusta que cuelgue de dentro de la carpeta scr. Para ello muev o todo dentro y para decirle a Vite que trabaje dentro de esa carpeta hacemos unç


export default {
  root:'src',
  build: {
    outDir: '../dist'
  }
}




## ⚙️ Utilizando **localStorage** y prefetch

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

En nuestro caso, la librería **typeahead** almacena en el localStorage los arrays con los valores para mostrar en el autonumérico. Para el caso del municipio, el HTML y el Javascript son:

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

### ☂️ Motivos del cambio de la librería TypeAhead por AutoComplete

Para el componente Autocomplete, he descartado la librería [**Typeahead**](https://github.com/twitter/typeahead.js) porque necesita de **jQuery** para su funcionamiento, y quería hacer un desarrollo libre de esta dependencia. En su sustitución, he utilizado la librería [**autoComplete**](https://github.com/TarekRaafat/autoComplete.js) que utiliza exclusivamente **Vanilla JS**.

Dentro de la carpeta `vendor\autoComplete@10.2.7` está la versión descargada de la librería con sus posibles hojas de estilo y un fichero `pruebas.html` que utilizo como pruebas.


## ⚙️ Uso de fetch en peticiones API

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

