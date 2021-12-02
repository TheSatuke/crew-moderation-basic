const { Message, Client, MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Config = require("../../Configuration/Config.json");
const db = require('quick.db');
const moment = require('moment');
require('moment-duration-format');


/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
 module.exports.execute = async (client, message, args) => {

  var hembed = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setFooter(Config.Footer).setColor(Settings.Perm.Color)
  var embed = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setFooter(Config.Footer).setColor(Settings.Perm.Color)
    
{
      let mesaj = db.get(`snipe.${message.guild.id}.${message.channel.id}`);
      if (!mesaj) {
        message.delete({timeout: 5000})
        return message.channel.send(hembed.setDescription(`Bu kanalda silinmiş bir mesaj bulunmamakta.`)).then(msg => msg.delete({timeout: 5000}))}
    
      if(mesaj.icerik.toLowerCase().includes('discord.gg/') || mesaj.icerik.toLowerCase().includes('https') || mesaj.icerik.toLowerCase().includes('http') || mesaj.icerik.toLowerCase().includes('.com')) {
         message.delete({timeout: 5000})
         return message.channel.send(hembed.setDescription(`Son silinen mesajda reklam bulunmakta.`)).then(msg => msg.delete({timeout: 5000}))}
    
        
      let mesajYazari = await message.guild.members.cache.get(mesaj.yazar);
      if (mesaj.icerik) {
    return message.channel.send(embed.setDescription(`
    \`•\` Mesaj Sahibi: ${mesajYazari ? mesajYazari : mesajYazari.tag} ( \`${mesajYazari.id}\` )
    \`•\` Mesajın Yazılma Tarihi: \`${moment.duration(Date.now() - mesaj.yazilmaTarihi).format("D [gün], H [Saat], m [dakika], s [saniye]")}\` önce
    \`•\` Mesajın Silinme Tarihi: \`${moment.duration(Date.now() - mesaj.silinmeTarihi).format("D [gün], H [Saat], m [dakika], s [saniye]")}\` önce 
    `).addField(`Silinen Mesaj`,`\`\`\`ARM
${mesaj.dosya ? "Atılan mesaj bir dosya içeriyor." : mesaj.icerik}\`\`\``))
      }
      } 
    };
module.exports.settings = {
  Commands: ["snipe"],
  Usage: "snipe",
  Description: "Toplantı esnasında toplantıda olan kişilere katıldı rolü dağıtır.",
  Category: "General",
  Activity: true
}