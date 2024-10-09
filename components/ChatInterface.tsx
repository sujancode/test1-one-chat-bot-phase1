"use client"

import React, { useState, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import AudioRecorder from './AudioRecorder';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
  isAudio?: boolean;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    setMessages([
      { 
        id: 1, 
        text: "Hello! How can I help you today?", 
        sender: 'other', 
        timestamp: new Date().toISOString() 
      },
    ]);
  }, []);

  const handleSendMessage = (text: string, isAudio: boolean = false) => {
    if (text.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text,
        sender: 'user',
        timestamp: new Date().toISOString(),
        isAudio,
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      
      // Simulate a response (you'd replace this with actual API call in a real app)
      setTimeout(() => {
        const responseMessage: Message = {
          id: messages.length + 2,
          text: "Thanks for your message. How else can I assist you?",
          sender: 'other',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 1000);
    }
  };

  const handleTranscriptionComplete = (transcription: string) => {
    handleSendMessage(transcription, true);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-md mx-auto border rounded-lg overflow-hidden">
      <div className="bg-primary text-primary-foreground p-4">
        <h2 className="text-xl font-bold">Chat Support</h2>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="w-8 h-8">
                <div className={message.sender === 'user' ? 'bg-blue-500' : 'bg-gray-500'} />
              </Avatar>
              <div className={`mx-2 p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                <p>{message.isAudio ? '🎤 ' : ''}{message.text}</p>
                <span className="text-xs opacity-50">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
      
      <div className="p-4 bg-background">
        <div className="flex items-center">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
            className="flex-grow mx-2"
          />
          <AudioRecorder onTranscriptionComplete={handleTranscriptionComplete} />
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Button onClick={() => handleSendMessage(inputMessage)}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}