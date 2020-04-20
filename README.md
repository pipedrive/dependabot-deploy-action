# Dependabot Deploy GitHub action

A GitHub Action which allows to deploy Pipedrive services. Automatically approves Dependabot PRs and adds 'ready-for-deploy' label.

## Usage

Create an yml file into `.github/workflows/<WORKFLOW_NAME>.yml` and merge into into your default branch (usually master).

```yml
on: [status]

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Dependabot auto deploy dependencies
    steps:
      - name: Deploy
        uses: pipedrive/dependabot-deploy-action@master
        with:
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

#### gitHubToken (required)

GitHub token for current action.

#### maxDeployVersion

The maximum difference in version which should be auto-deployed. Allowed values `PATCH`, `MINOR`, `MAJOR`. Defaults to `MINOR`.

#### deployOnlyInWorkingHours

If true then deploy will be skipped if the PR is created outside of working hours". Default `true`

#### timezone

Timezone defined https://momentjs.com/timezone/ used to verify if the current time is within the working hours. Default Europe/Prague

#### deployDevDependencies (TODO: So far not working)

Sets if dev dependencies will be deployed automatically. Defaults to `true`.

#### deployDependencies (TODO: So far not working)

Sets if production dependencies will be deployed automatically. Defaults to `false`.

### Development

To install all dependencies run:

```sh
npm install
```

The package is built into single `dist/index.js` file which is part of the repository. It needs to be created manually before the commit by running:

```sh
# Run all tests and creates the build
npm run publish
```
