<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import * as Select from "$lib/components/ui/select";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";
    import { invalidFormMessage, showMessage } from "$lib/utils";
    import { SheetClose } from "$lib/components/ui/sheet";
    import {
        updatePersonalInfoSchema,
        type UpdatePersonalInfoSchema,
        Gender
    } from "../schema";
    import {
        dateProxy,
        superForm,
        type SuperValidated
    } from "sveltekit-superforms";

    interface Props {
        data: SuperValidated<UpdatePersonalInfoSchema>;
        [key: string]: any
    }

    let { ...props }: Props = $props();

    const form = superForm(props.data, {
        validators: zod(updatePersonalInfoSchema),
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
    const proxyDate = dateProxy(form, "birth", {
        format: "date",
        empty: "undefined"
    });

    let selectedGender = $derived($formData.gender
        ? {
              label: $formData.gender,
              value: $formData.gender
          }
        : undefined);
</script>

<form method="POST" action="/account?/updateInfo" {...props} use:enhance>
    <Form.Field {form} name="name">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>Nome</Form.Label>
                <Input {...attrs} bind:value={$formData.name} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="email">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>Email</Form.Label>
                <Input {...attrs} bind:value={$formData.email} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="phone">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>Telefone</Form.Label>
                <Input {...attrs} bind:value={$formData.phone} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="cpf">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>CPF</Form.Label>
                <Input {...attrs} bind:value={$formData.cpf} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="birth">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>Data de nascimento</Form.Label>
                <Input type="date" {...attrs} bind:value={$proxyDate} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="gender">
        <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label>Gênero</Form.Label>
                <Select.Root
                    selected={selectedGender}
                    onSelectedChange={(v) => {
                        v && ($formData.gender = v.value);
                    }}
                >
                    <Select.Trigger {...attrs}>
                        <Select.Value placeholder="Gênero" />
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value={Gender.MALE} label="Masculino" />
                        <Select.Item value={Gender.FEMALE} label="Feminino" />
                        <Select.Item value={Gender.OTHER} label="Outro" />
                    </Select.Content>
                </Select.Root>
                <input hidden bind:value={$formData.gender} name={attrs.name} />
                                {/snippet}
                </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <SheetClose>
        <Form.Button class="w-full">Confirmar</Form.Button>
    </SheetClose>
</form>
