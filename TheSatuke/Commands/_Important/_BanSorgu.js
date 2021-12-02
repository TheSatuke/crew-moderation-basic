const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Config = require("../../Configuration/Config.json");
const Settings = require("../../Configuration/Settings.json");
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Ban.AuthRoles.some(authRole => message.member.roles.cache.has(authRole)))
    return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));
  
if (!message.guild) return;
let embed = new MessageEmbed()
embed.setColor(Config.EmbedColor);
embed.setFooter(Config.Status);
embed.setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
if(!args[0]) return message.lineReply(embed.setDescription(`${Settings.emojiler.iptal} Geçerli bir kullanıcı ID si giriniz.`))
await client.users.fetch(args[0]).then(res => {
    if(!res){
        embed.setDescription(`${Settings.emojiler.iptal} Geçerli bir kullanıcı ID si giriniz.`)
        return message.lineReply(embed)
    }else{
        message.guild.fetchBans(true).then(async(bans) => {
            let ban = await bans.find(a => a.user.id === res.id)
            if(!ban){
                embed.setDescription(`${Settings.emojiler.iptal} \`${res.tag}\` Bu sunucuda yasaklı değil.`)
                return message.lineReply(embed)
            }else{
                let text = `🚫 **${res.tag}** (\`${res.id}\`) Adlı üye sunucumuzdan yasaklanma bilgileri: \n\n\`\`\`"${ban.reason || "Sebep Belirtilmemiş."}"\`\`\``
                message.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD', limit: 100}).then(audit => {
                    let user = audit.entries.find(a => a.target.id === res.id)
                    if(user){
                        embed.setDescription(text + `\n\n\`•\` Yasaklayan Kullanıcı: \`${user.executor.tag}\` (\`${user.executor.id}\`)\n\`•\` Yasaklanma Tarihi: \`${moment(user.createdAt).format("lll")}\``)
                        return message.lineReply(embed)
                    }else{
                        embed.setDescription(text + `\n\n${Settings.emojiler.iptal} Bu yasaklama, son 100 yasaklama içinde olmadığından dolayı ban bilgisini yazamıyorum.`)
                        return message.lineReply(embed)
                    }
                })
            }
        })
    };
}).catch(err => {
    embed.setDescription(`${Settings.emojiler.iptal} Geçerli bir kullanıcı ID si giriniz.`)
        return message.lineReply(embed)
})
}

module.exports.settings = {
   Commands: ["bansorgu","baninfo","ban-sorgu","ban-info","b"],
   Usage: "bansorgu",
   Description: "Bahsettiğin kişinin ban sebebini öğrenirsin.",
   Category: "General",
   Activity: true
}