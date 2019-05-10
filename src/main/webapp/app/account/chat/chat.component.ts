import { ChatService } from './chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';

@Component({
    selector: 'jhi-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    title = 'Spring Boot WebSocket Chat App';
    private stompClient;
    connectedPromise: any;
    alreadyConnectedOnce = false;

    constructor(private chatService: ChatService) {}

    ngOnInit() {
        this.chatService.connect();
        this.chatService.subscribe();
        this.chatService.receive().subscribe(message => {
            console.log('message', message);
            if (message) {
                $('.chat').prepend("<div class='alert alert-secondary flex-wrap'>" + message.body + '</div>');
            }
        });
    }

    sendMessage(message) {
        if (message) {
            this.chatService.sendMessage(message);
        }
        $('#input').val('');
    }

    ngOnDestroy(): void {
        this.chatService.unsubscribe();
        this.chatService.disconnect();
    }
}
