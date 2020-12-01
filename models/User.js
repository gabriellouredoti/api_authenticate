const knex = require('../database/connection');
const bcrypt = require('bcrypt');


class User{

  async findAll(){

    try {
      var result = await knex.select(["id", "name", "email", "role"]).table("users");
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
    
  }

  async findById(id){
    try {
      var result = await knex.select(["id", "name", "email", "role"]).table("users").where({id: id});

      if(result.length > 0){
        return result[0];
      }else{
        return undefined;
      }
      
    } catch (error) {
      console.log(error);
      return undefined;
    }

  }

  async findByEmail(email){

    try {
 
      var result = await knex.select(["id", "name", "email", "password", "role"]).table("users").where({email: email}); 

      if(result.length > 0){
        return result[0];
      }else{
        return undefined;
      }
      
    } catch (error) {
      console.log(error);
      return undefined;
    }

  }

  async findEmail(email){

    try {
      var result = await knex.select("email").from("users").where({email: email});  
      if(result.length > 0){
        return true;
      }else{
        return false;
      }

    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async create(email, password, name){

    try {
      var hashPass = await bcrypt.hash(password, 10); 
      await knex.insert({email, password: hashPass, name, role: 0}).table('users');

    } catch (error) {
      console.log(error);
    }   
  }

  async update(id, email, name, role){

    var user = this.findById(id);

    if(user != undefined){
      var editUser = {};
      if(email != undefined){
        if(email !== user.email){
          var result = await this.findEmail(email);
          if(result == false){
            editUser.email = email;
          }else{
            return {status: false, err: "Este e-mail já está cadastrado!"};
          }
        }
      }

      if(name != undefined){
        editUser.name = name;
      }

      if(role != undefined){
        editUser.role = role;
      }

      try {
        await knex.update(editUser).where({id: id}).table("users");
        return {status: true, success: "Usuário alterado com sucesso!"};
      } catch (error) {
        console.log(error);
        return {status: false, err: error};
      }

    }else{
      return {status: false, err: "Usuário não encontrado!"};
    }
  
  }

  async delete(id){
    
    var user = await this.findById(id);

    if(user !== undefined){

      try {
        await knex.delete().table("users").where({id: id});
        return {status: true};
      } catch (error) {
        return {status: false, err: `Erro ao deletar usuário: ${error}`}; 
      }

    }else{
      return {status: false, err: "Usuário não encontrado para realizar a ação de exclusão"};
    }

  }

  async changePassword(newPassword, id, token){

    var hashPass = await bcrypt.hash(newPassword, 10); 

    try {
      await knex.update({password: hashPass}).table("users").where({id: id});
      await knex.update({used: 1}).table("password_tokens").where({token: token});

    } catch (error) {
      return {status: false, err: error};
      
    }

  }





}

module.exports = new User();