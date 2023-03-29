import { fail, redirect } from '@sveltejs/kit';
import crypto from 'node:crypto';
import { Team, User } from '$lib/server/models';

export const actions = {
    signup: async ({ request }) => {
        //Receive data from form
        const input = await request.formData();
        const data = {};
        ["fname", "lname", "uname", "pass1", "pass2", "team", "auth"].forEach((item) => {data[item] = input.get(item);});

        //Server-side validation that data was entered
        const alias = {fname:"First name",lname:"Last name",uname:"Username",pass1:"Password",team:"Team",auth:"Authkey"};
        ["fname", "lname", "uname", "pass1", "team", "auth"].forEach((item) => {
            if (data[item] === '') data.error = `${alias[item]} is required!`;
        });
        if(data?.error) { return fail(400, data); }

        //Username length
        if(data.uname.length < 3 || data.uname.length > 20){
            data.error = "Username must be 3-20 characters in length!";
            return fail(400, data);
        }

        if(data.uname.includes(" ")){
            data.error = "Username must not include spaces!";
            return fail(400, data);
        }

        //Password length
        if(data.pass1.length < 8){
            data.error = "Password must be at least 8 characters long!";
            return fail(400, data);
        }

        //Check passwords
        if(data.pass1 != data.pass2){
            data.error = "Passwords don't match!";
            return fail(400, data);
        }

        const u = await User.findOne({ username:data.uname })
        if(u){
            data.error = "Username already in use!";
        }
        if(data?.error) { return fail(400, data); }
        
        //Check team authkey
        const team = await Team.findOne({ number:+data.team });
        if(!team || team?.authkey != data.auth){
            data.error = "Invalid authkey!";
            return fail(400, data);
        }

        //Create account
        await create(data);

        throw redirect(307, `/login/n`);
    }
}

//Takes in mongo client and processed form data from signup action
async function create(data) {
    let salt = randstr(30);
    let hash = salt + data.pass1;
    for(let i = 0; i < 1145; i++) hash = crypto.createHash("sha512").update(hash).digest('hex');
    
    const result = new User({
        username: data.uname,
        name: {
            first: data.fname,
            last: data.lname
        },
        password: {
            hash: hash,
            salt: salt
        },
        credits: 1000,
        team: +data.team,
        stats: { joined: Math.floor(Date.now()/1000) },
        preferences: { theme: "dark" },
        permissions: [],
        flags: {}
    });
    
    await result.save();
}

function randstr(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}