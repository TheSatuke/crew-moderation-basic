const { MessageEmbed } = require('discord.js');
const Settings = require("../../Configuration/Settings.json");
const Text = require("../../Configuration/Text.json");
const Config = require("../../Configuration/Config.json");


module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Perm.Owner.some(authRole => message.member.roles.cache.has(authRole))) 
    return message.lineReply(`${Settings.emojiler.iptal} ${Text.YetkinYetmiyor}`);

    var embed = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setFooter(Config.Footer).setColor(Settings.Perm.Color)
    let tag = "Shiva"
    let tag2 = "Shivâ"
    let tag3 = "SHIVA"
    let tag4 = "?"
    let tag5 = `1784`
    let etiket = "1784"

    let rol = "918993283240312853"
    let taglilar = message.guild.members.cache.filter(s => s.user.username.includes(tag) && !s.roles.cache.has(rol))
    let taglilar2 = message.guild.members.cache.filter(s => s.user.username.includes(tag2) && !s.roles.cache.has(rol))
    let taglilar3 = message.guild.members.cache.filter(s => s.user.username.includes(tag3) && !s.roles.cache.has(rol))
    let taglilar4 = message.guild.members.cache.filter(s => s.user.username.includes(tag4) && !s.roles.cache.has(rol))
    let taglilar5 = message.guild.members.cache.filter(s => s.user.username.includes(tag5) && !s.roles.cache.has(rol))
    let etiketliler = message.guild.members.cache.filter(s => s.user.discriminator.includes(etiket) && !s.roles.cache.has(rol))
    let tagsizlar = message.guild.members.cache.filter(s => !s.user.username.includes(tag) && s.user.discriminator.includes(etiket) && !s.user.username.includes(tag2) && s.user.username.includes(tag3) && s.user.username.includes(tag4) && s.user.username.includes(tag5) && s.roles.cache.has(rol))


    taglilar.array().forEach(async(member, index) => {  
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 4000)
    })
    taglilar5.array().forEach(async(member, index) => {  
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 4000)
    })
    taglilar4.array().forEach(async(member, index) => {  
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 4000)
    })
    
    taglilar2.array().forEach(async(member, index) => {
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 4000)
    })
    
    taglilar3.array().forEach(async(member, index) => {
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 4000)
    })
    
    etiketliler.array().forEach(async(member, index) => {
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 4000)
    })
    tagsizlar.array().forEach(async(member, index) => {
        setTimeout(async() => {
            await member.roles.set("918993283240312853")
        }, index * 1000)
    })
  
    embed.setDescription(`
Tagımızı taşıyan ama rolü olmayan **${taglilar.size + taglilar2.size + taglilar3.size + etiketliler.size + taglilar4.size + taglilar5.size}** üyeye <@&${rol}> rolü verildi.`)
    message.channel.send(embed)
}
module.exports.settings = {
    Commands: ["1784","tagt"],
    Usage: "tagt",
    Description: "Sunucunun bilgilerini atar.",
    Category: "General",
    Activity: true
}
