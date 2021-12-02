const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Config = require("../../Configuration/Config.json");
const Settings = require("../../Configuration/Settings.json");
const moment = require("moment");
require("moment-timezone");
require("moment-duration-format")
moment.locale("tr")

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {  

  if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Transporter.Roles.some(authRole => message.member.roles.cache.has(authRole)))
  return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));
if (!message.member.voice.channelID)
return message.lineReply(`${Settings.emojiler.iptal} Bir ses kanalında olmalısın.`);

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

if (!member) 
return message.lineReply(`${Settings.emojiler.iptal} Bir üye etiketle ve tekrardan dene.`);

if (!member.voice.channelID)
return message.lineReply(`${Settings.emojiler.iptal} Bu kullanıcı herhangi bir ses kanalında bulunmuyor.`);

if (message.member.voice.channelID === member.voice.channelID) 
return message.lineReply(`${Settings.emojiler.iptal} Zaten aynı kanaldasınız.`);

let embed = new MessageEmbed().setColor(Config.EmbedColor).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter(Config.Status)

if (message.member.permissions.has("ADMINISTRATOR")) {
    message.member.voice.setChannel(member.voice.channel)
    message.react(Settings.emojiler.tik)
    message.lineReply(`${message.author}, ${member} kişisinin yanına gittiniz.`)

client.channels.cache.get(Settings.Transporter.Log).send(embed.setDescription(`
\`\`\`Bir Gitme işlemi gerçekleşti.\`\`\`

➜  Odaya Giden Kullanıcı: ${member} - (\`${member.id}\`)
➜  Odasına Gidilen Yetkili: ${message.author} - (\`${message.author.id}\`)`))
}


else {
const question = await message.lineReply(member.toString(), { embed: embed.setDescription(`${member}, ${message.author} **${member.voice.channel.name}** odasına gelmek istiyor. Kabul ediyor musun?`) });
await question.react(Settings.emojiler.tik);
await question.react(Settings.emojiler.iptal);
const answer = await question.awaitReactions((reaction, user) => [Settings.emojiler.tik, Settings.emojiler.iptal].includes(reaction.emoji.toString()) && user.id === member.user.id, { max: 1, time: 60000, errors: ["time"] }).catch(() => { question.edit(embed.setDescription("İşlem iptal edildi!")) });

if (answer.first().emoji.toString() === Settings.emojiler.tik) {

  embed.setColor(Config.EmbedColor);
  question.delete();
  message.lineReply(`${Settings.emojiler.tik} ${message.author}, ${member} kişisinin yanına gittiniz.`)
  message.member.voice.setChannel(member.voice.channel);
}

else {
  embed.setColor(Config.EmbedColor);
  question.delete();
}
}
}
module.exports.settings = {
    Commands: ["git"],
    Usage: "git <user/id>",
    Description: "Etiketlemiş olduğun kişinin yanına gidersin.",
    Category: "Move",   
    Activity: true
}