import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Location {
  lat: number;
  lng: number;
  updatedAt?: any;
}

export const updateDriverLocation = async (orderId: string, location: Location) => {
  const orderRef = doc(db, 'orders', orderId);
  try {
    await updateDoc(orderRef, {
      currentLocation: {
        ...location,
        updatedAt: serverTimestamp()
      }
    });
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
};

export const subscribeToOrderTracking = (orderId: string, onUpdate: (location: Location) => void) => {
  const orderRef = doc(db, 'orders', orderId);
  return onSnapshot(orderRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      if (data.currentLocation) {
        onUpdate(data.currentLocation);
      }
    }
  });
};

export const startLocationTracking = (orderId: string) => {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser.");
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      updateDriverLocation(orderId, { lat: latitude, lng: longitude });
    },
    (error) => {
      console.error("Error watching position:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 5000
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);
};
