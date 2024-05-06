import { Note } from './Notes';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import { performDatabaseOperation,notesDb } from '../databaseHelper';

export class NoteModel {

    // Get all notes from the database
    async getAllNotes(): Promise<Note[]> {
        try {
            return await performDatabaseOperation<Note[]>((callback) => {
                notesDb.find({}, callback);
            });
        } catch (error) {
            throw new Error('Failed to fetch notes from the database');
        }
    }

    async getNotesByDateRange(startDate: Date, endDate: Date): Promise<Note[]> {
        try {
            return await performDatabaseOperation<Note[]>((callback) => {
                notesDb.find({ createdAt: { $gte: startDate, $lte: endDate } }, callback);
            });
        } catch (error) {
            throw new Error('Failed to fetch notes by date range from the database');
        }
    }
    // Get a note by ID from the database
    async getNoteById(id: string): Promise<Note | null> {
        try {
            return await performDatabaseOperation<Note | null>((callback) => {
                notesDb.findOne({ id:id }, callback);
            });
        } catch (error) {
            throw new Error('Failed to fetch note from the database');
        }
    }

    // Create a new note in the database
    async createNote(newNote: Note): Promise<Note> {
        try {
            // Generate a UUID for the new note
            const newNoteId = uuidv4();
            // Set the generated UUID as the ID of the new note
            newNote.id = newNoteId;

            return await performDatabaseOperation<Note>((callback) => {
                notesDb.insert(newNote, callback);
            });
        } catch (error) {
            throw new Error('Failed to create note in the database');
        }
    }

    // Update an existing note in the database
    async updateNote(id: string, updatedNote: Note): Promise<Note | null> {
        try {
            return await performDatabaseOperation<Note | null>((callback) => {
                notesDb.update({ id }, { $set: updatedNote }, { returnUpdatedDocs: true }, callback);
            });
        } catch (error) {
            throw new Error('Failed to update note in the database');
        }
    }

    // Delete a note from the database
    async deleteNote(id: string): Promise<void> {
        try {
            return await performDatabaseOperation<void>((callback) => {
                notesDb.remove({ id }, {}, callback);
            });
        } catch (error) {
            throw new Error('Failed to delete note from the database');
        }
    }

    async deleteAllNotes(): Promise<void> {
        try {
            return await performDatabaseOperation<void>((callback) => {
                notesDb.remove({}, { multi: true }, callback);
            });
        } catch (error) {
            throw new Error('Failed to delete all notes from the database');
        }
    }
    
}
