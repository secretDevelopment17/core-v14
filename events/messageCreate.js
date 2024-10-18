const discord = require("discord.js");
const config = require("../config.json");
const lineReader = require("line-reader");
const nvt = require('node-virustotal');
const isMute = require("./../database/Schema/isMute");
const Case = require("./../database/Schema/Case");
const path = require('path');
const fs = require('fs');
const filePath = path.resolve(__dirname, '../../dangurls.txt');
let dangerousUrls = [];

fs.readFile(dangerousUrlsPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading dangerous URLs file:', err);
        return;
    }
    dangerousUrls = data.split('\n').map(url => url.trim()).filter(Boolean); // Memastikan tidak ada baris kosong
    console.log('Dangerous URLs loaded:', dangerousUrls);
});

module.exports = async (client, message) => {
    
    let prefix = client.config.prefix;
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmda = args.shift().toLowerCase();
    let command = client.commands.get(cmda) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmda));
    if (!command) return;

    try {
        command.run(client, message, args)
    } catch (error) {
        client.logger.log(error, "error");
        message.reply({ content: `there was an error trying to execute that command!` });
    } finally {
        client.logger.log(`> ID : ${message.author.id} | User : ${message.author.tag} | command | ${command.name}`, "info");
    }


    //Anti-link feature
    const messageContent = message.content.toLowerCase();
    const detectedUrl = dangerousUrls.find(url => messageContent.includes(url));

    if (detectedUrl) {
        // Jika link berbahaya terdeteksi, hapus pesan dan berikan peringatan
        message.delete()
            .then(() => {
                message.channel.send(`${message.author}, your message contained a dangerous link and has been removed.`);
            })
            .catch(err => console.error('Failed to delete message:', err));
    }
};
