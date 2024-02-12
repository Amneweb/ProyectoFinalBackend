# ProyectoFinalBackend

## Consideraciones para la primer entrega

1. **POST - nuevo producto:** usé multer cargando los valores en los campos de formulario de form-data de Postman. Las imágenes se cargan de a una, y si el campo está vacío se genera un array vacío.
2. **POST - agregado de imágenes:** por ahora el producto se genera con una sola imagen, pero le puedo agregar más con el endpoint /imagenes/:id, que es un POST que recibe por form-data la imagen y por params el id del producto.
3. **PUT - modificando un producto:** al igual que en el último desafío, el producto se modifica con los datos enviados desde el body (objeto con propiedad a modificar y valor que reemplaza al anterior). Eso es para todas las propiedades menos las imágenes, que se agregan como se explica en el punto 2. Por ahora sólo se pueden agregar imágenes nuevas, no se borran las que ya están.
4. **POST - propiedades de nuevo producto:** los campos de form-data de Postman sólo pueden ser texto o file. Por lo que las propiedades que no son texto, antes de pasarlas al objeto producto primero las pasé por JSON.parse (por ejemplo, si agrego stock directamente desde req.body, queda como stock: "10" en lugar de stock:10).
