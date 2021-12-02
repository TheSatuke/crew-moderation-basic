const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {

if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Roles.Owner.some(authRole => message.member.roles.cache.has(authRole)))
return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));
const number = args[0];
if (isNaN(number)) return message.lineReply(`${Settings.emojiler.iptal} Geçerli bir süre girmelisin.`).then(x => x.delete({timeout: 7500}));
if (number > 100) return message.lineReply(`${Settings.emojiler.iptal} Süre en fazla **100** olmalıdır.`).then(x => x.delete({timeout: 7500}));

message.channel.setRateLimitPerUser(args[0]);
message.lineReply(`> ${Settings.emojiler.tik} Kanal Yavas Modu **${number} Saniye** olarak ayarlandı.`);

},
module.exports.settings = {
    Commands: ["slowmode"],
    Usage: "slowmode <member/id>",
    Description: "",
    Category: "Advanced",
    Activity: true
}