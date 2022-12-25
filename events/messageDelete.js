const Discord = require("discord.js");
const config = require("../config.json");

module.exports = async (message) => {
    if (!message.guild || message.author.bot) return;
    const attachments =
      message.attachments.size !== 0
        ? message.attachments.map((attachment) => attachment.proxyURL)
        : null;
    const embed = new Discord.EmbedBuilder()
      .setColor("#2f3136")
      .setAuthor({
        text: `New Message Deleted`,
        iconURL: `https://cdn.discordapp.com/emojis/737554516999929867.gif?size=32&quality=lossless`
        })
      .setDescription([
        `> Message ID: \`${message.id}\``,
        `> Channel: ${message.channel}`,
        `> Author: <@!${message.member.id}> | \`${message.member.id}\``,
        //`${attachments ? `**❯ Attachments:** ${attachments.join('\n')}` : '\u200B'}`
      ])
      .setTimestamp();
    if (message.content.length) {
      embed.addField(
        `> Content:`,
        `\`\`\`${
          message.content !== undefined
            ? message.content
            : "This message is not have any content"
        }\`\`\``
      );
    }
    if (attachments) {
      embed.setImage(attachments[0]);
    }
  
    const channel = message.guild.channels.cache.find(
      (ch) => ch.name === "🚫┇automod"
    );
    if (channel) channel.send({ embeds: [embed] });
}