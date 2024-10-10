const Discord = require("discord.js")

module.exports = {
    name: "purge",
    aliases: ["prune", "clear"],
    description: "Clear multiple chats with one command",
    category: "Staff",
    run: async (client, message, args) => {
        if(!message.member.permissions.has('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Moderator")) {
            return message.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription("<a:no:954773357407113298> | I'm sorry but you don't have permission to do that.")
                        .setColor(Discord.Colors.Red)
                ]
            });
        }
        

        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription("<a:no:954773357407113298> | Please enter the number of messages you want to delete between 1-100.")
                        .setColor(Discord.Colors.Red)
                ]
            });
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;

        } else {
            deleteAmount = parseInt(args[0]);
        }

        await message.channel.bulkDelete(deleteAmount, true);
        await message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setDescription(`<a:yes:954773528153059350> | Successfully deleted **${deleteAmount}** chats.`)
                    .setColor(Discord.Colors.Green)
            ]
        }).then(message => message.delete({timeout: 10000}))

    }
}