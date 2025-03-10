<script lang="ts">
    import { signinSchema, type SigninSchema } from "../schema";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";
    import { invalidFormMessage, showMessage } from "$lib/utils";

    interface Props {
        data: SuperValidated<SigninSchema>;
        [key: string]: any
    }

    let { ...props }: Props = $props();

    const form = superForm(props.data, {
        validators: zod(signinSchema),
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

<form method="POST" action="?/signin" {...props} use:enhance>
    <Form.Field {form} name="email">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>Email</Form.Label>
                <Input {...attrs} bind:value={$formData.email} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="password">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>Senha</Form.Label>
                <Input type="password" {...attrs} bind:value={$formData.password} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button class="col-span-2">Continuar</Form.Button>
</form>
