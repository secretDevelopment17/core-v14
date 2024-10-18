const discord = require("discord.js");
const config = require("./config.json");
const { KeyMongo } = require("key-mongo");
const mongoose = require("mongoose");

const lineReader = require('line-reader');
const nvt = require('node-virustotal');
const isMute = require("./database/Schema/isMute")
const Case = require("./database/Schema/Case")
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

client.on("message", async (message) => {

  let j = 0;

function isValidURL(string) {
    const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return res !== null;
}

if (isValidURL(message.content.toLowerCase()) === true) {
    const a = message.id;

    lineReader.eachLine('antilink.txt', (line, last) => {
        if (
            message.content.toLowerCase().startsWith('https://www.' + line) ||
            message.content.toLowerCase().startsWith('http://www.' + line) ||
            message.content.toLowerCase().startsWith(line) ||
            message.content.toLowerCase().startsWith('http://' + line) ||
            message.content.toLowerCase().startsWith('https://' + line)
        ) {
            message.channel.messages.fetch(a).then((msg) => msg.delete());

            const linksEmbed = new discord.EmbedBuilder()
                .setColor('#E7A700')
                .setTitle('⚠ Malicious link detected ⚠')
                .setFooter({ text: 'The link sent may be malicious. Don\'t try to open it.' });

            const author = client.user.tag;
            const reason = 'Posted malicious link detected';
            const member = message.author;

            const logsLinkEmbed = new discord.EmbedBuilder()
                .setColor(discord.Colors.Red)
                .setAuthor({ name: `Auto-Muted | Case ${client.cases}`, iconURL: 'https://cdn.discordapp.com/emojis/742191092652310578.png?v=1' })
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 4096 }))
                .addFields(
                    { name: 'Muted User', value: `${member} | \`${member.id}\`` },
                    { name: 'Moderator', value: `${author}` },
                    { name: 'Reason', value: `\`\`\`\n${reason}\n\`\`\`` },
                    { name: 'Timestamp', value: `**\`\`\`css\n${new Date(message.createdTimestamp).toString()}\n\`\`\`**` }
                )
                .setTimestamp();

            const userEmbed = new discord.EmbedBuilder()
                .setAuthor({ name: `${message.guild.name} Auto-Muted | Case ${client.cases}`, iconURL: message.guild.iconURL() })
                .setColor('#2f3136')
                .setDescription(`You have been auto-muted on **${message.guild.name}**`)
                .addFields(
                    { name: 'Reason', value: `\`\`\`${reason}\`\`\`` },
                    { name: 'Moderator', value: `${author}` }
                )
                .setFooter({ text: 'If this is a mistake, please DM our staff.' })
                .setTimestamp();

            const alertEmbed = new discord.EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({ name: 'Malicious link detected', iconURL: 'https://cdn.discordapp.com/emojis/590433107111313410.gif' })
                .setDescription(`> Message ID: \`${message.id}\`\n> Channel: ${message.channel}\n> Author: ${member} | \`${member.id}\``)
                .addFields({ name: 'Content:', value: `|| ${message.content} ||` })
                .setFooter({ text: 'Don\'t try to open it.' })
                .setTimestamp();

            const channel = message.guild.channels.cache.find((ch) => ch.name === '🚫┇automod');
            if (channel) channel.send({ embeds: [alertEmbed] });

            message.member.roles.add('954378331401367572');
            client.users.cache.get(member.id).send({ embeds: [userEmbed] });
            bot.channels.cache.get(client.logsChannel).send({ embeds: [logsLinkEmbed] });

            isMute.create({
              userID: member.id,
              isMuted: true
            });
            Case.create({
              caseID: client.cases,
              userID: member.id,
              globalName: member.user.globalName,
              modType: "Auto-Mute",
              moderator: author.id,
              reason: reason
            });


            message.channel.send(`${message.author}`).then(() => {
                message.channel.send({ embeds: [linksEmbed] });
            }).catch(() => {
                message.reply('An error occurred.');
            });

            j++;
            return false;
        }
    });
}

if (j > 0) {
    const defaultTimedInstance = nvt.makeAPI();
    defaultTimedInstance.domainLookup(message.content.toLowerCase(), (err, res) => {
        if (err) {
            console.log('Virustotal API did not work because:');
            console.log(err);
            return;
        }
        const road = JSON.parse(res);
        if (road.data.attributes.last_analysis_results.Kaspersky.result !== 'clean') {
            const linksEmbed = new discord.EmbedBuilder()
                .setColor('#E7A700')
                .setTitle(`⚠ This link is ${road.data.attributes.last_analysis_results.Kaspersky.result.toUpperCase()} ⚠`)
                .setFooter({ text: 'The link sent may be malicious. Don\'t try to open it.' });

            const author = client.user.tag;
            const reason = 'Posted malicious link detected';
            const member = message.author;

            const logsLinkEmbed = new discord.EmbedBuilder()
                .setColor(discord.Colors.Red)
                .setAuthor({ name: `Auto-Muted | Case ${client.cases}`, iconURL: 'https://cdn.discordapp.com/emojis/742191092652310578.png?v=1' })
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 4096 }))
                .addFields(
                    { name: 'Muted User', value: `${member} | \`${member.id}\`` },
                    { name: 'Moderator', value: `${author}` },
                    { name: 'Reason', value: `\`\`\`\n${reason}\n\`\`\`` },
                    { name: 'Timestamp', value: `**\`\`\`css\n${new Date(message.createdTimestamp).toString()}\n\`\`\`**` }
                )
                .setTimestamp();

            const userEmbed = new discord.EmbedBuilder()
                .setAuthor({ name: `${message.guild.name} Auto-Muted | Case ${client.cases}`, iconURL: message.guild.iconURL() })
                .setColor('#2f3136')
                .setDescription(`You have been auto-muted on **${message.guild.name}**`)
                .addFields(
                    { name: 'Reason', value: `\`\`\`${reason}\`\`\`` },
                    { name: 'Moderator', value: `${author}` }
                )
                .setFooter({ text: 'If this is a mistake, please DM our staff.' })
                .setTimestamp();

            const alertEmbed = new discord.EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({ name: 'Malicious link detected', iconURL: 'https://cdn.discordapp.com/emojis/590433107111313410.gif' })
                .setDescription(`> Message ID: \`${message.id}\`\n> Channel: ${message.channel}\n> Author: ${member} | \`${member.id}\``)
                .addFields({ name: 'Content:', value: `|| ${message.content} ||` })
                .setFooter({ text: 'Don\'t try to open it.' })
                .setTimestamp();

            const channel = message.guild.channels.cache.find((ch) => ch.name === '🚫┇automod');
            if (channel) channel.send({ embeds: [alertEmbed] });

            message.member.roles.add('954378331401367572');
            client.users.cache.get(member.id).send({ embeds: [userEmbed] });
            bot.channels.cache.get(client.logsChannel).send({ embeds: [logsLinkEmbed] });

            isMute.create({
              userID: member.id,
              isMuted: true
          });
            Case.create({
              caseID: client.cases,
              userID: member.id,
              globalName: member.user.globalName,
              modType: "Auto-Mute",
              moderator: author.id,
              reason: reason
            });


            message.channel.send(`${message.author}`).then(() => {
                message.channel.send({ embeds: [linksEmbed] });
            }).catch(() => {
                message.reply('An error occurred.');
            });
        }
    });
}

})

client.login(config.token).catch(() => { client.logger.log('Invaid TOKEN!', "warn") });

const express = require("express");
const http = require("http");
const app = express();
