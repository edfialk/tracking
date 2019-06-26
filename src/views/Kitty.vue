<template>

    <div class="container">
        <h5>Good job here is a cat:</h5>
        <router-link to="/">
            <img :src="imgUrl" class="img-fluid my-3">
        </router-link>
        <h5>Poke the kitty to go home.</h5>
    </div>

</template>


<script>

import jQuery from 'jquery';

export default {

data() {
        return {
            imgUrl: null,
        }
    },

    created() {
        jQuery.get("https://api.thecatapi.com/v1/images/search?size=med?mime_types=gif,jpg,png", data => {
            if (data && data.length > 0 && data[0].url){
                this.imgUrl = data[0].url;
            }
        });
    },

}

</script>