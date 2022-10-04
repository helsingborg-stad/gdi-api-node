import path from 'path'
import Koa from 'koa'
import { createApplication } from '../application'
import swaggerModule from '../modules/swagger'
import webFrameworkModule from '../modules/web-framework'
import { ApplicationContext, ApplicationModule } from '../application/types'

/** register a handler for (Koa captured) errors to prevenmt default console.error logging  */
const silentErrorsModule = (): ApplicationModule => ({ app }) => app.on('error', () => {})

/** create full baked application  configured for test */
const createTestApp = () => createApplication({
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