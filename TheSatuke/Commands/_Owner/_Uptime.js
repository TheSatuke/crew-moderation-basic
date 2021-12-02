const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
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
if (message.author.id !== "707325480378040430") return
let up = moment.duration(client.uptime).format(" D [gün], H [saat], m [dakika], s [saniye]");
message.channel.send(`${Settings.emojiler.tik} Yaklaşık **${up}** önce çalışmaya başladım.`)
}
module.exports.settings = {
    Commands: ["uptime"],
    Usage: "uptime",
    Activity: true,
    Category: "Owner",
    cooldown: 10000
}