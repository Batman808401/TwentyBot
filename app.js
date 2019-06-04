const { Client } = require('discord.js');
const bot = new Client();
const cfg = require('./config.json');

bot.on('ready', () => {
	console.log('I\'m ready!');
	bot.user.setActivity('on GarGar\'s PC');
})

bot.on('message', msg => {
	//if (msg.author.bot || !msg.content.startsWith(cfg.prefix)) return;
	/*const args = msg.content.slice(cfg.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	console.log(`Args: ${args}\nCommand: ${command}`);

	if (command === 'boop') {
		msg.channel.send('*boop*')
	}

	if (msg.content === 'penis') {
		msg.reply('u sus boi')
	}*/
	if (msg.content === 'penis' || msg.content === 'dick') {
		msg.reply('u sus boi')
	}

	console.log(msg.author.username + ': ' + msg.content);
	//console.log(user('<@184326588655992832>').presence.status)

})

bot.login(cfg.token)
//console.log(cfg);