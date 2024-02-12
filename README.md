# ProyectoFinalBackend

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
📂 PUBLIC
    |__ 📂 IMG
    |__ index.html (está vacío)
📂 SRC
    |__ 📂 FILES
    |       |__ carritos.json
    |       |__ productos.json
    |__ 📂 ROUTES
    |       |__ cart.routes.js
    |       |__ products.routes.js
    |__ 📂 SCRIPTS
    |       |__ CartManager.js
    |       |__ ProductManager.js
    |__ app.js
    |__ utils.js
    |__ packages, README, etc
```
