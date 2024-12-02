<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Textarea } from "$lib/components/ui/textarea";
    import { zod } from "sveltekit-superforms/adapters";
    import { changeProductStatusSchema } from "../schema";
    import { superForm } from "sveltekit-superforms";
    import { Close } from "$lib/components/ui/sheet";

    export let id: number;
    export let kind: string;

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

<form
    method="POST"
    action="/dashboard/products?/changeStatus"
    {...$$props}
    use:enhance
>
    <Form.Field {form} name="id">
        <Form.Control let:attrs>
            <input {...attrs} hidden value={$formData.id} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="kind">
        <Form.Control let:attrs>
            <input {...attrs} hidden value={$formData.kind} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="reason">
        <Form.Control let:attrs>
            <Form.Label>Justificativa</Form.Label>
            <Textarea
                placeholder="Preencha com sua justificativa"
                {...attrs}
                bind:value={$formData.reason}
            />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Close class="w-full mt-4">
        <Form.Button class="w-full">Confirmar</Form.Button>
    </Close>
</form>
