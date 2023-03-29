<script>
    import CompetitionSelector from "$lib/components/search/CompetitionSelector.svelte";

    export let data;
</script>

<center class="pt-10">
    <div class="box">
        <h6>Competition</h6>
        <CompetitionSelector events={data.events} bind:event={data.competition} />
    </div>
    <br>
    <a disabled={!data.competition} href="./2023/spreadsheet/{data.competition}"><button disabled={!data.competition}>Spreadsheet</button></a>
    <a disabled={!data.competition} href="./2023/entries/{data.competition}"><button disabled={!data.competition}>Database</button></a>
</center>