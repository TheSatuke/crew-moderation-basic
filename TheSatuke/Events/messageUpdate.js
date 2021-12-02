const moment = require("moment");
moment.locale("tr");
const { MessageEmbed } = require("discord.js");

module.exports = async (oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;

  const channel = newMessage.guild.channels.cache.get("886231027897475147");
  if (!channel) return;
  const embed = new MessageEmbed()
    .setAuthor(newMessage.member.displayName, newMessage.author.avatarURL({ dynamic: true }))
    .setColor("RANDOM")
    .setDescription(`**Eski Mesaj İçeriği:** ${oldMessage.content}
**Yeni Mesaj İçeriği:**  ${newMessage.content}`)

  if (newMessage.attachments.first()) embed.setImage(newMessage.attachments.first().proxyURL);
  channel.send(embed);
};

module.exports.config = {
  Event: "messageUpdate",
};