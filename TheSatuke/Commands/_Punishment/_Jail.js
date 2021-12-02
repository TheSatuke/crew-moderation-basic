const { Message, Client, Application, MessageFlags} = require("discord.js");
const Discord = require("discord.js");
const Config = require("../../Configuration/Config.json");
const Settings = require("../../Configuration/Settings.json");
const moment = require("moment");
const ms = require("ms");
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
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Jail.AuthRoles.some(authRole => message.member.roles.cache.has(authRole)))
    return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));

    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || await Helper.GetUser(args[0]);
    if(!victim) 
    return message.lineReply(`${Settings.emojiler.iptal} Cezalandırmak istediğin bir kullanıcıyı belirtmelisin.`).then(x => x.delete({timeout: 7500}));
    
    let time = args[1];
    if(!time || !ms(time)) 
    return message.lineReply("Lütfen geçerli bir süre girin. Örn: \`S: Saniye\` \`M: Dakika\`,\`H: Saat\`").then(x => x.delete({timeout: 7500}));
    time = ms(time);
    
    let reason = args.splice(2).join(" ");
    if(!reason) 
    return message.lineReply(`${Settings.emojiler.iptal} Geçerli \`Ceza\` sebebi belirtmelisin.`).then(x => x.delete({timeout: 7500}));

    let member = await message.guild.getMember(victim.id);
    if(!member) return message.lineReply(`${victim} Bu kullanıcı sunucuda bulamıyorum.`).then(x => x.delete({timeout: 7500}));
    
    if(member && member.roles.highest.position >= message.member.roles.highest.position) 
    return message.lineReply(`${Settings.emojiler.iptal} Senin rolünden üstte ya da aynı roldeki birisine ceza veremezsin.`).then(x => x.delete({timeout: 7500}));

    if(member && member.manageable) PM.setRoles(Settings.Penals.Jail.Role).catch();
    let document = await PM.addPenal(victim.id, message.author.id, PM.Types.TEMP_JAIL, reason, true, Date.now(), time);

    message.channel.send(`${victim}, ${message.author} tarafından **__${reason}__** sebebiyle geçici olarak cezalandırıldı, Ceza Numarası - (\`#${document.Id}\`) ${Settings.emojiler.tik}`)
    message.react(Settings.emojiler.onayID)
    //message.guild.log(message.author, victim, document, Log.Log.JailedLog);


let cıkaralım = time + Date.parse(new Date());
let şuanki = moment(Date.now()).format("LLL");
let sonraki = moment(cıkaralım).format("LLL");
let logKanali = client.channels.cache.find(a => a.name == Settings.Penals.Jail.Log)

const embed = new Discord.MessageEmbed()
.setDescription(`${victim} Kullanıcısı, ${message.author} tarafından **Jail** adlı ceza ile cezalandırıldı.`)
.addField(`Ceza Numarası`,`${document.Id}`, true)
.addField(`Ceza Sebebi`,`${reason}`, true)
.addField(`Ceza Türü`,`Jail`, true)
.addField(`Yetkili`,`${message.author}`, true)
.addField(`Kullanıcı`,`${victim}`, true)
.addField(`Ceza Başlangıc`,`${şuanki}`, true)
.addField(`Ceza Bitiş`,`${sonraki}`, true)
.setColor(Config.EmbedColor).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter(Config.Status)
logKanali.send(embed)
//client.channels.cache.get(Log.Log.TransporterLog).send(embed)
}

module.exports.settings = {
    Commands: ["jail", "cezalandır","karantina" ,"hapis","ceza"],
    Usage: "jail <@user/id> [reason]",
    Description: "Bahsettiğin kişiyi sunucuda geçici olarak cezalandırırsın.",
    Category: "Criminal",
    Activity: true
}