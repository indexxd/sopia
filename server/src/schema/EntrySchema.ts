import mg from "mongoose"

export interface Entry {
	title: string
	content: string
}

const entrySchema = new mg.Schema({
	title: String,
	content: String,
})

export default entrySchema