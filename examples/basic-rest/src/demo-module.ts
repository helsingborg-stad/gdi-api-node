import { ApplicationModule, ApplicationContext } from "gdi-api-node/types";

export const demoModule = (): ApplicationModule => {

	const helloWorld = async ctx => {
		ctx.body = {hello: "world"}
	}

	return ({registerKoaApi}: ApplicationContext) => registerKoaApi({
		helloWorld,
	})
}