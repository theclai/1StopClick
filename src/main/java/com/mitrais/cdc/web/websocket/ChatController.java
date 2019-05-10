package com.mitrais.cdc.web.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class ChatController {
    private Logger logger = LoggerFactory.getLogger(ChatController.class);

    private static final Logger log = LoggerFactory.getLogger(ActivityService.class);

    private final SimpMessagingTemplate  messagingTemplate;

    @Autowired
    public ChatController(final SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/topic/chat.sendMessage")
    //@SendTo("/topic/chat")
    public void onReceiveMessage(@Nullable final  String message, StompHeaderAccessor stompHeaderAccessor, Principal principal) {
        logger.warn("message [{}]", message);
        messagingTemplate.convertAndSend("/topic/chat", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")) + ": "+message);
    }
}
