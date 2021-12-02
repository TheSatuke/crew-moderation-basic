const Discord = require("discord.js")
const moment = require("moment");
const Settings = require("../../Configuration/Settings.json");
const Text = require("../../Configuration/Text.json");
require("moment-duration-format")
moment.locale("tr")
const db = require('../../Models/Database/TopluUnBan');
    module.exports.execute = async (client, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR"))
        if (args.length < 1)
        return message.lineReply(
            `${Settings.emojiler.iptal} ${Text.BirKullanıcıBelirt}`
        );
    const members = args
        .filter((id) => message.guild.members.cache.has(id))
        .map((id) => message.guild.member(id));
    if (members.length < 1)
        return message.channel.send(
            "Banlanacak kişilerin sunucuda olması gerekir.",
        );
        
    const prompt = await message.channel.send(
        `${members
            .map((member, idx) => `\`${idx + 1}.\` ${member.toString()} (\`${member.id}\`)`)
            .join("\n")}\n\n\`\`\`Bu üyeleri banlamak istiyor musun?\`\`\``,
    );
    await prompt.react(Settings.emojiler.onayID);
    const collector = prompt.createReactionCollector(
        (reaction, user) =>
            reaction.emoji.name === Settings.emojiler.onayID && user.id === message.author.id,
        { time: 1000 * 15 },
    );

    collector.on("collect", async () => {
        await prompt.edit(`${members.length} adet kullanıcı başarıyla yasaklandı.`);
        for (const member of members) {
            if (member.bannable)
                await member.ban({ days: 7, reason: "Toplu ban" });
        }
        collector.stop();
    });

    collector.on("end", (_, reason) => {
        console.log("end", reason);
        if (reason === "time")
            prompt.edit("\`\`\`15 saniye geçtiği için işlem iptal edildi\`\`\`");
    });
    }

module.exports.settings = {
    Commands: ["topluban"],
    Usage: "toplu-ban",
    Activity: true,
    permLevel: 7,
    Category: "Owner",
    cooldown: 10000
}