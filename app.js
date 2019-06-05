const { Client } = require('discord.js');
const bot = new Client();
const cfg = require('./config.json');

bot.on('ready', () => {
	console.log('I\'m ready!');
	bot.user.setActivity('on GarGar\'s PC');

})

bot.on('message', msg => {
	if (msg.content === 'penis' || msg.content === 'dick') {
		msg.reply('u sus boi')
	}

	console.log(msg.author.username + ': ' + msg.content);
})

bot.on("presenceUpdate", (oldMember, newMember) => {
	if (newMember.presence.game.streaming === true) {
		bot.channels.get("585613596134735874").send(newMember.displayName + " is now live!")
	}
})

bot.login(cfg.token)