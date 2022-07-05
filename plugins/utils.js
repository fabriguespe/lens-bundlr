import Vue from 'vue'
import { createClient } from 'urql'
import { refresh } from '@/plugins/api'

export const APIURL = "https://api.lens.dev"
export const STORAGE_KEY = "LH_STORAGE_KEY"
export const basicClient = new createClient({
  url: APIURL
})


export default ({ app,store,route }, inject) => {
    inject('util',{
        parseJwt (token) {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
        
          return JSON.parse(jsonPayload);
        },
        gclient(){ 
          return basicClient
        },
        async refreshAuthToken() {
          const token = JSON.parse(localStorage.getItem(STORAGE_KEY))
          if (!token) return
          try {
            const authData = await basicClient.mutation(refresh, {refreshToken: token.refreshToken}).toPromise()

            if (!authData.data) return

            const { accessToken, refreshToken } = authData.data.refresh
            const exp = this.parseJwt(refreshToken).exp

            localStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken, refreshToken, exp }))

            return {
              accessToken
            }
          } catch (err) {
            console.log('error:', err)
          }
        },
        async createClient() {
          const storageData = JSON.parse(localStorage.getItem(STORAGE_KEY))
          if (storageData) {
            try {
              const { accessToken } = await this.refreshAuthToken()
              console.log(accessToken)
              const urqlClient = new createUrqlClient({
                url: APIURL,
                fetchOptions: {
                  headers: {
                    'x-access-token': `Bearer ${accessToken}`
                  },
                },
              })
              return urqlClient
            } catch (err) {
              return basicClient
            }
          } else {
            return basicClient
          }
      },
    })
}