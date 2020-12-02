const jwt = require('jsonwebtoken');
const secret = "batata12345654321node";
module.exports = function(req, res, next){

  const authToken = req.headers['authorization'];

  if(authToken != undefined){
    const bearer = authToken.split(' ');
    const token = bearer[1];

    

    try {
      const decoded = jwt.verify(token, secret);
      
      if(decoded.role == 0){
        next();
      }else{
        res.status(403);
        res.json({err: "Você não tem permissão para acessar o sistema!"});
        return;
      } 
      
    } catch (error) {
      res.status(403);
      res.json({err: "Você não está autenticado"});
      return;
      
    }

    
  }else{
    res.status(403);
    res.json({err: "Você não está autenticado"});
    return;
  } 

}