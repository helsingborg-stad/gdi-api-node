import { koaSwagger } from 'koa2-swagger-ui'
import { ApplicationModule, ApplicationContext } from '../../application/types'

/**
 * Module that exposes __/swagger__ and __/swagger.json__ with contents derived from current openapi specification
 */
export const swaggerModule = (): ApplicationModule => ({ app, router, api }: ApplicationContext) => {
	app.use(koaSwagger({
		routePrefix: '/swagger',
		swaggerOptions: {
			url: '/swagger.json',
		},
	}))

	router
		.get('/swagger.json', ctx => {
			ctx.body = api.document
		})
		.get('/', ctx => ctx.redirect('/swagger'))
}
