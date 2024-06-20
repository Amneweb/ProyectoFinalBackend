import * as z from "zod";

const userValidatorSchema = z.object({
  userName: z.string({
    required_error: "El nombre es requerido",
  }),
  userLastName: z.string({
    required_error: "El apellido es requerido",
  }),
  userAge: z
    .number({
      invalid_type_error: "La edad debe ser un valor numérico",
    })
    .int({ message: "La edad debe ser un número entero" })
    .lt(100, {
      message: "La edad debe ser un número entero menor que 100",
    }),
  userEmail: z
    .string()
    .min(1, { required_error: "El email es requerido" })
    .email({ message: "El email ingresado es inválido" }),
  userPassword: z
    .string({
      required_error: "El password es requerido",
    })
    .min(5, { message: "El password debe contener al menos 5 caracteres" }),
});

export const validateUser = (object) => {
  try {
    const resultadoValidacion = userValidatorSchema.parse(object);

    return resultadoValidacion;
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.issues);
      const errores = err.issues
        .map((cadaerror) => `'${cadaerror.message}'`)
        .join(" ");
      throw new Error(`Datos inválidos:${errores}`);
      //return err.issues;
    }
  }
};
