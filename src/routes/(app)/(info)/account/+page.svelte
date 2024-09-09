<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import type { PageData } from "./$types";
    import UpdatePersonalInfoForm from "$lib/components/update-personal-info-form.svelte";
    import DataField from "$lib/components/data-field.svelte";
    import ChangePasswordForm from "$lib/components/change-password-form.svelte";

    export let data: PageData;
</script>

<main class="flex flex-col gap-16">
    <h1>Informações pessoais</h1>
    <article class="grid gap-4 md:gap-8 grid-cols-2">
        {#each Object.entries(data.profile) as [label, value]}
            <DataField {label} {value} />
        {/each}
    </article>
    <div class="flex gap-4 md:flex-row">
        <Sheet.Root>
            <Sheet.Trigger>
                <Button class="w-full">Editar dados</Button>
            </Sheet.Trigger>
            <Sheet.Content
                side="right"
                class="flex flex-col gap-4 overflow-scroll"
            >
                <Sheet.Header>
                    <Sheet.Title>Editar dados pessoais</Sheet.Title>
                    <Sheet.Description>
                        Edite seus dados pessoais. Caso altere seu email,
                        lembre-se de verificar sua caixa de entrada.
                    </Sheet.Description>
                </Sheet.Header>
                <UpdatePersonalInfoForm
                    class="flex flex-col gap-2"
                    data={data.form.updateInfo}
                />
            </Sheet.Content>
        </Sheet.Root>
        <Sheet.Root>
            <Sheet.Trigger>
                <Button class="w-full">Alterar senha</Button>
            </Sheet.Trigger>
            <Sheet.Content
                side="right"
                class="flex flex-col gap-4 overflow-scroll"
            >
                <Sheet.Header>
                    <Sheet.Title>Alterar senha</Sheet.Title>
                    <Sheet.Description>
                        Edite seus dados pessoais. Caso altere seu email,
                        lembre-se de verificar sua caixa de entrada.
                    </Sheet.Description>
                </Sheet.Header>
                <ChangePasswordForm
                    class="flex flex-col gap-2"
                    data={data.form.changePassword}
                />
            </Sheet.Content>
        </Sheet.Root>
    </div>
    <article>
        <h1 class="text-destructive">Excluir conta</h1>
        <p class="text-sm mt-4 mb-4 w-8/12">
            Ao excluir sua conta, todos os seus dados e histórico de compras
            serão permanentemente apagados e não poderão ser recuperados. Clique
            no botão abaixo para confirmar a exclusão da sua conta. Se precisar
            de ajuda ou tiver alguma dúvida, nossa equipe de suporte está à
            disposição para ajudar.
        </p>
        <Button variant="destructive">Excluir conta</Button>
    </article>
</main>
