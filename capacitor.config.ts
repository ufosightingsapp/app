import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.ufosightings.www',
  appName: 'UFO Sightings',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'icon',
      iconColor: '#1f1f1f',
      sound: 'sound.wav',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    Gallery: {},
  },
};

export default config;
