/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface WebSocketEvent {
  type: string;
  data?: any;
  authorId?: string;
  timestamp: string;
}

interface UseWebSocketProps {
  onAuthorCreated?: (author: any) => void;
  onBookCreated?: (book: any, authorId: string) => void;
}

export function useWebSocket({
  onAuthorCreated,
  onBookCreated,
}: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(API_URL, {
      path: '/library/websocket',
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (error: Error) => {
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Library event handlers
    socket.on('author_created', (event: WebSocketEvent) => {
      if (onAuthorCreated && event.data) {
        onAuthorCreated(event.data);
      }
    });

    socket.on('book_created', (event: WebSocketEvent) => {
      if (onBookCreated && event.data && event.authorId) {
        onBookCreated(event.data, event.authorId);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [onAuthorCreated, onBookCreated]);

  return {
    isConnected,
    connectionError,
    socket: socketRef.current,
  };
}
