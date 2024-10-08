// import { createTestOrder, createTestOrder2, getFuturePathDates } from "db";
// import express, { Request, Response, NextFunction } from "express"

// const router = express.Router();

// router.get("/test", async (req: Request, res: Response) => {
//     try {
//         let value = await getFuturePathDates("7yPWUGula8TfVctK9cyUnKsuq1l2",new Date())
//         return res.json({
//             msg: "Success"
//         });
//     }
//     catch {
//         return res.json({
//             msg: "Failed"
//         })
//     }
// })


// router.get("/test2", async (req: Request, res: Response) => {
//     try {
//         await createTestOrder2()
//         return res.json({
//             msg: "Success"
//         });
//     }
//     catch {
//         return res.json({
//             msg: "Failed"
//         })
//     }
// })

// export default router