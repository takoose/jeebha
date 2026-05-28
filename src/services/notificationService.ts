import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: any;
  link?: string;
}

export const sendNotification = async (notif: Omit<Notification, 'createdAt' | 'read'>) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      ...notif,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const subscribeToNotifications = (userId: string, callback: (notifs: Notification[]) => void) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(10)
  );

  return onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
    callback(notifs);
  });
};
