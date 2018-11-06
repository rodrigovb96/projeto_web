const MongoDocument = require('./database');

module.exports = class User extends MongoDocument {

	constructor (data) {
		super(data);
		this._id = data._id;
		this.username = data.username;
		this.email = data.email;
		this.password = data.password;
		this.collection = 'user';
	}

	static find(query = {}, limit = 0,sort = {username:1}) {
		return super.find('user',query=query,sort=sort,limit=limit).then((result) => {
			return result.map((u) => new User(u));
		});
	}
}
