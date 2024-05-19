# ProyectoFinalBackend

## Tercer entrega actualizada (incluye mocking, factory y winston)

> [!TIP]
> Esta entrega está en la rama MAIN

**Comandos para persistencia:**

- FS: node --watch src/app.js --persist fs
- MONGO: node --watch src/app.js --persist mongodb

En el caso de mongo se puede escribir "npm run dev" y automáticamente usa el servicio de mongo

## Comentarios sobre la tercer entrega y desafíos posteriores

En este caso preferí dejar de lado el front-end y todo el proceso de registro, compra, armado de carrito, etc, se deberá realizar desde postman, para lo cual generé un archivo con la colección de requests.

### WINSTON

#### RUTA DE PRUEBA

El endpoint /loggertest muestra sólo el log que se genera en app.js a través del middleware addLogger. Haciendo correr las otras requests se van generando diferentes logs con mensajes, warnings y errores.

#### LOGGERS PARTICULARES

Para cada endpoint, el middleware genera un log con la ruta correspondiente. Los demás logs son generados por otros loggers que se llaman desde los distintos procesos (hasta el momento tengo creados los loggers que se llaman desde el controlador de usuarios, desde productos y desde custom router) Todos los loggers se crean en el archivo **logger.config.js**

#### ARCHIVO GENERADO

Según el modo en que estemos, se genera un archivo global.log (modo producción) o globalDEV.log (modo desarrollo)

### Requests en Postman

Las requests están organizadas en carpetas: Usuarios, Carritos y Productos. Hay además dos requests fuera de las carpetas, una para probar el envío de emails desde un endpoint, y otra para ver los productos generados con faker-js

### Proceso de compra

Pasos a seguir para armar un carrito y hacer la compra (cada paso corresponde a una request)

> [!IMPORTANT]
> Este proceso completo sólo funciona con la persistencia de Mongo

1. Registrar un nuevo usuario con rol "user"
1. Loguear el usuario
1. Crear carrito vacío
1. Ver carrito de usuario logueado y copiar el id que aparece como respuesta de la query
1. Agregar productos al carrito teniendo en cuenta que hay que pegar el id del carrito en la ruta del endpoint correspondiente (Si se agregan productos con poco stock se puede evaluar el funcionamiento del carrito remanente)
1. Comprar el carrito (pegar el id del carrito en la ruta)
1. Se puede ver el carrito remanente (si se compraron productos con poco stock) volviendo a ejecutar la request para ver el carrito del usuario logueado

### Sobre Factory

Uso factory sólo para cambiar el método de persistencia de carritos y productos. NO lo uso para cambiar entre desarrollo y producción.
Por otro lado, tampoco armé un servicio de usuarios con fileSystem, por lo que para agregar productos necesito la conexión con Mongo, así que en "fs" también inicializo Mongo (archivo **factory.js** línea 38)

- En FileSystem se pueden agregar productos, borrar y modificar. Se pueden crear carritos a los que se les puede agregar productos.
- El carrito se puede generar y se le pueden agregar productos sólo desde el rol de usuario.
- Se pueden ver los carritos existentes sólo desde el rol de admin

### Navegación en el front-end

> [!CAUTION]
> El desarrollo del front end quedó en stand by. Algunas funcionalidades tienen fallas. Por ahora las pruebas deben hacerse todas desde postman

Hay 4 vistas principales:

- **Catálogo** que sería para el público en general
- **Lista de productos** para el administrador
- **Lista de carritos** para el administrador
- **Custommer support** con el chat de usuarios

Y otras dos vistas secundarias:

- **Carrito del usuario**
- **Detalle del producto**

### CARRITO

Carga de productos al carrito: se puede hacer desde el catálogo. Si no hay ningún carrito generado, cuando el usuario hace click en el botón "comprar" de un producto, primero se arma un carrito vacío y luego se agrega el producto.
Una vez que se genera un carrito, el ID se guarda en el local storage y a partir de ahí todos los productos que se compran se agregan al carrito guardado en storage. Para acceder al carrito, se puede usar el link en la parte superior derecha de la página.
Cuando se borra el carrito, se elimina del storage.

### PRODUCTOS

Se pueden agregar productos desde el formulario al final del listado de productos del administrador. Para modificarlos, se hace click en el nombre del producto y se abre una ventana modal.
La carga de un producto se hace enviando el formulario html con el método post del mismo formulario. (lo hice así porque no pude enviar el formulario con datos y archivos -multipart form- usando fetch) Para volver a la vista de front end desde el endpoint hice una redirección. No creo que sea la forma más elegante de resolverlo, pero es lo único que pude hacer funcionar.
La modificación de los productos se hace con fetch. Se pueden modificar los datos por un lado, o subir las imágenes. Se hacen por separado.

### PAGINACION, ORDENAMIENTO, ETC

Por ahora sólo programé la paginación, con una cantidad de productos por página fija y se ordena por cantidad de stock.
Tengo que pensar un poco más cómo hacer que la cantidad de productos pueda ser elegida por el usuario, porque con la paginación, al ir a la segunda página el límite que se cargaba como req.query la primera vez, ya no queda en la url. (tengo que ver si lo puedo agregar desde handlebars con un if, pero todavía no lo pude pensar bien)

## CARPETAS

> [!WARNING]
> El árbol está desactualizado. Es tarea pendiente.

```
📂 ROOT
|__ 📂 PUBLIC
|        |__ 📂 IMG
|        |__ index.html (está vacío)
|__ 📂 SRC
|        |__ 📂 FILES
|        |       |__ carritos.json
|        |       |__ productos.json
|        |__ 📂 ROUTES
|        |       |__ cart.routes.js
|        |       |__ products.routes.js
|        |__ 📂 SCRIPTS
|        |       |__ CartManager.js
|        |       |__ ProductManager.js
|        |__ app.js
|__ utils.js
|__ packages, README, .gitignore, etc
```
