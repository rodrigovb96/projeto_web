var express = require('express'),
	http = require('http'),
	path = require('path'),
	userDAO = require('./model/user'),
	app = express(),
	cookieParser = require('cookie-parser'),
	postDAO = require('./model/posts');

app.set('views',path.join(__dirname,'view'));
app.set('view engine','hbs');
app.use(express.static(path.join(__dirname,'static')));
app.use(express.static(path.join(__dirname,'static/images')));
app.use(cookieParser());

app.use(express.urlencoded({extendend: false}));

app.get('/',(req,res) => {
	let q = req.query.q ? {title:req.query.q} : {};
	postDAO.find(query = q).then((found) => {
		let postlist = found.length > 0 ? found : [{title:'Nenhum Post', content:'Não tem nenhum post cadastrado, foi mal :/'}];
		let session_user = (req.cookies && req.cookies.login) ? req.cookies.login : false; 
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

app.get('/create_post',(req,res) => {
	if(req.cookies && req.cookies.login) {
		res.render('create_post');
	}
	else {
		res.redirect('/login');
	}
});

app.get('/cadastro',(req,res) => {
	renderCadastro(res);
});

app.post('/postar',(req,res) => {
	let titulo = req.body.post_titulo;
	let content = req.body.post_content;
	let user = req.cookies && req.cookies.login ? req.cookies.login : false;

	if(user){
		if(titulo && content) {
			let post = new postDAO({title:titulo,content:content,username:user});
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

app.post('/register',(req,res) => {
	let username = req.body.username;	
	let email = req.body.email;	
	let password = req.body.password;	
	
	console.log(`Username: ${username} email: ${email} senha: ${password}`);

	if(username && checkEmail(email) && password){
		userDAO.find(query={username:username}, limit=1).then((found) => {
			if(found.length === 0) {
				let user = new userDAO({username:username,email:email,password:password});
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
					//req.session.login = username;
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

http.createServer(app).listen(process.env.PORT);
