<script lang="ts">
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import { Textarea } from "$lib/components/ui/textarea";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";
    import cep from "cep-promise";
    import * as Select from "$lib/components/ui/select/index.js";

    import { SheetClose } from "$lib/components/ui/sheet";
    import { ResidenceKind } from "$lib/models";
    import {
        createAddressSchema,
        updateAddressSchema,
        type CreateAddressSchema,
        type UpdateAddressSchema
    } from "../schema";
    import { maybeShowMessage } from "$lib/error";

    let {
        data,
        isUpdateForm = false
    }: {
        data: SuperValidated<CreateAddressSchema | UpdateAddressSchema>;
        isUpdateForm?: boolean;
    } = $props();

    const form = superForm(data, {
        validators: isUpdateForm
            ? zod(updateAddressSchema)
            : zod(createAddressSchema),
        onChange() {
            if ($formData.zip_code?.length == 8) {
                cep($formData.zip_code)
                    .then((data) => {
                        $formData.state = data.state;
                        $formData.street = data.street;
                        $formData.city = data.city;
                        $formData.neighborhood = data.neighborhood;
                    })
                    .catch(() => {
                        $formData.state = "";
                        $formData.street = "";
                        $formData.city = "";
                        $formData.neighborhood = "";
                    });
            }
        },
        onUpdate: ({ form }) => maybeShowMessage(form)
    });

    const { form: formData, enhance } = form;
</script>

<form
    method="POST"
    action={isUpdateForm ? "/addresses?/update" : "addresses?/new"}
    use:enhance
>
    {#if isUpdateForm}
        <Form.Field {form} name="id">
            <Form.Control>
                {#snippet children({ props })}
                    <input {...props} hidden value={$formData.id} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    {/if}
    <Form.Field {form} name="name">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Nome</Form.Label>
                <Input {...props} bind:value={$formData.name} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="zip_code">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>CEP</Form.Label>
                <Input {...props} bind:value={$formData.zip_code} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="state">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Estado</Form.Label>
                <Input {...props} readonly bind:value={$formData.state} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="city">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Cidade</Form.Label>
                <Input {...props} readonly bind:value={$formData.city} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="neighborhood">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Bairro</Form.Label>
                <Input
                    {...props}
                    readonly
                    bind:value={$formData.neighborhood}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="street">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Rua</Form.Label>
                <Input {...props} readonly bind:value={$formData.street} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="number">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Número</Form.Label>
                <Input {...props} bind:value={$formData.number} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="residence_type">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Tipo de residência</Form.Label>
                <Select.Root
                    type="single"
                    bind:value={$formData.residence_type}
                    name={props.name}
                >
                    <Select.Trigger {...props}>
                        {$formData.residence_type
                            ? $formData.residence_type
                            : "Selecione o tipo da residência"}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item
                            value={ResidenceKind.House}
                            label={ResidenceKind.House}
                        />
                        <Select.Item
                            value={ResidenceKind.Apartment}
                            label={ResidenceKind.Apartment}
                        />
                    </Select.Content>
                </Select.Root>
            {/snippet}
        </Form.Control>
    </Form.Field>
    <Form.Field {form} name="observations">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Observações</Form.Label>
                <Textarea
                    {...props}
                    placeholder="Faltou alguma informação? Nos ajude a te encontrar."
                    class="resize-none"
                    bind:value={$formData.observations}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <SheetClose>
        <Form.Button class="w-full">Continuar</Form.Button>
    </SheetClose>
</form>
