import mongoose from "mongoose"
import entrySchema, { Entry } from "../schema/EntrySchema"

const Entry = mongoose.model<Entry>("Entry", entrySchema)

const model = {
	getAll() {
		return Entry.find({})
	},
	save(entry: EntryRequest) {
		return Entry.create({ ...entry, content: JSON.stringify(entry.content) })
	},
	update(entry: EntryRequest) {
		return Entry.findByIdAndUpdate(entry.id, { ...entry, content: JSON.stringify(entry.content) })
	}
}

export { Entry }
export default model