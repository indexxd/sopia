function debounce(func: Function, timeout: number = 300): Function {
	let timer: any

	return (...args: any) => {
		clearTimeout(timer)

		timer = setTimeout(() => func.apply(this, args), timeout)
	}
}

export { debounce }