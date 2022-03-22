import { isLocalEntry } from "../type-guards"
import { Entry, LocalEntry, NO_ID } from "../types/CustomTypes"
import http, { Endpoint } from "./http"

const entryService = {
	async saveEntry(entry: Entry | LocalEntry): Promise<Entry> {
		if (isLocalEntry(entry)) {
			return await http.post(Endpoint.Entry, entry)
		}

		return await http.put(Endpoint.Entry, entry)
	},
	async fetchEntries(): Promise<Entry[]> {
		return await http.get<Entry[]>(Endpoint.Entry)
	}
}

export default entryService