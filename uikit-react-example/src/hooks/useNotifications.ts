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

const useNotifications = (): void => {
  useEffect(() => {
    requestPermission();

    const source = new EventSource(`${import.meta.env.VITE_BACKEND_URL}/events`);

    source.addEventListener('profanity_filter', (e) => {
      const { sender, message, channelName } = JSON.parse(e.data) as ProfanityEvent;
      notify(`Profanity detected in ${channelName}`, `${sender}: ${message}`);
    });

    source.addEventListener('group_channel_create', (e) => {
      const { channelName, message, data } = JSON.parse(e.data) as GroupChannelCreateEvent;
      notify(
        `New channel created: ${channelName}`,
        `${message}\n— ${data.author}, ${data.work} (${data.year})`
      );
    });

    return () => source.close();
  }, []);
};

export default useNotifications;
