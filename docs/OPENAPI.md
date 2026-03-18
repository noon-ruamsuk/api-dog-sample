# OpenAPI Specification Generation

This project includes automated OpenAPI specification generation using GitHub Actions and a local script.

## Local Generation

To generate the OpenAPI specification locally:

```bash
npm run generate-openapi
```

This will:
1. Use tsx to run the TypeScript script at `scripts/generate-openapi.ts`
2. Extract all OpenAPI routes from the Hono application
3. Generate an `openapi.json` file in the project root
4. Output the number of generated endpoints

## GitHub Actions

The GitHub Action at `.github/workflows/generate-openapi.yml` automatically:

- Triggers on pushes to main branch, pull requests, or manual workflow dispatch
- Sets up Node.js environment
- Installs dependencies
- Generates the OpenAPI specification
- Uploads the spec as a GitHub artifact
- Commits the generated spec back to the repository (main branch only)
- Optionally deploys to GitHub Pages

## Generated Specification

The generated OpenAPI spec includes:
- **Info**: API title, version, and description
- **Servers**: Production and development server URLs
- **Paths**: All API endpoints with request/response schemas
- **Components**: Reusable schemas and parameters

## Viewing the API Documentation

When running the application locally:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit the Swagger UI at `http://localhost:4005/swagger`

3. Access the raw OpenAPI spec at `http://localhost:4005/doc`

## Workflow Features

- **Automatic Updates**: Spec is regenerated on every code change
- **Artifact Storage**: Generated specs are stored as GitHub artifacts
- **Version Control**: Specs are committed to the repository for version tracking
- **Multi-Environment**: Supports both development and production server configurations

## Customization

To modify the OpenAPI generation:

1. Edit `scripts/generate-openapi.ts` to change spec configuration
2. Update `.github/workflows/generate-openapi.yml` to modify workflow behavior
3. Adjust server URLs and metadata in the generation script

## Dependencies

- `@hono/zod-openapi`: OpenAPI integration for Hono
- `tsx`: TypeScript execution runtime
- `zod`: Schema validation used for OpenAPI definitions
