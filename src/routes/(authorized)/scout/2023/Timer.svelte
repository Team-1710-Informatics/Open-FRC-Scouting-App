<script lang="ts">
    export let state:any & {
        time:number,
        started:boolean,
        start:number
    }

    let interval:NodeJS.Timer;
    function start(){
        state.start = Date.now();
        state.started = true;
        state.time = 153
        interval = setInterval(()=>{
            if(state.time > 0)
                state.time--;
            else
                clearInterval(interval);
        }, 1000);
    }

    $: if(interval && state.started == false) clearInterval(interval);

    function toTimer(seconds:number){
        if(seconds > 138) seconds -= 138;
        else if(seconds > 135) seconds -= 135;
        let min = Math.trunc(seconds/60);
        let sec = seconds - min*60;
        if(sec >= 10)
            return `${min}:${sec}`;
        else
            return `${min}:0${sec}`;
    }

    let h:number;
</script>

<div class="flex flex-row justify-center mt-10">
    {#if !state.started}
        <button style="width:150px; height:{h}px" on:click={start} class="bg-orange-400 bg-gradient-to-br from-orange-600 to-orange-400 text-lg border rounded border-orange-600 p-1 text-white">Start Match</button>
    {:else if state.time > 138}
        <div style="width:150px; height:{h}px" class="text-center text-lg bg-yellow-400 align-middle border rounded border-yellow-600 p-1"><p class="text-black font-bold">Auto</p></div>
    {:else if state.time > 135}
        <div style="width:150px; height:{h}px" class="text-center text-lg bg-red-400 align-middle border rounded border-red-600 p-1 text-white"><p class="text-black font-bold">Pause</p></div>
    {:else}
        <div style="width:150px; height:{h}px" class="text-center text-lg bg-green-500 align-middle border rounded border-green-700 p-1"><p class="font-bold">TeleOp</p></div>
    {/if}
    <p class = "bg-white border border-black rounded p-1 text-black font-extrabold text-xl px-1" bind:offsetHeight={h}>{toTimer(state.time)}</p>
</div>