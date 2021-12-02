const { Message, Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Text = require("../../Configuration/Text.json");
const Config = require("../../Configuration/Config.json");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
if(!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`${Settings.emojiler.iptal} ${Text.YetkinYetmiyor}`)

let members = message.guild.members.cache.filter(member => member.roles.cache.has(Settings.Authorized.ToplantıRole) && member.voice.channelID != Settings.Authorized.ToplantıKanalı);
members.array().forEach((member, index) => {setTimeout(() => {member.roles.remove(Settings.Authorized.ToplantıRole).catch();}, index * 1250)});

let verildi = message.member.voice.channel.members.filter(member => !member.roles.cache.has(Settings.Authorized.ToplantıRole) && !member.user.bot)
verildi.array().forEach((member, index) => {setTimeout(() => {member.roles.add(Settings.Authorized.ToplantıRole).catch();},
index * 1250)});
const ToplantıLog = message.guild.channels.cache.find(c => c.id === Settings.Authorized.ToplantıLog)

ToplantıLog.send(new MessageEmbed()
.setDescription(`<@&${Settings.Authorized.ToplantıRole}> Rolü <#${Settings.Authorized.ToplantıKanalı}> Kanalında Bulunan Üyelere Dağıtılmaya Başladı.\n\n ${Settings.emojiler.tik} Toplam Rol Verilen Kullanıcı: \n \`${verildi.size}\` \n\n ${Settings.emojiler.iptal} Rolleri Geri Alınan Kullanıcı Sayısı: \n \`${members.size}\``)
.setColor('#2F3136')
.setTitle(`Toplantı yoklaması alındı..`)
.setFooter(Config.Footer)
.setThumbnail(message.guild.iconURL({dynamic:true})))

message.channel.send(new MessageEmbed()
.setDescription(`<@&${Settings.Authorized.ToplantıRole}> Rolü <#${Settings.Authorized.ToplantıKanalı}> Kanalında Bulunan Üyelere Dağıtılmaya Başladı.\n\n ${Settings.emojiler.tik} Toplam Rol Verilen Kullanıcı: \n \`${verildi.size}\` \n\n ${Settings.emojiler.iptal} Rolleri Geri Alınan Kullanıcı Sayısı: \n \`${members.size}\``)
.setColor('#2F3136')
.setTitle(`Toplantı yoklaması alındı..`)
.setFooter(Config.Footer)
.setThumbnail(message.guild.iconURL({dynamic:true})))}


module.exports.settings = {
  Commands: ["toplantı","katıldı","yoklama"],
  Usage: "katıldı",
  Description: "Toplantı esnasında toplantıda olan kişilere katıldı rolü dağıtır.",
  Category: "General",
  Activity: true
}