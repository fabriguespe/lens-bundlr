<template>
  <div class="container text-center">
    <MyNav/>
    <div>
      <h4 style="margin-top:20px;text-aling:center">Latest posts</h4>
      <div v-if="!pubs" class="loader"></div>
      <div v-for="(pub,index) in pubs" :key="pub.id">
        <div v-for="(post,index) in pub.publication" :key="post.id">
          <template v-if="post.media && post.media[0] && post.media[0].original && post.media[0].original.mimeType.includes('image')">
            <b style="display:block;margin-top:40px;">{{pub.id}}-{{pub.name}}</b>
            <img style='display:block;max-width:300px;margin:0 auto;' :src='post.media[0].original.url'/>
          </template>
        </div>
        
      </div>
    </div>
  </div>
</template>


<script>

import {  getPublications, recommendProfiles } from '@/plugins/api'
import MyNav from '@/components/Nav'
export default {
  data() {
        return {
            pubs:null,
        }
  },
  mounted(){
    this.recommendProfiles()
  },
  methods:{
    
    async recommendProfiles() {
      try {
        const response = await this.$util.gclient().query(recommendProfiles).toPromise()
        const profileData = await Promise.all(response.data.recommendedProfiles.map(async profile => {
          const pub = await this.$util.gclient().query(getPublications, { id: profile.id, limit: 1 }).toPromise()
          profile.publication = pub.data.publications.items[0]
          return profile
        }))
        this.pubs=profileData
      } catch (err) {
        console.log('error fetching recommended profiles: ', err)
      }
    },

  },
  components:{
    MyNav
  }
}
</script>