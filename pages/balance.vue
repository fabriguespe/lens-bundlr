<template>
  <div class="container text-center">
    <MyNav/>
    <div>
      <h4 style="margin-top:20px;text-aling:center">Your balance</h4>
      <h3>{{balance}}</h3>
      <div>
          <input  v-model="amount" />
          <button @click="fundWallet">Fund Wallet</button>
      </div>
    </div>
  </div>
</template>


<script>

import BigNumber from 'bignumber.js'
import { utils } from 'ethers'
import MyNav from '@/components/Nav'

export default {
  data() {
        return {
          amount:0,
          bundlrRef:this.$store.state.bundlrRef,
          balance:0
        }
  },
  async mounted(){
  
    if(this.bundlrRef)this.fetchBalance()
  },
  methods:{

    async fetchBalance() {
      const bal = await this.bundlrRef.current.getLoadedBalance()
      console.log('bal: ', utils.formatEther(bal.toString()))
      this.balance=utils.formatEther(bal.toString())
    },
    parseInput (input) {
      const conv = new BigNumber(input).multipliedBy(this.bundlrRef.currencyConfig.base[1])
      if (conv.isLessThan(1)) {
        console.log('error: value too small')
        return
      } else {
        return conv
      }
    },
    async  fundWallet() {
      try{

        if (!this.amount) return
        let response = await this.bundlrRef.fund(this.parseInput(this.amount))
        console.log('Wallet funded: ', response)
        fetchBalance()
      }catch(e){
        console.log(e)
      }
    },

  },
  components:{
    MyNav
  }
}
</script>