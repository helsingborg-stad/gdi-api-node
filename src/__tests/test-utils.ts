import * as path from 'path'
import * as Koa from 'koa'
import { createApplication } from '../application'
import { swaggerModule } from '../modules/swagger'
import { webFrameworkModule } from '../modules/web-framework'
import { Application, ApplicationContext, ApplicationModule } from '../application/types'

const noop = () => (void 0)

/** register a handler for (Koa captured) errors to prevenmt default console.error logging  */
const silentErrorsModule = (): ApplicationModule => ({ app }) => app.on('error', noop)

/** create full baked application  configured for test */
const createTestApp = (): Application => createApplication({
	openApiDefinitionPath: path.join(__dirname, './test-app.openapi.yml'),
	validateResponse: true,
})
	.use(silentErrorsModule())
	.use(webFrameworkModule())
	.use(swaggerModule())

/** Shorthand module for registering API operations in application */
const registerTestApi = (handlers: Record<string, Koa.Middleware>): ApplicationModule => ({ registerKoaApi }: ApplicationContext) => registerKoaApi(handlers)

export {
	createTestApp,
	registerTestApi,
}