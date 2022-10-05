/** given an object, return a new object with same property names but with mapped values */
export const mapValues = <T, S>(obj: Record<string, T>, valueFn: ((v: T, k: string) => S)): Record<string, S> => Object
	.entries(obj)
	.reduce((agg, [ k, v ]) => ({
		...agg,
		[k]: valueFn(v, k),
	}), {} as Record<string, S>)
