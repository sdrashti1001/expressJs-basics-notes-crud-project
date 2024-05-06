import {Router } from 'express';
import * as notesController from '../controllers/notesController';



export default class NotesRoutes {
    router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {

         // Apply verifyToken middleware to all routes
         
        this.router.get('/', notesController.getAllNotes);
        this.router.get('/byDateRange', notesController.getAllNotesByDateRange);
        this.router.get('/:id', notesController.getNoteById);
        this.router.post('/', notesController.createNote);
        this.router.put('/:id', notesController.updateNote);
        this.router.delete('/:id', notesController.deleteNote);
        this.router.delete('/', notesController.deleteAllNotes);
        
    }

    

    public getRouter(): Router {
        return this.router;
    }
}
