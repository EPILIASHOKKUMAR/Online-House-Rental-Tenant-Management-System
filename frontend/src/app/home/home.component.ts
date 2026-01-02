import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatbotService, ChatResponse } from '../services/chatbot.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule, HttpClientModule],
  providers: [ChatbotService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  availableHouses = 0;
  pendingBookings = 0;
  recentProperties = 0;

  isChatOpen = false;
  isFullscreen = false;
  isTyping = false;
  userInput = '';
  messages: ChatMessage[] = [];

  @ViewChild('chatMessages') chatMessagesRef!: ElementRef;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    this.animateValue('availableHouses', 24);
    this.animateValue('pendingBookings', 8);
    this.animateValue('recentProperties', 5);

    this.messages.push({
      text: 'Hi! I\'m your HouseRental AI Assistant. I can help you with:\n\n• Finding properties in specific cities\n• Property statistics and availability\n• Understanding how our platform works\n• Booking process information\n\nHow can I help you today?',
      isUser: false
    });
  }

  private animateValue(property: 'availableHouses' | 'pendingBookings' | 'recentProperties', target: number) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        this[property] = target;
        clearInterval(timer);
      } else {
        this[property] = Math.floor(current);
      }
    }, duration / steps);
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (!this.isChatOpen) {
      this.isFullscreen = false;
    }
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  sendQuickMessage(message: string) {
    this.userInput = message;
    this.sendMessage();
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({
      text: this.userInput,
      isUser: true
    });

    const userQuestion = this.userInput;
    this.userInput = '';

    this.isTyping = true;
    this.scrollToBottom();

    this.chatbotService.sendMessage(userQuestion).subscribe({
      next: (response: ChatResponse) => {
        this.isTyping = false;
        this.messages.push({
          text: response.response,
          isUser: false
        });
        this.scrollToBottom();
      },
      error: (error) => {
        this.isTyping = false;
        console.error('Chatbot error:', error);
        this.messages.push({
          text: 'I apologize, but I\'m having trouble connecting to the server. Please make sure the backend is running and try again.',
          isUser: false
        });
        this.scrollToBottom();
      }
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatMessagesRef) {
        const element = this.chatMessagesRef.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }
}
