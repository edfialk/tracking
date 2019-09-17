<h3 align="center">Tracker</h3>
<br>
<p align="center"><img src="https://user-images.githubusercontent.com/8652384/65061496-e4b06800-d92e-11e9-851a-290702722171.png"></p>
<p align="center">A webapp for visualizing effects.</p>
<p align="center">Built with Vue and Firebase.</p>

## Preview
```
git clone
npm install
```

Create project in firebase console.

Copy firebase config to /src/firebase.config.js

example firebase.config.js:
```
export default {
    apiKey: "{{ API KEY }}",
    authDomain: "{{ PROJECT }}.firebaseapp.com",
    databaseURL: "https://{{ PROJECT }}.firebaseio.com",
    projectId: "{{ PROJECT }}",
    storageBucket: "{{ PROJECT }}.appspot.com",
    messagingSenderId: "{{ COPY THIS... }}",
    appId: "{{ ...FROM FIREBASE }}"
};
```
```
npm run serve
```

visit localhost:8080