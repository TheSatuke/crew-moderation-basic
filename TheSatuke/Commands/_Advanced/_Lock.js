const { Message , Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

  /** 
  * @param {Client} client 
  * @param {Message} message 
  * @param {Array<String>} args 
  */  
   module.exports.execute = async (client, message, args) => {

if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Roles.Owner.some(authRole => message.member.roles.cache.has(authRole)))
return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));
 
if(!args[0]) {
     message.channel.createOverwrite(message.guild.id, { SEND_MESSAGES: false}).then(() => {
     message.channel.send(`${Settings.emojiler.tik} **Kanala yazma engeli konulmustur.**`)
 }) }

 if(args[0] == "aç") {
     message.channel.createOverwrite(message.guild.id, { SEND_MESSAGES: null }).then(() => {
     message.channel.send(`${Settings.emojiler.tik} **Kanalın yazma kilidi kaldırılmıstır.**`)
 }) 
}
   }
module.exports.settings = {
    Commands: ["lock","kilit"],
    Usage: "lock",
    Description: "",
    Category: "Advanced",
    Activity: true
}