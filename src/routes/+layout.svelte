<script lang="ts">
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";
    import { MoonIcon, SunIcon } from "lucide-svelte";
    import { Toaster } from "$lib/components/ui/sonner";
    import { toggleMode } from "mode-watcher";
    import { Button } from "$lib/components/ui/button";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";

    let { data, children } = $props();
    let { session, supabase } = $derived(data);

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate("supabase:auth");
            }
        });

        return () => data.subscription.unsubscribe();
    });
</script>

<Toaster position="top-center" />
{@render children?.()}
