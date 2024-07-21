# ProyectoFinalBackend

El curso de BackEnd de Coderhouse está estructurado en tres módulos, cada uno con diferentes objetivos, pero todos unidos por un hilo conductor que es el proyecto de una api completa para un ecommerce. Para poder avanzar en el curso es necesario ir realizando entregas con las mejoras aprendidas a medida que se desarrollan las clases.

## DESAFIOS QUE FUERON COMPLETANDOSE HASTA LLEGAR AL PF

Este readme contiene toda la información de las entregas principales y los desafíos intermedios, con las consignas de cada uno y en algunos casos, con aclaraciones sobre la solución propuesta por mí. Los desafíos están ordenados cronológicamente de más recientes a más antiguos.

> Los párrafos con borde gris a la izquierda representan las consignas de cada desafío

### DESAFIO 14: **DOCUMENTACION DEL USUARIO, PERMISOS Y DATOS DE CONEXIÓN**

> configurar el servidor para que los usuarios puedan cargar documentación y según el tipo y objetivo de los archivos, éstos se carguen en diferentes carpetas. Para eso, modificar el modelo de User para que cuente con una nueva propiedad “documents” el cual será un array que contenga los objetos con propiedades nombre y link. Además, agregar una propiedad al usuario llamada “last_connection”, la cual deberá modificarse cada vez que el usuario realice un proceso de login y logout

**DOCUMENTACION**

Para la parte del redireccionamiento de los archivos agregué un middleware en las rutas de creación y modificación de productos, y en la nueva ruta de carga de documentación. Dicho middleware arma la ruta de destino del archivo en base a las propiedades baseUrl y path que vienen con el req.

Aunque no se pide, para la documentación hice una colección "Documentation", que contiene objetos con las propiedades código, obligatoriedad y nombre del archivo requerido. De esa manera, si en el futuro se requiere incluir otro documento como obligatorio, se puede subir su nombre y código a esa colección. Para verificar que un usuario puede tener permisos de premium, se comparan los códigos de los documentos que subió el usuario con los códigos de la documentación requerida, guardados en la colección "documentation".

El usuario carga los documentos desde la ruta /api/users/:uid/documents

**CAMBIO DE ROL**

El usuario puede pedir el cambio de rol en cualquier momento, pero esto sólo ocurre cuando tiene cargados los 3 archivos solicitados

La ruta para el cambio de rol es /api/users/premium/:uid/

**DATOS DE CONEXIÓN**

El timestamp se genera al momento de hacer login o logout y se guarda en la propiedad userConnection. En el caso del login, se le asigna el valor de Date.now() + 600000 que es el valor de maxAge que dura la cookie de login. Si el usuario nunca se desloguea, ese valor será el equivalente al deslogueo. Si se desloguea antes, el valor es reemplazado por el de desloguear.

**VER USUARIOS INACTIVOS**

El administrador puede ver todos los usuarios que no se han conectado en un determinado lapso de tiempo en la ruta:

http://localhost:8080/api/users/sinactividad/?meses=3

En un ecommerce real, si el valor ingresado en el parámetro meses es 3, el lapso será un tiempo real de 90 días, sin embargo, a los efectos de probar su funcionamiento, el código está realizado de manera que cada "mes" equivale a poco más de 8 minutos. (El detalle del cálculo está en la descripción de la ruta de postman)

---

### DESAFIO 13: **TESTING**

> Realizar módulos de testing para tu proyecto principal, utilizando los módulos de mocha + chai + supertest

**Trabajo realizado**

> [!TIP]
> COMANDOS PARA REALIZAR EL TEST

Para realizar los tests se tendrán abiertas dos terminales, una para el servidor y otra para el test. Los comandos para inicializar el test en cada una de ellas son:

**SERVIDOR**

```
node --watch src/app.js --test test
```

**TEST**

```
npm test
```

**TESTS QUE SE REALIZAN**

Se realizarán tests unitarios (TDD) y tests de integración (BDD) de toda la app en cada una de las rutas principales.

---

### DESAFIO 12: **DOCUMENTAR LA API**

> Realizar la configuración necesaria para tener documentado tu proyecto final a partir de Swagger.

Se documentó parte de la API con Swagger.
La ruta para ver la documentación es **http://localhost:8080/api/docs/**

---

### DESAFIO 11: **RECUPERO DE CONTRASEÑA Y ROL PREMIUM**

> Realizar un sistema de recuperación de contraseña, la cual envíe por medio de un correo un botón que redireccione a una página para restablecer la contraseña (no recuperarla). Establecer un nuevo rol para el schema del usuario llamado “premium” el cual estará habilitado también para crear productos Modificar el schema de producto para contar con un campo “owner”, el cual haga referencia a la persona que creó el producto

Para este desafío implementé un método de recuperación de contraseña en 3 pasos

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

### DESAFIO 10: **IMPLEMENTACION DE LOGGER**

> Basado en nuestro proyecto principal, implementar un logger. Primero, definir un sistema de niveles que tenga la siguiente prioridad (de menor a mayor): **debug, http, info, warning, error, fatal** Después implementar un logger para desarrollo y un logger para producción.

**_WINSTON_**

**RUTA DE PRUEBA**

El endpoint /loggertest muestra sólo el log que se genera en app.js a través del middleware addLogger. Haciendo correr las otras requests se van generando diferentes logs con mensajes, warnings y errores.

**LOGGERS PARTICULARES**

Para cada endpoint, el middleware genera un log con la ruta correspondiente. Los demás logs son generados por otros loggers que se llaman desde los distintos procesos (hasta el momento tengo creados los loggers que se llaman desde el controlador de usuarios, desde productos y desde custom router) Todos los loggers se crean en el archivo **logger.config.js**

**ARCHIVO GENERADO**

Según el modo en que estemos, se genera un archivo global.log (modo producción) o globalDEV.log (modo desarrollo)

---

### DESAFIO 9: **MOCKING Y MANEJO DE ERRORES**

> Se aplicará un módulo de mocking y un manejador de errores a tu servidor actual

---

### TERCERA PRE-ENTREGA: MEJORA DE LA ARQUITECTURA DEL SERVIDOR

> Profesionalizar el servidor. Aplicar una arquitectura profesional para nuestro servidor. Aplicar prácticas como patrones de diseño, mailing, variables de entorno. etc. Modificar la capa de persistencia para aplicar los conceptos de Factory (opcional), DAO y DTO.

**COMENTARIOS SOBRE LA TERCER ENTREGA Y DESAFIOS POSTERIORES**

En este caso preferí dejar de lado el front-end y todo el proceso de registro, compra, armado de carrito, etc, se deberá realizar desde postman, para lo cual generé un archivo con la colección de requests.

**_Tercer entrega actualizada (incluye mocking, factory y winston)_**

**Comandos para persistencia:**

- FS: node --watch src/app.js --persist fs
- MONGO: node --watch src/app.js --persist mongodb

En el caso de mongo se puede escribir "npm run dev" y automáticamente usa el servicio de mongo

**Requests en Postman**

Las requests están organizadas en carpetas: Usuarios, Carritos y Productos. Hay además dos requests fuera de las carpetas, una para probar el envío de emails desde un endpoint, y otra para ver los productos generados con faker-js

**Proceso de compra**

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

**Sobre Factory**

Uso factory sólo para cambiar el método de persistencia de carritos y productos. NO lo uso para cambiar entre desarrollo y producción.
Por otro lado, tampoco armé un servicio de usuarios con fileSystem, por lo que para agregar productos necesito la conexión con Mongo, así que en "fs" también inicializo Mongo (archivo **factory.js** línea 38)

- En FileSystem se pueden agregar productos, borrar y modificar. Se pueden crear carritos a los que se les puede agregar productos.
- El carrito se puede generar y se le pueden agregar productos sólo desde el rol de usuario.
- Se pueden ver los carritos existentes sólo desde el rol de admin

**Navegación en el front-end**

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

**CARRITO**

Carga de productos al carrito: se puede hacer desde el catálogo. Si no hay ningún carrito generado, cuando el usuario hace click en el botón "comprar" de un producto, primero se arma un carrito vacío y luego se agrega el producto.
Una vez que se genera un carrito, el ID se guarda en el local storage y a partir de ahí todos los productos que se compran se agregan al carrito guardado en storage. Para acceder al carrito, se puede usar el link en la parte superior derecha de la página.
Cuando se borra el carrito, se elimina del storage.

**PRODUCTOS**

Se pueden agregar productos desde el formulario al final del listado de productos del administrador. Para modificarlos, se hace click en el nombre del producto y se abre una ventana modal.
La carga de un producto se hace enviando el formulario html con el método post del mismo formulario. (lo hice así porque no pude enviar el formulario con datos y archivos -multipart form- usando fetch) Para volver a la vista de front end desde el endpoint hice una redirección. No creo que sea la forma más elegante de resolverlo, pero es lo único que pude hacer funcionar.
La modificación de los productos se hace con fetch. Se pueden modificar los datos por un lado, o subir las imágenes. Se hacen por separado.

**PAGINACION, ORDENAMIENTO, ETC**

Por ahora sólo programé la paginación, con una cantidad de productos por página fija y se ordena por cantidad de stock.
Tengo que pensar un poco más cómo hacer que la cantidad de productos pueda ser elegida por el usuario, porque con la paginación, al ir a la segunda página el límite que se cargaba como req.query la primera vez, ya no queda en la url. (tengo que ver si lo puedo agregar desde handlebars con un if, pero todavía no lo pude pensar bien)

**CARPETAS**

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

---

### DESAFIO 8: **REESTRUCTURA DEL SERVIDOR**

> El proyecto debe contar con capas de routing, controlador, dao, con nuestras vistas bien separadas y con las responsabilidades correctamente delegadas.

---

### DESAFIO 7: **REFACTOR DEL LOGIN CON BYCRYPT Y JWT**

> Se deberá contar con un hasheo de contraseña utilizando bcrypt Se deberá contar con una implementación de passport, tanto para register como para login. Implementar el método de autenticación de Github a la vista de login.

---

### DESAFIO 6: **IMPLEMENTACION DE LOGIN**

> Ajustar nuestro servidor principal para trabajar con un sistema de login. Deberá contar con todas las vistas de register, login y profile, así también como las rutas de router para procesar el registro y el login. Una vez logueado, el usuario es dirigido a la vista de productos.

---

### SEGUNDA PRE-ENTREGA: PROFESIONALIZANDO LA BDD

> Contarás con Mongo como sistema de persistencia principal. Tendrás definidos todos los endpoints para poder trabajar con productos y carritos. OBJETIVOS: Profesionalizar las consultas de productos con filtros, paginación y ordenamientos Profesionalizar la gestión de carrito para implementar los últimos conceptos vistos.

---

### DESAFIO 5: **MONGO Y MONGOOSE**

> Agregar el modelo de persistencia de Mongo y mongoose a tu proyecto. Crear una base de datos llamada “ecommerce” dentro de tu Atlas, crear sus colecciones “carts”, “messages”, “products” y sus respectivos schemas.

---

### DESAFIO 4: **WEBSOCKETS Y HANDLEBARS**

> Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo. Crear una vista “index.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento.

---

### PRIMERA PRE-ENTREGA: ROUTER Y MULTER

> Desarrollar el servidor basado en Node.JS y express, que escuche en el puerto 8080 y disponga de dos grupos de rutas: /products y /carts. Dichos endpoints estarán implementados con el router de express

---

### DESAFIO 3: **SERVIDOR CON EXPRESS**

> Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos. Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.

---

### DESAFIO 2: **MANEJO DE ARCHIVOS**

> Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).

---

### DESAFIO 1: **CLASES CON ECMA SCRIPT**

> Realizar una clase “ProductManager” que gestione un conjunto de productos. Cada producto que gestione debe contar con las propiedades title, stock, description, thumb, etc
