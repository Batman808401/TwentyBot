class Contestant {
	contstructor() {
		this.name = "";
		this.id = "";
		this.votes = 0;
		this.submission = "";
	}
	set vote(votes) {
		this.votes = votes;
	}
	set submission(submission) {
		this.submission = submission;
	}
	set name(name) {
		this.name = name;
	}
	set id(id) {
		this.id = id;
	}
	get vote() {
		return this.votes;
	}
	get submission() {
		return this.submission;
	}
	get name() {
		return this.name;
	}
	get id() {
		return this.id;
	}
}

module.exports = Contestant