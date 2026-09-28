import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export function connect(onMessageReceived) {
  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,

    reconnectDelay: 5000,

    onConnect: () => {
      console.log("Conectado al WebSocket");

      stompClient.subscribe("/user/queue/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);

        onMessageReceived(receivedMessage);
      });
    },
  });

  stompClient.activate();
}

export function sendMessage(chatMessage) {
  console.log("SE LLAMÓ sendMessage DEL WEBSOCKET");
  
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat",

      body: JSON.stringify(chatMessage),
    });
  }
}

export function disconnect() {
    if(stompClient) {
        stompClient.deactivate();
    }
}


