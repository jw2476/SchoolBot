# School Bot

By Jack Whitehorn

# Setup

The project is split up into two parts, the frontend (the part you see), 
and the backend (the bit that handles database calls and the API). For School Bot to work, both must be running.

## Backend

```shell
cd backend
yarn # Install Dependencies
cp .env.example .env # Make a copy of the .env file to store secrets
nano .env # Edit the .env file adding your secrets and tokens
yarn dev # Run
```

### .env File Breakdown

CLIENT_ID: Discord Application Client ID

CLIENT_SECRET: Discord Application Client Secret

GUILD_ID: The ID of the Discord server/ guild you want to bot to be in

BOT_TOKEN: The token of the Discord bot

## Frontend

```shell
cd frontend
yarn # Install dependencies
yarn dev # Run
```

## MongoDB
The project requires a local MongoDB instance to be running, and have a database called school.
Because of all the different platforms, I'm just going to link to a guide on how to install MongoDB Server and Compass 
(a nice GUI for connecting to MongoDB)

[MongoDB Server](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials)

[MongoDB Compass](https://docs.mongodb.com/compass/current/install)