import { makeSchema } from "nexus";
import { join } from 'path';

import * as types from './graphql';

export const schema = makeSchema({
    types,
    outputs: {
        schema: join(process.cwd(), 'schema.graphql'), //This is the GraphQL Schema Definition Language (SDL) for defining the structure of your API

        typegen: join(process.cwd(), 'nexus-typegen.ts'),  //contain TypeScript type definitions for all types in your GraphQL schema. These generated types will help ensure typesafety in your application code and keep your GraphQL schema definition in sync with your schema implementation
    },
    contextType: {
        module: join(process.cwd(), './src/context.ts'),
        export: 'Context',
    }
})