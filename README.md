# FIRST Robotics Scouting App
This is the scouting software developed and used by FIRST Robotics Team 1710 for the 2023 season.

### Features:
 - Designed for mobile devices
 - Match scouting UI that aims to intuitively reflect the game
 - Track piece intake, scoring, even dropping as a list of actions timed by user input
 - View statistics through a customizable table that can be exported as a csv file
 - Look up individual scouting entries

# Running your own instance

## Setting up MongoDB
This app uses MongoDB for storing data. Fortunately, MongoDB's free M0 cluster is more than enough for this.

All you need to do is sign up/in to [MongoDB](https://www.mongodb.com/) and create a new cluster. Remember your database user credentials.

If you know you'll be hosting the app from a single IP address, add that IP to the IP access list. Otherwise, add ```0.0.0.0/0```.

### Create your database
Once there, click 'Browse Collections' and then 'Create Database.'

You can name the database anything you want, but something like ```main``` will suffice. The collection name should be ```teams```.

Once created, click 'INSERT DOCUMENT' and add two properties:
 - An ```Int32``` named ```number``` with your team number as the value. If you're not associated with a team, you can use 0.
 - A ```String``` named ```authkey```. This will be the password required for users to sign up as part of your team, so keep it somewhere safe!

For example:

![image](https://user-images.githubusercontent.com/93231078/228636791-f639f4aa-9e5c-4fd4-8ee8-748e79a3b069.png)

If you'd like to share an instance with other teams, just insert another document with their team number!

### Find your connection string
Go back to your cluster and click 'Connect' > 'Connect your application.' Copy the connection string and paste it somewhere safe.

Be sure to add your database user password to the string. You'll also need to add the database name (e.g. ```main``` from before) following the last '/' in the string, so the end of the connection string should end up looking something like this:

```...mongodb.net/main?retryWrites=true&w=majority```

## Hosting your instance
You can build and host the app in any environment supporting Node.js, but in this guide we'll be using [Vercel](https://vercel.com).

### Copy this repository
First, you'll need to get a copy of this repository onto your GitHub account. This can easily be done by clicking "fork" in the top right, although it doesn't matter how you do it.

### Sign into Vercel and create a project
Like MongoDB, Vercel's free tier is more than enough for the app. Create a free account and create a new project by importing your repository from GitHub.

Give the project a unique, but relevant name, and change the 'Output Directory' from ```public``` to ```.svelte-kit```.

## Adding Environment Variables
If you're using Vercel, you can configure the environment variables from your project. Otherwise, you can add them to the code in a new file called ```.env``` in the base directory. If you do it this way, just make sure the ```.env``` file isn't publicly visible.

These are the needed environment variables:
```
MONGODB_MAIN="<your modified connection string from earlier>"
X_TBA_AUTHKEY="<your auth key from thebluealliance.com>"
PUBLIC_HOST="https://<the host your instance is being served from>"
```

### X_TBA_AUTHKEY
Some parts of the app use [The Blue Alliance](https://thebluealliance.com)'s API. You can get an auth key by signing into The Blue Alliance and going to your account page.

### PUBLIC_HOST
This is the host serving the app. If you're using Vercel, set it to ```https://{your project name}.vercel.app```. If your project name is't unique enough, it may be served to a slightly different address, in which case you can go back and change it once you know the address.

If you're hosting the app locally, you should format it as ```http://localhost:5173```.

On Vercel, once you set your environment variables, you can click 'Deploy,' and if everything has gone right so far, you'll be good to go!

If hosting elsewhere, you may have to compile the project on your own. Assuming npm is installed, this can be done by running ```npm i``` followed by ```npm run build``` in the project directory.
