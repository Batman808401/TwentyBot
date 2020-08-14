const Contestant = require('./contestant.js');

class Contest {
	constructor() {
		this.contestants = [];
		this.winner = [];
	}
	addContestant(name, id) {
		let contestant = new Contestant;
		contestant.setName(name);
		contestant.setId(id);
		this.contestants.push(contestant);
		console.log(contestant);
	}

	getWinner() {
		this.winner = [];
		let highestVotes = this.getHighestVote();
		for (let contestant of this.contestants) {
			if (contestant.votes == highestVotes) {
				this.winner.push(contestant.name)
			}
		}
		console.log(`highest vote is ${highestVotes}`)
		return this.winner
	}
	getHighestVote() {
		let votes = [];
		for (let contestant of this.contestants) {
			votes.push(contestant.votes)
		}
		console.log('getting highest vote...')
		return Math.max(...votes);
	}

	enterVote(count, messageId) {
		for (let contestant of this.contestants) {
			if (contestant.submission == messageId) {
				contestant.setVote(count);
			}
		}
	}
	setUserSubmit(userId, messageId) {
		let contestant = this.getUser(userId);
		contestant.setSubmission(messageId);
	}
	setUserSubmitURL(userId, url) {
		let contestant = this.getUser(userId);
		if (contestant == undefined) {
			console.log('DNE')
			return false
		}
		contestant.setSubmissionURL(url);
		return true
	}
	getUser(userId) {
		for (let contestant of this.contestants) {
			if (contestant.id == userId) {
				return contestant
			}
		}
	}
	getUsers() {
		return this.contestants;
	}
}

module.exports = Contest