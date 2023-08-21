import { addStreamCommands } from '@lensesio/cypress-websocket-testing';
addStreamCommands();

Cypress.Commands.add('wrapObservable', (observable, timeout = 60000) => {
    return new Cypress.Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('Observable timeout'));
        }, timeout);

        observable.subscribe({
            next: value => {
                clearTimeout(timer);
                resolve(value);
            },
            error: err => {
                clearTimeout(timer);
                reject(err);
            }
        });
    });
});