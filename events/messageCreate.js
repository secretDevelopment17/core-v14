const discord = require("discord.js");
const config = require("../config.json");
const lineReader = require("line-reader");
const nvt = require('node-virustotal');
const isMute = require("./../database/Schema/isMute");
const Case = require("./../database/Schema/Case");
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, './../antilink.txt');
let bannedUrls = [];

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
      console.error('Error reading dangurls.txt:', err);
      return;
  }
  bannedUrls = data.split(/\r?\n/).filter(url => url.trim() !== '');
  console.log('Banned URLs loaded:', bannedUrls);
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

    if (containsBannedUrl(message.content)) {
        try {
            // Menghapus pesan jika mengandung URL yang terlarang
            await message.delete();
    
            // Mengirimkan embed peringatan ke channel
            const alertEmbed = new discord.EmbedBuilder()
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
};
