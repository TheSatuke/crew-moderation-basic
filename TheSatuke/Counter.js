const { Discord, Client, MessageEmbed } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const guildInvites = new Map();

const Config = require("./Configuration/Config.json");
const Settings = require("./Configuration/Settings.json");
const Counter = require("./Configuration/Bot_Token.json");

const mongoose = require('mongoose');
mongoose.connect(Config.DatabaseUrl,{ useNewUrlParser: true, useUnifiedTopology: true });
let elmas = "<a:1784_elmas:915735967783067678>"
client.on("ready", async () => {
  client.user.setPresence({ activity: { name: Config.Status }, status: "dnd" });
  let botVoiceChannel = client.channels.cache.get(Config.VoiceChannel);
  if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
  client.guilds.cache.forEach(guild => {
  guild.fetchInvites().then(invites => guildInvites.set(guild.id, invites)).catch(err => console.log(err));
  });
});    

client.on("message", async message => {
    if (message.content === ".gir invite") {if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Bu Komudu kullanamazsın!");
      client.emit(
        "guildMemberAdd",
        message.member || (await message.guild.fetchMember(message.author))
      );
    }
  });
  
client.on("inviteCreate", async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on("inviteDelete", invite => setTimeout(async () => { guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()); }, 5000));
const Database = require("./Models/Database/Invıte");
client.on("guildMemberAdd", async member => {
  let cachedInvites = guildInvites.get(Settings.Server.Id);
  let newInvites = await member.guild.fetchInvites();
  let usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses) || cachedInvites.find(inv => !newInvites.has(inv.code)) || {code: member.guild.vanityURLCode, uses: null, inviter: {id: null}};
  let inviter = client.users.cache.get(usedInvite.inviter.id) || {id: member.guild.id};
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;
  let inviteChannel = client.channels.cache.get(Settings.Server.İnviteLog);
  Database.findOne({ guildID: member.guild.id, userID: member.id }, (err, joinedMember) => {
    if (!joinedMember) {
      let newJoinedMember = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: member.id,
          inviterID: inviter.id,
          regular: 0,
          bonus: 0,
          fake: 0
      });
      newJoinedMember.save();
    } else {
      joinedMember.inviterID = inviter.id;
      joinedMember.save();
    };
  });
  if (isMemberFake) {
    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: inviter.id,
          inviterID: null,
          regular: 0,
          bonus: 0,
          fake: 1
        });
        newInviter.save().then(x => {
          if (inviteChannel) inviteChannel.send(`${elmas} ${member} Sunucuya Katıldı, Davet eden kişi \`${inviter.name == member.guild.id ? member.guild.name : inviter}\`, Ulaştığı davet sayısı (\`${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}\`)`).catch(err => {});
        });
      } else {
        inviterData.fake++
        inviterData.save().then(x => {
          if (inviteChannel) inviteChannel.send(`${elmas} ${member} Sunucuya Katıldı, Davet eden kişi \`${inviter.name == member.guild.id ? "Vanity Url" : inviter}\`,  Ulaştığı davet sayısı (\`${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}\`)`).catch(err => {});
        });
      };
    });
  } else {
    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
        if (!inviterData) {
          let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 1,
            bonus: 0,
            fake: 0
          });
          newInviter.save().then(x => {
            if (inviteChannel) inviteChannel.send(`${elmas} ${member} Sunucuya Katıldı, Davet eden kişi \`${inviter.name == member.guild.id ? member.guild.name : inviter}\`, Ulaştığı davet sayısı (\`${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}\`)`).catch(err => {});
          });
        } else {
          inviterData.regular++;
          inviterData.save().then(x => {
            if (inviteChannel) inviteChannel.send(`${elmas} ${member} Sunucuya Katıldı, Davet eden kişi \`${inviter.name == member.guild.id ? member.guild.name : inviter}\`, Ulaştığı davet sayısı (\`${(x.regular ? x.regular : 0)+(x.bonus ? x.bonus : 0)}\`)`).catch(err => {});
          });
        };
      });
  };
  guildInvites.set(member.guild.id, newInvites);
});

client.on("guildMemberRemove", async member => {
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;
  let inviteChannel = client.channels.cache.get(Settings.Server.İnviteLog);
  Database.findOne({ guildID: member.guild.id, userID: member.id }, async (err, memberData) => {
    if (memberData && memberData.inviterID) {
      let inviter = client.users.cache.get(memberData.inviterID) || {id: member.guild.id};
      Database.findOne({ guildID: member.guild.id, userID: memberData.inviterID }, async (err, inviterData) => {
        if (!inviterData) {
         let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 0,
            bonus: 0,
            fake: 0
          });
          newInviter.save();
        } else {
          if (isMemberFake) {
            if (inviterData.fake-1 >= 0) inviterData.fake--;
          } else {
            if (inviterData.regular-1 >= 0) inviterData.regular--;
          };
          inviterData.save().then(x => {
            if (inviteChannel) inviteChannel.send(`📤 \`${member.user.tag}\` Sunucudan ayrıldı`).catch(err => {});
          });
        };
      });
    } else {

      if (inviteChannel) inviteChannel.send(`📤 \`${member.user.tag}\` Sunucudan ayrıldı`).catch(err => {});
    };
  });
});




client.on("message", async message => {
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(Config.Prefix)) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(Config.Prefix.length);

  if (command === "davetlerim" || command === "invites" || command === "rank" || command === "invite" || command === "me") {
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let embed = new MessageEmbed().setAuthor(uye.displayName, uye.user.displayAvatarURL({dynamic: true})).setColor(Config.EmbedColor).setFooter(Config.Footer).setTimestamp();
    Database.findOne({guildID: message.guild.id, userID: uye.id}, (err, inviterData) => {
      if (!inviterData) {
        embed.setDescription(`VeriTabanında Davet Bilgin Yok!`);
        message.react(Settings.emojiler.onayID) && message.channel.send(embed);
      } else {

        Database.find({guildID: message.guild.id, inviterID: uye.id}).sort().exec((err, inviterMembers) => {
          let dailyInvites = 0;
          let HaftalıkDavet = 0;
          let AylıkDavet = 0;
          if (inviterMembers.length) {

            dailyInvites = inviterMembers.filter(x => message.guild.members.cache.has(x.userID) && (Date.now() - message.guild.members.cache.get(x.userID).joinedTimestamp) < 1000*60*60*24).length;
            HaftalıkDavet = inviterMembers.filter(x => message.guild.members.cache.has(x.userID) && (Date.now() - message.guild.members.cache.get(x.userID).joinedTimestamp) < 7000*60*60*24).length;
            AylıkDavet = inviterMembers.filter(x => message.guild.members.cache.has(x.userID) && (Date.now() - message.guild.members.cache.get(x.userID).joinedTimestamp) < 30000*60*60*24).length;

          };
          embed.setDescription(`**Günlük, Haftalık, Aylık Davet Davet Bilgilerin Aşşağıda Belirtilmiştir.**`)
          embed.addField('➜ Toplam Davet:',`\`\`\`ARM
${inviterData.regular+inviterData.bonus}\`\`\``,true)
embed.addField('➜ Bonus:',`\`\`\`ARM
${inviterData.bonus}\`\`\``,true)
embed.addField('➜ Fake:',`\`\`\`ARM
${inviterData.fake}\`\`\``,true)
embed.addField('➜ Günlük:',`\`\`\`ARM
${dailyInvites}\`\`\``,true)
embed.addField('➜ Haftalık:',`\`\`\`ARM
${HaftalıkDavet}\`\`\``,true)
embed.addField('➜ Aylık:',`\`\`\`ARM
${AylıkDavet}\`\`\``,true)

embed.setThumbnail(message.author.displayAvatarURL({dynamic: true, size: 1024}))

          
          message.react(Settings.emojiler.onayID) && message.channel.send(embed);
        });
      };
    });
  };

  if (command === "bonus") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    let uye = message.mentions.members.first () || message.guild.members.cache.get(args[0]);
    let sayi = args[1];
    if (!uye || !sayi) return message.react(Settings.emojiler.iptalID) && message.reply(`Geçerli bir Üye ve sayı belirt`);
    Database.findOne({guildID: message.guild.id, userID: uye.id}, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          userID: uye.id,
          inviterID: null,
          regular: 0,
          bonus: sayi,
          fake: 0
        });
        newInviter.save().then(x => message.reply(`Kullanıcının Bonus Davet Verisine **${sayi}** eklendi!`));
      } else {
        eval(`inviterData.bonus = inviterData.bonus+${Number(sayi)}`);
        inviterData.save().then(x => message.reply(`Kullanıcının Bonus Davet Verisine **${sayi}** eklendi!`));
      };
    });
  };

  if (command === "top" || command === "sıralama" || command === "top 10") {

    let embed = new MessageEmbed()
    .setColor("purple")
    .setThumbnail(message.guild.iconURL({dynamic: true}))
    .setThumbnail()
    .setFooter(Config.Footer , message.author.avatarURL({dynamic:true}));
    
    let currentPage = 1;
    Database.find({guildID: message.guild.id}).sort().exec(async (err, pageArray) => {
      pageArray = pageArray.filter(x => message.guild.members.cache.has(x.userID)).sort((uye1, uye2) => ((uye2.regular ? uye2.regular : 0)+(uye2.bonus ? uye2.bonus : 0))-((uye1.regular ? uye1.regular : 0)+(uye1.bonus ? uye1.bonus : 0)));
      if (err) console.log(err);
      if (!pageArray.length) {
        message.react(Settings.emojiler.iptalID) && message.channel.send(embed.setDescription("**Veritabını üzerinde herhangi bir davet verisi bulamıyorum :c**"));
      } else {
        let pages = pageArray.chunk(10);
        if (!pages.length || !pages[currentPage - 1].length) return message.react(Settings.emojiler.iptalID) && message.channel.send("**Veritabanında daveti olan üye bulunamadı!**");
        let msg = await message.channel.send(embed);
        let reactions = ["◀", "❌", "▶"];
        for (let reaction of reactions) await msg.react(reaction);
        if (msg) await msg.edit(embed.setDescription(`\`\`\`${message.guild.name} Sunucusunun davet sıralaması:\`\`\`\n${pages[currentPage - 1].map((kisi, index) => `\`${index+1}.\` ${message.guild.members.cache.get(kisi.userID).toString()}  \`-\`  \`${kisi.regular+kisi.bonus}\` Daveti Var`).join('\n')}`).setFooter(`${Config.Footer} - Şu anki sayfa: ${currentPage}`));
        const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id,
              { time: 20000 }),
            x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, 
              { time: 20000 }),
            go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id,
              { time: 20000 });
          back.on("collect", async reaction => {
          await reaction.users.remove(message.author.id).catch(err => {});
          if (currentPage == 1) return;
            currentPage--;
            if (msg) msg.edit(embed.setDescription(`**Sunucusunun davet sıralaması:**\n${pages[currentPage - 1].map((kisi, index) => `\`${index+1}.\` ${message.guild.members.cache.get(kisi.userID).toString()}  \`-\`  \`${kisi.regular+kisi.bonus}\` Daveti Var`).join('\n')}`).setFooter(`${Config.Footer} - Şu anki sayfa: ${currentPage}`));
          });
    
          go.on("collect", async reaction => {
            await reaction.users.remove(message.author.id).catch(err => {});
              if (currentPage == pages.length) return;
              currentPage++;
              if (msg) msg.edit(embed.setDescription(`\`\`\`${message.guild.name} Sunucusunun davet sıralaması:\`\`\` \n${pages[currentPage - 1].map((kisi, index) => `\`${index+1}.\` ${message.guild.members.cache.get(kisi.userID).toString()}  \`-\`  \`${kisi.regular+kisi.bonus}\` Daveti Var`).join('\n')}`).setFooter(`${Config.Footer} - Şu anki sayfa: ${currentPage}`));
          });
    
          x.on("collect", async reaction => {
            await back.stop();
            await go.stop();
            await x.stop();
            if (message) message.delete().catch(err => {});
            if (msg) return msg.delete().catch(err => {});
          });
          back.on("end", async () => {
            await back.stop();
            await go.stop();
            await x.stop();
            if (message) message.delete().catch(err => {});
            if (msg) return msg.delete().catch(err => {});
          });
      };
    });
  };
});


client.tarihHesapla = (date) => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(new Date() - startedAt);

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor((msecs / (1000 * 60)));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;

  string = string.trim();
  return `\`${string} önce\``;
};

Array.prototype.chunk = function(chunk_size) {
  let myArray = Array.from(this);
  let tempArray = [];
  for (let index = 0; index < myArray.length; index += chunk_size) {
    let chunk = myArray.slice(index, index + chunk_size);
    tempArray.push(chunk);
  }
return tempArray;
};
client.login(Counter.İnvite_Token).then(x => console.log(`Counter Başarıyla Giriş Yaptı!
---------------------------------------`)).catch(err => console.error(`Bota Giriş Yapılamadı.!\n ∞ Hata : ${err}`))
