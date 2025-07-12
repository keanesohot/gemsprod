import { useState, useEffect, useCallback, useRef } from 'react';
import { BusData } from '../../interfaces/bus.interface';
const VITE_WSURL = import.meta.env.VITE_WSURL

import Cookies from "js-cookie";


export function useWebSocketData() {
  const [messages, setMessages] = useState<BusData | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [lastMessageTime, setLastMessageTime] = useState<number>(0);
  const url = `${VITE_WSURL}`;
  const token = Cookies.get("token") || "";

  // === Reconnect logic ===
  const reconnectDelayRef = useRef(1000); // เริ่มที่ 1 วินาที
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  // Health check
  useEffect(() => {
    const healthCheck = setInterval(() => {
      const now = Date.now();
      if (connectionStatus === 'connected' && lastMessageTime > 0) {
        const timeSinceLastMessage = now - lastMessageTime;
        if (timeSinceLastMessage > 10000) { // 10 วินาทีไม่มีข้อมูล
          console.warn('No data received for 10 seconds, reconnecting...');
          wsRef.current?.close();
        }
      }
    }, 5000); // ตรวจสอบทุก 5 วินาที

    return () => clearInterval(healthCheck);
  }, [connectionStatus, lastMessageTime]);

  useEffect(() => {
    let isUnmounted = false;
    
    function connect() {
      if (isUnmounted) return;
      
      setConnectionStatus('connecting');
      const ws = new WebSocket(url, [token]);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setSocket(ws);
        setConnectionStatus('connected');
        reconnectDelayRef.current = 1000; // reset delay
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const newMessage: BusData = JSON.parse(event.data);
          setMessages(newMessage);
          setLastMessageTime(Date.now());
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setSocket(null);
        setConnectionStatus('disconnected');
        
        if (!isUnmounted) {
          // Clear existing timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          // Exponential backoff (max 30s)
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, 30000);
            connect();
          }, reconnectDelayRef.current) as unknown as number;
        }
      };
    }
    
    connect();
    
    return () => {
      isUnmounted = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [url, token]);

  const sendMessage = useCallback((message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  return { 
    messages, 
    sendMessage, 
    connectionStatus, 
    lastMessageTime 
  };
}