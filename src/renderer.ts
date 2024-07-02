// src/renderer.ts
interface Message {
  text: string;
  sender: "user" | "ai";
}

class ChatUI {
  private messages: Message[] = [];
  private chatContainer: HTMLElement;

  constructor() {
    this.chatContainer = document.getElementById(
      "chat-container",
    ) as HTMLElement;
  }

  addMessage(text: string, sender: "user" | "ai"): void {
    const message: Message = { text, sender };
    this.messages.push(message);
    this.render();
  }

  private render(): void {
    this.chatContainer.innerHTML = this.messages
      .map((msg) => `<div class="${msg.sender}-message">${msg.text}</div>`)
      .join("");
  }
}

const chat = new ChatUI();

// Example usage
document.addEventListener("DOMContentLoaded", () => {
  chat.addMessage("Hi! It's AI. Welcome to AutoCode!", "ai");
});
