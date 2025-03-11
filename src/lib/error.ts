import { toast } from "svelte-sonner";
import { message, type SuperValidated } from "sveltekit-superforms";

export const errInvalid =
    "Haviam alguns dados inválidos no formulário. Corrija e tente novamente";

export const errGeneric =
    "Tivemos alguns problemas acessando seus dados. Tente novamente mais tarde";

export function err(form: SuperValidated<any>, msg: string) {
    return message(form, {
        type: "error",
        text: msg
    });
}

export function success(form: SuperValidated<any>, msg: string) {
    return message(form, {
        type: "success",
        text: msg
    });
}

export function maybeShowMessage(form: SuperValidated<any>): void {
    if (form.message) showMessage(form.message);
    if (!form.valid) showMessage({ type: "error", text: errInvalid });
}

export function showMessage(message: App.Superforms.Message) {
    switch (message.type) {
        case "success":
            toast.success("Sucesso", { description: message.text });
            break;
        case "error":
            toast.error("Erro", { description: message.text });
            break;
        case "warning":
            toast.warning("Aviso", { description: message.text });
            break;
    }
}
