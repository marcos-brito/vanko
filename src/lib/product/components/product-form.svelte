<script lang="ts">
    import { Textarea } from "$lib/components/ui/textarea";
    import * as Form from "$lib/components/ui/form";
    import * as Select from "$lib/components/ui/select";
    import { Input } from "$lib/components/ui/input";
    import { zod } from "sveltekit-superforms/adapters";
    import { maybeShowMessage } from "$lib/error";
    import { newProductSchema, type NewProductSchema } from "../schema";
    import FormSection from "$lib/components/form-section.svelte";
    import CategorySheet from "./category-sheet.svelte";
    import TypeSheet from "./type-sheet.svelte";
    import PricingGroupSheet from "./pricing-group-sheet.svelte";
    import type { Category, PricingGroup, Type } from "../presenter";
    import {
        filesProxy,
        superForm,
        type SuperValidated
    } from "sveltekit-superforms";

    let {
        data,
        categories,
        types,
        pricingGroups
    }: {
        data: SuperValidated<NewProductSchema>;
        categories: Array<Category>;
        types: Array<Type>;
        pricingGroups: Array<PricingGroup>;
    } = $props();

    const form = superForm(data, {
        validators: zod(newProductSchema),
        onUpdated: ({ form }) => maybeShowMessage(form)
    });

    const { form: formData, enhance } = form;
    const files = filesProxy(form, "images");
</script>

<form
    method="POST"
    action="/dashboard/products/new?/newProduct"
    enctype="multipart/form-data"
    use:enhance
    class="gap-8 grid-cols-2 lg:grid"
>
    <article class="flex flex-col gap-4">
        <FormSection name="Descrição">
            <Form.Field {form} name="name">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Nome do produto</Form.Label>
                        <Input {...props} bind:value={$formData.name} />
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="description">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Descrição do produto</Form.Label>
                        <Textarea
                            {...props}
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
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Ano</Form.Label>
                            <Input
                                type="number"
                                {...props}
                                bind:value={$formData.year}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="number">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Número</Form.Label>
                            <Input
                                {...props}
                                type="number"
                                bind:value={$formData.number}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="bar_code">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Código de barras</Form.Label>
                            <Input
                                {...props}
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
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Categoria</Form.Label>
                            <Select.Root
                                type="single"
                                name={props.name}
                                bind:value={$formData.category}
                            >
                                <Select.Trigger class="w-[180px]"
                                ></Select.Trigger>
                                <Select.Content>
                                    {#each categories as category}
                                        <Select.Item
                                            value={category.id}
                                            label={category.name}
                                        />
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                            <CategorySheet />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="type">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Tipo</Form.Label>
                            <Select.Root
                                type="single"
                                name={props.name}
                                bind:value={$formData.type}
                            >
                                <Select.Trigger class="w-[180px]"
                                ></Select.Trigger>
                                <Select.Content>
                                    {#each types as type}
                                        <Select.Item
                                            value={type.id}
                                            label={type.name}
                                        />
                                    {/each}
                                </Select.Content>
                            </Select.Root>
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
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Custo</Form.Label>
                            <Input {...props} bind:value={$formData.cost} />
                        {/snippet}
                    </Form.Control>
                    <Form.FormDescription>Custo em reais</Form.FormDescription>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="pricing_group">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Grupo de precificação</Form.Label>
                            <Select.Root
                                type="single"
                                name={props.name}
                                bind:value={$formData.pricing_group}
                            >
                                <Select.Trigger class="w-[180px]"
                                ></Select.Trigger>
                                <Select.Content>
                                    {#each pricingGroups as pricingGroup}
                                        <Select.Item
                                            value={pricingGroup.id}
                                            label={pricingGroup.name}
                                        />
                                    {/each}
                                </Select.Content>
                            </Select.Root>
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
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Peso</Form.Label>
                            <Input {...props} bind:value={$formData.weight} />
                        {/snippet}
                    </Form.Control>
                    <Form.FormDescription>Peso em gramas</Form.FormDescription>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="height">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Altura</Form.Label>
                            <Input {...props} bind:value={$formData.height} />
                        {/snippet}
                    </Form.Control>
                    <Form.FormDescription
                        >Altura em centímetros</Form.FormDescription
                    >
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="width">
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Largura</Form.Label>
                            <Input {...props} bind:value={$formData.width} />
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
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Imagens</Form.Label>
                        <Input
                            {...props}
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
