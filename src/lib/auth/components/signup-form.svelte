<script lang="ts">
    import { signupSchema, type SignupSchema } from "../schema";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";
    import { maybeShowMessage } from "$lib/error";

    let {
        ...props
    }: {
        data: SuperValidated<SignupSchema>;
        [key: string]: any;
    } = $props();

    const form = superForm(props.data, {
        validators: zod(signupSchema),
        onUpdated: ({ form }) => maybeShowMessage(form)
    });

    const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/signup" {...props} use:enhance>
    <Form.Field {form} name="name">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Nome</Form.Label>
                <Input {...props} bind:value={$formData.name} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="email">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Email</Form.Label>
                <Input {...props} bind:value={$formData.email} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="password">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Senha</Form.Label>
                <Input
                    type="password"
                    {...props}
                    bind:value={$formData.password}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="confirm_password">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Confirme sua senha</Form.Label>
                <Input
                    type="password"
                    {...props}
                    bind:value={$formData.confirm_password}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button class="col-span-2">Continuar</Form.Button>
</form>
