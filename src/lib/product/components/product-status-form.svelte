<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Textarea } from "$lib/components/ui/textarea";
    import { zod } from "sveltekit-superforms/adapters";
    import { changeProductStatusSchema } from "../schema";
    import { superForm } from "sveltekit-superforms";
    import { Close } from "$lib/components/ui/sheet";

    let {
        id,
        kind
    }: {
        id: number;
        kind: string;
    } = $props();

    const form = superForm(
        {
            id,
            kind,
            reason: ""
        },
        {
            validators: zod(changeProductStatusSchema)
        }
    );

    const { form: formData, enhance } = form;
</script>

<form method="POST" action="/dashboard/products?/changeStatus" use:enhance>
    <Form.Field {form} name="id">
        <Form.Control>
            {#snippet children({ props })}
                <input {...props} hidden value={$formData.id} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="kind">
        <Form.Control>
            {#snippet children({ props })}
                <input {...props} hidden value={$formData.kind} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="reason">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Justificativa</Form.Label>
                <Textarea
                    placeholder="Preencha com sua justificativa"
                    {...props}
                    bind:value={$formData.reason}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Close class="w-full mt-4">
        <Form.Button class="w-full">Confirmar</Form.Button>
    </Close>
</form>
