# ProyectoFinalBackend

## Desafío testing

### CONSIGNA

> Realizar módulos de testing para tu proyecto principal, utilizando los módulos de mocha + chai + supertest

Se realizarán tests unitarios (TDD) y tests de integración (BDD) de toda la app en cada una de las rutas principales.

> [!TIP]
> COMANDOS PARA REALIZAR EL TEST

Para realizar los tests se tendrán abiertas dos terminales, una para el servidor y otra para el test.

**SERVIDOR**

Para indicar que se trabajará con la base de datos "test", en la línea de comandos se agregará la opción --test, de manera que en la cli se escribirá:

```
node --watch src/app.js --test test
```

**TEST**

En la terminal del test el comando es

```
npm test
```

> [!NOTE]
> QUE ESTAREMOS EVALUANDO

Terminado toda la configuración de testing, se deberán poder realizar:

- Tests unitarios (TDD) sobre los módulos de productos, carritos y usuarios
- Tests de integración (BDD) sobre las rutas de usuarios, productos y carritos

Hasta el momento están configurados los siguientes tests

## TDD

### Test del DAO de productos

✔ El dao debe devolver los productos en un Array

✔ El dao debe agregar un producto correctamente a la base de datos

✔ Cuando no lo envía el usuario, el dao creará por defecto la propiedad thumb con un array vacío

✔ El dao debe obtener un producto por su SKU (code)

## BDD

### Tests de toda la App

**Tests de usuarios**

✔ el endpoing POST api/users/register debe crear un usuario correctamente

✔ el endpoing POST api/users/register no debe permitir la creación de un usuario sin email

✔ el endpoing POST api/users/register no debe permitir la creación de un usuario con email existente

✔ el usuario creado en el endpoing POST api/users/register debe tener la propiedad userCartID como array vacío

✔ Test Login Usuario: Debe poder hacer login correctamente con el usuario registrado previamente.

✔ El endpoint DELETE /api/users/:id debe borrar correctamente al usuario con el id indicado

**Tests de productos**

✔ el endpoing POST api/products/ con un usuario 'user' debe crear un producto correctamente y sin el campo owner (141ms)

✔ el endpoing DELETE api/products/:id borra el producto correctamente (59ms)

✔ El endpoint POST /api/products/ debe devolver status 400 y el error al intentar crear un producto sin el nombre

**Test de subida de imágenes**

✔ se debe poder crear un producto con la imagen subida y la ruta guardada en la propiedad thumb

✔ El endpoint PUT /api/products/:id/imagenes debe cargar una imagen y la ruta se agregará al array de la propiedad thumb

---

## Desafío de documentación

Se documentó parte de la API con Swagger.
La ruta para ver la documentación es **http://localhost:8080/api/docs/**

---

## Desafío recuperación de contraseña

Se ha implementado un método de recuperación de contraseña en 3 pasos

- El cliente visita la página de recuperación de contraseña, carga su dirección de correo y el sistema le envía un correo con un link
- El cliente hace click en el link y es dirigido a una página en donde ingresa un nuevo password
- Si el password es distinto al anterior, se guarda en el sistema, si no, es rechazado

**Controles en cada uno de los pasos**

- Cuando el cliente carga su dirección de correo, primero se verifica que corresponda a un cliente registrado
- En el momento en que se envía el formulario que da la orden del envío del correo, se genera una cookie con una vida de 1 hora (en el ejemplo la hice de 10 minutos)
- En la cookie se guarda un jwt token que tiene el email del usuario
- Ese token se agrega como parámetro en la ruta del enlace que recibe el usuario por correo
- Cuando el usuario hace click en el enlace, en el endpoint se verifica que la cookie todavía exista y que el token guardado en la cookie sea el mismo que el que llega por parámetro.
- Si son iguales, el correo guardado en el token es el que se renderiza en el último paso, cuando se le pide al usuario que ingrese un nuevo password
- Antes de guardar el password en la BDD, se verifica que no sea igual al anterior

---

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

---

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

---

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
