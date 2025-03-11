<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import * as Select from "$lib/components/ui/select";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";
    import { SheetClose } from "$lib/components/ui/sheet";
    import { maybeShowMessage } from "$lib/error";
    import { Gender } from "$lib/models";
    import {
        updatePersonalInfo,
        type UpdatePersonalInfoSchema
    } from "../schema";
    import {
        dateProxy,
        superForm,
        type SuperValidated
    } from "sveltekit-superforms";

    let {
        ...props
    }: {
        data: SuperValidated<UpdatePersonalInfoSchema>;
        [key: string]: any;
    } = $props();

    const form = superForm(props.data, {
        validators: zod(updatePersonalInfo),
        onUpdated: ({ form }) => maybeShowMessage(form)
    });

    const { form: formData, enhance } = form;
    const proxyDate = dateProxy(form, "birth", {
        format: "date",
        empty: "undefined"
    });

    let selectedGender = $derived(
        $formData.gender
            ? {
                  label: $formData.gender,
                  value: $formData.gender
              }
            : undefined
    );
</script>

<form method="POST" action="/account?/update" {...props} use:enhance>
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
    <Form.Field {form} name="phone">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Telefone</Form.Label>
                <Input {...props} bind:value={$formData.phone} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="cpf">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>CPF</Form.Label>
                <Input {...props} bind:value={$formData.cpf} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="birth">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Data de nascimento</Form.Label>
                <Input type="date" {...props} bind:value={$proxyDate} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="gender">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Gênero</Form.Label>
                <Select.Root
                    name={props.name}
                    selected={selectedGender}
                    onSelectedChange={(v) => {
                        v && ($formData.gender = v.value);
                    }}
                >
                    <Select.Trigger {...props}>
                        {$formData.gender
                            ? $formData.gender
                            : "Genêro"}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value={Gender.Male} label="Masculino" />
                        <Select.Item value={Gender.Female} label="Feminino" />
                        <Select.Item value={Gender.Other} label="Outro" />
                    </Select.Content>
                </Select.Root>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <SheetClose>
        <Form.Button class="w-full">Confirmar</Form.Button>
    </SheetClose>
</form>
