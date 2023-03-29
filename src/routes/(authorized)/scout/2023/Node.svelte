<script>
    import input from "$lib/assets/icons/input.svg";
    import { inv, nextID } from "./Inventory.svelte";
    import cube from "$lib/assets/scout/2023/cube.png";
    import cone from "$lib/assets/scout/2023/cone.png";
    const imgs={"c":cube,"^":cone,"h":input};

    export let meta;
    export let type;
    export let size;
    export let log;
    export let location;
    export let take;
    export let state;

    function logPlacement(type){
        if(take){
            log.push({
                time:Date.now(),
                action:"intake",
                type:type,
                location:location,
                id: nextID()
            })

            log = log;
            take = false;
            return;
        }
        let n=0;
        $inv.forEach(i=>{
            if(i.type==type) n = i.id;
        })
        log.push({
            time:Date.now(),
            action:"place",
            type:type,
            node:location,
            id:n
        })
        log = log
    }

    $: full = (()=>{
        let res = false;
        log.forEach(l=>{
            if(l.action==="place")
                if(l.node === location)
                    res = l.type;
            if(l.action==="intake"&&l.location===location)
                res = false;
        })
        return res;
    })();

    $: available = (()=>{
        let res = {'c':false,'^':false}
        $inv.forEach(item=>{
            if(item.type=="cube") res['c'] = true;
            if(item.type=="cone") res['^'] = true;
        })
        return res;
    })();
</script>

<div class="text-center border-x-4 border-transparent relative" style="width:{size}px; height:{size}px"
    class:bg-gray-300={type==="c"}

    class:border-x-white={type!=="^"}
    class:border-x-black={type==="^"}
    class:border-x-2={type==="^"}
    class:border-y-black={type==="^"||type=="c"}
    class:border-y={type==="^"||type=="c"}
    class:border-opacity-25={type==="^"}

    class:bg-red-700={type==="^"&&meta.alliance==="red"} 
    class:bg-blue-700={type==="^"&&meta.alliance==="blue"}
    class:bg-slate-900={location==3||location==5||location==12||location==14}
>
<!-- {#if type=="^"}
    <div class="rounded-full bg-gray-500 absolute" style="top:{(size/2)-6}px; left:{(size/2)-6}px; width:8px; height:8px" />
{/if} -->
    {#if type != "h"}
        <button disabled={!state.started} on:click={()=>{logPlacement(type=="c"?"cube":"cone")}} class="p-0 bg-none border-none w-full h-full grid justify-items-center items-center">
            <!-- <img class="{type==="c"?"purple":type==="^"?"yellow":""}" width={(size/3)*2}px src={input} alt="place" /> -->
            <img class:green={take} class:opacity-100={full||take} class:opacity-40={!full && available[type] && !take} class:opacity-5={!full && !available[type] && !take} width={(size/3)*2}px src={imgs[type]} alt="place" />
        </button>
    {:else}
        <div class="w-full h-full grid grid-cols-2 relative">
            <!-- <img class="{type==="c"?"purple":type==="^"?"yellow":""}" width={(size/3)*2}px src={input} alt="place" /> -->
            <button disabled={!state.started} on:click={()=>{logPlacement("cone")}} class="p-0 bg-none border-none absolute self-end" style="width:{size/2}px;">
                <img class="w-full" class:green={take} class:opacity-100={full=="cone"||take} class:opacity-40={!full&&available['^']&&!take} class:opacity-5={((!(full=="cone")&&!available['^'])||full=="cube")&&!take} src={cone} alt="place" />
            </button>
            <button disabled={!state.started} on:click={()=>{logPlacement("cube")}} class="p-0 bg-none border-none absolute justify-self-end" style="width:{size/2}px;">
                <img class="w-full" class:green={take} class:opacity-100={full=="cube"||take} class:opacity-40={!full&&available['c']&&!take} class:opacity-5={((!(full=="cube")&&!available['c'])||full=="cone")&&!take} src={cube} alt="place" />
            </button>
        </div>
    {/if}
</div>

<style>
    .purple{
        filter: brightness(0) saturate(100%) invert(23%) sepia(68%) saturate(1410%) hue-rotate(227deg) brightness(86%) contrast(93%);
    }

    .yellow{
        filter: brightness(0) saturate(100%) invert(67%) sepia(87%) saturate(681%) hue-rotate(349deg) brightness(103%) contrast(98%);
    }

    .green{
        filter: brightness(0) saturate(100%) invert(67%) sepia(53%) saturate(7278%) hue-rotate(93deg) brightness(110%) contrast(119%);
    }
</style>