import { createApplication } from 'gdi-api-node'
import healthCheckModule from 'gdi-api-node/modules/healthcheck'
import swaggerModule from 'gdi-api-node/modules/swagger'
import webFrameworkModule from 'gdi-api-node/modules/web-framework'
import { Application } from 'gdi-api-node/types'
import { demoModule } from './demo-module'

export const createDemoApp = ({ validateResponse }: {validateResponse?: boolean}): Application =>
	createApplication({
		openApiDefinitionPath: './src/openapi.yml',
		validateResponse,
	})
		.use(webFrameworkModule())
		.use(swaggerModule())
		.use(healthCheckModule())
		.use(demoModule())
