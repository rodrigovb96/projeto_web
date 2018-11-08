var express = require('express'),
	http = require('http'),
	path = require('path'),
	userDAO = require('./model/user'),
	app = express();

app.set('views',path.join(__dirname,'view'));
app.set('view engine','hbs');
app.use(express.static(path.join(__dirname,'static')));
app.use(express.static(path.join(__dirname,'static/images')));

app.use(express.urlencoded({extendend: false}));

app.get('/',(req,res) => {
	let logged = false;
	let postlist = [{username:'teste',post_title:'post title',post_source:'lupa.svg'}];
	res.render('index',{logged_in:logged,post_list:postlist});
});

app.get('/login',(req,res) => {
	res.render('login');
});

app.get('/create_post',(req,res) => {
	res.render('create_post');
});

app.get('/cadastro',(req,res) => {
	renderCadastro(res);
});

app.post('/register',(req,res) => {
	let username = req.body.username;	
	let email = req.body.email;	
	let password = req.body.password;	
	
	console.log(`Username: ${username} email: ${email} senha: ${password}`);

	if(username && checkEmail(email) && password){
		userDAO.find().then((found) => {
			if(found.length === 0) {
				let user = new userDAO({username:username,email:email,password:password});
				user.save().then((response) => {
					if(response.acknowledged) {
						let msg = 'Cadastrado com sucesso!';
						renderCadastro(res,situacao=0,mensagem = msg);
					}
				}).catch((err) => {console.log(err)});
			}
			else {
				console.log(found);
				let msg = 'Usuário já cadastrado'
				renderCadastro(res,situacao=1,mensagem = msg);
			}
		});
	}
	else {
		let msg = 'Erro na inserção dos dados.'
		renderCadastro(res,situacao=1,mensagem = msg);
	}
});

function renderCadastro(res,situacao=-1, mensagem = ''){
	let options = {};

	if(situacao != -1 && situacao  === 0) {
		options = {sucesso:true, mensagem:mensagem};
	}
	else if(situacao != -1 && situacao === 1) {
		options = {falha:true, mensagem:mensagem}
	}

	res.render('cadastro',options);
}

function checkEmail(email){
	let regex = new RegExp('[\\w.]+@[\\w]+\.[\\w]{3}','gi');
	return regex.test(email);
}

http.createServer(app).listen(3000);
