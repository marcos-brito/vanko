<script>
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";
    import { MoonIcon, SunIcon } from "lucide-svelte";
    import { Toaster } from "$lib/components/ui/sonner";
    import { toggleMode } from "mode-watcher";
    import { Button } from "$lib/components/ui/button";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";

    export let data;
    $: ({ session, supabase } = data);

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate("supabase:auth");
            }
        });

        return () => data.subscription.unsubscribe();
    });
</script>

<ModeWatcher />
<Button
    on:click={toggleMode}
    variant="outline"
    size="icon"
    class="absolute right-8 bottom-8"
>
    <SunIcon
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <MoonIcon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
</Button>
<Toaster position="top-center" />
<slot />
