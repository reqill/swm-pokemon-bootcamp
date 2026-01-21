import { CodegenConfig } from "@graphql-codegen/cli";
import { POKE_API_GRAPHQL_URL } from "./apollo";

const config: CodegenConfig = {
  schema: POKE_API_GRAPHQL_URL,
  documents: "graphql/queries/**/*.ts",
  generates: {
    "graphql/types/": {
      preset: "client",
      plugins: [],
      config: {
        avoidOptionals: true,
      },
      presetConfig: {
        gqlTagName: "gql",
      },
    },
    "graphql/schema.graphql": {
      plugins: ["schema-ast"],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
