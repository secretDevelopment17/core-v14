const Discord = require("discord.js")

module.exports = {
    name: "mock",
    aliases: [],
    description: "Use it so the bot can speak according to what you type and mock it",
    category: "Misc",
    run: async (client, message, args) => {
        let word = args.join(" ").split('').map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join('');
        if(!word) return message.channel.send(new Discord.EmbedBuilder().setDescription("<a:no:954773357407113298> | Please provide a message to say.").setColor(Discord.Colors.Red))

        message.delete()
        message.channel.send(word)    
    }
}