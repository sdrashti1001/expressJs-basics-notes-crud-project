import Datastore from 'nedb';

// Create an instance of the database
export const usersDb = new Datastore({ filename: 'users.db', autoload: true });
export const notesDb = new Datastore({ filename: 'notes.db', autoload: true });

// Helper function to perform database operation
export const performDatabaseOperation = <T>(operation: (callback: (err: Error | null, result?: T) => void) => void): Promise<T> => {
    return new Promise((resolve, reject) => {
        operation((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};