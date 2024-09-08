<script lang="ts">
    import { signupSchema, type SignupSchema } from "$lib/schemas";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";

    export let data: SuperValidated<SignupSchema>;

    const form = superForm(data, {
        validators: zod(signupSchema)
    });

    const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/signup" {...$$props} use:enhance>
    <Form.Field {form} name="name">
        <Form.Control let:attrs>
            <Form.Label>Nome</Form.Label>
            <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="email">
        <Form.Control let:attrs>
            <Form.Label>Email</Form.Label>
            <Input {...attrs} bind:value={$formData.email} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="password">
        <Form.Control let:attrs>
            <Form.Label>Senha</Form.Label>
            <Input type="password" {...attrs} bind:value={$formData.password} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="confirm_password">
        <Form.Control let:attrs>
            <Form.Label>Confirme sua senha</Form.Label>
            <Input
                type="password"
                {...attrs}
                bind:value={$formData.confirm_password}
            />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button class="col-span-2">Continuar</Form.Button>
</form>
