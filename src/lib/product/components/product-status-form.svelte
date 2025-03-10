<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Textarea } from "$lib/components/ui/textarea";
    import { zod } from "sveltekit-superforms/adapters";
    import { changeProductStatusSchema } from "../schema";
    import { superForm } from "sveltekit-superforms";
    import { Close } from "$lib/components/ui/sheet";

    interface Props {
        id: number;
        kind: string;
        [key: string]: any
    }

    let { ...props }: Props = $props();

    const form = superForm(
        {
            props.props.id,
            props.props.kind,
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
    {...props}
    use:enhance
>
    <Form.Field {form} name="id">
        <Form.Control >
            {#snippet children({ attrs })}
                        <input {...attrs} hidden value={$formData.id} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="kind">
        <Form.Control >
            {#snippet children({ attrs })}
                        <input {...attrs} hidden value={$formData.kind} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="reason">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>Justificativa</Form.Label>
                <Textarea
                    placeholder="Preencha com sua justificativa"
                    {...attrs}
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
