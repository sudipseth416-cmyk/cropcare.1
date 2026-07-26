import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { PushNotifications } from '@capacitor/push-notifications';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const isNative = () => Capacitor.isNativePlatform();

export const triggerHaptic = async (style = ImpactStyle.Medium) => {
  if (isNative()) {
    await Haptics.impact({ style });
  }
};

export const initPushNotifications = async () => {
  if (isNative()) {
    let perm = await PushNotifications.checkPermissions();
    if (perm.receive !== 'granted') {
      perm = await PushNotifications.requestPermissions();
    }

    if (perm.receive === 'granted') {
      await PushNotifications.register();
    }

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ', notification);
    });
  }
};

export const takeNativePhoto = async () => {
  if (isNative()) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });
    return image.webPath;
  }
  return null;
};
