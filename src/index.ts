
import express, { Request, Response } from "express";
import { z } from "zod";
import { client } from "./db";

export const app = express();

app.use(express.json());

const sumInput = z.object({
    a: z.number(),
    b: z.number()
})

app.post("/sum", async (req: Request, res: Response) => {
    const parsedResponse = sumInput.safeParse(req.body)

    if (!parsedResponse.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const answer = await client.output.create({

        data: {
            a: parsedResponse.data.a,
            b: parsedResponse.data.b,
            Req: parsedResponse.data.a + parsedResponse.data.b

        },
        select: {
            Req: true,
        }
    })

    res.json({
        answer
    })
});

app.get("/sum", (req: Request, res: Response) => {
    const parsedResponse = sumInput.safeParse({
        a: Number(req.headers["a"]),
        b: Number(req.headers["b"])
    })

    if (!parsedResponse.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const answer = parsedResponse.data.a + parsedResponse.data.b;

    res.json({
        answer
    })
});