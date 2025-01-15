import {app} from "./index"

const port = process.env.PORT

app.listen(port, () => console.log(`Running at port ${port}`))