const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const moment = require("moment");
require("moment-timezone");
require("moment-duration-format")
moment.locale("tr")

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args, embed) => {
if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Roles.Owner.some(authRole => message.member.roles.cache.has(authRole)))
return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));

  let specify = "Seste Olmayan Yetkililer:\n\n";
  
  message.guild.roles.cache.get(message.guild.roles.cache.get(Settings.Roles.Commander).members.map(r => {
    specify += !r.voice.channel ? "<@" + r.user.id + "> \n" : "";
  }));

 
  message.channel.send(`\`\`\`${specify}\`\`\``).then(s => s.s);
}

module.exports.settings = {
    Commands: ["ysay"],
    Usage: "yetkili",
    Description: "Bahsettiğin kişiyi sunucudan atarsın.",
    Category: "General",
    cooldown: 10000,
    Activity: true
} 