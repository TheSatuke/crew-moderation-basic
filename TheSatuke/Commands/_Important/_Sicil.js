const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Config = require("../../Configuration/Config.json");
const Settings = require("../../Configuration/Settings.json");
const moment = require("moment");
const Penal = require("../../Models/Database/Penal");
require("moment-timezone");
require("moment-duration-format")
moment.locale("tr")

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Roles.Commander.some(authRole => message.member.roles.cache.has(authRole)))
    return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));

    let victim = message.mentions.users.first() || (args[0] ? await client.getUser(args[0]) : undefined);
    if (!victim) return message.lineReply(`${Settings.emojiler.iptal} Cezalarına bakacagın kişiyi etiketlemelisin.`)

    Penal.find({ User: victim.id }, async (err, res) => {
        if (err) return message.lineReply(`${Settings.emojiler.iptal} Botta bir takım problemler yaşanıyor.`);
        res = res.reverse();

           let page = 1;
           const liste = res.map((e, i) => `\`#${e.Id}:\` \`${e.Activity == true ? "#Online" : "#Offline"}\` **(${e.Type})** <@${e.Admin}>: **${e.Reason}** - ${moment(e.Time).tz("Europe/Istanbul").format("YYYY.MM.DD HH:mm:ss")} `);

        var msg = await message.lineReply(new MessageEmbed()
            .setDescription(`${victim} Kullanıcısının geçmiş ve şuanki cezaları aşşağıda belirtilmiştir.`)
            .setColor(Config.EmbedColor)
            .addField(`➜ Kullanıcının Cezaları`, `${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n")} ** **`, true)
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))).then(e => e);

        if (liste.length > 10) {
            await msg.react(`◀`);
            await msg.react(`▶`);
            await msg.react(`❌`);

            let collector = msg.createReactionCollector((react, user) => ["◀", "▶", "❌"].some(e => e == react.emoji.name) && user.id == message.member.id, {
                time: 200000
            });

            collector.on("collect", (react, user) => {
                if (react.emoji.name == "▶") {
                    if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                    page += 1;
                    let newList = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit(new MessageEmbed()
                        .setColor(Config.EmbedColor)
                        .setDescription(`${victim} Kullanıcısının geçmiş ve şuanki cezaları aşşağıda belirtilmiştir.`)
                        .addField(`➜ Kullanıcının Cezaları`, `${newList} ** **`, true)
                        .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })));
                }
                if (react.emoji.name == "◀") {
                    if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                    page -= 1;
                    let newList = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit(new MessageEmbed()
                        .setDescription(`${victim} Kullanıcısının geçmiş ve şuanki cezaları aşşağıda belirtilmiştir.`)
                        .addField(`➜ Kullanıcının Cezaları`, `${newList} ** **`, true)
                        .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })));
                }
                if (react.emoji.name == "❌") {
                    msg.delete();
                    collector.stop();
                }
            })
        }
    });
}
module.exports.settings = {
    Commands: ["sicil","geçmiş"],
    Usage: "sicil <member>",
    Description: "Etiketlediğin kişinin sunucu içerisinde aldığı cezaları listelersin.",
    Category: "General",
    Activity: true,
    cooldown: 15000
}