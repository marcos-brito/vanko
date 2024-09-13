<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Sheet from "$lib/components/ui/sheet/index";
    import type { PageData } from "./$types";
    import NewAddressForm from "$lib/components/address-form.svelte";
    import AddressCard from "$lib/components/address-card.svelte";

    export let data: PageData;
</script>

<section class="flex flex-col gap-16">
    <h1>Endereços</h1>
    {#if data.addresses.length < 1}
        <p>Nenhum endereço cadastrado</p>
    {/if}
    <div class="flex flex-wrap gap-16">
        {#each data.addresses as address, i}
            <AddressCard {address} data={data.form.existingAddresses[i]} />
        {/each}
    </div>
    <div>
        <Sheet.Root>
            <Sheet.Trigger>
                <Button class="w-full">Adicionar endereço</Button>
            </Sheet.Trigger>
            <Sheet.Content
                side="right"
                class="flex flex-col gap-4 overflow-scroll"
            >
                <Sheet.Header>
                    <Sheet.Title>Adicionar novo endereço</Sheet.Title>
                    <Sheet.Description>
                        Basta colocar seu CEP para preencher os outros campos.
                    </Sheet.Description>
                </Sheet.Header>
                <NewAddressForm
                    action="/addresses?/new"
                    class="flex flex-col gap-2"
                    data={data.form.newAddress}
                />
            </Sheet.Content>
        </Sheet.Root>
    </div>
</section>
