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
		userDAO.find().then((users) => {
			console.log(users);
		});
		res.write('SUCESSO');
		res.end();
	}
	else{
		let msg = 'Erro na inserção dos Dados.'
		renderCadastro(res,sucesso=false,mensagem=msg);
	}
});

function renderCadastro(res,sucesso=true, mensagem = ''){
	res.render('cadastro',{sucesso:sucesso,mensagem:mensagem});
}

function checkEmail(email){
	let regex = new RegExp('[\\w.]+@[\\w]+\.[\\w]{3}','gi');
	return regex.test(email);
}

http.createServer(app).listen(3000);
