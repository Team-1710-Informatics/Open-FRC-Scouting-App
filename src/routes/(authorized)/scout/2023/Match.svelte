<script>
    import Inventory from "./Inventory.svelte";
    import Grid from "./Grid.svelte";
    import Timer from "./Timer.svelte";
    import Questions from "./Questions.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let meta;
    export let pregame;
    export let game={};

    let log = [];
    let untimed={};

    $: answered = (()=>{
        let res=true;
        ["mobile","dockedAuto","engageAuto","dockedMatch","engageMatch","parked"].forEach(q=>{
            if(untimed?.[q]==null) res = false;
        })
        return res;
    })();

    if(pregame.preload != "none"){
        log.push({
            time:-1,
            action:"intake",
            type:pregame.preload,
            location:"preload",
            id: -1
        })

        log = log;
    }

    function undo(){
        if(log.length == 1){
            if(log[0].time == -1){
                state.start=0;
                state.time=0;
                state.started=false;
                return;
            }
        }else if(log.length == 0){
            state.start=0;
            state.time=0;
            state.started=false;
            return;
        }
        log.pop();
        log = log;
    }

    let state = {
        time: 0,
        started: false,
        start: 0
    }
</script>

<h5>Scouting {meta.team}</h5>
<Timer bind:state={state} /><br>
<Inventory bind:log={log} bind:state={state} />
<Grid bind:log={log} {meta} bind:state={state}/> <br>
<Questions bind:state={state} bind:answers={untimed} />
<div class="py-2"/>
<button on:click={()=>{
        log.forEach(l=>{
            delete l.id
            if(l.action == "place"){
                l.node={
                    x:l.node % 9,
                    y:Math.trunc(l.node/9)
                }
            }
            if(l.action == "intake" && typeof l.location == "number"){
                l.location={
                    x:l.location % 9,
                    y:Math.trunc(l.location/9)
                }
            }
        })
        console.log(log);
        game = {
            start:state.start,
            actions:log,
            untimed:untimed
        }
        dispatch("advance");
    }} 
    class="submit my-2" disabled={!(state.started&&state.time==0)||!answered}
>
    {(state.started&&state.time==0)?"Next":(state.started)?state.time:"Next"}
</button>

<button disabled={!state.started} on:click={undo} class="fixed top-0 right-0 bg-gradient-to-bl border-red-700 from-red-600 to-red-400">
    Undo
</button>