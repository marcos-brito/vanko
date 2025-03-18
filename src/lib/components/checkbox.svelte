<script lang="ts">
    import { Label } from "$lib/components/ui/label/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox";

    interface Props {
        label: string;
        checked: boolean;
    }

    let { label, checked = $bindable() }: Props = $props();
</script>

<div class="flex gap-2 items-center">
    <Checkbox id={label} aria-labelledby={`${label}-label`} bind:checked />
    <Label id={`${label}-label`} for={label} class="text-sm">
        {label}
    </Label>
</div>
