import mongoose from 'mongoose';
const { Schema } = mongoose;

mongoose.set('strictQuery', false);

const user = new Schema({
    username: String,
    name: {
        first: String,
        last: String
    },
    password: {
        hash: String,
        salt: String
    },
    credits: Number,
    team: Number,
    stats: {},
    preferences: {},
    permissions: [],
    flags: {},
    token: String,
    status: String,
});

export const User = mongoose.model("User", user);

const team = new Schema({
    number: Number,
    authkey: String
});

export const Team = mongoose.model("Team", team);

const scoutEntry2023 = new Schema({
    event: {type: String, match:/(\d{4})\w+/},
    match: Number,
    alliance: {type: String, match:/red|blue/},
    team: Number,
    scout: String,
    pregame: {
        start: {x:Number,y:Number},
        preload: {type:String, match:/cube|cone|none/}
    },
    game:{
        start:Number,
        actions: Array,
        untimed: {
            mobile: Boolean,
            dockedAuto: Boolean,
            engageAuto: Boolean,
            dockedMatch: Boolean,
            engageMatch: Boolean,
            parked: Boolean
        }
    },
    postgame:{
        strategy:Array,
        rating: {type: Number, min: 0, max: 10},
        driverSkill: {type: Number, min: 0, max: 10},
        thoughts: String
    }
},{
    virtuals:{
        placements:{
            get(){
                let med = this.game.actions.filter((i)=>{
                    return i.action === "place";
                });
                return med.length;
            }
        }
    },
    toJSON: { virtuals: true }
});

export const ScoutData = mongoose.model("2023entry", scoutEntry2023);

const transaction = new Schema({
    user:String,
    amount:Number,
    reason:String,
    time:Number
});

export const Transaction = mongoose.model("Transaction", transaction);