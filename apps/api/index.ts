import expres from "express"

const app = expres()

const port =3000

app.use(expres.json())

app.listen(port,()=>console.log(`Running at port ${port}`))