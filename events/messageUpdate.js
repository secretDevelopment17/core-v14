const Discord = require("discord.js");
const config = require("../config.json");

module.exports = async (old, message, client) => {
    if (!message.guild || old.content === message.content || message.author.bot)
    return;

  const embed = new Discord.EmbedBuilder()
    .setColor(client.config.color)
    .setAuthor({
      text: `New Message Update`,
      iconURL: `https://cdn.discordapp.com/emojis/737554516999929867.gif?size=32&quality=lossless`,
      url: old.url
    })
    .setDescription([
      `> Message ID: \`${old.id}\``,
      `> Channel: ${old.channel}`,
      `> Author: <@!${old.author.id}> | \`${old.author.id}\``,
    ])
    .addFields({ name: "> Before:", value: `\`\`\`${old.content}\`\`\`` })
    .addFields({ name: "> After:", value: `\`\`\`${message.content}\`\`\`` })
    .setTimestamp();

  const channel = message.guild.channels.cache.find(
    (ch) => ch.name === "🚫┇automod"
  );
  if (channel) channel.send({ embeds: [embed] });
}