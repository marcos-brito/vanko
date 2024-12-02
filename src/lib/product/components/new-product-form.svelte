<script lang="ts">
    import { Textarea } from "$lib/components/ui/textarea";
    import * as Form from "$lib/components/ui/form";
    import * as Select from "$lib/components/ui/select";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";
    import { invalidFormMessage, showMessage } from "$lib/utils";
    import { newProductSchema } from "../schema";
    import FormSection from "$lib/components/form-section.svelte";
    import { Button } from "$lib/components/ui/button";
    import {
        filesProxy,
        superForm,
        type SuperValidated
    } from "sveltekit-superforms";
    import {
        type Category,
        type NewProductSchema,
        type PricingGroup,
        type Type
    } from "../types";

    type Data = {
        form: SuperValidated<NewProductSchema>;
        categories: Array<Category>;
        types: Array<Type>;
        pricing_groups: Array<PricingGroup>;
    };

    export let data: Data;

    const form = superForm(data.form, {
        validators: zod(newProductSchema),
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

    const files = filesProxy(form, "images");

    $: selectedCategory = $formData.category
        ? {
              label: $formData.category,
              value: $formData.category
          }
        : undefined;

    $: pricingGroup = $formData.pricing_group
        ? {
              label: $formData.pricing_group,
              value: $formData.pricing_group
          }
        : undefined;

    $: selectedType = $formData.type
        ? {
              label: $formData.type,
              value: $formData.type
          }
        : undefined;
</script>

<form
    method="POST"
    action="/dashboard/products/new?/newProduct"
    enctype="multipart/form-data"
    {...$$props}
    use:enhance
    class="gap-8 grid-cols-2 lg:grid"
>
    <article class="flex flex-col gap-4">
        <FormSection name="Descrição">
            <Form.Field {form} name="name">
                <Form.Control let:attrs>
                    <Form.Label>Nome do produto</Form.Label>
                    <Input {...attrs} bind:value={$formData.name} />
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="description">
                <Form.Control let:attrs>
                    <Form.Label>Descrição do produto</Form.Label>
                    <Textarea
                        {...attrs}
                        class="resize-y"
                        bind:value={$formData.description}
                    />
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
        </FormSection>
        <FormSection name="Detalhes">
            <div class="grid gap-3 grid-cols-3">
                <Form.Field {form} name="year">
                    <Form.Control let:attrs>
                        <Form.Label>Ano</Form.Label>
                        <Input
                            type="number"
                            {...attrs}
                            bind:value={$formData.year}
                        />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="number">
                    <Form.Control let:attrs>
                        <Form.Label>Número</Form.Label>
                        <Input
                            {...attrs}
                            type="number"
                            bind:value={$formData.number}
                        />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="bar_code">
                    <Form.Control let:attrs>
                        <Form.Label>Código de barras</Form.Label>
                        <Input
                            {...attrs}
                            type="number"
                            bind:value={$formData.bar_code}
                        />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>
        </FormSection>
        <FormSection name="Categoria e tipo">
            <div class="grid gap-3 grid-cols-2">
                <Form.Field {form} name="category">
                    <Form.Control let:attrs>
                        <Form.Label>Categoria</Form.Label>
                        <Select.Root
                            selected={selectedCategory}
                            onSelectedChange={(v) => {
                                v && ($formData.category = v.value);
                            }}
                        >
                            <Select.Trigger {...attrs}>
                                <Select.Value
                                    placeholder={data.categories.length > 0
                                        ? "Categoria"
                                        : "Nenhuma cadastrada"}
                                />
                            </Select.Trigger>
                            <Select.Content>
                                {#each data.categories as category}
                                    <Select.Item
                                        value={category.name}
                                        label={category.name}
                                    />
                                {/each}
                            </Select.Content>
                        </Select.Root>
                        <input
                            hidden
                            bind:value={$formData.category}
                            name={attrs.name}
                        />
                        <Button variant="link" class="text-xs"
                            >Adicionar categoria</Button
                        >
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="type">
                    <Form.Control let:attrs>
                        <Form.Label>Tipo</Form.Label>
                        <Select.Root
                            selected={selectedType}
                            onSelectedChange={(v) => {
                                v && ($formData.type = v.value);
                            }}
                        >
                            <Select.Trigger {...attrs}>
                                <Select.Value
                                    placeholder={data.types.length > 0
                                        ? "Tipo"
                                        : "Nenhum cadastrado"}
                                />
                            </Select.Trigger>
                            <Select.Content>
                                {#each data.types as type}
                                    <Select.Item
                                        value={type.name}
                                        label={type.name}
                                    />
                                {/each}
                            </Select.Content>
                        </Select.Root>
                        <input
                            hidden
                            bind:value={$formData.type}
                            name={attrs.name}
                        />
                        <Button variant="link" class="text-xs"
                            >Adicionar tipo</Button
                        >
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>
        </FormSection>
        <FormSection name="Precificação">
            <div class="grid gap-3 grid-cols-2">
                <Form.Field {form} name="cost">
                    <Form.Control let:attrs>
                        <Form.Label>Custo</Form.Label>
                        <Input {...attrs} bind:value={$formData.cost} />
                    </Form.Control>
                    <Form.FormDescription>Custo em reais</Form.FormDescription>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="pricing_group">
                    <Form.Control let:attrs>
                        <Form.Label>Grupo de precificação</Form.Label>
                        <Select.Root
                            selected={pricingGroup}
                            onSelectedChange={(v) => {
                                v && ($formData.pricing_group = v.value);
                            }}
                        >
                            <Select.Trigger {...attrs}>
                                <Select.Value
                                    placeholder={data.pricing_groups.length > 0
                                        ? "Grupo"
                                        : "Nenhum cadastrado"}
                                />
                            </Select.Trigger>
                            <Select.Content>
                                {#each data.pricing_groups as group}
                                    <Select.Item
                                        value={group.name}
                                        label={`${group.name} ${group.profit_margin}`}
                                    />
                                {/each}
                            </Select.Content>
                        </Select.Root>
                        <input
                            hidden
                            bind:value={$formData.pricing_group}
                            name={attrs.name}
                        />
                        <Button variant="link" class="text-xs"
                            >Adicionar grupo</Button
                        >
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>
        </FormSection>
    </article>
    <article class="flex flex-col gap-4">
        <FormSection name="Dimensões">
            <div class="grid gap-3 grid-cols-3">
                <Form.Field {form} name="weight">
                    <Form.Control let:attrs>
                        <Form.Label>Peso</Form.Label>
                        <Input {...attrs} bind:value={$formData.weight} />
                    </Form.Control>
                    <Form.FormDescription>Peso em gramas</Form.FormDescription>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="height">
                    <Form.Control let:attrs>
                        <Form.Label>Altura</Form.Label>
                        <Input {...attrs} bind:value={$formData.height} />
                    </Form.Control>
                    <Form.FormDescription
                        >Altura em centímetros</Form.FormDescription
                    >
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="width">
                    <Form.Control let:attrs>
                        <Form.Label>Largura</Form.Label>
                        <Input {...attrs} bind:value={$formData.width} />
                    </Form.Control>
                    <Form.FormDescription
                        >Largura em centímetros</Form.FormDescription
                    >
                    <Form.FieldErrors />
                </Form.Field>
            </div>
        </FormSection>
        <FormSection name="Imagens">
            <Form.Field {form} name="images">
                <Form.Control let:attrs>
                    <Form.Label>Imagens</Form.Label>
                    <Input
                        {...attrs}
                        type="file"
                        multiple
                        accept="image/png, image/jpeg"
                        bind:value={$files}
                    />
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
        </FormSection>
        <Form.Button class="w-full col-span-2 mt-8"
            >Adicionar Produto</Form.Button
        >
    </article>
</form>
