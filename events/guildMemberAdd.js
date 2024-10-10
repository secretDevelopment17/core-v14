const Discord = require("discord.js");
const config = require("../config.json");


module.exports = async (client, member) => {
    const ch = client.channels.cache.get("954177761868664863");
    const welcomer = [
      `${member.user} just landed 🚀`,
      `Glad you're here, ${member.user} 👋`,
      `${member.user}  joined the party 🥂`,
      `Everyone welcome ${member.user}! 😉`,
      `Welcome, ${member.user} don't forget to bring your coffe ☕`,
      `Good to see you, ${member.user} 😃`,
    ];
    let random = Math.floor(Math.random() * welcomer.length);
  
    const logsEmbed = new Discord.EmbedBuilder()
      .setTitle(`[\`${member.guild.memberCount}\`] Member joined.`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setColor(Discord.Colors.Green)
      .setDescription(
        `\`\`\`asciidoc
                  • Username :: ${member.user.username} | #${member.user.discriminator}
                  • ID :: ${member.user.id}
                  • Created At :: ${new Date(member.user.createdTimestamp).toString()}    
              \`\`\``
      )
      .setFooter({
        text: `Member joined`,
        iconURL: `https://cdn.discordapp.com/emojis/574840956444999681.png?v=1`
      })
      .setTimestamp();
  
    const memberEmbed = new Discord.EmbedBuilder()
      .setColor(client.config.color)
      .setThumbnail(member.guild.iconURL({ dynamic: true, size: 4096 }))
      .setDescription(
        `
                  Greetings, ${member.user}!
                  Welcome to **${member.guild.name}**!
  
                  Before you do anything, you have to read the rules that we have provided,
                  you are advised to read the **Rules and Information** in the <#954175101371301960> channels.
              `
      )
      .setFooter({ text: `You are now in ${member.guild.memberCount} Members.` });
  
    const row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setLabel("Read our rules")
        .setStyle(Discord.ButtonStyle.Link)
        .setURL(
          "https://discord.com/channels/954173179042091028/954175101371301960"
        )
    );
  
    const embed = new Discord.EmbedBuilder()
      .setColor("#00FF00")
      .setDescription(`<a:Join:593588419087695872> | ${welcomer[random]}`);
  
    client.channels.cache.get("954176559332327494").send({ embeds: [logsEmbed] });
    client.channels.cache.get("954173179042091031").send({ embeds: [embed]})
    ch.setName(`Total Member : ${member.guild.memberCount}`);
    member.send({ embeds: [memberEmbed], components: [row] });
    member.roles.add("954181940381098014");
}