const discord = require("discord.js");
const config = require("./config.json");
const { KeyMongo } = require("key-mongo");
const mongoose = require("mongoose");

const lineReader = require('line-reader');
const nvt = require('node-virustotal');
const fs = require('fs');
const path = require('path');
const isMute = require("./database/Schema/isMute")
const Case = require("./database/Schema/Case")
require('./server.js');

const filePath = path.join(__dirname, 'antilink.txt');
let bannedUrls = [];

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
      console.error('Error reading dangurls.txt:', err);
      return;
  }
  bannedUrls = data.split(/\r?\n/).filter(url => url.trim() !== '');
  console.log('Banned URLs loaded:', bannedUrls);
});

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
client.cases = Math.random(1000).toString(36).substr(2, 8);
client.logsChannel = "954396398617501726"; 


mongoose.connect('mongodb+srv://athx:athx123@coredata.xyliwmo.mongodb.net/?retryWrites=true&w=majority', {
  serverSelectionTimeoutMS: 5000,
}).then(() => {
    client.logger.log(`> ✅ • Database server connected to MongoDB`, "success");
}).catch((err) => {
    client.logger.log(`> ❌ • Database server connected to MongoDB`, "error");
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

function containsBannedUrl(messageContent) {
  const normalizedMessage = messageContent.toLowerCase(); // Normalisasi ke huruf kecil

  // Mengecek setiap URL yang dilarang
  for (const bannedUrl of bannedUrls) {
      const normalizedBannedUrl = bannedUrl.toLowerCase();
      
      // Memeriksa jika URL ada dalam pesan
      if (normalizedMessage.includes(normalizedBannedUrl)) {
          return true; // Mengembalikan true jika ditemukan
      }
  }
  return false; // Mengembalikan false jika tidak ditemukan
}

client.on("messageCreate", async (message) => {

  if (containsBannedUrl(message.content)) {
    try {
        // Menghapus pesan jika mengandung URL yang terlarang
        await message.delete();

        // Mengirimkan embed peringatan ke channel
        const alertEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('⚠ Malicious Link Detected ⚠')
            .setDescription('A message containing a banned URL was detected and deleted.')
            .setFooter({ text: 'The link sent may be malicious. Don\'t try to open it.' })
            .setTimestamp();

        await message.channel.send({ embeds: [alertEmbed] });

        console.log(`Deleted a message containing a banned URL from ${message.author.tag}`);
    } catch (err) {
        console.error('Failed to delete message:', err);
    }
}

})

client.login(config.token).catch(() => { client.logger.log('Invaid TOKEN!', "warn") });

const express = require("express");
const http = require("http");
const app = express();
