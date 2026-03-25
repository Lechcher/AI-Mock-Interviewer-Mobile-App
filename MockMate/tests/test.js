const { Client, Avatars } = require('react-native-appwrite');
const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('test');
const avatars = new Avatars(client);
const url = avatars.getInitials({ name: 'Test' });
console.log(typeof url, url.constructor.name, url.toString());
