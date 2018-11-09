let uri = () => {
	let key = process.env.MONGO_KEY;
	console.log(key);
	return key
};

//let uri = () => {return 'mongodb://localhost:27017/redditdb'};

module.exports = {
	db_uri : uri(),
	db_name : 'redditdb',
	options:{useNewUrlParser: true}
}
