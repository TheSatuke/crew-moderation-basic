const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {

    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Roles.Owner.some(authRole => message.member.roles.cache.has(authRole)))
    return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));
let roles = args.length > 0 ? message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) : message.guild.roles.cache.find(x => x.id == Settings.Roles.Commander)
    let offlineMembers = message.guild.members.cache.filter(x => {
        return x.roles.cache.has(roles.id) && !x.voice.channel && x.user.presence.status == "offline"
    })
    let voiceMembers = message.guild.members.cache.filter(x => {
        return x.roles.cache.has(roles.id) && x.voice.channel
    })
    let notVoiceMembers = message.guild.members.cache.filter(x => {
        return x.roles.cache.has(roles.id) && !x.voice.channel
    })
    message.channel.send("\`\`\`Roldeki Offline Kullanıcılar: "+ offlineMembers.size +"\n\`\`\`" + offlineMembers.map(x => "<@" + x.id + ">").join(", ") + "")
    message.channel.send("──────────────────────────────────")
    message.channel.send("\`\`\`Roldeki Seste Olan Kullanıcılar: "+ voiceMembers.size +"\n\`\`\`" + voiceMembers.map(x => "<@" + x.id + ">").join(", ") + "")
    message.channel.send("──────────────────────────────────")
    message.channel.send("\`\`\`Roldeki Seste Olmayan Kullanıcılar: "+ notVoiceMembers.size +" \n\`\`\`" + notVoiceMembers.map(x => "<@" + x.id + ">").join(", ") + "")

}
module.exports.settings = {
    Commands: ["roldenetim","denetim"],
    Usage: "denetim",
    Description: "Sunucunun Güncel Verilerini Atar.",
    Category: "Advanced",
    Activity: true
}
