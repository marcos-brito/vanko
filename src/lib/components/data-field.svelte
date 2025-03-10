<script lang="ts">
    interface Props {
        label: string;
        value: string | Date | undefined;
    }

    let { label, value = $bindable() }: Props = $props();

    if (value instanceof Date) {
        const options = { year: "numeric", month: "numeric", day: "numeric" };

        value = value.toLocaleDateString("pt-BR", options);
    }
</script>

<div class="flex flex-col gap-3">
    <p class="opacity-70 first-letter:capitalize">{label}</p>
    <p>{value ? value : "---"}</p>
</div>
