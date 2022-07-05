<template>
  <div class="container text-center">
    <MyNav/>
    <div class="container text-center">

      <h4 style="margin-top:20px;text-aling:center">Your posts</h4>
      <div v-if="loading" class="loader"></div>
      <div v-else-if="pubs" v-for="(post,index) in pubs" :key="index">
          <img v-if="post.media && media[0].original.url" style='display:block;max-width:300px;margin:0 auto;' :src='post.media[0].original.url'/>
          <span v-else>{{post.metadata.content}}</span>
      </div>
      <div v-else>
        Wallet missing
      </div>

        
    </div>
  </div>
</template>


<script>

import {  getPublications, defaultProfile} from '@/plugins/api'
import { ethers } from 'ethers'
import MyNav from '@/components/Nav'
import Newpost from '@/components/Newpost.vue'
export default {
  data() {
        return {
            loading:true,
            pubs:null,
            profile:null,
            wallet:this.$store.state.wallet
        }
  },
  async mounted(){

    const provider = new ethers.providers.Web3Provider((window).ethereum)
    const addresses = await provider.listAccounts();
    this.$store.state.wallet=addresses[0]
    this.wallet=addresses[0]

    await this.fetchProfile()

          
  },
  methods:{
    async  fetchProfile() {
      this.loading=true
      try {
        let dis= this
        const urqlClient = await this.$util.createClient()
        const dd = await urqlClient.query(defaultProfile, {request:{ethereumAddress: dis.wallet }}).toPromise()
        this.profile=dd.data  
        const pub = await this.$util.gclient().query(getPublications, { id: dis.profile.defaultProfile.id, limit: 1 }).toPromise()
        this.pubs = pub.data.publications.items
   
      } catch (err) {
        console.log('error fetching profile...', err)
      }
        this.loading=false
    }

  },
  components:{
    MyNav,Newpost
  }
}
</script>