const client = global.Client;
const { Client, MessageEmbed } = require("discord.js");
const db = require("quick.db")
const moment = require("moment");

const disbut = require('discord-buttons');
require("discord-buttons")(client)

const Config = require("./Configuration/Config.json");
const Settings = require("./Configuration/Settings.json");
const Moderator = require("./Configuration/Bot_Token.json");

const _1784 = require("./Managers/EventManager");
_1784.addEvent("autoReply")
_1784.addEvent("CommandHandler");
_1784.addEvent("messageUpdate");
_1784.addEvent("Timer.js");
_1784.addEvent("Penal/OnMemberUpdate");
_1784.addEvent("Penal/OnReady");
_1784.addEvent("Penal/OnVoiceStateUpdate");
_1784.addEvent("Tag/UserUpdate");

require("./Utils/Helper");
require("./Utils/Patch");

client.on("ready", async () => {
client.user.setPresence({ activity: { name: Config.Status }, status: "dnd" });
let botVoiceChannel = client.channels.cache.get(Config.VoiceChannel);
if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Moderator | Ses Kanalına Bağlanamadı!"))});

client.on("message", async (message) => {
    const args = message.content.split(" ");
    const command = args.shift();
    if (command === "!etkinlik" && "707325480378040430" == message.author.id) {
    let ETK = new disbut.MessageButton().setStyle('green').setEmoji('🎉').setLabel('Etkinlik Katılımcısı!').setID('ETK')
    let CEKİLİS = new disbut.MessageButton().setStyle('red').setEmoji('🎁').setLabel('Çekiliş Katılımcısı!').setID('CEKİLİS')
    message.channel.send(`**Merhaba Shiva #1784 ${Settings.emojiler.yıldız}

Kayıtlı - kayıtsız bu kanalı hepiniz görebilmektesiniz. Sunucumuz'da fazla etiket atmamak adına ve sizlere kolaylık sağlamak adına iki farklı rol alabilmenizi sağlıyoruz. 

<a:nitro:916048637920960532> , <:netflix:916041632527286352> , <:exxen:916041666115289138> , <:Spotify:916041601053245500> Gibi çekilişlere katılmak için <@&915176035794960404>, Kırmızı koltuk , Doğruluk ve Cesaretlik vb. Etkinlikler için de <@&915176036600254464> rollerini aşağıdaki butonlara basarak alabilirsiniz.**

@everyone & @here`, {
        buttons: [CEKİLİS, ETK]
    });
}
});

client.on('clickButton', async (button) => {
    if (button.id === 'CEKİLİS') {
        if (button.clicker.member.roles.cache.get("915176035794960404")) {
            await button.clicker.member.roles.remove("915176035794960404");
            await button.reply.send('Rol Başarıyla Üzerinden Alındı!', true);
          } else {
            await button.clicker.member.roles.add("915176035794960404");
            await button.reply.send('Rol Başarıyla Üzerine Eklendi!', true);
  
          }
    }
    if (button.id === 'ETK') {
        if (button.clicker.member.roles.cache.get("915176036600254464")) {
            await button.clicker.member.roles.remove("915176036600254464");
            await button.reply.send('Rol Başarıyla Üzerinden alındı!', true);
        } else {
            await button.clicker.member.roles.add("915176036600254464");
            await button.reply.send('Rol Başarıyla Üzerine Eklendi!', true);
        }

    }

});


client.on("message" , message => {
if(!message.guild) return;
if (message.content.includes(`afk`)) return;
let etiket = message.mentions.users.first()
let uye = db.fetch(`user_${message.author.id}_${message.guild.id}`)
let nickk = db.fetch(`nick_${message.author.id}_${message.guild.id}`)
if(etiket){
let reason = db.fetch(`sebep_${etiket.id}_${message.guild.id}`)
let uye2 = db.fetch(`user_${etiket.id}_${message.guild.id}`)
if(message.content.includes(uye2)){
message.channel.send(`${etiket} adlı kullanıcı **${reason}** sebebiyle afk.`)}}
if(message.author.id === uye){  
message.member.setNickname(nickk)
  db.delete(`sebep_${message.author.id}_${message.guild.id}`)
  db.delete(`user_${message.author.id}_${message.guild.id}`)
  db.delete(`nick_${message.author.id}_${message.guild.id}`)
  db.delete(`user_${message.author.id}_${message.guild.id}`);
message.channel.send(`${message.author} (\`${message.author.id}\`) Başarıyla **Afk** modundan çıktın`)}  
})


client.on("messageDelete", async message => {
if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
await db.set(`snipe.${message.guild.id}.${message.channel.id}`, { 
    yazar: message.author.id,
    yazilmaTarihi: message.createdTimestamp, 
    silinmeTarihi: Date.now(), 
    dosya: message.attachments.first() ? true : false });
if (message.content) db.set(`snipe.${message.guild.id}.${message.channel.id}.icerik`, message.content);
}
);

client.on("message", async message => {
  if (message.content === ".gir") {if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("YARRAMI YE KNK");
    client.emit(
      "guildMemberAdd",
      message.member || (await message.guild.fetchMember(message.author))
    );
  }
});
client.on("guildMemberAdd", member => {

  member.roles.add(Settings.Roles.Unregistered);

  require("moment-duration-format")
  
  const kanal = member.guild.channels.cache.find(r => r.id === Settings.Server.WelcomeChannel)
  let user = client.users.cache.get(member.id);
  const kurulus = new Date().getTime() - user.createdAt.getTime();
  var kontrol;
  if (kurulus < 604800) kontrol = Settings.emojiler.iptal
  if (kurulus > 604800) kontrol = Settings.emojiler.tik

moment.locale("tr");
kanal.send(`${Settings.emojiler.yıldız} **Shiva #1784** Ekibine Hoş geldin ${member}, hesabın **${moment(member.user.createdTimestamp).format("LLL")}** tarihinde  (**${moment(member.user.createdAt).add(7, 'days').fromNow().replace("Az", " ")}**) oluşturulmuş! ${kontrol}
  
Seninle birlikte ailemiz **${member.guild.memberCount}** kişi sayısına ulaştı, Senin ile <@&${Settings.Roles.RegisterID}> rolündekiler ilgilenecektir.

Sunucu kurallarımız <#915176072188944437> kanalında belirtilmiştir. Unutma sunucu içerisinde ki **Ceza-i işlemler** kuralları okuduğunu varsayarak gerçekleştirilecek.
  
Tagımıza ulaşmak için herhangi bir kanala **.tag** yazabilirsiniz.`)
})




client.on("userUpdate", async function(oldUser, newUser) {
  let tag = ("shiva")
  const roleID = (Settings.Tag.Role)
  const guildID = (Settings.Server.Id)
  const log2 = Settings.Tag.Log
  const etiket = "1784"
  const guild = client.guilds.cache.get(guildID)
  const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
  

          const member = guild.members.cache.get(newUser.id)
  if (newUser.username !== oldUser.username) {
      if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
          member.roles.set(Settings.Roles.Unregistered)
          member.roles.remove(roleID)

        client.channels.cache.get(log2).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı çıkartarak bize veda etti.`)
      } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
          member.roles.add(roleID)
          client.channels.cache.get(log2).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı ismine alarak aramıza katıldı.`)
      }
  }

  
  
  if (newUser.discriminator !== oldUser.discriminator) {
      if (oldUser.discriminator == `${etiket}` && newUser.discriminator !== `${etiket}`) {
          member.roles.set(Settings.Roles.Unregistered)
          client.channels.cache.get(log2).send(`${newUser} - (\`${newUser.id}\`) (\`#${etiket}\`) Adlı tagımızı çıkartarak bize veda etti.`)
      } else if (oldUser.discriminator !== `${etiket}` && newUser.discriminator == `${etiket}`) {
          member.roles.add(roleID)
          client.channels.cache.get(log2).send(`${newUser} - (\`${newUser.id}\`) (\`#${etiket}\`) Adlı tagımızı ismine alarak aramıza katıldı.`)
      }
  }

}) 



client.on("userUpdate", async function(oldUser, newUser) {
  let tag = ("SHİVA")
  const roleID = (Settings.Tag.Role)
 const guildID = (Settings.Server.Id)
  const log3 = Settings.Tag.Log
  const guild = client.guilds.cache.get(guildID)
  const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
  

          const member = guild.members.cache.get(newUser.id)
  if (newUser.username !== oldUser.username) {
      if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
          member.roles.set(Settings.Roles.Unregistered)
          member.roles.remove(roleID)

        client.channels.cache.get(log3).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı çıkartarak bize veda etti.`)
      } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
          member.roles.add(roleID)
          client.channels.cache.get(log3).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı ismine alarak aramıza katıldı.`)
      }
    }
  }
)

client.on("userUpdate", async function(oldUser, newUser) {
  let tag = (`SHIVA`)
  const roleID = (Settings.Tag.Role)
  const guildID = (Settings.Server.Id)
  const log3 = Settings.Tag.Log
  const guild = client.guilds.cache.get(guildID)
  const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
  

          const member = guild.members.cache.get(newUser.id)
  if (newUser.username !== oldUser.username) {
      if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
          member.roles.set(Settings.Roles.Unregistered)
          member.roles.remove(roleID)

        client.channels.cache.get(log3).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı çıkartarak bize veda etti.`)
      } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
          member.roles.add(roleID)
          client.channels.cache.get(log3).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı ismine alarak aramıza katıldı.`)
      }
    }
  }
)

client.on("userUpdate", async function(oldUser, newUser) {
  let tag = (`Shivâ`)
  const roleID = (Settings.Tag.Role)
  const guildID = (Settings.Server.Id)
  const log3 = Settings.Tag.Log
  const guild = client.guilds.cache.get(guildID)
  const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
  

  const member = guild.members.cache.get(newUser.id)
  if (newUser.username !== oldUser.username) {
      if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
          member.roles.set(Settings.Roles.Unregistered)
          member.roles.remove(roleID)

        client.channels.cache.get(log3).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı çıkartarak bize veda etti.`)
      } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
          member.roles.add(roleID)
          client.channels.cache.get(log3).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı ismine alarak aramıza katıldı.`)
      }
    }
  }
)

client.on("userUpdate", async function(oldUser, newUser) { // kod codaredan alınıp editlenmiştir!
  let tag = (`shivâ`)
  const roleID = (Settings.Tag.Role)
  const guildID = (Settings.Server.Id)
  const log3 = Settings.Tag.Log
  const guild = client.guilds.cache.get(guildID)
  const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
  

  const member = guild.members.cache.get(newUser.id)
  if (newUser.username !== oldUser.username) {
      if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
          member.roles.set(Settings.Roles.Unregistered)
          member.roles.remove(roleID)

        client.channels.cache.get(log3).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı çıkartarak bize veda etti.`)
      } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
          member.roles.add(roleID)
          client.channels.cache.get(log3).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı ismine alarak aramıza katıldı.`)
      }
    }
  }
)

client.on("userUpdate", async function(oldUser, newUser) { // kod codaredan alınıp editlenmiştir!
  let tag = (`?`)
  const roleID = (Settings.Tag.Role)
  const guildID = (Settings.Server.Id)
  const log3 = Settings.Tag.Log
  const guild = client.guilds.cache.get(guildID)
  const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
  

  const member = guild.members.cache.get(newUser.id)
  if (newUser.username !== oldUser.username) {
      if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
          member.roles.set(Settings.Roles.Unregistered)
          member.roles.remove(roleID)

        client.channels.cache.get(log3).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı çıkartarak bize veda etti.`)
      } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
          member.roles.add(roleID)
          client.channels.cache.get(log3).send(`${newUser} - (\`${newUser.id}\`) (\`${tag}\`) Adlı tagımızı ismine alarak aramıza katıldı.`)
      }
    }
  }
)


client.on("voiceStateUpdate",(oldMember, newMember) => {

  if(newMember.channelID != null) {
  db.set(`voiceTime_${oldMember.id}_${oldMember.guild.id}`, new Date());
  }
  
  if(newMember.channelID == null) {
  db.delete(`voiceTime_${oldMember.id}_${oldMember.guild.id}`)
  }
  
   if (oldMember.channelID  != newMember.channelID  ) {
  db.delete(`voiceTime_${oldMember.id}_${oldMember.guild.id}`)
  db.set(`voiceTime_${oldMember.id}_${oldMember.guild.id}`, new Date());
  }
  })
  
client.DateCalculator = (date) => {
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




  const yavsamaSöz = [
  
    'Varlığın dünyada cenneti yaşatıyor bana.',
    'Bir gülüşü var, kelebek görse ömrü uzar.',
    'çünkü sen gittiğinde sokak lambaları gözümü kamaştırıyor', 
    'Seni düşlerken bir tebessüm beliriyor suretimde.',
    'Gölgene sığınırım en çaresiz anımda.',
    'Gamzen diyorum bir ömür sevmelik.',
    'Sen sevilmek için yaratılmışsın.',
    'Varsan var yoksan yokum.',
    'Bu dünya için fazla mükemmelsin.',
    'Yüzümdeki oluşan gülümsemenin sebebisin.',
    'Damlaya damlaya büyütüyorum sevgimi.',
    'Gecemi aydınlatan yıldızımsın.',
    'Gözlerin gökyüzü kadar uçsuz bucaksız.',
    'Ömrümün en güzel mevsimi sensin.',
    'Başıma gelen güzel şeylerin nedeni hep sensin.',
    'Gülüşünde bir şey var hep içime dokunur.',
    'Kendimi sende bulduğum için bu kadar güzelsin.',
    'Varlığın bir çocuğun gülüşü gibi; öyle güzel öyle masum ki.',
    'Uyanmak istemediğim en güzel rüyam sensin.',
    'Masallar elbette güzel; kahramanı sen isen.',
    'Her adımımda senin adını fısıldar yollar…',
    'Sen bana aitsin, Balık denize, bulut gökyüzüne ait.',
    'Her bir kirpiğinin ayrı bir büyüsü var zihnimde.',
    'Derdim de devam da sen oldun haberin yok.',
    'Sen varsan yeter ömrüme. Gerisi hikâye.',
    'Seni kokladığımda, nefes aldığımı hatırlıyorum.',
    'Lütfen üzerine alın! Kimseyi görmedim ben, senden daha güzel gülen.',
    'Fazlası zarar olmayan iki şey; biri sen biri kokun.',
    'Kokunu içime çektiğimde nefes aldığımı anlıyorum.',
    'Bir gülümse bana, o eşsiz gülüşünle güneş açsın hayatımda.',
    'Nasıl anlatsam seni sana? Gökyüzü gibi gözlerinde kaybolabiliyormuş insan.',
    'Sen varsın, bundan güzel bir teselli var mı dünyada?',
    'Gözlerimin gördüğü en güzel şey sensin.',
    'Sesini duydum, huzura kavuştum.',
    'Kalbinin güzelliği yüzüne vurmuş, ben buna ilk kez şahit oluyorum.',
    'Sen benim yeniden kendime gelişim gibisin. Seni görmek sarsıyor insanı, insan yeryüzünde melek görüyor sanki.',
    'Sen hayatın bana verdiği en güzel armağansın.',
    'Bu yeryüzünde sevilmeye dair her şey sende toplanmış',
    'Her şey çirkinken sen nasıl bu kadar güzelsin?',
    'Sen bu dünyada gülüşü olan tek manzaramsın.',
    'Benim bütün hevesim sende. Seninle ilgili her şey heyecanlandırıyor beni.',
    'Benim sadece seninle olmaya ihtiyacım var. Her şey sende toplanmış.',
    'Sen bana hep öyle tatlı tatlı bak emi.',
    'Sen benim için teksin ve bana yetersin.',
    'Biliyor musun? ilk seninle bir dilenciye para verdim. İnanmadığım yapmam dediğim her şeyi seninle yaptım.',
    'Bir buse misali öpünce izi kalansın.',
    'Gel benim ekmeğim, suyum, aşım ol',
    'Şimdi divaneye döndüm seni görünce.',
    'Çiçekler bile kıskanıyor bak aşkımızı.',
    'Senin aşkın beni gece gözlüm deli ediyor.',
    'Kurumuş bir ağaç gibiydim, sen geldin yeniden yeşerdim',
    'Küçük bir çocuğun masumiyeti gibisin sevmeye kıyamadığım.',
    'Senle aşkı öğrendim, sevgiyi, paylaşmayı…',
    'Gülerken kendini görsen inan kendi ömrüne ömür katardın.',
    'Dertlerini bana ver sevinçler senin olsun..',
    'Etrafımda olduğunda başka bir şeye ihtiyacım olmuyor.',
    'Sen olmadan nasıl var olacağımı bilmiyorum.',
    'Güneşe gerek yok, gözlerindeki sıcaklık içimi ısıtıyor.',
    'Gözlerimi senden alamıyorum, benim tüm dünyam sensin.',
    'Mutluluk ne diye sorsalar, cevabı gülüşünde ve o sıcak bakışında arardım.',
    'Bir şeyler ters gittiğinde, aramak istediğim ilk kişi sensin.',
    'Kusursuz tavırların var. Korkunç kararlar verdiğimde beni yargılamadığın için sana minnettarım.',
    'Baharı anımsatan kokunu içime çektiğimde, her şey mümkün görünüyor.',
    'Bu kadar güzel bakma, başka biri daha sana aşık olur diye ödüm kopuyor.',
    'Güzel yüzünü göremediğim için geceleri hiç sevmiyorum.',
    'Dünyadaki tüm şiirler sana yazılmış gibi hissettiriyorsun.',
    'Sen benim aldığım en doğru kararsın.',
    'Sen gülümseyince bulutlar dağılıyor göz bebeğim.',
    'Sabah uykusu kadar güzelsin.',
    'Onu Bunu Boşver de bize gel 2 bira içelim.',
    'Seni anlatmaya kelimeler bulamıyorum. Nasıl anlatacağımı bilemediğim için seni kimselere anlatamıyorum',
    'Yuva kokuyor kucağın. Sarılınca seninle yuva kurası geliyor insanın',
    'Öyle bir duru güzelliğin var ki, seni gören şairler bile adına günlerce şiir yazardı.',
    'Işık oluyorsun karanlık gecelerime.',
    'Gözlerin adeta bir ay parçası.',
    'Sen benim bu hayattaki en büyük duamsın.',
    'Parlayan gözlerin ile karanlık gecelerime ay gibi doğuyorsun.',
    'Huzur kokuyor geçtiğin her yer.',
    'Bir gülüşün ile çiçek açıyor bahçemdeki her bir çiçek.',
    'Satuke seni çok sevdi...',
    'Sen benim düşlerimin surete bürünmüş halisin.',
    'Mucizelerden bahsediyordum.',
    'Yaşanılacak en güzel mevsim sensin.',
    'Sıradanlaşmış her şeyi, ne çok güzelleştiriyorsun.',
    'Gönlüm bir şehir ise o şehrin tüm sokakları sana çıkar.',
    'Birilerinin benim için ettiğinin en büyük kanıtı seninle karşılaşmam.',
    'Denize kıyısı olan şehrin huzuru birikmiş yüzüne.',
    'Ben çoktan şairdim ama senin gibi şiiri ilk defa dinliyorum.',
    'Gece yatağa yattığımda aklımda kalan tek gerçek şey sen oluyorsun.',
    'Ne tatlısın sen öyle. Akşam gel de iki bira içelim.',
    'Bir gamzen var sanki cennette bir çukur.',
    'Gecemi aydınlatan yıldızımsın.',
    'Ponçik burnundan ısırırım seni',
    'Bu dünyanın 8. harikası olma ihtimalin?',
    'fıstık naber?',
    'tanisalim mi ?',
    'Dilek tutman için yıldızların kayması mı gerekiyor illa ki? Gönlüm gönlüne kaydı yetmez mi?',
    'Süt içiyorum yarım yağlı, mutluluğum sana bağlı.',
    'Müsaitsen aklım bu gece sende kalacak.',
    'Gemim olsa ne yazar liman sen olmadıktan sonra...',
    'Gözlerimi senden alamıyorum çünkü benim tüm dünyam sensin.',
    'Sabahları görmek istediğim ilk şey sensin.',
    'Mutluluk ne diye sorsalar- cevabı gülüşünde ve o sıcak bakışında arardım.',
    'Hayatım ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.',
    'Bir adada mahsur kalmak isteyeceğim kişiler listemde en üst sırada sen varsın.',
    'Sesini duymaktan- hikayelerini dinlemekten asla bıkmayacağım. Konuşmaktan en çok zevk aldığım kişi sensin.',
    'Üzerinde pijama olsa bile, nasıl oluyor da her zaman bu kadar güzel görünüyorsun? Merhaba, neden bu kadar güzel olduğunu bilmek istiyorum.',
    'Çok yorulmuş olmalısın. Bütün gün aklımda dolaşıp durdun.',
    'Çocukluk yapsan da gönlüme senin için salıncak mı kursam?',
    'Sen birazcık huzur aradığımda gitmekten en çok hoşlandığım yersin.',
    'Hangi çiçek anlatır güzelliğini? Hangi mevsime sığar senin adın. Hiçbir şey yeterli değil senin güzelliğine erişmeye. Sen eşsizsin...',
    'Rotanızı geçen her geminin ışığıyla değil, yıldızlara göre ayarlayın.',
    'Telaşımı hoş gör, ıslandığım ilk yağmursun.',
    'Gülüşün ne güzel öyle- cumhuriyetin gelişi gibi...',
    'Domates biber patlıcan, bu gece sana saplıcam...',
    'Bu ego nereden geliyor. Kuyudan mı çıkarıyorsun?',
    'Çok tatlısın :blush:',
  ];
  client.on("message", async message => {
    if(message.channel.id !== Settings.Server.ChatChannel) return;
    let YavsakBot = db.get('iltifat');
    await db.add("iltifat", 1);
    if(YavsakBot >= 50) { 
      db.delete("iltifat");
      const random = Math.floor(Math.random() * ((yavsamaSöz).length - 1) + 1);
      message.reply(`${(yavsamaSöz)[random]}`);
    };
  });


client.login(Moderator.Moderator_Token).then(x => console.log(`Moderation Başarıyla Giriş Yaptı!
---------------------------------------`)).catch(err => console.error(`Bota Giriş Yapılamadı.!\nHata : ${err}`))
