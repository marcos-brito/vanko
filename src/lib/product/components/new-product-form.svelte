<script lang="ts">
    import { Textarea } from "$lib/components/ui/textarea";
    import * as Form from "$lib/components/ui/form";
    import * as Select from "$lib/components/ui/select";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";
    import { invalidFormMessage, showMessage } from "$lib/utils";
    import { newProductSchema } from "../schema";
    import FormSection from "$lib/components/form-section.svelte";
    import CategorySheet from "./category-sheet.svelte";
    import TypeSheet from "./type-sheet.svelte";
    import PricingGroupSheet from "./pricing-group-sheet.svelte";
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

    interface Props {
        data: Data;
        [key: string]: any
    }

    let { ...props }: Props = $props();

    const form = superForm(props.data.form, {
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

    let selectedCategory = $derived($formData.category
        ? {
              label: $formData.category,
              value: $formData.category
          }
        : undefined);

    let pricingGroup = $derived($formData.pricing_group
        ? {
              label: $formData.pricing_group,
              value: $formData.pricing_group
          }
        : undefined);

    let selectedType = $derived($formData.type
        ? {
              label: $formData.type,
              value: $formData.type
          }
        : undefined);
</script>

<form
    method="POST"
    action="/dashboard/products/new?/newProduct"
    enctype="multipart/form-data"
    {...props}
    use:enhance
    class="gap-8 grid-cols-2 lg:grid"
>
    <article class="flex flex-col gap-4">
        <FormSection name="Descrição">
            <Form.Field {form} name="name">
                <Form.Control >
                    {#snippet children({ attrs })}
                                        <Form.Label>Nome do produto</Form.Label>
                        <Input {...attrs} bind:value={$formData.name} />
                                                        {/snippet}
                                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="description">
                <Form.Control >
                    {#snippet children({ attrs })}
                                        <Form.Label>Descrição do produto</Form.Label>
                        <Textarea
                            {...attrs}
                            class="resize-y"
                            bind:value={$formData.description}
                        />
                                                        {/snippet}
                                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
        </FormSection>

        <FormSection name="Detalhes">
            <div class="grid gap-3 grid-cols-3">
                <Form.Field {form} name="year">
                    <Form.Control >
                        {#snippet children({ attrs })}
                                                <Form.Label>Ano</Form.Label>
                            <Input
                                type="number"
                                {...attrs}
                                bind:value={$formData.year}
                            />
                                                                    {/snippet}
                                        </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="number">
                    <Form.Control >
                        {#snippet children({ attrs })}
                                                <Form.Label>Número</Form.Label>
                            <Input
                                {...attrs}
                                type="number"
                                bind:value={$formData.number}
                            />
                                                                    {/snippet}
                                        </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="bar_code">
                    <Form.Control >
                        {#snippet children({ attrs })}
                                                <Form.Label>Código de barras</Form.Label>
                            <Input
                                {...attrs}
                                type="number"
                                bind:value={$formData.bar_code}
                            />
                                                                    {/snippet}
                                        </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>
        </FormSection>

        <FormSection name="Categoria e tipo">
            <div class="grid gap-3 grid-cols-2">
                <Form.Field {form} name="category">
                    <Form.Control >
                        {#snippet children({ attrs })}
                                                <Form.Label>Categoria</Form.Label>
                            <Select.Root
                                selected={selectedCategory}
                                onSelectedChange={(v) => {
                                    v && ($formData.category = v.value);
                                }}
                            >
                                <Select.Trigger {...attrs}>
                                    <Select.Value
                                        placeholder={props.data.categories.length > 0
                                            ? "Categoria"
                                            : "Nenhuma cadastrada"}
                                    />
                                </Select.Trigger>
                                <Select.Content>
                                    {#each props.data.categories as category}
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
                            <CategorySheet />
                                                                    {/snippet}
                                        </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="type">
                    <Form.Control >
                        {#snippet children({ attrs })}
                                                <Form.Label>Tipo</Form.Label>
                            <Select.Root
                                selected={selectedType}
                                onSelectedChange={(v) => {
                                    v && ($formData.type = v.value);
                                }}
                            >
                                <Select.Trigger {...attrs}>
                                    <Select.Value
                                        placeholder={props.data.types.length > 0
                                            ? "Tipo"
                                            : "Nenhum cadastrado"}
                                    />
                                </Select.Trigger>
                                <Select.Content>
                                    {#each props.data.types as type}
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
                            <TypeSheet />
                                                                    {/snippet}
                                        </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>
        </FormSection>

        <FormSection name="Precificação">
            <div class="grid gap-3 grid-cols-2">
                <Form.Field {form} name="cost">
                    <Form.Control >
                        {#snippet children({ attrs })}
                                                <Form.Label>Custo</Form.Label>
                            <Input {...attrs} bind:value={$formData.cost} />
                                                                    {/snippet}
                                        </Form.Control>
                    <Form.FormDescription>Custo em reais</Form.FormDescription>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="pricing_group">
                    <Form.Control >
                        {#snippet children({ attrs })}
                                                <Form.Label>Grupo de precificação</Form.Label>
                            <Select.Root
                                selected={pricingGroup}
                                onSelectedChange={(v) => {
                                    v && ($formData.pricing_group = v.value);
                                }}
                            >
                                <Select.Trigger {...attrs}>
                                    <Select.Value
                                        placeholder={props.data.pricing_groups.length > 0
                                            ? "Grupo"
                                            : "Nenhum cadastrado"}
                                    />
                                </Select.Trigger>
                                <Select.Content>
                                    {#each props.data.pricing_groups as group}
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
                            <PricingGroupSheet />
                                                                    {/snippet}
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
                    <Form.Control >
                        {#snippet children({ attrs })}
                                                <Form.Label>Peso</Form.Label>
                            <Input {...attrs} bind:value={$formData.weight} />
                                                                    {/snippet}
                                        </Form.Control>
                    <Form.FormDescription>Peso em gramas</Form.FormDescription>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="height">
                    <Form.Control >
                        {#snippet children({ attrs })}
                                                <Form.Label>Altura</Form.Label>
                            <Input {...attrs} bind:value={$formData.height} />
                                                                    {/snippet}
                                        </Form.Control>
                    <Form.FormDescription
                        >Altura em centímetros</Form.FormDescription
                    >
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="width">
                    <Form.Control >
                        {#snippet children({ attrs })}
                                                <Form.Label>Largura</Form.Label>
                            <Input {...attrs} bind:value={$formData.width} />
                                                                    {/snippet}
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
                <Form.Control >
                    {#snippet children({ attrs })}
                                        <Form.Label>Imagens</Form.Label>
                        <Input
                            {...attrs}
                            type="file"
                            multiple
                            accept="image/png, image/jpeg"
                            bind:value={$files}
                        />
                                                        {/snippet}
                                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
        </FormSection>
        <Form.Button class="w-full col-span-2 mt-8"
            >Adicionar Produto</Form.Button
        >
    </article>
</form>
