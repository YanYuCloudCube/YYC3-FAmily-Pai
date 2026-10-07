/**
 * file useChatPersistence.ts
 * description useChatPersistence Hook · 聊天记录持久化（配额清理/导入导出）
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [hook],hook
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized；类型引用改为 './types'
 */

import { useState, useEffect, useCallback } from "react";
import { Chat } from "./types";

const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AGE_DAYS = 30;

export function useChatPersistence(channelId: string, initialChats: Chat[] = []) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [loading, setLoading] = useState(true);

  const getStorageKey = (id: string) => id === 'main' ? "yyc3_chat_history" : `yyc3_chat_history_${id}`;

  useEffect(() => {
    setLoading(true);
    try {
      const key = getStorageKey(channelId);
      const stored = localStorage.getItem(key);

      if (stored) {
        const parsed: Chat[] = JSON.parse(stored, (key, value) => {
          if (key === "createdAt" || key === "updatedAt" || key === "timestamp") {
            return new Date(value);
          }
          return value;
        });

        const migrated = parsed.map(chat => ({
          ...chat,
          isStarred: chat.isStarred ?? false,
          messages: chat.messages || []
        }));

        setChats(migrated);
      } else {
        setChats(initialChats);
      }
    } catch (e) {
      console.error(`Failed to load chats for channel ${channelId}:`, e);
      setChats(initialChats);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  const saveChats = useCallback((newChats: Chat[]) => {
    try {
      const key = getStorageKey(channelId);
      const serialized = JSON.stringify(newChats);

      if (serialized.length > MAX_STORAGE_SIZE) {
        console.warn("Storage quota exceeded, cleaning old chats...");
        const now = new Date();
        const cutoff = new Date(now.getTime() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

        const cleaned = newChats.filter(c =>
          c.isStarred || new Date(c.updatedAt) > cutoff
        );

        localStorage.setItem(key, JSON.stringify(cleaned));
        setChats(cleaned);
      } else {
        localStorage.setItem(key, serialized);
        setChats(newChats);
      }
    } catch (e) {
      console.error(`Failed to save chats for channel ${channelId}:`, e);
    }
  }, [channelId]);

  const setChatsWrapper = useCallback((value: Chat[] | ((val: Chat[]) => Chat[])) => {
    setChats(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      saveChats(newValue);
      return newValue;
    });
  }, [saveChats]);

  const exportData = useCallback(() => {
    const data = {
      channelId,
      timestamp: new Date().toISOString(),
      chats
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yyc3_channel_${channelId}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [chats, channelId]);

  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString, (key, value) => {
        if (key === "createdAt" || key === "updatedAt" || key === "timestamp") {
          return new Date(value);
        }
        return value;
      });

      if (parsed.chats && Array.isArray(parsed.chats)) {
        setChatsWrapper(parsed.chats);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Import failed:", e);
      return false;
    }
  }, [setChatsWrapper]);

  return {
    chats,
    setChats: setChatsWrapper,
    loading,
    exportData,
    importData
  } as const;
}
