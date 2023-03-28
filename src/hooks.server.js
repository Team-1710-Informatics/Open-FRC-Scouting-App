import { MONGODB_MAIN } from '$env/static/private';

import mongoose from 'mongoose';
import { User } from '$lib/server/models';

import { redirect } from "@sveltejs/kit";

import { DateTime } from 'luxon';
import tba from '$lib/modules/tba';

await mongoose.connect(MONGODB_MAIN);

export async function handle({ event, resolve }) {
    const token = event.cookies.get("session");

    if(!token || event.url.pathname == "/logout") return await resolve(event);

    const user = JSON.parse(JSON.stringify(await User.findOne({ token:token })));

    if(token && !user) {
        throw redirect(307, "/logout");
    }

    let res = await tba(`team/frc${user.team}/events/${new Date().getFullYear()}`);
    
    let c = currComp(res);
    let n = nextComp(res);

    event.locals.user = {
        username: user.username,
        name: user.name,
        email: user.email,
        team: user.team,
        stats: user.stats,
        preferences: user.preferences,
        permissions: user.permissions
    }

    event.locals.competition = c;
    event.locals.nextCompetition = n;
    
    return await resolve(event);
}

function nextComp(res) {
    let next = null;
    let now = Date.now();
    res.forEach(e=>{
        if(timestamp(e.start_date, e.timezone)>now){
            if(next == null) next = e;
            else if(timestamp(next.start_date, e.timezone)>timestamp(e.start_date, e.timezone)) next = e;
        }
    });

    return next;
}

function currComp(res){
    let curr = null;
    let now = Date.now();
    res.forEach(e=>{
        if(timestamp(e.start_date, e.timezone) <= now && timestamp(e.end_date, e.timezone)+86400000 > now)
            curr = e;
    });

    return curr;
}

function timestamp(d, tz){
    let array = d.split("-");
    let n = DateTime.local(+array[0], +array[1], +array[2], { zone: tz });
    return n.toMillis();
}
