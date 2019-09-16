const admin = require('../functions/node_modules/firebase-admin');
const serviceAccount = require('./service-key.json');
const moment = require('../node_modules/moment');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lerb-7790f.firebaseio.com"
});

const USER_ID = 'mcL9r6MoyGeKbKKvj6dPDEtROjE2';
const NUM_DAYS = 40;
const MAX_RATING_CHANGE = 5;
// const END_DATE = new Date();
// const START_DATE = new Date(END_DATE.getTime() - )


const db = admin.firestore();

const trackers = ['Health', 'Weight', 'Energy'];
const factors = ['Exercise', 'Medicine', 'Coffee', 'Good Sleep'];

const ratingsRef = db.collection('ratings').doc(USER_ID);
const factorsRef = db.collection('factors').doc(USER_ID);

const ratingsData = {};

trackers.forEach(t => {
    ratingsData[t] = [];
    let value = 5;
    for (let i = 0; i < NUM_DAYS; i++) {
        let change = Math.floor(Math.random() * (2 * MAX_RATING_CHANGE + 1)) - MAX_RATING_CHANGE;
        value += change;
        if (value > 9) value = 9;
        if (value < 0) value = 0;
        let date = moment().subtract(i, 'days').toDate();
        ratingsData[t].push({ date, value });
    }
});

const factorsData = {};
factors.forEach(f => {
    const dates = [];
    let start = null;
    for (let i = NUM_DAYS; i > 0; --i) {
        let today = moment().subtract(i, 'days').toDate();
        if (start) {
            //1 in 3 of stopping
            if (Math.floor(Math.random() * 3) == 0) {
                dates.push({
                    start,
                    end: today
                });
                start = null;
            };
        } else {
            //1 in 3 of using
            if (Math.floor(Math.random() * 3) == 0) {
                //50/50 single use or range
                if (Math.round(Math.random())) {
                    //single
                    dates.push({
                        date: today
                    });
                } else {
                    //range
                    start = today;
                }
            }
        }
    }
    factorsData[f] = {
        dates,
        name: f
    }
});

ratingsRef.set(ratingsData);
factorsRef.set(factorsData);
