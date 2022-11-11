import Koa from 'koa'
import { Context } from 'openapi-backend'
import { ApplicationContext } from './types'
import Debug from 'debug'
const debug = Debug('application')

const performResponseValidation = (c: Context, ctx: Koa.Context) => {
	/**
	 * Perform response validation
	 * 
	 * Typically, this is done in tests only
	 * 
	 * To make life simpler, we only validate 2xx results
	 * Also, header validation is probably not needed
	 */
	const { status } = ctx
	if (!((status >= 200) && (status < 300))) {
		return
	}
	// https://github.com/anttiviljami/openapi-backend#response-validation
	([
		c.api.validateResponse(ctx.body, c.operation),
		/*
		c.api.validateResponseHeaders(ctx.headers, c.operation, {
			statusCode: ctx.status,
			setMatchType: SetMatchType.Superset,
		}),
		*/
	])
		.map(({ errors }) => errors)
		.filter(errors => errors && errors.length)
		.map(errors => {
			debug({
				body: ctx.body,
				operation: c.operation,
				errors,
			})
			ctx.throw(502)
		})
}

export const apiValidationModule = (validateResponse: boolean) => ({ api }: ApplicationContext): void => api
	.register({
		validationFail: (c, ctx) => {
			ctx.body = { errors: c.validation.errors }
			ctx.status = 400
		},
		postResponseHandler: async (c, ctx) => {
			// turn off all caching of all API responses
			ctx.set('Cache-Control', 'no-store')
			return validateResponse && performResponseValidation(c, ctx)
		},
	})