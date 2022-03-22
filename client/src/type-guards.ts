import { Entry, LocalEntry } from "./types/CustomTypes";

function isLocalEntry(entry: Entry | LocalEntry): entry is LocalEntry {
	return (entry as Entry).id === undefined
}

export { isLocalEntry }