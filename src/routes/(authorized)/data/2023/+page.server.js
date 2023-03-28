import tba from "$lib/modules/tba";

export async function load({locals}){
    const events = await tba(`events/2023`);

    return { events, competition:locals.competition };
}