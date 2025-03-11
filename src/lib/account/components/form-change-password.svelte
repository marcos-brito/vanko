<script lang="ts">
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";
    import { SheetClose } from "$lib/components/ui/sheet";
    import { changePassword, type ChangePasswordSchema } from "../schema";
    import { maybeShowMessage } from "$lib/error";

    let {
        data,
        ...props
    }: { data: SuperValidated<ChangePasswordSchema>; [key: string]: any } =
        $props();

    const form = superForm(data, {
        validators: zod(changePassword),
        onUpdated: ({ form }) => maybeShowMessage(form)
    });

    const { form: formData, enhance } = form;
</script>

<form method="POST" action="/account?/changePassword" {...props} use:enhance>
    <Form.Field {form} name="old">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Senha atual</Form.Label>
                <Input {...props} type="password" bind:value={$formData.old} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="new">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Nova senha</Form.Label>
                <Input {...props} type="password" bind:value={$formData.new} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="confirm">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Confirme sua nova senha</Form.Label>
                <Input
                    {...props}
                    type="password"
                    bind:value={$formData.confirm}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <SheetClose>
        <Form.Button class="w-full">Confirmar</Form.Button>
    </SheetClose>
</form>
