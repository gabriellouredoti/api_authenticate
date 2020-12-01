const knex = require("../database/connection");
const User = require("./User");

class PasswordToken {

  async create(email){

    var user = await User.findByEmail(email);

    var token = Date.now();
    
    if(user != undefined){

      try {
        await knex.insert({
          user_id: user.id,
          used: 0,
          token: token //UUID
        }).table("password_tokens");

        return {status: true, token: token};
        
      } catch (error) {
        console.log(error);
        return {status: false, err: `Erro ao guardar token no banco: ${error}`};
      }
      

    }else{
      return {status: false, err: "O este e-mail de usuário não existe"}
    }

  }




  async validate(token){

    try {

      var result = await knex.select().table("password_tokens").where({token: token});

      if(result.length > 0){

        var resultToken = result[0];

        if(resultToken.used != 0){
          return {status: false};
        }else{
          return {status: true, token: resultToken};
        }

      }else{
        return false;
      }

    } catch (error) {
      
      return {status: false, err: error};

    }
  }


}

module.exports = new PasswordToken();