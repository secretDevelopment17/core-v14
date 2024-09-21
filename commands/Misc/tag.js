const Discord = require("discord.js")

module.exports = {
    name: "tag",
    aliases: [],
    description: "Use tags for quick messages",
    category: "Misc",
    run: async (client, message, args) => {
        if (!args[0]) {
            message.channel.send(
              new Discord.EmbedBuilder()
                .setDescription(
                  `<a:no:954773357407113298> | Not a valid command. I've \`add\`, \`show\`, \`list\``
                )
                .setColor("RED")
            );
          } else if (args[0] == "add") {
            if (!args[1]) {
              message.channel.send(
                new Discord.EmbedBuilder()
                  .setDescription(
                    `<a:no:954773357407113298> | You need to specify a name to add.`
                  )
                  .setColor("RED")
              );
            } else {
              let name = args[1]
              let tag = await client.mongo.has(`tag`, name);
              let response = args.slice(2).join(" ");
              if (tag)
                return message.channel.send(
                  new Discord.EmbedBuilder()
                    .setDescription(
                      `<a:no:954773357407113298> | This tag name already exists.`
                    )
                    .setColor("RED")
                );
              if (!response)
                return message.channel.send(
                  new Discord.EmbedBuilder()
                    .setDescription(
                      `<a:no:954773357407113298> | You need to specify a response.`
                    )
                    .setColor("RED")
                );
        
              await client.mongo.set(`tag`, name, {
                author: message.author.id,
                name: name,
                response: response,
              });

              message.channel.send(
                new Discord.EmbedBuilder()
                  .setDescription(
                    `<a:yes:954773528153059350> | Tag \`${name}\` has been added.`
                  )
                  .setColor("GREEN")
              );
            }
          } else if (args[0] == "delete") {
            if (!args[1]) {
              message.channel.send(
                new Discord.EmbedBuilder()
                  .setDescription(
                    `<a:no:954773357407113298> | You need to specify a name to delete.`
                  )
                  .setColor("RED")
              );
            } else {
              let name = args[1]
              let tag = await client.mongo.has(`tag`, name);
              if (!tag)
                return message.channel.send(
                  new Discord.EmbedBuilder()
                    .setDescription(
                      `<a:no:954773357407113298> | This tag doesn't exist.`
                    )
                    .setColor("RED")
                );
        
              await client.mongo.delete(`tag`, name);
              message.channel.send(
                new Discord.EmbedBuilder()
                  .setDescription(
                    `<a:yes:954773528153059350> | Tag \`${name}\` has been deleted.`
                  )
                  .setColor("GREEN")
              );
            }
          } else {
            if (!args[0]) {
              message.channel.send(
                new Discord.EmbedBuilder()
                  .setDescription(
                    `<a:no:954773357407113298> | You need to specify a name to show.`
                  )
                  .setColor("RED")
              );
            } else {
              let name = args[0];
              let tag = await client.mongo.get(`tag`, name);
              if (!tag)
                return message.channel.send(
                  new Discord.EmbedBuilder()
                    .setDescription(
                      `<a:no:954773357407113298> | This tag doesn't exist.`
                    )
                    .setColor("RED")
                );
        
              message.channel.send(tag.response);
            }
          }
    }
}