const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const User = require("../../Models/Database/User");

  /** 
  * @param {Client} client 
  * @param {Message} message 
  * @param {Array<String>} args 
  */  

module.exports.execute = async (client, message, args) => {  
    

    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Roles.Commander.some(authRole => message.member.roles.cache.has(authRole)))
    return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));
  
    let victim = message.mentions.members.first() || (args[0] ? await message.guild.getMember(args[0]) : undefined);
    if (!victim) return message.lineReply(`${Settings.emojiler.iptal} Kayıtsıza atacağım birisini belirtmelisin.`).then(x => x.delete({timeout: 7500}));

    if (victim.roles.highest.position >= message.member.roles.highest.position) 
    return message.lineReply(`${Settings.emojiler.iptal} Senin rolünden üst yada aynı roldeki birisini kayıtsıza atamazsın..`).then(x => x.delete({timeout: 7500}));

    if (!victim.manageable) 
    return message.lineReply(`${Settings.emojiler.iptal} Bu kişinin yetkisi benden yüksek.`).then(x => x.delete({timeout: 7500}));

    let roles = Settings.Roles.Unregistered;
    victim.setRoles(roles);

    User.updateOne({ Id: message.author.id, Authorized: true }, { $inc: { "Usage.Unregistered": 1 } }).exec();

    message.lineReply(`> ${Settings.emojiler.tik} ${victim}, ${message.author} tarafından **Kayıtsız** kısmına atıldı.`);
}

module.exports.settings = {
    Commands: ["unregister", "kayıtsız", "Kayıtsız","Kayitsiz","kayitsiz", "Unregister"],
    Usage: "unregister <@member|id>",    
    Category: "Advanced",
    Description: "",
    Activity: true
  }