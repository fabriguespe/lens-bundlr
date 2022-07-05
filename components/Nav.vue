<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="/"><img width="50" src="https://docs.bundlr.network/img/logo.svg"/></a>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active"> <router-link class="nav-link"  to="/">Home</router-link></li>
          <li class="nav-item active"> <router-link class="nav-link" to="/profile">Profile</router-link></li>
          <li class="nav-item active"> <router-link class="nav-link" to="/explore">Explore</router-link></li>
          <li class="nav-item active"> <router-link class="nav-link" to="/balance">Balance</router-link></li>
          <button v-if="wallet" class="btn btn-outline-success my-2 my-sm-0" style="margin:0 auto;" @click="showModal=true">+</button>
        </ul>
        <div class="form-inline my-2 my-lg-0">
          <button v-if="!wallet" class="btn btn-outline-success my-2 my-sm-0" @click="login()">Login</button>
          <button v-else class="btn btn-outline-success my-2 my-sm-0" >{{wallet.slice(0,8)}}...</button>
          <button v-if="wallet" class="btn btn-outline-success my-2 my-sm-0" @click="publish()">Post</button>
    
        </div>
      </div>
      <Newpost v-show="showModal" @close-modal="showModal = false" :bundlr="bundlrRef"/>
    </nav>
</template>

<script>


import { WebBundlr } from "@bundlr-network/client"
import { providers, ethers } from 'ethers'
import  Newpost from '@/components/Newpost'
import { getChallenge,authenticate,createPostTypedData,defaultProfile} from '@/plugins/api'

export default {
  data() {
        return {
            showModal:false,
            wallet:this.$store.state.wallet,
            bundlrRef:false
        }
  },
  async mounted(){
    const provider = new ethers.providers.Web3Provider((window).ethereum)
    const addresses = await provider.listAccounts();
    this.$store.state.wallet=addresses[0]
    this.wallet=addresses[0]
    this.initialiseBundlr()
  },
  methods:{
    
    async initialiseBundlr() {
      
      let dis=this
      console.log(window.ethereum)
      const accounts = await window.ethereum.send("eth_requestAccounts" )
      const account = accounts.result[0]
      
      const provider = new providers.Web3Provider(window.ethereum);
      await provider._ready()
      
      const bundlr = new WebBundlr("https://node1.bundlr.network", "matic", provider)
      await bundlr.ready()
      
      this.bundlrRef = bundlr
      this.bundlrRef.current = bundlr
      this.$store.state.bundlrRef = bundlr
      this.$store.state.bundlrRef.current = bundlr
      
    },
    async login(){
      try{
        let dis=this
        const accounts = await window.ethereum.send("eth_requestAccounts" )
        const account = accounts.result[0]


        const provider = new providers.Web3Provider(window.ethereum);
        await provider._ready()
      
        const bundlr = new WebBundlr("https://node1.bundlr.network", "matic", provider)
        await bundlr.ready()
        this.wallet=bundlr
        this.$store.commit('setProfile',bundlr)
        
        const urqlClient = await this.$util.createClient()


        //Lens sign
        const response = await urqlClient.query(getChallenge, {address: dis.wallet }).toPromise()
        const signer = provider.getSigner()
        const signature = await signer.signMessage(response.data.challenge.text)
        const authData = await urqlClient.mutation(authenticate, { address: account, signature}).toPromise()
        const { accessToken, refreshToken } = authData.data.authenticate
        const accessTokenData = this.$util.parseJwt(accessToken)
        localStorage.setItem(this.$util.STORAGE_KEY, JSON.stringify({ accessToken, refreshToken, exp: accessTokenData.exp}))
        
      }catch(e){
        console.log(e)
      }
    },
    async publish(){
        // hard coded to make the code example clear

        let dis= this
        const urqlClient = await this.$util.createClient()
        const dd = await urqlClient.query(defaultProfile, {request:{ethereumAddress: dis.wallet }}).toPromise()
        console.log(dd.data.defaultProfile.id)
        const createPostRequest = {
        profileId: dd.data.defaultProfile.id,
        contentURI: "ipfs://QmPogtffEF3oAbKERsoR4Ky8aTvLgBF5totp5AuF8YN6vl.json",
        collectModule: {
          revertCollectModule: true
        },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      };
            
      const client = await this.$util.createClient()
      const token = JSON.parse(localStorage.getItem(this.$util.STORAGE_KEY))
      const response = await client.mutation(createPostTypedData, {request:createPostRequest}).toPromise()
      console.log(response.error.message,response.data)
      //const typedData = response.data.createPostTypedData.typedData
    },
  },
  components:{Newpost}
}
</script>
<style >
.nuxt-link-exact-active{
  font-weight: bold;
}
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #224F24; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin:0 auto;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.navbar{
  margin-bottom: 40px;
}
</style>