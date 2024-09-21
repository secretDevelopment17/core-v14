const discord = require("discord.js");
const config = require("./config.json");
const { KeyMongo } = require("key-mongo");
const mongoose = require("mongoose");
require('./server.js');

const client = new discord.Client({
    closeTimeout: 3_000 ,
    waitGuildTimeout: 15_000,
    intents: [discord.GatewayIntentBits.Guilds, discord.GatewayIntentBits.GuildMessages, discord.GatewayIntentBits.GuildMembers, discord.GatewayIntentBits.MessageContent],
    allowedMentions: {
        parse: ["users"],
        repliedUser: true
    },
    sweepers: {
		...discord.Options.DefaultSweeperSettings,
		messages: {
			interval: 3600, // Every hour...
			lifetime: 1800,	// Remove messages older than 30 minutes.
		},
	},
});

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.config = config;
client.logger = require('./Utils/logger');
client.mongo = new KeyMongo({
    dbName: "data",
    dbUrl:
      "mongodb+srv://athx:athx123@coredata.xyliwmo.mongodb.net/?retryWrites=true&w=majority",
    collectionName: "core"
  });

mongoose.connect('mongodb+srv://athx:athx123@coredata.xyliwmo.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});
mongoose.connection.on('error', err => {
  console.error(`Mongoose connection error: ${err}`);
});


["commands", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on('error', error => client.logger.log(error.stack, "error"));
client.on('warn', info => client.logger.log(info, "warn"));
process.on('unhandledRejection', error => client.logger.log("UNHANDLED_REJECTION\n" + error.stack, "error"));
process.on('uncaughtException', error => {
    client.logger.log("UNCAUGHT_EXCEPTION\n" + error.stack, "error");
    client.logger.log("Uncaught Exception is detected, restarting...", "info");
    process.exit(1);
});

client.login(config.token).catch(() => { client.logger.log('Invaid TOKEN!', "warn") });

const express = require("express");
const http = require("http");
const app = express();
