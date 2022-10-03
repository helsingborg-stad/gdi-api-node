import { requireJwtUser } from '../../../modules/jwt-user'
import { ApplicationContext, ApplicationModule } from '../../../application/types'
import { makeGqlEndpoint } from '../../make-gql-endpoint'
import { makeGqlMiddleware } from '../../make-gql-middleware'
import { GraphQLModule } from '../../types'

const createTestGqlModule = (): GraphQLModule => ({
	schema: `
        type TestData {
            idFromToken: String,
        }
        type Query {
            testData: TestData
        }
        `,
	resolvers: {
		Query: {
			// https://www.graphql-tools.com/docs/resolvers
			testData: ({ ctx: { user } }) => {
				return {
					idFromToken: user.id,
				}
			},
		},
	},
})

const testGqlModule = (): ApplicationModule => ({ registerKoaApi }: ApplicationContext) => registerKoaApi({
	testGql: requireJwtUser(makeGqlMiddleware(makeGqlEndpoint(createTestGqlModule()))),
})

export default testGqlModule
