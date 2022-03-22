import { URLSearchParams } from "url"

export enum Endpoint {
	Entry = "/"
}

const http = {
	url: "http://localhost:3001",
	async post<T>(endpoint: Endpoint, data: any): Promise<T> {
		const res: Response = await fetch(this.url + endpoint, {
			method: "post",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json"
			}
		})

		return await res.json()
	},
	async put(endpoint: Endpoint, data: any) {
		const res: Response = await fetch(this.url + endpoint, {
			method: "put",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json"
			}
		})

		return await res.json()
	},
	async get<T>(endpoint: Endpoint, args?: URLSearchParams): Promise<T> {
		const url = this.url + endpoint + (args?.toString() || "")

		const res = await fetch(url, {
			method: "get",
		})

		return await res.json()
	}
}

export default http