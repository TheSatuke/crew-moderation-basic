
const {Client, MessageEmbed} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Text = require("../../Configuration/Text.json");
const Config = require("../../Configuration/Config.json");


/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {

if(!message.member.roles.cache.get(Settings.Perm.Commander) && !message.member.hasPermission('ADMINISTRATOR'))
return message.lineReply(new MessageEmbed().setDescription(`${Settings.emojiler.iptal} ${Text.YetkinYetmiyor}`).setFooter(Config.Footer).setColor('RANDOM'))

let satuke = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!satuke) return message.lineReply(new MessageEmbed().setDescription(`${Settings.emojiler.iptal} ${Text.BirKullanıcıBelirt}`).setFooter(Config.Footer).setColor("RANDOM")).then(msg => msg.delete({timeout: 9000}))

const embed = new MessageEmbed()
.setColor('RANDOM').setDescription(`${satuke}, kullanıcısına <@&${"915176015762948146"}> rolü verildi!`).setFooter(Config.Footer).setTimestamp()
message.lineReply(embed)
satuke.roles.add("915176015762948146")}

module.exports.settings = {
    Commands: ["müzisyen"],
    Usage: "müzisyen",
    Description: "Bahsettiğin kullanıcıya belirlenen yetenek rolünü verirsin!",
    Category: "Ability",
    Activity: true
}
