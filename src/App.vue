<template>
  <main id="app" class="w-100 h-100">
    <Nav></Nav>
    <router-view 
      :things="things" 
      :ratings="ratings"
      :status="status"
      @saveRating="saveRating"
      @addThing="addThing"
      @saveThing="saveThing"
      @deleteThing="deleteThing"
      @reset="reset"
    />
  </main>
</template>

<script>

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import Nav from './components/Nav';

export default {

  components: { Nav },

  data() {
    return {
      user: null,
      things: [],
      ratings: [],
      status: { 
        loading: false,
        error: null,
      }
    };
  },

  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        this.getData();
      } else {
        this.$router.push('login');
      }
    });
  },

  methods: {
    getData() {
      this.getThings();
      this.getRatings();
    },

    getRatings() {
      firebase
        .firestore()
				.collection('ratings')
				.orderBy('date')
        .onSnapshot(snapshot => {
          this.ratings = snapshot.docs.map(doc => {
						let { date, rating } = doc.data();
						date = date.toMillis();
            return { date, rating };
					});
				});
    },

    saveRating(rating) {
      this.isLoading();

      firebase.firestore().collection('ratings').add({
        date: new Date(),
        rating
      }).then(this.reset).catch(this.error);
    },

    getThings() {
      firebase.firestore().collection('factors').orderBy("name", "asc").onSnapshot(snapshot => {
        this.things = snapshot.docs.map(doc => {
          let { name, dates, active, since } = doc.data();

          dates.sort((a,b) => {
            let x = a.end || a.date;
            let y = b.end || b.date;
            return new Date(x) - new Date(y);
          });

          return { id: doc.id, name, dates, active, since };
        });
      });
    },

    addThing(thing) {
      
      this.isLoading();

      firebase.firestore().collection('factors').add(thing).then(this.success).catch(this.error);

},

    saveThing(thing) {
      
      if (thing.dates.length == 0 && !thing.since){
        this.error("You have to put a date in somewhere.");
        return;
      }

      this.isLoading();

      let { active, dates, name, since } = thing;
      
      // if (!since) since = null;

      dates.sort((a,b) => {
        let x = a.end ? a.end : a.date;
        let y = b.end ? b.end : b.date;
        return new Date(x) - new Date(y);
      });

      firebase.firestore().collection('factors').doc(thing.id).set({
        active, dates, name, since
      }).then(this.reset).catch(this.error);

    },

    deleteThing(thing) {

      if (!thing.id) {
        this.error("Invalid thing.");
        return;
      }

      this.isLoading();

      firebase.firestore().collection('factors').doc(thing.id).delete().then(this.reset).catch(this.error);

    },

    reset() {
      this.status.loading = false;
      this.status.error = null;
    },

    isLoading() {
      this.status.error = null;
      this.status.loading = true;
    },

    error(err) {
      this.status.loading = false;
      this.status.error = err;
    },

    success() {
      this.reset();
      this.$router.push('/kitty');
    }

  }

}

</script>