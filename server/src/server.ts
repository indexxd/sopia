import express from 'express'
import mongoose from "mongoose"
import model from './model/EntryModel'
import cors from "cors"
import mapper from './utils/mapper'

const app = express()

app.use(express.json())
app.use(cors())

const port = 3001

const host = process.env.DB_HOST || "mongodb://localhost:27017/app"

mongoose.connect(host)

app.get("/", async (req, res) => {
	const entries = await model.getAll()

	res.send(entries.map(a => mapper.map(a)))
})

app.post("/", async (req, res) => {
	const body = req.body

	const entry = await model.save(body)

	res.send(mapper.map(entry))
})


app.put("/", async (req, res) => {
	const body = req.body

	await model.update(body)

	res.send("putted")
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))