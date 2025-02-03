 import { LRUCache } from 'lru-cache'

 // in future distributed cache can be added
 //no ttl as only this server is running
const cache = new LRUCache<string, any>({
    maxSize: 200 * 1024 * 1024, // 200MB limit
    sizeCalculation:(value,key)=>{
      console.log("Size of Object",Buffer.byteLength(JSON.stringify(value),'utf-8'))
        return Buffer.byteLength(JSON.stringify(value),'utf-8')
      },
  });


  export function getCachedObject(key:string){
    return cache.get(key)
  }

  export function addObjectInCache(key:string,value:any){
    return cache.set(key,value)
  }

  export function updateObjectinCache(key:string,value:any){
    return cache.set(key,value)
  }

  export function deleteObjectInCache(key:any){
    return cache.delete(key)
  }



