const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const notlar = require('../../Models/Database/Notlar');

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {

if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Roles.Commander.some(authRole => message.member.roles.cache.has(authRole)))
return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));
  
let user = message.mentions.members.first() || await user(args[0], message.guild)
if(!user)
return message.lineReply(`> ${Settings.emojiler.iptal} Not bırakacağın birisini belirt.`).then(x => x.delete({timeout: 7500}));
await notlar.findOne({ user: user.id }, async (err, res) => {
if (!args.slice(1).join(" ")) 
return message.lineReply(`> ${Settings.emojiler.iptal} Kişiye bırakmak istediğin notu yaz.`).then(x => x.delete({timeout: 7500}));
if (!res) { let arr = []
arr.push({ not: args.slice(1).join(" "), yetkili: message.author.id })
const newData = new notlar({ user: user.id, notlar: arr })
newData.save().catch(e => console.log(e))

message.lineReply(`${Settings.emojiler.tik} <@${user.id}> Kullanıcısına Bırakılan Not;

> ${args.slice(1).join(" ")}`)
} 
else {
    res.notlar.push({ not: args.slice(1).join(" "), yetkili: message.author.id })
    res.save().catch(e => console.log(e))

message.lineReply(`${Settings.emojiler.tik} <@${user.id}> Kullanıcısına Bırakılan Not;

> ${args.slice(1).join(" ")}`)
}
    })
}

module.exports.settings = {
    Commands: ["not","notekle",],
    Usage: "not",
    Description: "",
    Category: "Advanced",
    Activity: true
}