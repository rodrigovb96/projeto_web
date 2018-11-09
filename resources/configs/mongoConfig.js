let uri = process.env.MONGO_CONNECTION_KEY || 5;
module.exports = {
	db_uri : uri,
	db_name : 'redditdb',
	options:{useNewUrlParser: true}
}
