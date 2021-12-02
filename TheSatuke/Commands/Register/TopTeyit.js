const teyitci = require("../../Models/Database/Teyitci");
const kayitlar = require("../../Models/Database/Kayıtlar");
const Config = require("../../Configuration/Config.json");
const Text = require("../../Configuration/Text.json");
const Settings = require("../../Configuration/Settings.json");

const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args) => {
  let embed = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setColor("PURPLE");
  let data = await teyitci.find({}).then(x => x)
  message.channel.send(embed.setDescription(`\`>\` Teyit Listesi \n\n ${data.length ? data.map((d, index) => `\`${index+1}.\` <@${d._id}>`).join("\n") : "Teyitçi bulunamadı.."}`)).then(x => x.delete({ timeout: 5000 }));
  };

  module.exports.settings = {
    Commands: ["Topteyit"],
    Usage: "topteyit",
    Description: "Top 20 teyitçi listesi.",
    Category: "General",
    Activity: true
}
