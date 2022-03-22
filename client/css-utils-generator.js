const directionalProperties = {
	m: "margin",
	p: "padding",
}

const directions = {
	l: "left",
	r: "right",
	t: "top",
	b: "bottom",
}

const values = [
	2, 3, 4, 5, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50
]

for (let i in directionalProperties) {
	const prop = directionalProperties[i]

	for (const y in values) {
		const value = values[y]

		const css = `.${i}-${value} {
	${prop}: ${value}px;
}`

		console.log(css)
		
		for (let x in directions) {
			const dir = directions[x]

			const css = `.${i}${x}-${value} {
	${prop}-${dir}: ${value}px;
}`

			console.log(css)
		}
	}
}