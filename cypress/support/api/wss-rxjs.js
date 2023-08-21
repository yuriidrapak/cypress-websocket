// '../support/api/wss-rxjs.js'

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export default class Wss {
    static ws = null;
    static messagesReceived = [];
    static wsObservable = null;
    static _disconnect$ = new Subject();

    static connect(url) {
        this.ws = new WebSocket(url);

        const connectionEstablished$ = new Observable(subscriber => {
            this.ws.onopen = () => {
                subscriber.next();
                subscriber.complete();
            };
            this.ws.onerror = (error) => {
                subscriber.error(error);
            };
        });

        return connectionEstablished$;
    }

    static listen() {
        if (!this.ws) {
            throw new Error("WebSocket is not initialized. Please call `connect` first.");
        }

        this.wsObservable = new Observable(subscriber => {
            this.ws.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                this.messagesReceived.push(parsedData);
                subscriber.next(parsedData);
            };

            this.ws.onerror = (error) => {
                console.error("WebSocket Error:", error);
            };

            this.ws.onclose = (event) => {
                if (event.wasClean) {
                    console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
                } else {
                    console.error('Connection died');
                }
            };
        }).pipe(takeUntil(this._disconnect$)); // Automatically unsubscribe on disconnect

        return this.wsObservable;
    }

    static close() {
        this._disconnect$.next();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    static sendMessage(message) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not open. Please ensure the connection is established before sending messages.");
        }
        this.ws.send(JSON.stringify(message));
    };
};