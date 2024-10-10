import { message, type SuperValidated } from "sveltekit-superforms";

export const invalidFormMessage =
    "Haviam alguns dados inválidos no formulário. Corrija e tente novamente";

export const genericError =
    "Tivemos alguns problemas acessando seus dados. Tente novamente mais tarde";

export function actionError(form: SuperValidated<any>, msg: string) {
    return message(form, {
        type: "error",
        text: msg
    });
}

export function actionSuccess(form: SuperValidated<any>, msg: string) {
    return message(form, {
        type: "success",
        text: msg
    });
}
