<script lang="ts">
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";
    import { invalidFormMessage, showMessage } from "$lib/utils";
    import { SheetClose } from "$lib/components/ui/sheet";
    import { changePasswordSchema, type ChangePasswordSchema } from "../schema";

    interface Props {
        data: SuperValidated<ChangePasswordSchema>;
        [key: string]: any
    }

    let { ...props }: Props = $props();

    const form = superForm(props.data, {
        validators: zod(changePasswordSchema),
        onUpdated({ form }) {
            if (form.message) {
                showMessage(form.message);
            }

            if (!form.valid) {
                showMessage(invalidFormMessage);
            }
        }
    });

    const { form: formData, enhance } = form;
</script>

<form method="POST" action="/account?/changePassword" {...props} use:enhance>
    <Form.Field {form} name="old">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>Senha atual</Form.Label>
                <Input {...attrs} type="password" bind:value={$formData.old} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="new">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>Nova senha</Form.Label>
                <Input {...attrs} type="password" bind:value={$formData.new} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="confirm">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>Confirme sua nova senha</Form.Label>
                <Input {...attrs} type="password" bind:value={$formData.confirm} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <SheetClose>
        <Form.Button class="w-full">Confirmar</Form.Button>
    </SheetClose>
</form>
