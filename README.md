# ProyectoFinalBackend

## Tercer entrega

> [!WARNING]
> Esta entrega está en la rama main

Para esta entrega ya se tiene armado un circuito completo de ecommerce, a excepción del método de pago.
El recorrido del usuario supone los siguientes pasos:

1. El visitante no logueado puede recorrer el catálogo, elegir productos y armar un carrito que se guarda en el local storage
2. Una vez armado el carrito, para iniciar la compra deberá loguearse (o registrarse primero y luego loguearse)
3. Una vez logueado el usuario e iniciada la compra se genera una orden de compra con un ID
4. Se envía un correo al usuario con el ID de la orden de compra y los componentes del carrito

### Consideraciones

Suponemos que cada usuario sólo puede tener un carrito guardado en el sistema de persistencia. Si al momento de guardar un carrito, tenía uno guardado en la base de datos, éste se elimina automáticamente del documento del usuario y es reemplazado por el nuevo. Al mismo tiepo se elimina el carrito de la colección de carritos.

---

## Desafío Clase 21 - login con estrategia local y/o de terceros (GitHub)

Para este desafío se implementaron las estrategias local y Github. Quien tiene cuenta de Github puede elegir logearse a través de ese servicio. En ambos casos la vista de login es la misma, pero el botón de github lleva directamente a la ruta de la api sessions que llama a la estrategia de GitHub (no usé una vista intermedia. En clase el profesor usó una vista intermedia, pero me pareció que no era necesario)

> [!WARNING]
> Siguiendo el procedimiento indicado en clase, no podía obtener el email desde el perfil de Github. Para obtener el email, en Account Permissions agregué el permiso para leer el email (Read-only), además del permiso para obtener el perfil.

---

## Desafío Clase 19 - sesiones y login básico

> [!TIP]
> Esta rama ("errores") tiene mejoras respecto a la rama segundaentrega.

Para este desafío la página de inicio es http://localhost:8080/catalogo
Al intentar acceder a dicha página sin haberse autenticado, el sistema lleva a la página de login / registro. Una vez logueado, un usuario común (con rol de usuario) puede acceder a todas las vistas menos las de "Admin carritos" y "Admin productos". Un usuario con rol de administrador puede acceder a todas las vistas.
Para impedir el acceso sin estar logueado, usé un middleware que verifica si existe el req.session.user.
Para impedir el acceso al recurso de administración de carritos, usé un midleware similar, pero que verifica qué rol tiene el usuario.
Las vistas desde la ruta /sessions ahora se renderizan con la vista sessions.handlebars (la realidad es que no sé en qué casos el usuario llegaría a ver esas vistas)

### Variables de entorno

Pasé la definición de las constantes basadas en variables de entorno al archivo config/config.js. Las variables son importadas a app.js. El archivo .env aun no esta agregado a gitignore, para que se pueda probar el código clonado desde este repo.

### Manejo de errores

Ya mejoré la captura de errores en las rutas products/:id y carts/:id, de manera que si el id no es el correcto se renderiza una vista con el mensaje de error. Falta hacer lo mismo con las rutas para borrar carritos, agregar productos, etc.

### Mejoras a la carga y edición de los productos

Las categorías de productos ahora se guardan de a una, y sólo se pueden asignar categorías existentes (antes había que escribir a mano el nombre de la categoría y si no existía, el programa la tomaba igual). Además, cada categoría agregada se suma al array de categorías, sin borrar las que ya estaban asignadas. Por otro lado, mediante el formulario de modificación de productos también se pueden borrar categorías.

### Ordenamiento de productos en el catálogo

Ya se pueden elegir los criterios de ordenamiento y el límite máximo de productos por página.

---

## Segunda entrega

Para esta entrega ya se puede probar todo desde las vistas de front end. También se pueden hacer las peticiones a través del archivo .rest, pero la ventaja del front end es que se pueden agregar imágenes y borrar carritos sin tener que escribir el id cada vez.

### Navegación

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

> [!NOTE]
> El chat está igual que para la entrega anterior

> [!WARNING]
> Las rutas a las vistas y los archivos que las renderizan tienen nombres un poco confusos y mezclados. Me falta corregirlos.

> [!NOTE]
> 19/3 -> Para las próximas entregas: la idea es poder tener varias fotos por producto, y cada producto podrá pertenecer a diferentes categorías. Para eso tengo que corregir la manera de cargar los thumbs y categories en la base de datos. Actualmente, cuando subo una nueva imagen se borra la anterior. Lo mismo con las categorías. Teniendo varias categorías podré hacer reportes filtrando por las mismas.

---

## Entrega intermedia

> [!WARNING]
> Esta entrega está en la rama 'vmc' del repositorio

> [!WARNING]
> La carpeta que en la consigna se llama DAO, acá se llama services

1. La carga de un producto nuevo se puede hacer desde el archivo con las peticiones "ecommerce.rest", en la raiz del directorio, o desde la ruta /home (en este caso se puede cargar un archivo de imagen)
1. FALTA CORREGIR >> Una vez que se envía el formulario de carga de productos, el sistema lleva a la ruta del método post de la api. Para volver a la vista de productos hay que ir para atrás con el botón del navegador o escribir la ruta.
1. Cuando creamos un producto desde el formulario http, los valores en cada input se devuelven como strings, por lo que si el req.body lo envío directo al verificador, me da error. Entonces generé un middleware que hace parseInt y parseFloat a los elemmentos que tienen que ser números. El middleware está en utils, en la raiz del directorio.
1. Las validaciones se hacen con zod y el schema se encuentra en el archivo services/product.validator.js
1. En el caso de los carritos, primero se crean vacíos y luego se agregan productos, de a uno por vez.
1. Si el producto no existe en el carrito, se **AGREGA** uno. Si el producto ya existe, se **SUMA** uno.
1. El chat está en la ruta /chat. Es igual al de la clase pero con mongoDB. La consigna pide que el usuario sea de tipo email. En este caso no lo hice así porque para probar es mucho más simple hacerlo con un simple texto.

---

## Consideraciones para la primer entrega

### CARRITOS

1. **POST - agregando productos al carrito:** Antes de permitir el agregado de un producto a un carrito, en CartManager agregué una pequeña verificación para comprobar que el producto a agregar exista en el array de productos. (importando ProductManager y aplicando el método getProductByID)
2. **RUTAS:** Hay varias rutas que no se piden en la consigna, pero las creé para mi propio control. (porque cuando probaba con postman no sabía cuántos carritos ya había creado, o qué productos tenían; y era más fácil agregar un request en postman que tener que abrir el json generado cada vez que cambiaba algo)
3. **POST - propiedad quantity:** Según la consigna, los productos se agregan a un determinado carrito de uno en uno, por lo tanto en el endpoint de agregado de producto, la información enviada al CartManager no incluye el campo quantity. (Si el producto no existe en el carrito, sólo se agrega una unidad. Si el producto ya existe en el carrito, se suma una unidad)

### PRODUCTOS

1. **POST - nuevo producto:** usé multer cargando los valores en los campos de formulario de form-data de Postman. Las imágenes se cargan de a una, y si el campo está vacío se genera un array vacío.
2. **POST - agregado de imágenes:** por ahora el producto se genera con una sola imagen, pero le puedo agregar más con el endpoint /imagenes/:id, que es un POST que recibe por form-data la imagen y por params el id del producto.
3. **PUT - modificando un producto:** al igual que en el último desafío, el producto se modifica con los datos enviados desde el body (objeto con propiedad a modificar y valor que reemplaza al anterior). Eso es para todas las propiedades menos las imágenes, que se agregan como se explica en el punto 2. Por ahora sólo se pueden agregar imágenes nuevas, no se borran las que ya están.
4. **POST - propiedades de nuevo producto:** los campos de form-data de Postman sólo pueden ser texto o file. Por lo que las propiedades que no son texto, antes de pasarlas al objeto producto primero las pasé por JSON.parse (por ejemplo, si agrego stock directamente desde req.body, queda como stock: "10" en lugar de stock:10).

**PROBLEMA CON RUTA DE IMAGENES** 🤔
Configuré multer, y funciona bien, pero cuando quiero ver la imagen haciendo click en el detalle del producto (desde el endpoint de get products), la ruta la pone detrás de localhost. En cambio si copio y pego la ruta en el browser, SI llego hasta la imagen, porque la ruta queda detrás de file://.
Por otro lado, mi computadora tiene directorios con espacios en blanco así que tuve que reemplazar los espacios con %20. ( file.path.replaceAll(' ','%20') )

## CARPETAS

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
