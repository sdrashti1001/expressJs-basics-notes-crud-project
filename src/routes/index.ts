import { Request, Response,Router,NextFunction } from 'express';
import NotesRoutes from './NotesRouter';
import { JWT_SECRET } from '../Constants';
import { HTTP_STATUS_CODES, sendResponse } from '../errorHandlers';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';


export default class Routes {
    router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const userRoutes = new NotesRoutes();
        this.router.use('/api/notes',verifyToken, userRoutes.getRouter());
        this.registerUserRoutes();

    }
    public getRouter(): Router {
        return this.router;
    }

    private registerUserRoutes(): void {
        // Authentication routes
        this.router.post('/register', UserModel.registerUser);
        this.router.post('/login', UserModel.loginUser);
    }
}
// Middleware to verify JWT token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return sendResponse(res, { message: 'Unauthorized' }, HTTP_STATUS_CODES.UNAUTHORIZED);
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return sendResponse(res, { message: 'Invalid token' }, HTTP_STATUS_CODES.UNAUTHORIZED);
        }

        // Attach the decoded user information to the request object
        (req as any).user = decoded;
        next();
    });
};
