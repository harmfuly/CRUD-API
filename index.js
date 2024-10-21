import express, { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

let app =  express();
let router = Router();

app.use(express.json());
app.use('/api/users',router);

const users = [
    { id: uuidv4(), name: "Miley Cyrus", age: 33, gender: "female", "hobbies": [] },
    { id: uuidv4(), name: "Chris Hemsworth", age: 40, gender: "male", "hobbies": [] },
    { id: uuidv4(), name: "Johnny Depp", age: 60, gender: "male", "hobbies": [] },
];

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the CRUD API!');
});

router.get('/', async (req, res, next) => {
    res.status(200).json({
        status: 200,
        statusText: "Ok",
        message: "Users data fetched successfully",
        data: users
    });
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


router.post('/', function(req, res, next) {
    const { username, age, hobbies } = req.body;

    if (!username || !age || !Array.isArray(hobbies)) {
        return res.status(400).json({
            status: 400,
            statusText: 'Bad Request',
            message: 'Missing required fields: username, age, or hobbies.'
        });
    }

    const newUser = {
        id: uuidv4(),
        username,
        age,
        hobbies: hobbies.length > 0 ? hobbies : []
    };

    users.push(newUser);

    res.status(201).json({
        status: 201,
        statusText: 'Created',
        message: 'User created successfully',
        data: newUser
    });
});

router.put('/:userId', function(req, res, next) {
    const userId = req.params.userId;
    const { name, age, gender } = req.body;

    const isValidUUID = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(userId);
    if (!isValidUUID) {
        return res.status(400).json({
            status: 400,
            statusText: 'Bad Request',
            message: 'Invalid userId. Please provide a valid UUID.'
        });
    }

    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({
            status: 404,
            statusText: 'Not Found',
            message: 'User not found with the provided userId.'
        });
    }

    users[userIndex] = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        age: age || users[userIndex].age,
        gender: gender || users[userIndex].gender
    };

    res.status(200).json({
        status: 200,
        statusText: 'Ok',
        message: 'User updated successfully',
        data: users[userIndex]
    });
});

router.delete('/:userId', function(req, res, next) {
    const userId = req.params.userId;

    const isValidUUID = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(userId);
    if (!isValidUUID) {
        return res.status(400).json({
            status: 400,
            statusText: 'Bad Request',
            message: 'Invalid userId. Please provide a valid UUID.'
        });
    }

    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({
            status: 404,
            statusText: 'Not Found',
            message: 'User not found with the provided userId.'
        });
    }

    users.splice(userIndex, 1);

    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({
        status: 404,
        statusText: 'Not Found',
        message: 'The requested resource was not found.'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 500,
        statusText: 'Internal Server Error',
        message: 'An unexpected error occurred. Please try again later.'
    });
});

app.listen(PORT, function() {
    console.log(`App running on http://localhost:${PORT}`);
});


