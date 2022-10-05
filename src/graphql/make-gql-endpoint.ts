import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphql } from 'graphql'
import { mapValues } from '../util'
import { GraphQLEndpoint, GraphQLEndpointArgs, GraphQLModule } from './types'

/** create endpoint function that given parameters resolves against a GraphQL module  */
export function makeGqlEndpoint<TContext = any, TModel = any>({ schema, resolvers }: GraphQLModule<TContext, TModel>): GraphQLEndpoint<TContext, TModel> {
	const es = makeExecutableSchema({
		typeDefs:schema,
		// wrap resolver going from indexed arguments to parameter object
		resolvers: mapValues(
			resolvers,
			entity => mapValues(entity, field => async (source, args, ctx, info) => field({ source, ctx, args, info }))),
	})

	return ({ context, model, query, variables }: GraphQLEndpointArgs<TContext, TModel>) => graphql({
		schema: es,
		source: query,
		rootValue: model,
		contextValue: context,
		variableValues: variables,
	})
}
