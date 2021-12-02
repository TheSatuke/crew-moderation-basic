const {Client, Message, MessageEmbed} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Text = require("../../Configuration/Text.json");
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Ban.AuthRoles.some(authRole => message.member.roles.cache.has(authRole))) return message.lineReply(`${Settings.emojiler.iptal} ${Text.YetkinYetmiyor}`);
var s = message.guild.fetchBans().then(bans => {
    var embed = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setFooter(Config.Footer).setColor(Settings.Perm.Color)

    message.lineReply(embed.setDescription(`${Settings.emojiler.tik} Sunucuda **${bans.size}** banlı üye var`))
    message.react(Settings.emojiler.onayID)
})
}
module.exports.settings = {
    Commands: ["bansay","banlar"],
    Usage: "bansay",
    Description: "Sunucuda kaç ban olduğunu sayıp atar",
    Category: "General",
    Activity: true
}