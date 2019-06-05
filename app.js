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

//event when any user changes their presence
bot.on("presenceUpdate", (oldMember, newMember) => {

	//A string that gives the User and their discord status
	const generalStatus = newMember.displayName + " is now " + newMember.presence.status;

	//check if User went offline or something
	if (newMember.presence.game === null) {
		console.log(generalStatus)
	} else {
		//Check if the user is streaming
		if (newMember.presence.game.streaming === true) {
			//check if this person has been streaming
			if (newMember.user.tag === oldMember.user.tag) {
				bot.channels.get("585613596134735874").send("@" + newMember.user.tag + " changed their stream name to " + newMember.presence.game.name);
			} else {
				//A new stream has started
				bot.channels.get("585613596134735874").send("@everyone @" + newMember.user.tag + " is now live! \n" + newMember.nickname + ": " + newMember.presence.game.name);
			}
		} else {
			//state the status of the user
			console.log(generalStatus);
		}
	}

})

bot.login(cfg.token)