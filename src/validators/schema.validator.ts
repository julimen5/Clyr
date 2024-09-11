// Middleware genérico de validación
import {NextFunction, Response, Request} from "express";
import {ZodSchema} from "zod";

export const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationResult = schema.safeParse(req.body);

        if (!validationResult.success) {
            // Si falla la validación, devolver errores
            return res.status(400).json({
                message: "Datos no válidos",
                errors: validationResult.error.errors,
            });
        }

        // Si pasa la validación, pasar al siguiente middleware/controlador
        next();
    };
};
