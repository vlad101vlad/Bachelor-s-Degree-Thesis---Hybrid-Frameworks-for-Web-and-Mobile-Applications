import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ionic-app-base',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    url: '192.168.100.10'
  }
};

export default config;
