const client = require('mongodb').MongoClient;
const config = require('../resources/configs/mongoConfig');
const conn = client.connect(config.db_uri,config.options).then((conn) => {
	return {
		db: conn.db(config.db_name),
		close: function () {
			conn.close();
		}
	};
}).catch(err => {console.log(err)});

module.exports = class MongoDocument {
	save() {
		if(this._id){
			return conn.then((conn) => {
				return conn.db.collection(this.collection).updateOne({_id:this._id},{$set:this});
			});
		}
		else{
			return conn.then((conn) => {
				return conn.db.collection(this.collection).insertOne(this);
			});
		}
	}

	static find(collection, query, sort, limit){
		return conn.then((conn) =>{
			return conn.db.collection(collection).find(query)
												 .sort(sort)
												 .limit(limit)
												 .toArray();
		});
	}
	remove() {
		if(this._id){
			return conn.then((conn) => {
				return conn.db.collection(this.collection).remove(query = {_id:this._id});
			});
		}
	}
}
