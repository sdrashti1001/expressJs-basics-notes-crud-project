import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES, sendResponse } from '../errorHandlers';
import { performDatabaseOperation, usersDb } from '../databaseHelper';
import { JWT_SECRET } from '../Constants';

export default class UserModel {

    static async registerUser(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;

        try {
            // Check if the username already exists
            const existingUser = await performDatabaseOperation<any>((callback) => {
                usersDb.findOne({ username }, callback);
            });

            if (existingUser) {
                sendResponse(res, { message: 'Username already exists' }, HTTP_STATUS_CODES.BAD_REQUEST);
                return;
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user data into the database
            await performDatabaseOperation<any>((callback) => {
                usersDb.insert({ username, password: hashedPassword }, callback);
            });

            sendResponse(res, { message: 'User registered successfully' }, HTTP_STATUS_CODES.CREATED);
        } catch (error) {
            sendResponse(res, { message: 'Failed to register user' }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    }

    static async loginUser(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;

        try {
            // Find the user by username
            const user = await performDatabaseOperation<any>((callback) => {
                usersDb.findOne({ username }, callback);
            });

            if (!user) {
                 sendResponse(res, { message: 'Invalid username or password' }, HTTP_STATUS_CODES.BAD_REQUEST);
                 return;
            }

            // Validate password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                 sendResponse(res, { message: 'Invalid username or password' }, HTTP_STATUS_CODES.BAD_REQUEST);
                 return;
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

            sendResponse(res, { token }, HTTP_STATUS_CODES.OK);
        } catch (error) {
            sendResponse(res, { message: 'Failed to authenticate user' }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteAllUsers(): Promise<void> {
        try {
            return await performDatabaseOperation<void>((callback) => {
                usersDb.remove({}, { multi: true }, callback);
            });
        } catch (error) {
            throw new Error('Failed to delete all users from the database');
        }
    }
    
}
