class Contestant {
	contstructor() {
		this.name = "";
		this.id = "";
		this.votes = 0;
		this.submission = "";
		this.submissionURL = "";
	}
	setVote(votes) {
		this.votes = votes;
	}
	setSubmission(submission) {
		this.submission = submission;
	}
	setName(name) {
		this.name = name;
	}
	setId(id) {
		this.id = id;
	}
	vote() {
		return this.votes;
	}
	submission() {
		return this.submission;
	}
	name() {
		return this.name;
	}
	id() {
		return this.id;
	}
	setSubmissionURL(url) {
		this.setSubmissionURL(url);
	}
	getSubmissionURL() {
		return this.submissionURL;
	}
}

module.exports = Contestant