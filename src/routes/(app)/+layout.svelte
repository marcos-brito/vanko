<script lang="ts">
    import { UserIcon, SearchIcon, MessageSquareIcon } from "lucide-svelte";
    import type { LayoutData } from "./$types";
    import * as Tabs from "$lib/components/ui/tabs";
    import SignupForm from "$lib/auth/components/signup-form.svelte";
    import SigninForm from "$lib/auth/components/signin-form.svelte";
    import * as Sheet from "$lib/components/ui/sheet";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { showMessage } from "$lib/utils";
    import { goto } from "$app/navigation";
    import CartSheet from "$lib/cart/components/cart-sheet.svelte";
    import { Button } from "$lib/components/ui/button";
    import {
        saveOnServer,
        saveOnLocalStorage,
        createCartStore,
        readFromLocalStorege
    } from "$lib/cart/store";

    let { data, children }: {
        data: LayoutData;
        children?: Snippet;
    } = $props();

    async function signout(): Promise<void> {
        const { error } = await data.supabase.auth.signOut();

        if (error) {
            showMessage({
                type: "error",
                text: "Algo deu errado ao sair da sessão. Tente novamente."
            });

            return;
        }

        showMessage({
            type: "success",
            text: "Sessão encerrada."
        });

        goto("/");
    }
</script>

<Button
    on:click={() => {}}
    variant="outline"
    size="icon"
    class="absolute right-8 bottom-8"
>
    <MessageSquareIcon />
    <span class="sr-only">Abrir chat</span>
</Button>
<div class="p-8">
    <nav class="flex gap-16 justify-end items-center mb-16">
        <h1 class="text-3xl font-semibold flex-grow">vanko</h1>
        <div class="flex-grow flex gap-5">
            <a href="/"> Início </a>
            <a href="/shop"> Loja </a>
        </div>
        <div class="flex gap-5">
            <SearchIcon />
            <CartSheet />
            {#if data.session}
                <DropdownMenu.Root disableFocusFirstItem loop>
                    <DropdownMenu.Trigger>
                        <UserIcon />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="mt-2">
                        <DropdownMenu.Group>
                            <DropdownMenu.Item
                                ><a href="/account">Conta</a></DropdownMenu.Item
                            >
                            <DropdownMenu.Item
                                ><a href="/orders/">Pedidos</a
                                ></DropdownMenu.Item
                            >
                            <DropdownMenu.Item
                                ><a href="/addresses">Endereços</a
                                ></DropdownMenu.Item
                            >
                            <DropdownMenu.Item
                                ><a href="/cards">Cartões</a></DropdownMenu.Item
                            >
                            <DropdownMenu.Item on:click={signout}
                                >Sair</DropdownMenu.Item
                            >
                        </DropdownMenu.Group>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            {:else}
                <Sheet.Root>
                    <Sheet.Trigger>
                        <UserIcon />
                    </Sheet.Trigger>
                    <Sheet.Content side="right" class="flex flex-col gap-4">
                        <Sheet.Header>
                            <Sheet.Title>Use sua conta</Sheet.Title>
                            <Sheet.Description>
                                Use sua conta para acessar ofertas exclusivas,
                                acompanhar pedidos e muito mais. É rápido e
                                fácil!
                            </Sheet.Description>
                        </Sheet.Header>
                        <Tabs.Root value="signin">
                            <Tabs.List class="grid grid-cols-2 mb-4">
                                <Tabs.Trigger value="signin"
                                    >Já tenho uma conta</Tabs.Trigger
                                >
                                <Tabs.Trigger value="signup"
                                    >Não tenho uma conta</Tabs.Trigger
                                >
                            </Tabs.List>
                            <Tabs.Content value="signup">
                                <SignupForm
                                    data={data.form.signup}
                                    class="flex flex-col gap-4"
                                />
                            </Tabs.Content>
                            <Tabs.Content value="signin">
                                <SigninForm
                                    data={data.form.signin}
                                    class="flex flex-col gap-4"
                                />
                            </Tabs.Content>
                        </Tabs.Root>
                    </Sheet.Content>
                </Sheet.Root>
            {/if}
        </div>
    </nav>
    {@render children?.()}
</div>
