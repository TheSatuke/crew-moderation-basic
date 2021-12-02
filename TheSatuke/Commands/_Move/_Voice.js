const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const moment = require("moment");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {

  let victim = message.mentions.members.first() || (args[0] ? await message.guild.getMember(args[0]) : undefined);
  if (!victim) 
  return message.lineReply(`${Settings.emojiler.iptal} Birisini Etiketlemelisin..`);
  message.lineReply(`> ${Settings.emojiler.tik} Bu Kullanıcı ${victim.voice.channelID ? "**<#" + victim.voice.channel.id + ">** Kanalında seste." : "Herhangi bir kanalda değil."}`);
}

module.exports.settings = {
    Commands: ["n","nerde","Seskontrol","ses-kontrol"],
    Usage: "voice",
    Description: "",
    Category: "General",
    Activity: true
}