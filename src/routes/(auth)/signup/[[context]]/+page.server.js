import { fail, redirect } from '@sveltejs/kit';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL, EMAIL_PASSWORD } from '$env/static/private';
import { Team, User } from '$lib/server/models';


export function load({ params }){
    let data = {};
    switch(params?.context){
        case 'verify-timeout': data.alert = "Your verification code timed out, so you will need to restart the account creation process.";break;
    }
    return data;
}

export const actions = {
    signup: async ({ request }) => {
        //Receive data from form
        const input = await request.formData();
        const data = {};
        ["email", "fname", "lname", "uname", "pass1", "pass2", "team", "auth"].forEach((item) => {data[item] = input.get(item);});

        //Server-side validation that data was entered
        const alias = {email:'Email',fname:"First name",lname:"Last name",uname:"Username",pass1:"Password",team:"Team",auth:"Authkey"};
        ["email", "fname", "lname", "uname", "pass1", "team", "auth"].forEach((item) => {
            if (data[item] === '') data.error = `${alias[item]} is required!`;
        });
        if(data?.error) { return fail(400, data); }

        //Make sure email is an email
        if(!detectEmail(data.email)){
            data.error = "Please use a valid email!";
            return fail(400, data);
        }

        //Make sure username is not an email
        if(detectEmail(data.uname)){
            data.error = "Username cannot be an email!";
            return fail(400, data);
        }

        //Username length
        if(data.uname.length < 3 || data.uname.length > 20){
            data.error = "Username must be 3-20 characters in length!";
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

        //Verify uniqueness
        const e = await User.findOne({ email:data.email });
        const u = await User.findOne({ username:data.uname })
        if(e){
            data.error = "Email already in use!";
        }else if(u){
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
        const key = await create(data);

        //Send verification email
        if(key) {
            const state = await email(data.email, key, data.fname).catch(console.error);
            if(state) data.success = "Success!";
            else{
                console.log("Email failure");
                await User.deleteOne({ email:data.email });
                data.error = "Something went wrong!";
            }
        } else data.error = "Something went wrong!";

        console.log("signed up")
        if(data?.success) throw redirect(307, `/verify/${data.uname}/s`);
        else {console.log("failure");return fail(500, data);}
    }
}

//Takes in mongo client and processed form data from signup action
async function create(data) {
    let salt = randstr(30);
    let hash = salt + data.pass1;
    for(let i = 0; i < 1145; i++) hash = crypto.createHash("sha512").update(hash).digest('hex');

    let key = Math.floor(Math.random() * 900000 + 100000);
    
    const result = new User({
        username: data.uname,
        email: data.email,
        name: {
            first: data.fname,
            last: data.lname
        },
        password: {
            hash: hash,
            salt: salt
        },
        credits: 100,
        team: +data.team,
        stats: { joined: Math.floor(Date.now()/1000) },
        preferences: { theme: "dark" },
        permissions: [],
        flags: { verification_key:key }
    });
    
    await result.save();

    return key;
}

async function email(email, key, fname){
    let transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        tls: {
            rejectUnauthorized: true
        },
        auth: {
            user: EMAIL,
            pass: EMAIL_PASSWORD
        }
    });

    let state = new Promise((resolve, reject) =>{
        transporter.verify(async function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
                
                transporter.sendMail({
                    from: `"Scouting" <${EMAIL}>`,
                    to: `${email}`,
                    subject: "Verify Scouting Account",
                    text: `Hello, ${fname}!\n\nThank you for signing up for Team 1710's Scouting App!\nYour verification code is ${key}`                }).then((res)=>{
                    console.log(res);
                    resolve(true);
                }).catch((err)=>{
                    console.error(err);
                    reject(false);
                });
            }
        });
    });

    return state;
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

function detectEmail(str) {return /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/.test(str);}