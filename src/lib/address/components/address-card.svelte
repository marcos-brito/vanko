<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Sheet from "$lib/components/ui/sheet";
    import { superForm, type SuperValidated } from "sveltekit-superforms";
    import AddressForm from "./address-form.svelte";
    import * as Form from "$lib/components/ui/form";
    import { zod } from "sveltekit-superforms/adapters";
    import { Input } from "$lib/components/ui/input";
    import { showMessage } from "$lib/utils";
    import { deleteAddressSchema, type UpdateAddressSchema } from "../schema";

    export let address: UpdateAddressSchema;
    export let data: SuperValidated<UpdateAddressSchema>;

    const form = superForm(data, {
        validators: zod(deleteAddressSchema),
        onUpdated({ form }) {
            if (form.message) {
                showMessage(form.message);
            }
        }
    });
    const { form: formData, enhance } = form;
</script>

<section class="flex flex-col gap-2 max-w-xs">
    <h1 class="text-base font-bold">{address.name}</h1>
    <p class="text-sm opacity-70">
        {address.street}, {address.number} - {address.zip_code}
    </p>
    <article class="flex justify-between gap-8 items-center">
        <p class="text-sm opacity-70">
            {address.country} - {address.state} - {address.city}
        </p>
        <div class="flex">
            <Sheet.Root>
                <Sheet.Trigger>
                    <Button class="font-bold" variant="link">Editar</Button>
                </Sheet.Trigger>
                <Sheet.Content
                    side="right"
                    class="flex flex-col gap-4 overflow-scroll"
                >
                    <Sheet.Header>
                        <Sheet.Title>Editar endereço</Sheet.Title>
                        <Sheet.Description>
                            Basta colocar seu CEP para preencher os outros
                            campos.
                        </Sheet.Description>
                    </Sheet.Header>
                    <AddressForm
                        isUpdateForm
                        class="flex flex-col gap-2"
                        {data}
                    />
                </Sheet.Content>
            </Sheet.Root>
            <form method="POST" action="/addresses?/del" use:enhance>
                <Form.Field {form} name="id">
                    <Form.Control let:attrs>
                        <Input class="hidden" {...attrs} value={$formData.id} />
                    </Form.Control>
                </Form.Field>
                <Form.Button class="font-bold" variant="link"
                    >Excluir</Form.Button
                >
            </form>
        </div>
    </article>
</section>
