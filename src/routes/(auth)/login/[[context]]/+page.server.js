import { fail, redirect } from '@sveltejs/kit';
import crypto from 'node:crypto';
import { User } from '$lib/server/models';

export function load({ params }) {
    let data = {};
    switch(params?.context){
        case 'n': data.success = "Your account has been successfully created! Log in to get started.";break;
        case 'r': data.success = "Your password has been reset.";break;
    }
    return data;
}

export const actions = {
    login: async ({ request, cookies }) => {
        //Receive data from form
        const input = await request.formData();
        const data = {};
        ["username", "password"].forEach((item) => {data[item] = input.get(item);});

        //Server-side validation that data was entered
        ["username", "password"].forEach((item) => {
            if (data[item] === '') data.error = `${item[0].toUpperCase() + item.substring(1)} is required!`;
        });
        if(data?.error) {
            return fail(400, data);
        }

        const user = await User.findOne({ username:data.username });

        //Throw error if user does not exist
        if(!user){
            data.error = "Invalid username or password!";
            return fail(401, data);
        }

        //Hash password and compare
        let hash = user.password.salt + data.password;
        for(let i = 0; i < 1145; i++) hash = crypto.createHash('sha512').update(hash).digest("hex");

        if(hash != user.password.hash){
            data.error = "Invalid username or password!";
            return fail(401, data);
        }

        //Establish session
        let token = crypto.randomUUID();
        user.token = token;
        await user.save();

        cookies.set('session', token, {
            path: '/',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7
        });

        throw redirect(302, '/hub');
    }
}