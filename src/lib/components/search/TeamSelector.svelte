<script>
    import { slide } from "svelte/transition";

    export let match;
    export let alliance;
    export let team;

    export let disabled = false;

    const MATCH_KEY_REGEX = /\d{4}\w+_(q|sf\d{1,2}|f\d)m\d+/;
</script>

{#if MATCH_KEY_REGEX.test(match.key)} 
    <div transition:slide class="grid grid-cols-1 gap-0 w-fit" class:opacity-50={disabled}>
        {#each ["red","blue"] as all}
            <div class={`grid grid-cols-3 w-fit p-2 pb-3 gap-1 ${all==="red"?"bg-red-500 rounded-t-lg":"bg-blue-500 rounded-b-lg"}`}>
                {#each match.alliances[all].team_keys as t}
                    <div class="relative w-14 h-8">
                        <button {disabled} on:click={()=>{team=+t.substring(3);alliance=all}} 
                            style={+t.substring(3)==team&&all==alliance?"top:4px":"box-shadow: 0px 4px black"} 
                            class={`font-bold left-0 w-14 h-8 absolute bg-none border-none rounded-none ${all=="red"?"bg-red-700":"bg-blue-700"}`}
                        >
                            {t.substring(3)}
                        </button>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
{/if}
