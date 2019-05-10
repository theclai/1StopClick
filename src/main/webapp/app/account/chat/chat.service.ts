import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { Location } from '@angular/common';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'webstomp-client';
import { CSRFService } from 'app/core';

@Injectable({ providedIn: 'root' })
export class ChatService {
    stompClient = null;
    subscriber = null;
    connection: Promise<any>;
    connectedPromise: any;
    listener: Observable<any>;
    listenerObserver: Observer<any>;
    alreadyConnectedOnce = false;
    private subscription: Subscription;

    constructor(private location: Location, private csrfService: CSRFService) {
        this.connection = this.createConnection();
        this.listener = this.createListener();
    }

    connect() {
        if (this.connectedPromise === null) {
            this.connection = this.createConnection();
        }
        // building absolute path so that websocket doesn't fail when deploying with a context path
        let url = '/websocket/tracker';
        url = this.location.prepareExternalUrl(url).replace('#', '');
        const socket = new SockJS(url);
        this.stompClient = Stomp.over(socket);
        const headers = {};
        headers['X-XSRF-TOKEN'] = this.csrfService.getCSRF('XSRF-TOKEN');
        console.log('headers', headers);
        this.stompClient.connect(headers, () => {
            this.connectedPromise('success');
            this.connectedPromise = null;
            if (!this.alreadyConnectedOnce) {
                this.alreadyConnectedOnce = true;
            }
        });
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
            this.stompClient = null;
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        this.alreadyConnectedOnce = false;
    }

    receive() {
        return this.listener;
    }

    sendMessage(message) {
        console.log('chat.service.sendMessage: ' + message);
        console.log('this.stompClient.connected', this.stompClient.connected);
        console.log('this.stompClient !== null', this.stompClient !== null);

        if (!this.stompClient.connected) {
            this.connect();
        }

        if (message && this.stompClient !== null && this.stompClient.connected) {
            this.stompClient.send(
                '/topic/chat.sendMessage', // destination
                message, // body
                {} // header
            );
        }
    }

    subscribe() {
        this.connection.then(() => {
            this.subscriber = this.stompClient.subscribe('/topic/chat', data => {
                console.log('chat.service-->subscribe', data);
                this.listenerObserver.next(data);
                // this.listenerObserver.next(data.body);
            });
        });
    }

    unsubscribe() {
        if (this.subscriber !== null) {
            this.subscriber.unsubscribe();
        }
        this.listener = this.createListener();
    }

    private createListener(): Observable<any> {
        return new Observable(observer => {
            this.listenerObserver = observer;
        });
    }

    private createConnection(): Promise<any> {
        return new Promise((resolve, reject) => (this.connectedPromise = resolve));
    }
}
