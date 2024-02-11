# ProyectoFinalBackend

## Consideraciones para la primer entrega

1. **POST - nuevo producto:** usé multer cargando los valores en los campos de formulario de form-data de Postman. Las imágenes se cargan de a una, y si el campo está vacío se genera un array vacío.
2. **POST - agregado de imágenes:** por ahora el producto se genera con una sola imagen, pero le puedo agregar más con el endpoint /imagenes/:id, que es un POST que recibe por form-data la imagen y como param el id del producto.
3. **PUT - modificando un producto:** al igual que en la entrega anterior, el producto se modifica con los datos enviados desde el body (objeto con propiedad a modificar y valor que reemplaza al anterior). Por ahora sólo se pueden agregar imágenes nuevas, no se borran las que ya están.
