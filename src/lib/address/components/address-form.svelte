<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import { Textarea } from "$lib/components/ui/textarea";
    import * as Form from "$lib/components/ui/form";
    import * as Select from "$lib/components/ui/select";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";
    import { invalidFormMessage, showMessage } from "$lib/utils";
    import cep from "cep-promise";
    import { SheetClose } from "$lib/components/ui/sheet";
    import { ResidenceType } from "../types";
    import {
        addressSchema,
        updateAddressSchema,
        type AddressSchema,
        type UpdateAddressSchema
    } from "../schema";

    export let data: SuperValidated<AddressSchema | UpdateAddressSchema>;
    export let isUpdateForm = false;

    const form = superForm(data, {
        validators: isUpdateForm
            ? zod(updateAddressSchema)
            : zod(addressSchema),
        onChange() {
            if ($formData.zip_code.length == 8) {
                cep($formData.zip_code)
                    .then((data) => {
                        $formData.country = "Brasil";
                        $formData.state = data.state;
                        $formData.street = data.street;
                        $formData.city = data.city;
                        $formData.neighborhood = data.neighborhood;
                    })
                    .catch(() => {
                        $formData.country = "";
                        $formData.state = "";
                        $formData.street = "";
                        $formData.city = "";
                        $formData.neighborhood = "";
                    });
            }
        },
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

    $: selectedResindenceType = $formData.residence_type
        ? {
              label: $formData.residence_type,
              value: $formData.residence_type
          }
        : undefined;
</script>

<form
    method="POST"
    action={isUpdateForm ? "/addresses?/update" : "addresses?/new"}
    {...$$props}
    use:enhance
>
    {#if isUpdateForm}
        <Form.Field {form} name="id">
            <Form.Control let:attrs>
                <input {...attrs} hidden value={$formData.id} />
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    {/if}
    <Form.Field {form} name="name">
        <Form.Control let:attrs>
            <Form.Label>Nome</Form.Label>
            <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="zip_code">
        <Form.Control let:attrs>
            <Form.Label>CEP</Form.Label>
            <Input {...attrs} bind:value={$formData.zip_code} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="country">
        <Form.Control let:attrs>
            <Form.Label>País</Form.Label>
            <Input
                {...attrs}
                class="text-secondary-foreground"
                readonly
                bind:value={$formData.country}
            />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="state">
        <Form.Control let:attrs>
            <Form.Label>Estado</Form.Label>
            <Input {...attrs} readonly bind:value={$formData.state} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="city">
        <Form.Control let:attrs>
            <Form.Label>Cidade</Form.Label>
            <Input {...attrs} readonly bind:value={$formData.city} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="neighborhood">
        <Form.Control let:attrs>
            <Form.Label>Bairro</Form.Label>
            <Input {...attrs} readonly bind:value={$formData.neighborhood} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="street">
        <Form.Control let:attrs>
            <Form.Label>Rua</Form.Label>
            <Input {...attrs} readonly bind:value={$formData.street} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="number">
        <Form.Control let:attrs>
            <Form.Label>Número</Form.Label>
            <Input {...attrs} bind:value={$formData.number} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="residence_type">
        <Form.Control let:attrs>
            <Form.Label>Tipo de residência</Form.Label>
            <Select.Root
                selected={selectedResindenceType}
                onSelectedChange={(v) => {
                    v && ($formData.residence_type = v.value);
                }}
            >
                <Select.Trigger {...attrs}>
                    <Select.Value placeholder="Gênero" />
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value={ResidenceType.HOUSE} label="Casa" />
                    <Select.Item
                        value={ResidenceType.APARTMENT}
                        label="Apartamento"
                    />
                </Select.Content>
            </Select.Root>
            <input
                hidden
                bind:value={$formData.residence_type}
                name={attrs.name}
            />
        </Form.Control>
    </Form.Field>
    <Form.Field {form} name="observations">
        <Form.Control let:attrs>
            <Form.Label>Observações</Form.Label>
            <Textarea
                {...attrs}
                placeholder="Faltou alguma informação? Nos ajude a te encontrar."
                class="resize-none"
                bind:value={$formData.observations}
            />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <SheetClose>
        <Form.Button class="w-full">Continuar</Form.Button>
    </SheetClose>
</form>
