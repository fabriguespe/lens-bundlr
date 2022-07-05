<template>
  <div class="container text-center">
    <MyNav/>
    <div v-if="!profile" class="loader"></div>
    <div v-if="profile" class="container text-center">
      <img style='border-radius:50%;display:block;max-width:300px;margin:0 auto;' :src='profile.picture.original.url'/>
    
      <span style="margin-top:20px;">{{profile.id}}</span>
      <h2 style="margin-top:20px;">{{profile.name}}</h2>
      <p style="margin-top:20px;">{{profile.bio}}</p>
    </div>
    <div v-else-if="!wallet" class="container text-center">
      <h4>No profile, connect your wallet</h4>
    </div>
  </div>
</template>


<script>

import { defaultProfile,getPublications } from '@/plugins/api'
import { providers, ethers } from 'ethers'
import MyNav from '@/components/Nav'
export default {
  data() {
        return {
            profile:null,
            wallet:this.$store.state.wallet
        }
  },
  async mounted(){

    const provider = new ethers.providers.Web3Provider((window).ethereum)
    const addresses = await provider.listAccounts();
    this.$store.state.wallet=addresses[0]
    this.wallet=addresses[0]

    this.fetchProfile()
  },
  methods:{
    
    async  fetchProfile() {
      try {
        let dis= this
        const urqlClient = await this.$util.createClient()
        const dd = await urqlClient.query(defaultProfile, {request:{ethereumAddress: dis.wallet }}).toPromise()
        this.profile=dd.data  
   
      } catch (err) {
        console.log('error fetching profile...', err)
      }
    }

  },
  components:{
    MyNav
  }
}
</script>