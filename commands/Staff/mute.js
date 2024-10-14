const Discord = require("discord.js")

module.exports = {
    name: "mute",
    aliases: ["timeout"],
    description: "Mute member",
    category: "Staff",
    run: async (client, message, args) => {
        if(!message.member.permissions.has('MUTE_MEMBERS') && !message.member.roles.cache.some((r) => r.name === "Moderator")) {
            return message.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription("<a:no:954773357407113298> | I'm sorry but you don't have permission to do that.")
                        .setColor(Discord.Colors.Red)
                ]
            });
        }

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setDescription("<a:no:954773357407113298> | You need to specify a user to mute.")
                    .setColor(Discord.Colors.Red)
            ]
        });

        let muteRole = message.guild.roles.cache.find(r => r.name === "Muted")
        if (!user) return message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setDescription("<a:no:954773357407113298> | I can't find \`Muted\` role in this guild.")
                    .setColor(Discord.Colors.Red)
            ]
        });

        let reason = args.slice(1).join(" ");
        if (!reason) return message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setDescription("<a:no:954773357407113298> | You need to specify a reason for muting this user.")
                    .setColor(Discord.Colors.Red)
            ]
        });

        let embed = new Discord.EmbedBuilder()
        .setColor(Discord.Colors.Red)
        .setAuthor({
            name: `Muted User | Case ${client.cases}`,
            iconURL: message.guild.iconURL(),
          })


    }
}