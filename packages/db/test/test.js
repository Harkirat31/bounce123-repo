const c = new Date().toUTCString()

const nd = new Date(c)

console.log(nd.toLocaleString())
console.log(nd.toUTCString())
