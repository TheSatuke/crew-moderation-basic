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
  
let Member = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)

if(args[0] == "ver") {
Member.forEach(r => {
r.roles.add(Settings.Roles.Unregistered)
})

message.lineReply(`${Settings.emojiler.tik} Sunucuda rolü bulunmayan **${Member.size}** kişiye **Kayıtsız** rolü verildi`)
}
else if(!args[0]) {

message.lineReply(`> ${Settings.emojiler.iptal} Sunucuda rolü bulunmayan **${Member.size}** kişi var.`).then(x => x.delete({timeout: 7500}));
}}

module.exports.settings = {
    Commands: ["rolsüz", "r"],
    Usage: "rolsüz",
    Description: "",
    Category: "Advanced",
    Activity: true
}