<script>
    import { AspectRatio } from "$lib/components/ui/aspect-ratio";
    import { page } from "$app/stores";
    import noDataBro from "$lib/assets/no-data-bro.png";
    import { Button } from "$lib/components/ui/button";
</script>

<main class="flex p-8 gap-2 flex-col items-center justify-center">
    <div class="w-full md:w-9/12 lg:w-7/12">
        <AspectRatio ratio={16 / 9} class="flex justify-center">
            <img class="w-7/12" src={noDataBro} alt="Erro de autenticação" />
        </AspectRatio>
    </div>
    <h1>Algo deu errado</h1>
    <p>
        {$page.error?.message ||
            "Parece que algo deu errado. Estamos trabalhando nisso."}
    </p>
    <p class="text-xs">
        code: {$page.error?.message || ""}
    </p>
    <Button href="/">Volte para o início</Button>
</main>
