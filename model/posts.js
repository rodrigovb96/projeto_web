const MongoDocument = require('./database');

module.exports = class Posts extends MongoDocument {

	constructor (data) {
		super(data);
		this._id = data._id;
		this.title = data.title;
		this.content = data.content;
		this.image_path = data.image_path;
		this.collection = 'posts';
	}

	static find(query = {}, limit = 0,sort = {title:1}) {
		return super.find('posts',query=query,sort=sort,limit=limit).then((result) => {
			return result.map((u) => new Posts(u));
		});
	}
}
