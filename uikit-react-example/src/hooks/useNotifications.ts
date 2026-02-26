import { useEffect } from 'react';

interface ProfanityEvent {
  sender: string;
  message: string;
  channelName: string;
}

interface GroupChannelCreateEvent {
  channelName: string;
  message: string;
  data: { author: string; work: string; year: string };
}

export interface MessageSendEvent {
  senderId: string;
  senderNickname: string;
  message: string;
  channelName: string;
  channelUrl: string;
}

const requestPermission = async (): Promise<void> => {
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }
  console.log('[notifications] permission:', Notification.permission);
};

const notify = (title: string, body: string): void => {
  console.log('[notifications] firing notification:', { title, body });
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  } else {
    console.warn('[notifications] permission not granted:', Notification.permission);
  }
};

const useNotifications = (
  currentUserId: string,
  onMessageSend?: (event: MessageSendEvent) => void,
): void => {
  useEffect(() => {
    requestPermission();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log('[sse] connecting to:', `${backendUrl}/events`);

    const source = new EventSource(`${backendUrl}/events`);

    source.onopen = () => console.log('[sse] connected');
    source.onerror = (e) => console.error('[sse] connection error:', e);

    source.addEventListener('profanity_filter', (e) => {
      console.log('[sse] profanity_filter event received:', e.data);
      const { sender, message, channelName } = JSON.parse(e.data) as ProfanityEvent;
      notify(`Profanity detected in ${channelName}`, `${sender}: ${message}`);
    });

    source.addEventListener('group_channel_create', (e) => {
      console.log('[sse] group_channel_create event received:', e.data);
      const { channelName, message, data } = JSON.parse(e.data) as GroupChannelCreateEvent;
      notify(
        `New channel created: ${channelName}`,
        `${message}\n— ${data.author}, ${data.work} (${data.year})`
      );
    });

    source.addEventListener('message_send', (e) => {
      console.log('[sse] message_send event received:', e.data);
      const event = JSON.parse(e.data) as MessageSendEvent;

      if (event.senderId === currentUserId) return;

      onMessageSend?.(event);
    });

    return () => source.close();
  }, [currentUserId]);
};

export default useNotifications;
