<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Sheet from "$lib/components/ui/sheet";
    import type { PageData } from "./$types";
    import NewAddressForm from "$lib/address/components/address-form.svelte";
    import AddressCard from "$lib/address/components/address-card.svelte";

    let {
        data
    }: {
        data: PageData;
    } = $props();
</script>

<section class="flex flex-col gap-16">
    <h1 class="text-2xl font-bold">Endereços</h1>
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
                <NewAddressForm data={data.form.newAddress} />
            </Sheet.Content>
        </Sheet.Root>
    </div>
</section>
