<script>
    import MatchSelector from "$lib/components/search/MatchSelector.svelte";
    import {teamScore, gridLayout} from "../spreadsheet/[event]/statistics";
    import StarRating from "$lib/components/ui/StarRating.svelte";
    import cube from "$lib/assets/scout/2023/cube.png";
    import cone from "$lib/assets/scout/2023/cone.png";
    import TeamSelector from "$lib/components/search/TeamSelector.svelte";
    import { PUBLIC_HOST } from "$env/static/public";

    export let data;
    
    let match = null;

    let team = null;

    function getYTlink(match){
        for(let i = 0; i < match.videos.length; i++){
            if(match.videos[i].type=="youtube"){
                return "https://youtube.com/watch?v="+match.videos[i].key;
            }
        }

        return false;
    }
</script>

<center class="pt-5">
    <p class="text-xl font-bold">Find match</p>
    <div class="box">
        <MatchSelector 
            event={data.competition?.key??null} 
            events={data.events} 
            bind:match={match} 
        />
    </div>
    <hr class="w-3/4 sm:w-1/2 my-3">
    {#if match}
        <TeamSelector {match} bind:team={team}/>

        {#if match.videos.length > 0}
            <a href={getYTlink(match)}><button class="submit my-2">Watch match</button></a>
        {/if}

        {#if team}
            <br>
            {#await fetch(`${PUBLIC_HOST}/internal/data/${match.event_key}/${match.match_number}/${team}`)}
                <p>Loading...</p>
            {:then res}{#await res.json() then res}
                {#each res.data as entry}
                    <middle class="box m-6">
                        <p>Scouted by <span class="font-bold">{entry.scout}</span></p>
                        <p>Approx. Scouted score: {teamScore(entry)}</p>
                        <div class="w-fit"><StarRating rating={entry.postgame.rating}/></div>
                        {#if entry.postgame?.driverSkill}
                            <div class="w-fit"><StarRating rating={entry.postgame.driverSkill}/></div>
                        {/if}
                        {#if entry.postgame.thoughts}<p>Scout thoughts: {entry.postgame.thoughts}</p>{/if}
                        <div class="flex flex-row items-middle gap-2">
                            <div class="grid grid-cols-9">
                                {#each gridLayout(entry) as row}
                                    {#each row as node}
                                        <div class="w-8 h-8 border-white border">
                                            {#if node==="cube"}
                                                <img src={cube}/>
                                            {:else if node==="cone"}
                                                <img src={cone}/>
                                            {/if}
                                        </div>
                                    {/each}
                                {/each}
                            </div>
                            <!-- <Starting alliance={entry.alliance} value={entry.pregame.start} display={true}/> -->
                        </div>
                        <!-- <p class="text-xs">{JSON.stringify(entry)}</p> -->
                    </middle>
                {:else}
                    <p class="opacity-50">No entries found</p>
                {/each}
            {/await}{/await}
        {/if}
    {/if}

</center>

