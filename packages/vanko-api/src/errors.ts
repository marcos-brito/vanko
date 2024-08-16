import createError from "http-errors";

export enum Scope {
    ValidationError = "validation_error",
    NotFoundError = "not_found_error",
    InternalError = "internal_error",
    ConflictError = "conflict_error"
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

export function conflictError(message: string) {
    return createError(409, message, {
        scope: Scope.ConflictError
    });
}

export function InternalError() {
    return createError(500, "Internal server error", {
        scope: Scope.InternalError
    });
}
