const Discord = require("discord.js")

module.exports = {
    name: "mock",
    aliases: [],
    description: "Use it so the bot can speak according to what you type and mock it",
    category: "Fun",
    run: async (client, message, args) => {
        let word = args.join(" ").split('').map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join('');
        if(!word) return message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setDescription("<a:no:954773357407113298> | <a:no:954773357407113298> | Please provide a message to mock")
                    .setColor(Discord.Colors.Red)
            ]
        });

        message.delete()
        message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                .setColor(client.config.color)
                .setDescription(`${word} <:mock:1289189326072184875>`)
                .setThumbnail("https://media.discordapp.net/attachments/954184065400070214/1289273072997629962/Untitled_design.png?ex=66f8389e&is=66f6e71e&hm=daabcdc1ae5d3f23b3783447a2ff4174651f068587f164191c2948b71c58daab&=&format=webp&quality=lossless&width=160&height=160")
                .setAuthor({
                    name: `${message.author.globalName}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true})
                })
                .setTimestamp()
            ]
        })    
    }
}