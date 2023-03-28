import tba from '$lib/modules/tba';
import { DateTime } from 'luxon';

export async function load({ locals }){
    const data = await tba(`team/frc${locals.user.team}/events/${new Date().getFullYear()}`);

    function timestamp(d, tz){
        let array = d.split("-");
        let n = DateTime.local(+array[0], +array[1], +array[2], { zone: tz });
        return n.toMillis();
    }

    let events = [];
    data.forEach(event=>{
        events.push({
            name: event.name,
            date: timestamp(event.start_date, event.timezone),
            end: timestamp(event.end_date, event.timezone)
        });
    });

    return {
        events: events,
        permissions: locals.user.permissions,
        user: locals.user.name.first,
        team: locals.user.team
    };
}