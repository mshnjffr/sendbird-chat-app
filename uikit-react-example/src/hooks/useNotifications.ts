/**
 * useNotifications hook
 * Manages the SSE connection to the backend and handles all real-time
 * notification events for the current user.
 */
import { useEffect, useRef } from 'react';

interface ProfanityEvent {
  senderId: string;
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
};

const notify = (title: string, body: string): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
};

/**
 * Opens an SSE connection to the backend and handles incoming events:
 * - profanity_filter: fires a browser notification with the censored message
 * - group_channel_create: fires a browser notification with the welcome quote
 * - message_send: calls onMessageSend (used to show an in-app toast)
 *
 * Own messages are filtered out client-side using currentUserId.
 */
const useNotifications = (
  currentUserId: string,
  onMessageSend?: (event: MessageSendEvent) => void,
): void => {
  // Keep the callback in a ref so the SSE listener always calls the latest
  // version without needing to reconnect when the reference changes
  const onMessageSendRef = useRef(onMessageSend);
  useEffect(() => { onMessageSendRef.current = onMessageSend; });

  useEffect(() => {
    requestPermission();

    const source = new EventSource(`${import.meta.env.VITE_BACKEND_URL}/events`);

    source.addEventListener('profanity_filter', (e) => {
      const { senderId, sender, message, channelName } = JSON.parse(e.data) as ProfanityEvent;
      if (senderId !== currentUserId) return;
      notify(`Profanity detected in ${channelName}`, `${sender}: ${message}`);
    });

    source.addEventListener('group_channel_create', (e) => {
      const { channelName, message, data } = JSON.parse(e.data) as GroupChannelCreateEvent;
      notify(`New channel created: ${channelName}`, `${message}\n— ${data.author}, ${data.work} (${data.year})`);
    });

    source.addEventListener('message_send', (e) => {
      const event = JSON.parse(e.data) as MessageSendEvent;
      if (event.senderId === currentUserId) return;
      onMessageSendRef.current?.(event);
    });

    return () => source.close();
  }, [currentUserId]);
};

export default useNotifications;
