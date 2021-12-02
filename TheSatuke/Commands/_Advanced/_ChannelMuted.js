const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

  /** 
  * @param {Client} client 
  * @param {Message} message 
  * @param {Array<String>} args 
  */  

module.exports.execute = async (client, message, args) => {

    if(!message.member.hasPermission("ADMINISTRATOR")) return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));

    let firstChannel = message.member.voice.channel.id;
    if(!firstChannel) return message.channel.send(`${Settings.emojiler.iptal} Bir Ses Kanalında Bulunmak Zorundasın.`);

    if(!message.guild.channels.cache.get(firstChannel).members.array().filter(x => x.id !== message.member.id).size <= 0) return message.channel.send(`${Settings.emojiler.iptal} Bulunduğun kanalda senden başkası **bulunmuyor!**`)
    let firstChannelMembers = message.guild.channels.cache.get(firstChannel).members.array().filter(x => x.id !== message.member.id);

firstChannelMembers.forEach((x, i) => {
  setTimeout(async () => {
    x.voice.setMute(true)
  }, i*200)
})

await message.lineReply(`> ${Settings.emojiler.tik} **<#${message.guild.channels.cache.get(firstChannel).id}>** Adlı Kanaldaki  \`${firstChannelMembers.length}\` Üye Susturuldu!`)
},

module.exports.settings = {
    Commands: ["allmute","all-mute","herkesi-sustur","herkesisustur"],
    Usage: "allmute",
    Description: "",
    Category: "Advanced",
    Activity: true
}