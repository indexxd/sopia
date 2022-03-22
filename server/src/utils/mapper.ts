import { Document } from "mongoose"
import { Entry } from "../schema/EntrySchema"

const mapper = {
	map(entry: Document<any, any, Entry> & Entry) {
		return {
			id: entry.id,
			title: entry.title,
			content: JSON.parse(entry.content),
		}
	}
}

export default mapper