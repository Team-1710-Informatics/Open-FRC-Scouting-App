import { redirect } from '@sveltejs/kit';
import { User } from '$lib/server/models';

export async function load ({ cookies }) {
    const token = cookies.get("session");
    if(token){
        cookies.set('session', '', {
            path: '/',
            expires: new Date(0),
        });
    }

    const user = await User.findOne({ token:token });
    if(user){
        user.token = undefined;
        await user.save();
    }

    throw redirect(302, '/login');
}