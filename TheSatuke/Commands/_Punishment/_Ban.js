const { Message, Client, Application, MessageFlags} = require("discord.js");
const Discord = require("discord.js");
const PM = require("../../Managers/PenalManager");
const Settings = require("../../Configuration/Settings.json");
const Helper = require("../../Utils/Helper");
const moment = require("moment");
const Penal = require("../../Models/Database/Penal");
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
    
    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await Helper.GetUser(args[0]);
    if(!victim) return message.lineReply(`${Settings.emojiler.iptal} Yasaklamak istediğin bir kullanıcıyı belirtmelisin.`).then(x => x.delete({timeout: 7500}));
    
    let reason = args.splice(1).join(" ");
    if(!reason) return message.lineReply(`${Settings.emojiler.iptal} Geçerli \`Ban\` sebebi belirtmelisin.`).then(x => x.delete({timeout: 7500}));

    let member = await message.guild.getMember(victim.id);
    if(!member) return message.lineReply(`${Settings.emojiler.iptal} Bu kullanıcıyı sunucuda bulamıyorumBu kullanıcı sunucuda bulamıyorum.`).then(x => x.delete({timeout: 7500}));
    
    if(member && member.roles.highest.position >= message.member.roles.highest.position) return message.lineReply(`${Settings.emojiler.iptal} Kişi senden yüksek bir pozisyona sahip, onu yasaklayamazsın.`).then(x => x.delete({timeout: 7500}));
    if(member && !member.bannable)
    return message.lineReply(`${Settings.emojiler.iptal} Botta Bir Hata Var \`Satuke'ye\` Ulaşınız.`)
    message.guild.members.ban(victim.id, { reason: `Yetkili: ${message.author.username} | ${reason}`}).catch();

    let document = await PM.addPenal(victim.id, message.author.id, PM.Types.BAN, reason);

    message.channel.send(`${victim}, ${message.author} tarafından **__${reason}__** sebebiyle sunucudan yasaklandı, Ceza Numarası - (\`#${document.Id}\`) ${Settings.emojiler.tik}`);
    message.react(Settings.emojiler.onayID)
    victim.send(`${message.author} Tarafından **__${reason}__** Sebebiyle **${message.guild.name}** adlı sunucudan uzaklaştırıldın. Ceza Numaran - (\`#${document.Id}\`)`);
    ///message.guild.log(message.author, victim, document, Log.Log.BanLog);
    let time = args[1];
    let cıkaralım = time + Date.parse(new Date());
    let şuanki = moment(Date.now()).format("LLL");
    let sonraki = moment(cıkaralım).format("LLL");
    let logKanali = client.channels.cache.find(a => a.id == Settings.Penals.Ban.Log)

    const embed = new Discord.MessageEmbed()
    .setDescription(`${victim} Kullanıcısı, ${message.author} tarafından **Ban** adlı ceza ile cezalandırıldı.`)
    .addField(`Ceza Numarası`,`${document.Id}`, true)
    .addField(`Ceza Sebebi`,`${reason}`, true)
    .addField(`Ceza Türü`,`Ban`, true)
    .addField(`Yetkili`,`${message.author}`, true)
    .addField(`Kullanıcı`,`${victim}`, true)
    .addField(`Ceza Başlangıc`,`${şuanki}`, true)
    .addField(`Ceza Bitiş`,`Kalıcı`, true)
    .setColor(Bot.EmbedColor).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter(Bot.Status)
    //client.channels.cache.get(Log.Log.TransporterLog).send(embed)    
    logKanali.send(embed)






}

module.exports.settings = {
    Commands: ["ban", "cezalandır","yak"],
    Usage: "ban <@user|id> [reason]",
    Description: "Bahsettiğin kişiyi sunucudan yasaklarsın.",
    Category: "Criminal",
    Activity: true
}
