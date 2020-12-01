const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const secret = "batata12345654321node";


class UserController {

  async index(req, res){

    var resultUsers = await User.findAll();

    res.status(200);
    res.json(resultUsers);

  }

  async findUser(req, res){

    var userId = req.params.id;

    var userId = parseInt(userId);

    if(userId > 0){
      var resultUser = await User.findById(userId);

      if(resultUser !== undefined){
        res.status(200);
        res.json(resultUser);
      }else{
        res.status(404);
        res.json({err: 'Usuário não encontrado'});
      }
      
    }else{
      res.status(400);
      res.json({err: 'Id de usuário inválido!'});
      return;
    }
      
  }

  async create(req, res){

    const {name, email, password} = req.body;

    if(email == undefined || email == '' || email == ' '){
      res.status(400);
      res.json({err: 'Campo "e-mail" inválido!'});
      return;

    }else if(name == undefined || name == '' || name == ' '){
      res.status(400);
      res.json({err: 'Campo "nome" inválido'}); 
      return;

    }else if(password == undefined || password == '' || password == ' ' || password.length < 6){
      res.status(400);
      res.json({err: 'Campo "password" inválido!'});
      return;

    }else{
      var resultEmail = await User.findEmail(email);
      if(resultEmail == false){
        await User.create(email,password,name);
        res.status(200);
        res.json({success: "Usuário cadastrado com sucesso!"});

      }else{
        res.status(406);
        res.json({err: 'Este e-mail já está cadastrado!'});
        return;
      }
    }
  }

  async edit(req, res){
    var {id, email, name, role} = req.body;
    var result = await User.update(id, email, name, role);
    
    if(result.status != undefined){
      if(result.status == true){
        res.status(200);
        res.json({success: "Usuário atualizado com sucesso!"});
      }else{
        res.status(406);
        res.json({err: result.err});
      }
    }else{
      res.status(406);
      res.json({err: result.err});
    } 
  }

  async delete(req, res){

    var id = req.params.id;

    var result = await User.delete(id);

    if(result.status == true){
      res.status(200);
      res.json({success: "Usuário deletado com sucesso!"});
    }else{
      res.status(406);
      res.json({err: result.err});
    }
  }

  async recoveryPassword(req, res){

    var email = req.body.email;
    
    var result = await PasswordToken.create(email);
    
    if(result.status == true){
      res.status(200);
      res.json({success: "Token gerado com sucesso!", token: result.token});
    }else{
      res.status(406);
      res.json({err: result.err});
    }

  }

  async changePassword(req, res){

    var token = req.body.token;
    var password = req.body.password;
    var isTokenValid = await PasswordToken.validate(token);

    if(isTokenValid.status == true){

      await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
      res.status(200);
      res.json({success: "Senha alterada com sucesso!"})

    }else{
      res.status(406);
      res.json({err: "Token inválido"});
    }
  }

  async login(req, res){
    const email = req.body.email;
    const password = req.body.password;

    var user = await User.findByEmail(email);

    if(user !== undefined){

      var authUser = await bcrypt.compare(password, user.password);

      if(authUser == true){
        var token = jwt.sign({email: user.email, role: user.role}, secret);
        res.status(200);
        res.json({token: token});
      }else{
        res.status(406);
        res.json({err: "Senha incorreta!"});
      }

    }else{
      res.status(406);
      res.json({status: false, err: "Este e-mail não existe"});

    }

  }



}

module.exports = new UserController();