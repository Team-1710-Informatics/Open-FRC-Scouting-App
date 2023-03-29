import tba from "$lib/modules/tba";

export async function load({params}){
    const events = await tba(`events/2023`);

    return { events, competition:params.event };
}