const { Client } = require('discord.js');
const readline = require("readline");
const bot = new Client();
const cfg = require('../config.json');
const Contest = require('./scripts/model-contest.js');

const modelContest = new Contest();

bot.on('ready', () => {
	console.log('I\'m ready!');

	//be sure to put your identification in the user property of config.json
	bot.user.setActivity('on '+ cfg.user +'\'s PC');
})

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

//console commands
rl.on('line', (input) => {

	const origMsg = `${input}`;
	var command = origMsg.split(' ')[0].toLowerCase();
	var attribute = origMsg.substr(origMsg.indexOf(' ')+1);

	if (command=="say") {
		bot.channels.fetch('511380337993973775').send(attribute);
	} else {
		console.log("\""+command+"\" is not a valid command")
	}

})

//event when messages are sent through 20 QUAD
bot.on('message', msg => {

	//parse the message for a command and attribute
	const origMsg = msg.content;
	const attribute = origMsg.substr(origMsg.indexOf(' ')+1);
	const command = origMsg.split(' ')[0].toLowerCase();
	const cmd = command.substr(command.indexOf("!")+1);

	//channels
	const spamChannel = bot.channels.cache.get('511380337993973775');

	//model contest vars
	let users = modelContest.getUsers();
	let submission = '';

	if (msg.channel.type == "dm") {
		//console.log(Array.from(msg.attachments.values())[0].proxyURL)
		if (Array.from(msg.attachments.values())[0] != undefined) {
			submission = Array.from(msg.attachments.values())[0].url;
		} else {
			//console.log('no attachments');
		}
		if (origMsg[0] == '!') {
			switch (cmd) {
				case 'submit':
					const id = msg.author.id;
					if (modelContest.setUserSubmitURL(id, submission)) {
						console.log('submission successful')
						msg.reply(`Your submission has been accepted.`)
					} else {
						console.log('submission failed')
						msg.reply(`You're not in the contest!`)
					}
					break;
				default:
					if (msg.author.id != '184326588655992832') {
						msg.reply(`"${cmd}" is not a command`)
					}
					break;
			}
		}
		if (origMsg[0] == "!" && msg.author.id == '184326588655992832') {
			switch (cmd) {
				case 'add':
					const addToContest = async () => {
						let user = await bot.users.fetch(attribute).catch(e => {
							return null;
						});
						if (user === null) {
							spamChannel.send(`"${attribute}" is not a user`);
						} else {
							modelContest.addContestant(user.username, user.id);
							spamChannel.send(`${user.username} has been added to the contest`);
							//msg.delete({timeout: 1000});
						}
					}
					addToContest();
					break;
				case 'contestants':
					let i = 1;
					let temp = '';
					for (let user of users) {
						//send a message containing an anonymous name and image
						spamChannel.send({
							files: [user.submissionURL],
							content: `Contestant ${i}`
						}).then( 
						//set the message id for this user instance and react to the sent message
						(message) => {
							modelContest.setUserSubmit(user.id, message.id)
							message.react('⭐')
						}).catch(console.error)
						//iterate to count the next contestant
						i++
					}
					break;
				case 'submit':
					const customId = attribute;
					if (customId != '!submit') {
						if (modelContest.setUserSubmitURL(customId, submission)) {
							console.log('submission successful')
						} else {
							console.log('submission failed')
							msg.reply(`You're not in the contest!`)
						}
					} else {
						console.log('using production submit...')
					}
					/*if (modelContest.setUserSubmitURL(id, submission)) {
						console.log('submission successful')
					} else {
						console.log('submission failed')
						msg.reply(`You're not in the contest!`)
					}*/
					break;
				case 'image':
					spamChannel.send({
						files: [attribute],
						content: msg.author.username
					}).then(
						(message) => {
							message.react('⭐')
						}
					).catch(console.error)
					break;
				case 'vote': 
					/*const setVotes = async () => {
						const voteSetter = new Promise(() => {
							for (let user of users) {
								spamChannel.messages.fetch(user.submission).then(
									(message) => {
										modelContest.enterVote(message.reactions.resolve('⭐').count, message.id)
										//console.log(message.reactions.resolve('⭐').count)
									}
								).catch(console.error)
							}
						})
						let vote = await voteSetter().then(console.log(users)).catch(console.log('there was a problem setting votes'))
					}
					setVotes()*/
					for (let user of users) {
						spamChannel.messages.fetch(user.submission).then(
							(message) => {
								modelContest.enterVote(message.reactions.resolve('⭐').count, message.id)
								//console.log(message.reactions.resolve('⭐').count)
							}
						).catch(console.error)
					}
					//setVotes().then(console.log(users));
					break;
				case 'judge':
					let winner = modelContest.getWinner()
					for (let user of users) {
						spamChannel.messages.fetch(user.submission).then(
							(message) => {
								message.edit(user.name)
							}
						).catch(console.error)
					}
					spamChannel.send(`Congratulations to:\n${winner.join('\n')}\nYou won the contest!`)
					break;
				default:
					//spamChannel.send(`"${cmd}" is not a valid command`)
					break;
			}
		}
	} else 
	//check for a command and if the command is from a human
	if (origMsg[0] == "!" && !msg.author.bot) {
		switch (cmd) {
			case 'mimic':
				spamChannel.send(attribute).then((message) => {console.log(message.id)}).catch(console.error);
				break;
			default:
				if (msg.author.id != '184326588655992832') {
					spamChannel.send(`"${msg}" is not a valid command`)
				}
		}
	}

	//logs users and their message
	console.log(msg.author.username + ': ' + msg.content);
})

//event when any user changes their presence
bot.on("presenceUpdate", (oldPresence, newPresence) => {

	//A string that gives the User and their discord status
	const generalStatus = newPresence.user.username + " is now " + newPresence.status;
	console.log(generalStatus);

})

//Add and removes a role that allows the user to type in vc-text
bot.on("voiceStateUpdate", (oldPresence,newPresence) => {
	if (newPresence.voiceChannel == null) {
		console.log(newPresence.displayName + " left VC.")
		newPresence.removeRole('640311067485929476').catch(console.error)
	} else {
		console.log(newPresence.displayName + " is in VC.")
		newPresence.addRole('640311067485929476').catch(console.error)
	}
})

bot.login(cfg.token)