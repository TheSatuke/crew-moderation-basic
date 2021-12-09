const { Message, Client, Application, MessageFlags} = require("discord.js");
const Discord = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Config = require("../../Configuration/Config.json");
const moment = require("moment");
const ms = require("ms")
const Helper = require("../../Utils/Helper");
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
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.VoiceMute.AuthRoles.some(authRole => message.member.roles.cache.has(authRole)))
    return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await Helper.GetUser(args[0]);
    if(!victim) 
    return message.lineReply(`${Settings.emojiler.iptal} Seste susturmak istediğin bir kullanıcıyı belirtmelisin.`).then(x => x.delete({timeout: 7500}));
 
    let time = args[1];
    if(!time || !ms(time))
    return message.lineReply("Lütfen geçerli bir süre girin. Örn: \`S: Saniye\` \`M: Dakika\`,\`H: Saat\`").then(x => x.delete({timeout: 7500}));
    time = ms(time);
    let reason = args.splice(2).join(" ");
    if(!reason) return message.lineReply(`${Settings.emojiler.iptal} Geçerli bir sebep belirtmelisin`).then(x => x.delete({timeout: 7500}));

    let member = await message.guild.getMember(victim.id);
    if(!member) return message.lineReply(`${victim} Bu kullanıcı sunucuda bulamıyorum.`).then(x => x.delete({timeout: 7500}));
    if(member && member.roles.highest.position >= message.member.roles.highest.position) 
    return message.lineReply(`${Settings.emojiler.iptal} Senin rolünden üstte ya da aynı roldeki birisini sesli susturamazsın.`).then(x => x.delete({timeout: 7500}));

    if(member && member.manageable) {
    if(!member.roles.cache.has(Settings.Penals.VoiceMute.Role)) member.roles.add(Settings.Penals.VoiceMute.Role).catch();
    if(member.voice.channelID && !member.voice.serverMute) member.voice.setMute(true).catch();}
    let document = await PM.addPenal(victim.id, message.author.id, PM.Types.TEMP_VOICE_MUTE, reason, true, Date.now(), time);

    message.channel.send(`${victim}, ${message.author} tarafından **__${reason}__** sebebiyle geçici olarak seslide susturuldu, Ceza Numarası -  (\`#${document.Id}\`) ${Settings.emojiler.tik}`)
    message.react(Settings.emojiler.onayID)
    //message.guild.log(message.author, victim, document, Settings.Penals.VoiceMute.Log);

let cıkaralım = time + Date.parse(new Date());
let şuanki = moment(Date.now()).format("LLL");
let sonraki = moment(cıkaralım).format("LLL");

let logKanali = client.channels.cache.find(a => a.id == Settings.Penals.VoiceMute.Log)
const embed = new Discord.MessageEmbed()
.setDescription(`${victim} Kullanıcısı, ${message.author} tarafından **Voice Mute** adlı ceza ile cezalandırıldı.`)
.addField(`Ceza Numarası`,`${document.Id}`, true)
.addField(`Ceza Sebebi`,`${reason}`, true)
.addField(`Ceza Türü`,`Voice Mute`, true)
.addField(`Yetkili`,`${message.author}`, true)
.addField(`Kullanıcı`,`${victim}`, true)
.addField(`Ceza Başlangıc`,`${şuanki}`, true)
.addField(`Ceza Bitiş`,`${sonraki}`, true)
.setColor(Config.EmbedColor).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter(Config.Status)
logKanali.send(embed);
//client.channels.cache.get(Log.Log.MuteLog).send(embed)

}

module.exports.settings = {
    Commands: ["voicemute", "seslisustur","vmute","unvmute"],
    Usage: "voicemute <@user|id> [reason]",
    Description: "Bahsettiğin kişiyi sunucuda geçici olarak susturursun.",
    Category: "Criminal",
    Activity: true
}
