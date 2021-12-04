const { Message, Client, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const moment = require("moment");
const Penal = require("../../Models/Database/Penal");
const PM = require("../../Managers/PenalManager");
require("moment-timezone");
require("moment-duration-format")
moment.locale("tr")

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {
if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Ban.AuthRoles.some(authRole => message.member.roles.cache.has(authRole)))
return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));
let victim = await client.users.fetch(args[0]);

if(!victim) return message.lineReply(`${Settings.emojiler.iptal} ${message.author} yasaklı olan bir id belirt.`)

message.guild.members.unban(victim.id)
message.lineReply(`${Settings.emojiler.tik} ${victim} adlı kullanıcının sunucu yasağı kaldırıldı.`)
  
message.react(Settings.emojiler.onayID)

}

module.exports.settings = {
    Commands: ["unban"],
    Usage: "unban",
    Description: "Bahsettiğin kişiyi sunucudan atarsın.",
    Category: "Penal",
    Activity: true
}
