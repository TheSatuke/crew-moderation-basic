const {User, GuildMember} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");

/**
 * @param {User} oldUser 
 * @param {User} newUser 
 */
module.exports = async (oldUser, newUser) => {
    if(oldUser.bot || newUser.bot || (oldUser.username == newUser.username)) return;

    let guild = oldUser.client.guilds.cache.get(Settings.Server.Id);

    let tagRole = guild.roles.cache.get(Settings.Tag.Role);
    if(!tagRole) return;

    /**
     * @type {GuildMember}
     */
     let member = await guild.getMember(oldUser.id);
     if(!member || (member && member.roles.cache.has(Settings.Penals.Jail.Role) && Settings.Roles.Unregistered.some(e => member.roles.cache.has(e)))) return;
 
     let channel = guild.channels.cache.get(Settings.Tag.Log);
 
     if(oldUser.username.includes(Settings.Tag.Tag) && !newUser.username.includes(Settings.Tag.Tag)){ // Tag leave
         if(member.manageable && Settings.Tag.Tag2.length > 0) member.setNickname(member.displayName.replace(Settings.Tag.Tag, Settings.Tag.Tag2));
         member.setRoles(member.roles.cache.filter(role => role.position < tagRole.position).map(role => role.id));
         if(channel) channel.send(`${oldUser} - (\`${oldUser.id}\`), (\`${Settings.Tag.Tag}\`) Adlı tagımızı çıkartarak bize veda etti.`);
     }
     else if(!oldUser.username.includes(Settings.Tag.Tag) && newUser.username.includes(Settings.Tag.Tag)){ // Tag Join
         if(member.manageable && Settings.Tag.Tag2.length > 0) member.setNickname(member.displayName.replace(Settings.Tag.Tag2, Settings.Tag.Tag));
         member.roles.add(tagRole);
         if(channel) channel.send(`${oldUser} - (\`${oldUser.id}\`), (\`${Settings.Tag.Tag}\`) Adlı tagımızı ismine alarak aramıza katıldı.`);
     }
 }
module.exports.config = {
    Event: "userUpdate"
}