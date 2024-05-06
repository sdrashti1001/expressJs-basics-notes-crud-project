import { Request, Response } from 'express';
import { Note } from '../models/Notes';
import { NoteModel } from '../models/NoteModel';
import { handleNotFound, handleError, sendResponse, HTTP_STATUS_CODES } from '../errorHandlers';

const noteModel = new NoteModel();

export const getAllNotes = async (req: Request, res: Response) => {
    try {
        const notes = await noteModel.getAllNotes();
        return sendResponse(res, notes);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getAllNotesByDateRange = async (req: Request, res: Response) => {
    try {
        const start_date = req.query.start_date as string;
        const end_date = req.query.end_date as string;

        // Validate query parameters
        if (!start_date || !end_date) {
            return sendResponse(res, { message: 'Both start_date and end_date are required query parameters.' },HTTP_STATUS_CODES.BAD_REQUEST);
        }

        // Parse start and end dates
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Check if dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return sendResponse(res, { message: 'Invalid date format. Please provide dates in ISO 8601 format.' },HTTP_STATUS_CODES.BAD_REQUEST);
        }
        // Fetch notes from the database filtered by date range
        const filteredNotes = await noteModel.getNotesByDateRange(startDate, endDate);
        return sendResponse(res, filteredNotes);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getNoteById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const note = await noteModel.getNoteById(id);
        return note ? sendResponse(res, note) : handleNotFound(res);
    } catch (error) {
        return handleError(res, error);
    }
};

export const createNote = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (!title || !description || !title.trim() || !description.trim()) {
        return sendResponse(res, { message: 'Title and description are required' },HTTP_STATUS_CODES.BAD_REQUEST);
    }
    try {
        const newNote: Note = { id: '', title, description, createdAt: new Date(), updatedAt: new Date() };
        const createdNote = await noteModel.createNote(newNote);
        return sendResponse(res, createdNote, HTTP_STATUS_CODES.CREATED);
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateNote = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { title, description } = req.body;
    try {
        const existingNote = await noteModel.getNoteById(id);
        if (!existingNote) return handleNotFound(res, 'Note not found');
        if (!title || !description || !title.trim() || !description.trim()) {
            return sendResponse(res, { message: 'Title and description are required' },HTTP_STATUS_CODES.BAD_REQUEST);
        }
        let updatedNote:Note;
        if(req.body.createdAt){
            let createdAt= new Date(req.body.createdAt);
            // Check if dates are valid
            if (isNaN(createdAt.getTime())) {
                return sendResponse(res,{ message: 'Invalid date format. Please provide dates in ISO 8601 format.' },HTTP_STATUS_CODES.BAD_REQUEST);
            }
            updatedNote = { ...existingNote, title, description,createdAt:createdAt, updatedAt: new Date() };
        }else{
            updatedNote = { ...existingNote, title, description, updatedAt: new Date() };
        }
        const result = await noteModel.updateNote(id, updatedNote);
        return sendResponse(res, { message: 'Note Updated' } || existingNote);
    } catch (error) {
        return handleError(res, error);
    }
};

export const deleteNote = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const existingNote = await noteModel.getNoteById(id);
        if (!existingNote) return handleNotFound(res, 'Note not found');
        await noteModel.deleteNote(id);
        return sendResponse(res, { message: 'Note Deleted' }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        return handleError(res, error);
    }
};

export const deleteAllNotes = async (req: Request, res: Response) => {
    try {
        await noteModel.deleteAllNotes();
        return sendResponse(res, { message: 'All Notes are Deleted' }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        return handleError(res, error);
    }
};
