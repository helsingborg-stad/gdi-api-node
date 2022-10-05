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
		type SyncAsyncPromise {
			syncId: String,
			asyncId: String,
			promiseId: String,
			asyncPromiseId: String
		}
        type Query {
            testData: TestData,
			combinationsOfSynAsyncPromise: SyncAsyncPromise
        }
        `,
	// https://www.graphql-tools.com/docs/resolvers
	resolvers: {
		SyncAsyncPromise: {
			syncId: ({ ctx: { user: { id } } }) => {
				return id
			},
			asyncId: async ({ ctx: { user: { id } } }) => id,
			promiseId: ({ ctx: { user: { id } } }) => Promise.resolve(id),
			asyncPromiseId: async ({ ctx: { user: { id } } }) => Promise.resolve(id),
		},
		Query: {
			testData: ({ ctx: { user: { id } } }) => ({
				idFromToken: id,
			}),
			combinationsOfSynAsyncPromise: () => {
				return ({ dummy_object: true })
			},
		},
	},
})

const testGqlModule = (): ApplicationModule => ({ registerKoaApi }: ApplicationContext) => registerKoaApi({
	testGql: requireJwtUser(makeGqlMiddleware(makeGqlEndpoint(createTestGqlModule()))),
})

export default testGqlModule
