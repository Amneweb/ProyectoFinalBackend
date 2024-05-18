# ProyectoFinalBackend

## Tercer entrega actualizada (incluye mocking)

> [!WARNING]
> Esta entrega está en la rama MAIN

En este caso preferí dejar de lado el front-end y todo el proceso de registro, compra, armado de carrito, etc, se deberá realizar desde postman, para lo cual generé un archivo con la colección de requests.

### Requests en Postman

Las requests están organizadas en carpetas: Usuarios, Carritos y Productos. Hay además dos requests fuera de las carpetas, una para probar el envío de emails desde un endpoint, y otra para ver los productos generados con faker-js

### Proceso de compra

Pasos a seguir para armar un carrito y hacer la compra (cada paso corresponde a una request)

1. Registrar un nuevo usuario con rol "user"
1. Loguear el usuario
1. Crear carrito vacío
1. Ver carrito de usuario logueado y copiar el id que aparece como respuesta de la query
1. Agregar productos al carrito teniendo en cuenta que hay que pegar el id del carrito en la ruta del endpoint correspondiente (Si se agregan productos con poco stock se puede evaluar el funcionamiento del carrito remanente)
1. Comprar el carrito (pegar el id del carrito en la ruta)
1. Se puede ver el carrito remanente (si se compraron productos con poco stock) volviendo a ejecutar la request para ver el carrito del usuario logueado

### Navegación en el front-end

> [!WARNING]
> El proceso de compra aun no funciona correctamente

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
