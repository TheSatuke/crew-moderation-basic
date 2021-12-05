const { MessageEmbed } = require('discord.js')
const Config = require("../../Configuration/Config.json");
const Settings = require("../../Configuration/Settings.json");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {
    var TopMember = message.guild.memberCount;
    var OnlineUser = message.guild.members.cache.filter(off => off.presence.status !== 'offline').size
    var Voice = message.guild.members.cache.filter(s => s.voice.channel).size;
    var Tagges = message.guild.members.cache.filter(s => !s.bot).filter(member => member.user.username.includes("Shiva")).size;
    var Tagges2 = message.guild.members.cache.filter(s => !s.bot).filter(member => member.user.username.includes("shiva")).size;
    var Tagges3 = message.guild.members.cache.filter(s => !s.bot).filter(member => member.user.username.includes("shivâ")).size;
    var Tagges4 = message.guild.members.cache.filter(s => !s.bot).filter(member => member.user.username.includes("Shivâ")).size;
    var Tagges6 = message.guild.members.cache.filter(s => !s.bot).filter(member => member.user.username.includes("1784")).size;
    var Tagges7 = message.guild.members.cache.filter(s => !s.bot).filter(member => member.user.username.includes(`?`)).size;
    var Tagges5 =  message.guild.members.cache.filter(s => !s.bot).filter(member => member.user.discriminator == "1784").size;

const Embed = new MessageEmbed()
.setColor(Settings.Perm.Color)
.setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
.setDescription(`\`•\` Sunucumuzda şuanda toplam **${TopMember}** üye bulunmakta.
\`•\` Sunucumuzda **${OnlineUser}** aktif kişi bulunmakta.
\`•\` Tagımızı alarak ailemize destek olan **${Tagges+Tagges2+Tagges3+Tagges4+Tagges5+Tagges6+Tagges7}** kişi bulunmaktadır.
\`•\` Sesli sohbetlerde toplam **${Voice}** kişi var.`)
message.channel.send(Embed)}

module.exports.settings = {
    Commands: ["say","SAY","Say"],
    Usage: "say",
    Description: "Sunucunun Güncel Verilerini Atar.",
    Category: "Advanced",
    Activity: true
}
