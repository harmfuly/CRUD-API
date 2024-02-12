let express = require('express');
let app =  express();
let router = express.Router();

app.use('/api/users',router);

const users = [{ "name": "Miley Cyrus", "age": 33, "gender": "female" },
{ "name": "Chris Hemsworth", "age": 40, "gender": "male" },
{ "name": "Johnny Depp", "age": 60, "gender": "male" }];
router.get('/', function(req, res, next){
    res.status(200).json({
        "status": 200,
        "statusText": "Ok",
        "message": "Users data fetched successfully",
        "data": users
    });
});

app.listen(5000, function(){
    console.log("App running on http://localhost:5000");
});

