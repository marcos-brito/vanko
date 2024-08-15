import createError from "http-errors";

export enum Scope {
    ValidationError = "validation_error",
    NotFoundError = "not_found_error",
}

export function validationError(message: string) {
    return createError(400, message, {
        scope: Scope.ValidationError
    });
}

export function notFoundError(message: string) {
    return createError(404, message, {
        scope: Scope.NotFoundError
    });
}
