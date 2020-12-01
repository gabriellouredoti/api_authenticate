class HomeController{

    async index(req, res){
        res.send("API");
    }

    async validate(req, res){
        res.json({success: "token_validate"});
    }

}

module.exports = new HomeController();