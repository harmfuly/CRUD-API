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

router.get('/:userId', function(req, res, next) {
    const userId = req.params.userId;

    const isValidUUID = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(userId);
    if (!isValidUUID) {
        return res.status(400).json({
            status: 400,
            statusText: 'Bad Request',
            message: 'Invalid userId. Please provide a valid UUID.'
        });
    }

    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({
            status: 404,
            statusText: 'Not Found',
            message: 'User not found with the provided userId.'
        });
    }

    res.status(200).json({
        status: 200,
        statusText: 'Ok',
        message: 'User data fetched successfully',
        data: user
    });
});

