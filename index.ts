import 'ts-node/register';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { parse } from 'url';

dotenv.config();

const PORT = process.env.PORT || 5000;

interface User {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

const users: User[] = [
    { id: uuidv4(), username: "Miley Cyrus", age: 33, hobbies: [] },
    { id: uuidv4(), username: "Chris Hemsworth", age: 40, hobbies: [] },
    { id: uuidv4(), username: "Johnny Depp", age: 60, hobbies: [] },
];

const sendResponse = (res: ServerResponse, statusCode: number, data: object) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const { pathname, query } = parse(req.url!, true);
    const method = req.method;

    if (pathname === '/' && method === 'GET') {
        sendResponse(res, 200, { message: 'Welcome to the CRUD API!' });
    } else if (pathname === '/api/users' && method === 'GET') {
        sendResponse(res, 200, {
            status: 200,
            statusText: 'Ok',
            message: 'Users data fetched successfully',
            data: users
        });
    } else if (pathname?.startsWith('/api/users/') && method === 'GET') {
        const userId = pathname.split('/')[3];
        if (!validateUUID(userId)) {
            return sendResponse(res, 400, {
                status: 400,
                statusText: 'Bad Request',
                message: 'Invalid userId. Please provide a valid UUID.'
            });
        }

        const user = users.find(user => user.id === userId);
        if (!user) {
            return sendResponse(res, 404, {
                status: 404,
                statusText: 'Not Found',
                message: 'User not found with the provided userId.'
            });
        }

        sendResponse(res, 200, {
            status: 200,
            statusText: 'Ok',
            message: 'User data fetched successfully',
            data: user
        });
    } else if (pathname === '/api/users' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { username, age, hobbies } = JSON.parse(body);

            if (!username || !age || !Array.isArray(hobbies)) {
                return sendResponse(res, 400, {
                    status: 400,
                    statusText: 'Bad Request',
                    message: 'Missing required fields: username, age, or hobbies.'
                });
            }

            const newUser: User = {
                id: uuidv4(),
                username,
                age,
                hobbies: hobbies.length > 0 ? hobbies : []
            };

            users.push(newUser);
            sendResponse(res, 201, {
                status: 201,
                statusText: 'Created',
                message: 'User created successfully',
                data: newUser
            });
        });
    } else if (pathname?.startsWith('/api/users/') && method === 'PUT') {
        const userId = pathname.split('/')[3];
        if (!validateUUID(userId)) {
            return sendResponse(res, 400, {
                status: 400,
                statusText: 'Bad Request',
                message: 'Invalid userId. Please provide a valid UUID.'
            });
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { username, age, hobbies } = JSON.parse(body);

            const userIndex = users.findIndex(user => user.id === userId);
            if (userIndex === -1) {
                return sendResponse(res, 404, {
                    status: 404,
                    statusText: 'Not Found',
                    message: 'User not found with the provided userId.'
                });
            }

            users[userIndex] = {
                ...users[userIndex],
                username: username || users[userIndex].username,
                age: age || users[userIndex].age,
                hobbies: hobbies !== undefined ? hobbies : users[userIndex].hobbies
            };

            sendResponse(res, 200, {
                status: 200,
                statusText: 'Ok',
                message: 'User updated successfully',
                data: users[userIndex]
            });
        });
    } else if (pathname?.startsWith('/api/users/') && method === 'DELETE') {
        const userId = pathname.split('/')[3];
        if (!validateUUID(userId)) {
            return sendResponse(res, 400, {
                status: 400,
                statusText: 'Bad Request',
                message: 'Invalid userId. Please provide a valid UUID.'
            });
        }

        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return sendResponse(res, 404, {
                status: 404,
                statusText: 'Not Found',
                message: 'User not found with the provided userId.'
            });
        }

        users.splice(userIndex, 1);
        res.writeHead(204);
        res.end();
    } else {
        sendResponse(res, 404, {
            status: 404,
            statusText: 'Not Found',
            message: 'The requested resource was not found.'
        });
    }
});

const validateUUID = (id: string) => {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
};

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});