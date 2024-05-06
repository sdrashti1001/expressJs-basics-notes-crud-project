import request from 'supertest';
import express, { Application } from 'express';
import { json, urlencoded } from 'express';
import { NoteModel } from '../models/NoteModel';
import { Note } from '../models/Notes';
import Routes from '../routes';
import cors from 'cors'; // Import cors module
import { usersDb } from '../databaseHelper';
import UserModel from '../models/UserModel';

const app: Application = express();
const routes = new Routes().getRouter();
const corsOptions = { origin: '*' };

app.use(cors(corsOptions));
app.use(json()); // parse requests of content-type application/json
app.use(urlencoded({ extended: true })); // parse requests of content-type application/x-www-form-urlencoded
app.use(routes);

// Mock JWT token for authorization
let authToken: string;

describe('Note Controller', () => {
    let testNoteId: string;
    const noteModel = new NoteModel();
    const userModel = new UserModel();

    beforeAll(async () => {

        // Register a new user if not already registered
        const existingUserRes = await request(app)
            .post('/login')
            .send({ "username": 'testuser', "password": 'testpassword' });
    
        if (existingUserRes.status !== 200) {
            await request(app)
                .post('/register')
                .send({ "username": 'testuser', "password": 'testpassword' });
        }
    
        // Login to get the authToken
        const loginRes = await request(app)
            .post('/login')
            .send({ "username": 'testuser', "password": 'testpassword' });
    
        authToken = loginRes.body.token;
    });

    afterAll(async () => {
        // Delete the test note after running the tests
        await noteModel.deleteAllNotes();
        await userModel.deleteAllUsers();
    });


    
    it('should create a new note', async () => {
        console.log("before authToken : "+authToken);
       console.log("after authToken : "+authToken);
       const res = await request(app)
           .post('/api/notes')
           .set('Authorization', `Bearer ${authToken}`)
           .send({ "title": 'Sample Note', "description": 'This is a sample note.' });
   
       expect(res.status).toBe(201);
       expect(res.body.title).toBe('Sample Note');
   });
   
    it('should return an error when creating a note with an empty title', async () => {
        const res = await request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ "title": '', "description": 'This is a sample note.' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Title and description are required');
    });

    it('should return an error when getting a note with invalid ID', async () => {
        const res = await request(app)
            .get('/api/notes/invalid-id')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Not Found');
    });

    it('should return an error when updating a note with invalid ID', async () => {
        const res = await request(app)
            .put('/api/notes/invalid-id')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Updated Test Note', description: 'This is an updated test note.' });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Note not found');
    });

    it('should return an error when deleting a note with invalid ID', async () => {
        const res = await request(app)
            .delete('/api/notes/invalid-id')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Note not found');
    });

    it('should delete all notes', async () => {
        const res = await request(app)
            .delete('/api/notes')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
    });

    // User Registration Test Cases
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send({ "username": 'newuser', "password": 'newpassword' });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('User registered successfully');
    });

    it('should return an error when registering with an existing username', async () => {
        const res = await request(app)
            .post('/register')
            .send({ "username": 'testuser', "password": 'testpassword' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Username already exists');
    });

    // User Login Test Cases
    it('should login with valid credentials', async () => {
        const res = await request(app)
            .post('/login')
            .send({ "username": 'testuser', "password": 'testpassword' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        authToken = res.body.token; // Save the authentication token for later use
    });

    it('should return an error when logging in with invalid credentials', async () => {
        const res = await request(app)
            .post('/login')
            .send({ "username": 'invaliduser', "password": 'invalidpassword' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid username or password');
    });

    // Access Protected Route Test Cases
    it('should access protected route with valid token', async () => {
        const res = await request(app)
            .get('/api/notes')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        // Add assertions for the response body if necessary
    });

    it('should return unauthorized error without token', async () => {
        const res = await request(app).get('/api/notes');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

});
