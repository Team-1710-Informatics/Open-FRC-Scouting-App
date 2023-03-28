<script>
    import tba from "$lib/modules/tba";
    import CompetitionSelector from "./CompetitionSelector.svelte";

    export let events = null;

    export let event;
    export let match=null;

    let matchID = {};
    let matches = null;

    async function load(event){
        if(event==null) {matches = null; return;}
        matches = "loading";
        const results = await tba(`event/${event}/matches`);

        matches = results;
    }

    function getMatch(level, number){
        if(matches === null){match=null;return;}
        let final = undefined;
        matches.forEach(m=>{
            const key = level==="sf"?"set_number":"match_number";
            if(m.comp_level===level&&m[key]==number){
                final = m;
            }
        })
        match = final;
    }

    $: load(event);
    $: if(matches!=="loading"){getMatch(matchID.level, matchID.number);};
</script>

<div>
    <div class="flex flex-row">
        <p class="mr-2">Event: </p>
        <CompetitionSelector bind:event={event} {events} watermark={false}/>
    </div>

    <div class="flex flex-row">
        <p class="mr-2">Match: </p>
        <div>
            <div class="grid grid-cols-2 w-full">
                <label for="level">
                    Level:
                </label>
                <select id="level" class="justify-self-end text-sm" style="width:105px;" bind:value={matchID.level}>
                    <option value="qm">Qualifier</option>
                    <option value="sf">Playoff</option>
                    <option value="f">Final</option>
                </select>
                
                <label for="set">
                    Number:
                </label>
                <!-- <NumberInput style="width:105px" bind:value={matchID.number}/> -->
                <input style="width:105px" type="number" min=1 bind:value={matchID.number}>
            </div>
        </div>
    </div>
    <p class="text-xs text-gray-400 text-center">Powered by <span class="font-bold">The Blue Alliance</span></p>
</div>

<style>
    /* Firefox */
    input[type=number] {
        -moz-appearance: initial;
    }
</style>