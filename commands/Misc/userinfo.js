const Discord = require("discord.js");
const moment = require("moment");
const momentTz = require("moment-timezone");

const userType = {
  false: "Human",
  true: "Robot",
};

const userPresence = {
  online: "Online",
  dnd: "Do Not Disturb",
  idle: "Idle",
  offline: "Offline",
  invisible: "Invisible",
};

module.exports = {
  name: "userinfo",
  aliases: ["ui"],
  description: "Viewing a specific user's discord account information",
  category: "Misc",
  run: async (client, message, args) => {

    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (r) => r.user.username.toLowerCase() === args.join(" ").toLowerCase()
      ) ||
      message.guild.members.cache.find(
        (r) => r.displayName.toLowerCase() === args.join(" ").toLowerCase()
      ) ||
      message.member;

    let embed = new Discord.EmbedBuilder()
      .setAuthor({
        name: `${member.displayName}'s Info`,
        iconURL: message.guild.iconURL(),
      })
      .setColor("#2f3136")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        {
          name: "General:",
          value:
            `\`\`\`asciidoc\n` +
            `• Username :: ${member.user.tag}\n` +
            `• ID :: ${member.id}\n` +
            `• Type :: ${member.user.bot ? "Bot" : "Human"}\n` +
            `• Created :: ${momentTz
              .tz(member.user.createdAt, "Asia/Jakarta")
              .format(
                "ddd MMM Do YYYY HH:mm:ss"
              )} GMT+0700 (Western Indonesia Time) [${moment(
              member.user.createdAt,
              "dd"
            ).fromNow()}]\n` +
            `• Joined :: ${momentTz
              .tz(member.joinedAt, "Asia/Jakarta")
              .format(
                "ddd MMM Do YYYY HH:mm:ss"
              )} GMT+0700 (Western Indonesia Time) [${moment(
              member.joinedAt,
              "dd"
            ).fromNow()}]\n` +
            `\`\`\``,
        },
        {
          name: "Presence:",
          value:
            `\`\`\`asciidoc\n` +
            `• Status :: ${
              member.presence?.status ? member.presence.status : "null"
            }\n` +
            `• Playing :: ${
              member.presence?.activities[0]
                ? member.presence.activities[0].name
                : "No game played"
            }\n` +
            `\`\`\``,
        }
      )
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
}
