var express = require('express'),
	http = require('http'),
	path = require('path'),
	userDAO = require('./model/user'),
	app = express(),
	cookieParser = require('cookie-parser'),
	postDAO = require('./model/posts'),
	multer = require('multer'),
	mongo = require('mongodb');

app.set('views',path.join(__dirname,'view'));
app.set('view engine','hbs');
app.use(express.static(path.join(__dirname,'static')));
app.use(express.static(path.join(__dirname,'static/images')));
app.use(express.static(path.join(__dirname,'static/uploadedImages')));
app.use(cookieParser());

app.use(express.urlencoded({extendend: false}));

const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'static/uploadedImages/') 
    },
    filename: (req, file, cb) => {
        //cb(null,`${file.originalname}${path.extname(file.originalname)}`);
        cb(null,`${file.originalname}`);
    } 
});
const upload = multer({storage});

app.get('/',(req,res) => {
	let q = req.query.q ? {title:new RegExp(req.query.q,'i')} : {};

	getPosts(q).then((postlist) => {
		let session_user = checkCookies(req); 
		if (session_user) { 
			userDAO.find(query={username:session_user}, limit=1).then((found) => {
				user_found = found[0];
				res.render('index',{user:user_found,post_list:postlist});
			});
		}
		else {
			res.render('index',{post_list:postlist});
		}
	});
});

app.get('/login',(req,res) => {
	res.render('login');
});

app.get('/buscar',(req,res) => {
	res.redirect(`/?q=${req.query.q}`);
});

app.get('/cadastro',(req,res) => {
	renderCadastro(res);
});

app.post('/register',(req,res) => {
	let username = req.body.username;	
	let email = req.body.email;	
	let password = req.body.password;	
	let endereco = req.body.endereco;
	
	console.log(`Username: ${username} email: ${email} senha: ${password}`);

	if(username && checkEmail(email) && password && endereco){
		userDAO.find(query={username:username}, limit=1).then((found) => {
			if(found.length === 0) {
				let user = new userDAO({username:username,email:email,password:password,endereco:endereco});
				user.save().then((response) => {
					let msg = 'Cadastrado com sucesso!';
					console.log(msg);
					renderCadastro(res,situacao={sucesso:true,mensagem:msg});
				}).catch((err) => {console.log(err)});
			}
			else {
				let msg = 'Usuário já cadastrado'
				renderCadastro(res,situacao={falha:true, mensagem:msg});
			}
		});
	}
	else {
		let msg = 'Erro na inserção dos dados.'
		renderCadastro(res,situacao={falha:true, mensagem:msg});
	}
});

app.post('/auth',(req,res) => {
	let username = req.body.username;	
	let password = req.body.password;	

	if(username && password){
		userDAO.find(query={username:username}, limit=1).then((found) => {
			if(found.length > 0) {
				if(found[0].password === password) {
					res.cookie('login',username);
					res.redirect('/');
				}
				else {
					let msg = 'Senha Errada!'
					renderLogin(res, mensagem = msg);
				}
			}
			else {
				let msg = 'Usuário não cadastrado!'
				renderLogin(res, mensagem = msg);
			}
		});
	}
	else {
		let msg = 'Erro na inserção dos dados.'
		renderLogin(res, mensagem = msg);
	}

});

app.get('/get_posts',(req,res) => {
	let q = req.query.q ? {title:new RegExp(req.query.q,'i')} : {};

	getPosts(q).then((postlist) => {
		let user = checkCookies(req);
		postlist = postlist.map((post) => {
			if(user) {
				if(post.upvoters.includes({username:user})) {
					post.upvoters = [{username:user}];
					post.downvoters = null;
				}
				else if(post.downvoters.includes({username:user})) {
					post.downvoters = [{username:user}];
					post.upvoters = null;
				}
				else {
					post.downvoters = null;
					post.upvoters = null;
				}
			}
			else {
				post.downvoters = null;
				post.upvoters = null;
			}
			return post;
		});
		res.status = 200;
		res.json(postlist);
	});
});

app.post('/upvote_post',(req,res) => {
	let post_id = req.body.post_id;
	console.log(`ObjectId("${post_id}")`);
	postDAO.find(query = {_id:new mongo.ObjectID(post_id)}, limit = 1).then((posts) => {
		if(posts.length < 1) {
			res.status = 404;
			res.send();
		}
		console.log(posts);
		let post = posts[0];
		let user = checkCookies(req);
		if (user) {
			let upvoter = {username:user};
			let index = 0;

			let already_upvoted = post.upvoters.find((v,i) => {
				index = i;
				return v.username === upvoter.username;
			});

			let already_downvoted = post.downvoters.find((v,i) => {
				index = i;
				return v.username === upvoter.username;
			});

			if(already_upvoted){
				post.upvoters.splice(index);
			}
			else if(already_downvoted){
				post.downvoters.splice(index);
				post.upvoters.unshift(upvoter);
			}
			else {
				post.upvoters.unshift(upvoter);
			}
			post.save().then((response) => {
				res.status = 200;
				res.send();
			}).catch((err) => {console.log(err);});
		}
	}).catch((err) => {console.log(err);});
});

app.post('/downvote_post',(req,res) => {
	let post_id = req.body.post_id;
	postDAO.find(query = {_id:new mongo.ObjectID(post_id)}, limit = 1).then((posts) => {
		let post = posts[0];
		let user = checkCookies(req);
		if (user) {
			let downvoter = {username:user};
			let index = 0;

			let already_upvoted = post.upvoters.find((v,i) => {
				index = i;
				return v.username === downvoter.username;
			});

			let already_downvoted = post.downvoters.find((v,i) => {
				index = i;
				return v.username === downvoter.username;
			});

			if(already_downvoted){
				post.downvoters.splice(index);
			}
			else if(already_upvoted){
				post.upvoters.splice(index);
				post.downvoters.unshift(downvoter);
			}
			else {
				post.downvoters.unshift(downvoter);
			}
			post.save().then((response) => {
				res.status = 200;
				res.send();
			}).catch((err) => {console.log(err);});
		}
	});
});

app.get('/create_post',(req,res) => {
	if(checkCookies(req)) {
		res.render('create_post');
	}
	else {
		res.redirect('/login');
	}
});

app.post('/postar',upload.single('post_image'),(req,res) => {
	let titulo = req.body.post_titulo;
	let content = req.body.post_content;
	let user = checkCookies(req);
    let image = req.file;

    let splitted_path = image.path.split('/')
    let image_name = splitted_path[ splitted_path.length - 1]

    if(image)
    {
        console.log(image);
        console.log(image.path);
    }


	if(user){
		if(titulo && content) {
			let post = new postDAO({title:titulo,content:content,username:user,image_path:image_name,upvoters:[{username:user}],downvoters:[]});
			post.save().then((response) => {
				res.redirect('/');
			});
		}
		else {
			let msg = 'Preencha todos os campos!';
			res.render('create_post',{falha:msg});
		}
	}
	else {
		res.redirect('/login');
	}
});

function renderLogin(res, mensagem = ''){
	res.render('login',{falha:mensagem});
}

function renderCadastro(res,situacao={}){
	res.render('cadastro',situacao);
}

function checkEmail(email){
	let regex = new RegExp('[\\w.]+@[\\w]+\.[\\w]{3}','gi');
	return regex.test(email);
}

function getPosts(q){
	let listPromise = new Promise((resolve,reject) => {
		postDAO.find(query = q).then((found) => {
			let postlist = found.length > 0 ? found : [{title:'Nenhum Post', content:'Não tem nenhum post cadastrado, foi mal :/'}];

			postlist = postlist.map((post) => {
				post.score = 0;
				upvoters = post.upvoters || [];
				downvoters = post.downvoters || [];
				post.score = upvoters.length - downvoters.length;
				return post;
			});
			
			postlist = postlist.sort((a,b) => {return b.score - a.score});

			resolve(postlist);
		}).catch((err) => {reject(err)});
	});
	return listPromise;
}

function checkCookies(req){
	return (req.cookies && req.cookies.login) ? req.cookies.login : false;
}

http.createServer(app).listen(process.env.PORT || 3000);
