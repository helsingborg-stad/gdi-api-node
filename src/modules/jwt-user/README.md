# JWT-User module

Updates __ctx.user__ with payload extracted from JWT bearer token, if present in request header

## Usage:

```ts
import { createApplication } from 'gdi-api-node'
import jwtUserModule from 'gdi-api-node/modules/jwt-user'
import { createAuthorizationServiceFromEnv } from 'gdi-api-node/services/authorization-service'

createApplication({
		openApiDefinitionPath: 'openapi.yml',
		validateResponse,
	})
	.use(jwtUserModule(createAuthorizationServiceFromEnv()))
```