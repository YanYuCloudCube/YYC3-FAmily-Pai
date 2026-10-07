/**
 * file useChannelManager.ts
 * description useChannelManager Hook · 多渠道管理（创建/删除/重命名/激活）
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [hook],hook,manager
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized/yyc3-zero-dependency/hooks
 */

import { useState, useEffect, useCallback } from "react";

const CHANNELS_KEY = "yyc3_channels_meta";

export interface Channel {
  id: string;
  name: string;
  createdAt: Date;
  isEncrypted?: boolean;
  preset?: string;
}

const DEFAULT_CHANNEL: Channel = {
  id: "main",
  name: "Main Console",
  createdAt: new Date(),
  preset: "General"
};

export function useChannelManager() {
  const [channels, setChannels] = useState<Channel[]>([DEFAULT_CHANNEL]);
  const [activeChannelId, setActiveChannelId] = useState<string>("main");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHANNELS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored, (key, value) => {
            if (key === "createdAt") return new Date(value);
            return value;
        });
        setChannels(parsed);
      } else {
        localStorage.setItem(CHANNELS_KEY, JSON.stringify([DEFAULT_CHANNEL]));
      }
    } catch (e) {
      console.error("Failed to load channels:", e);
    }
  }, []);

  const saveChannels = useCallback((newChannels: Channel[]) => {
    localStorage.setItem(CHANNELS_KEY, JSON.stringify(newChannels));
    setChannels(newChannels);
  }, []);

  const createChannel = useCallback((name: string, options?: { isEncrypted?: boolean, preset?: string }) => {
    const newChannel: Channel = {
      id: `chan_${Date.now()}`,
      name: name,
      createdAt: new Date(),
      isEncrypted: options?.isEncrypted,
      preset: options?.preset || "General"
    };
    saveChannels([...channels, newChannel]);
    return newChannel.id;
  }, [channels, saveChannels]);

  const deleteChannel = useCallback((id: string) => {
    if (id === "main") return; // Protect main channel

    localStorage.removeItem(`yyc3_chat_history_${id}`);

    const newChannels = channels.filter(c => c.id !== id);
    saveChannels(newChannels);

    if (activeChannelId === id) {
      setActiveChannelId("main");
    }
  }, [channels, activeChannelId, saveChannels]);

  const updateChannelName = useCallback((id: string, name: string) => {
    const newChannels = channels.map(c =>
      c.id === id ? { ...c, name } : c
    );
    saveChannels(newChannels);
  }, [channels, saveChannels]);

  return {
    channels,
    activeChannelId,
    setActiveChannelId,
    createChannel,
    deleteChannel,
    updateChannelName
  };
}
