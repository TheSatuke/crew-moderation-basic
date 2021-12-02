const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const moment = require("moment");
const axios = require('axios')
require("moment-duration-format")

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Ban.AuthRoles.some(authRole => message.member.roles.cache.has(authRole)))
    return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));
    var s = message.guild.fetchBans().then(bans => {
    message.lineReply(`\`\`\`🚫 Sunucumuzda Toplam "${bans.size}" Adet yasaklanmış üye var.\`\`\``)
    message.react(Settings.emojiler.onayID)
})
}

module.exports.settings = {
    Commands: ["bansay","banlar"],
    Usage: "bansay",
    Description: "",
    Category: "General",
    Activity: true
}