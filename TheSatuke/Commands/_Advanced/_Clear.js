const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {
  if(!message.member.hasPermission("MANAGE_MESSAGES") && !Settings.Roles.Yönetim.some(authRole => message.member.roles.cache.has(authRole)))
  return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));

  if(!args[0]) return message.lineReply(`${Settings.emojiler.iptal} Geçerli bir mesaj miktarı yaz.`).then(x => x.delete({timeout: 7500}));
  message.channel.bulkDelete(args[0]).then(() => {
  message.channel.send(`${Settings.emojiler.tik} Bu kanalda başarıyla **${args[0]}** adet mesajı sildim.`);
  })
  }
module.exports.settings = {
  Commands: ["temizle","sil","Sil","Temizle","clear","Clear"],
  Usage: "temizle",
  Description: "",
  Category: "Advanced",
  Activity: true
}