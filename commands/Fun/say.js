const Discord = require("discord.js")

module.exports = {
    name: "say",
    aliases: [],
    description: "Use it so the bot can speak according to what you type",
    category: "Fun",
    run: async (client, message, args) => {
        let word = args.join(" ")
        if(!word) return message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setDescription("<a:no:954773357407113298> | <a:no:954773357407113298> | Please provide a message to say")
                    .setColor(Discord.Colors.Red)
            ]
        });

        message.delete()
        message.channel.send(word)    
    }
}