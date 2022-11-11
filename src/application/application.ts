import Debug from 'debug'
const debug = Debug('application')
import Koa from 'koa'
import Router from 'koa-router'
import OpenAPIBackend from 'openapi-backend'

import { Application, ApplicationContext, ApplicationModule, ApplicationRunHandler } from './types'
import { mapValues } from '../util'
import { apiValidationModule } from './api-validation-module'
import { apiNotFoundModule } from './api-not-found-module'

const TEST_PORT = 4444

interface CreateApplicationArgs {
	openApiDefinitionPath: string,
	validateResponse?: boolean
}

// simple memoization - at most one evaluation, evalauation as late as possible
const ensureOnce = <T>(fn: (() => Promise<T>)): (() => Promise<T>) => {
	let value: Promise<T> | null = null
	return async () => {
		if (!value) {
			value = fn()
		}
		return value
	}
}

/**
 * ### createWebApplication 
 * create web application by wrapping with reasonable defaults
 * -  Koa web application
 * - routing
 * - openapi
 * 	- with default request validation
 * - with optional response validation
 */
export function createApplication({ openApiDefinitionPath, validateResponse }: CreateApplicationArgs): Application {
	// create app
	const app = new Koa()
	// create API backend
	const api = new OpenAPIBackend({ definition: openApiDefinitionPath })
	// create routes
	const router = new Router()

	// register modules via .use(...)
	const modules: ApplicationModule[] = []

	// forward declation of this
	let application: Application = null as unknown as Application
	
	const getContext = (): ApplicationContext => ({
		app,
		router,
		api,
		application,
		registerKoaApi: handlers => api.register(mapValues(handlers, handler => (c, ctx, next) => {
			// we announce the api context to handlers
			ctx.apiContext = c
			// we copy params manually to be compatible with 
			// libraries such as https://github.com/koajs/router/blob/master/API.md#url-parameters
			// In short, openapi path parameters are parsed and made visible in koa context 
			ctx.params = c.request.params
			return handler(ctx, next)
		})),
	})

	const init = ensureOnce(async () => {
		// initialize all modules
		await modules.reduce((prev, m) => prev.then(() => m(getContext())), Promise.resolve())
		// finalize api
		await api.init()
		return app
		// wire all custom routes
			.use(router.routes())
			.use(router.allowedMethods())
		// wire in API endpoints
			.use((ctx, next) => api.handleRequest(ctx.request, ctx, next))					
	})

	const use = (module: ApplicationModule): Application => {
		// we store the module but defer initialization until last responsible moment
		// this intruduces additional complexity but allows for use of async modules while still
		// having a fluent api as in .use(...).use(...)
		modules.push(module)
		return application
	}
	
	const start = async (port) => {
		return (await init())
			.listen(port, () => debug(`Server listening to port ${port}`))
	}
	
	const run = async (handler: ApplicationRunHandler, port: number = TEST_PORT) => {
		const server = await start(port)
		try {
			await handler(server)
		} finally {
			await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve(null)))
		}
	}

	application = {
		getContext,
		use,
		start,
		run,
	}
	return application
		.use(apiValidationModule(validateResponse))
		.use(apiNotFoundModule())
} 