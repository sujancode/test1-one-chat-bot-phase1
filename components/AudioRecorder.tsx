"use client"

import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AudioRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptionRef = useRef<string>('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcriptionRef.current += event.results[i][0].transcript + ' ';
          }
        }
      };

      recognitionRef.current.onend = () => {
        onTranscriptionComplete(transcriptionRef.current.trim());
        transcriptionRef.current = ''; // Reset for next recording
      };

      recognitionRef.current.start();
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recognitionRef.current) {
      mediaRecorderRef.current.stop();
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={isRecording ? stopRecording : startRecording}
    >
      {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </Button>
  );
};

export default AudioRecorder;