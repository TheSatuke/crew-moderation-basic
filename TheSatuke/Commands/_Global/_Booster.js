const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {  

let tag = Settings.Tag.Tag
let tag2 = Settings.Tag.Tag2 || tag;
let rol = Settings.Roles.BoosterRole;
if (!message.member.roles.cache.has(rol) && !message.member.permissions.has(8))
return message.lineReply(`> ${Settings.emojiler.iptal} Bu komutu kullanabilmek için **Server Booster** olman gerekiyor.`).then(x => x.delete({timeout: 7500}));
var isim = args.slice(0).join(" ");
if(!isim) return message.reply(`> {Settings.emojiler.iptal} Yeni adını girmelisin.`);
message.react(Settings.emojiler.onayID)
message.lineReply(`> ${Settings.emojiler.tik} Yeni Adın: \`${isim}\``)
message.member.setNickname(`${isim}`).catch(() => {});
}
module.exports.settings = {
    Commands: ["rich","zengin","booster"],
    Usage: "Booster",
    Description: "",
    Category: "Advanced",
    Activity: true
}
