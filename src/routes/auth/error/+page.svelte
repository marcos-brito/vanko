<script>
    import { AspectRatio } from "$lib/components/ui/aspect-ratio";
    import noDataBro from "$lib/assets/no-data-bro.png";
    import { Button } from "$lib/components/ui/button";
</script>

<main class="flex p-8 gap-2 flex-col items-center justify-center">
    <div class="w-full md:w-9/12 lg:w-7/12">
        <AspectRatio ratio={16 / 9} class="flex justify-center">
            <img class="w-7/12" src={noDataBro} alt="Erro de autenticação" />
        </AspectRatio>
    </div>
    <h1>Erro de autenticação</h1>
    <p>
        Não conseguimos validar alguns dos seus dados. Tente novamente mais
        tarde.
    </p>
    <Button href="/">Volte para o início</Button>
</main>
