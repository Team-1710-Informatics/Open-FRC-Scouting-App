import { fail, redirect } from '@sveltejs/kit';
import { User } from '$lib/server/models';

export async function load({ params }) {
    // Verify that account exists and is unverified
    const user = await User.findOne({ username:params.user });

    if(!user?.flags?.verification_key) { throw redirect(308, "/login"); }

    let elapsed = Math.floor(Date.now()/1000) - user.stats.joined;

    if(elapsed > 1800){
        await User.deleteOne({ username:params.user });
        throw redirect(308, '/signup/verify-timeout');
    }

    // Evaluate context
    let data = {};
    switch(params?.context){
        case 's': data.success = "Success! You have been sent an email containing a verification code.";break;
        case 'l': data.alert = `Please verify your email with the code that was sent to ${user.email}`;break;
    }

    return data;
}

export const actions = {
    verify: async ({ request, params })=>{
        const input = await request.formData();
        const key = input.get("key");
        const user = await User.findOne({ username:params.user });
        
        if(key == user?.flags?.verification_key){
            await user.update({$unset:{"flags.verification_key":1}})
            throw redirect(307, '/login/n');
        }else{
            return fail(401, {
                key:key,
                error:"Invalid code!"
            });
        }
    }
}