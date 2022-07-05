<template>
  <div class="modal-overlay">
    <div v-if="!uri" class="modals">
        <div class="close" @click="$emit('close-modal')">X </div>
        <h6>Upload image!</h6>
        <input type="file"  @change="onFileChange" accept="image/png, image/gif, image/jpeg" />
        <button v-if="!uri" @click="uploadFile">Post</button>
    </div>
    <div v-else>
        <div class="close" @click="$emit('close-modal')">X </div>
        <h6>Upload image!</h6>
        <input type="file"  @change="onFileChange" accept="image/png, image/gif, image/jpeg" />
        <button v-if="!uri" @click="uploadFile">Post</button>
    </div>
  </div>
</template>
<script>

import BigNumber from 'bignumber.js'

export default {
    props:['bundlr'],
    data() {
            return {
                image:null,
                uri:null,
                image:null,
                bundlrRef:this.bundlr
            }
    },
    methods:{


        onFileChange(e) {
            let dis=this
            const file = e.target.files[0]
            if (file) {
                const image = URL.createObjectURL(file)
                this.image=image
                let reader = new FileReader()
                reader.onload = function () {if (reader.result) dis.file=Buffer.from(reader.result)}
                reader.readAsArrayBuffer(file)
            }
        },
        async uploadFile() {    
            let tx = await this.bundlrRef.uploader.upload(this.file, [{ name: "Content-Type", value: "image/png" }])
            console.log('tx: ', tx)
            this.uri=`http://arweave.net/${tx.data.id}`


                 
        },
        parseInput (input) {
            const conv = new BigNumber(input).multipliedBy(this.bundlrRef.currencyConfig.base[1])
            if (conv.isLessThan(1)) {
                console.log('error: value too small')
            return
            } else {
                return conv
            }
        
        }
  }
}
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.modals {
  text-align: center;
  background-color: white;
  height: 500px;
  width: 500px;
  margin: 10%;
  padding: 20px;
  border-radius: 20px;
}
.close {
margin:0px;
  cursor: pointer;
}

.check {
  width: 150px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 20px 0;
}

p {
  font-size: 16px;
  margin: 20px 0;
}

button {
  width: 150px;
  height: 40px;
  font-size: 14px;
  border-radius: 16px;
  margin-top: 50px;
}
</style>