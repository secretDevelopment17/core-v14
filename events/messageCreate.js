const discord = require("discord.js");
const config = require("../config.json");

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
};
