const Discord = require("discord.js")

module.exports = {
    name: "say",
    aliases: [],
    description: "Use it so the bot can speak according to what you type",
    category: "Misc",
    run: async (client, message, args) => {
        let word = args.join(" ")
        if(!word) return message.channel.send(new Discord.EmbedBuilder().setDescription("<a:no:954773357407113298> | Please provide a message to say.").setColor("RED"))

        message.delete()
        message.channel.send(word)    
    }
}