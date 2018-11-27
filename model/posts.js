const MongoDocument = require('./database');

module.exports = class Posts extends MongoDocument {

	constructor (data) {
		super(data);
		this._id = data._id;
		this.title = data.title;
		this.content = data.content;
		this.username = data.username;
		this.collection = 'posts';
        this.image_path = data.image_path;
		this.upvoters = data.upvoters || [];
		this.downvoters = data.downvoters || [];
	}

	static find(query = {}, limit = 0,sort = {title:1}) {
		return super.find('posts',query=query,sort=sort,limit=limit).then((result) => {
			return result.map((u) => new Posts(u));
		});
	}
}
