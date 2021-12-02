const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const Config = require("../../Configuration/Config.json");
const moment = require("moment");
require("moment-duration-format")

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {
	if (!message.guild) return;

    var user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let embed = new MessageEmbed().setColor(Config.EmbedColor).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
    if (message.guild.members.cache.has(user.id)) {
        let member = message.guild.members.cache.get(user.id);
        const members = message.guild.members.cache.filter(x => !x.user.bot).array().sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
        const joinPos = members.map((u) => u.id).indexOf(member.id);
        const roles = member.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
        const rolleri = [];

        if (roles.length > 6) {
            const lent = roles.length - 6;
            let itemler = roles.slice(0, 6);
            itemler.map(x => rolleri.push(x));
            rolleri.push(`${lent}...`);
        }
         else {
            roles.map(x => rolleri.push(x));
        };
        
embed.setDescription(`**➜ Kullanıcı Bilgisi**
\`•\` Hesap: ${user}
\`•\` Kullanıcı ID: \`${member.id}\`
\`•\` Kuruluş Tarihi: \`${moment(member.user.createdTimestamp).locale("tr").format("LLL")} - (${moment(member.user.createdTimestamp).locale("tr").fromNow()})\`
\`•\` Status Durum: ${member.presence.status.replace('online', '\`Online\`').replace('idle', '\`Idle\`').replace('dnd', '\`Dnd\`').replace('offline', '\`Offline\`')}

**➜ Sunucu Bilgisi**
\`•\` Takma İsmi: \`${member.displayName}\`
\`•\` Katılım Tarihi: \`${moment(member.joinedAt).locale("tr").format("LLL")} - (${moment(member.joinedAt).locale("tr").fromNow()})\`
\`•\` Sunucuya Katılma Tarihi: \`${moment(member.joinedAt).format('D/MMMM/YYYY')}\`
\`•\` Rolleri (${rolleri.length}): ${rolleri.join(", ")}`)
embed.setColor(Config.EmbedColor)}
message.lineReply(embed).then(x => x.delete({timeout: 20000}));

 }



module.exports.settings = {
    Commands: ["kb","kullanıcı-bilgi","i","user","kullanıcıbilgi","User "],
    Usage: "User",
    Description: "",
    Category: "Advanced",
    Activity: true
}
