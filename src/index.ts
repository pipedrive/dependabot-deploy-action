import * as core from '@actions/core';
import { GitHub, context } from '@actions/github';
import { WebhookPayloadStatus } from '@octokit/webhooks';
import moment from 'moment-timezone';
import { VersionType, InputParams, DeployDependencies } from './types';
import { getVersionTypeChangeFromTitle } from './utils/getVersionTypeChangeFromTitle';
import { isInProdDependencies, isInAnyDependencies } from './utils/packageJson';
import { deploy } from './deploy';
import { isSuccessStatusCode } from './utils';
import { addReview } from './review';
import { isWorkingHour } from './utils/isWorkingHour';
import { getPackageNameFromTitle } from './utils/getPackageNameFromTitle';

const DEPLOY_DEPENDENCIES = ['dev', 'all'];
const VERSION_TYPES = ['PATCH', 'MINOR', 'MAJOR'];
const DEPENDABOT_BRANCH_PREFIX = 'dependabot-npm_and_yarn-';
const EXPECTED_CONCLUSION = 'success';
const EXPECTED_CONTEXT = 'continuous-integration/codeship';
const DEPENDABOT_LABEL = 'dependencies';

const getInputParams = (): InputParams => {
  const deployDependencies = core.getInput('deployDependencies') as DeployDependencies;
  const gitHubToken = core.getInput('gitHubToken');
  const deployOnlyInWorkingHours = Boolean(core.getInput('deployOnlyInWorkingHours'));
  const timezone = core.getInput('timezone');
  const maxDeployVersion = core.getInput('maxDeployVersion').toUpperCase() as VersionType;

  const isValidTimezone = moment.tz.zone(timezone);
  if (!isValidTimezone) {
    throw new Error(
      `Unexpected input ${timezone} for timezone. Please check https://momentjs.com/timezone/ for list of valid timezones`,
    );
  }

  if (!VERSION_TYPES.includes(maxDeployVersion)) {
    throw new Error(`Unexpected input for maxDeployVersion ${maxDeployVersion}`);
  }

  if (!DEPLOY_DEPENDENCIES.includes(deployDependencies)) {
    throw new Error(`Unexpected input for deployDependencies ${deployDependencies}`);
  }

  return {
    deployDependencies,
    gitHubToken,
    maxDeployVersion,
    deployOnlyInWorkingHours,
    timezone,
  };
};

const shouldDeployBranch = (branchName: string): boolean =>
  branchName.startsWith(DEPENDABOT_BRANCH_PREFIX);

const shouldDeployLabel = (labels: string[]): boolean => labels.includes(DEPENDABOT_LABEL);

const shouldDeployVersion = (
  versionChangeType: VersionType,
  maxDeployVersion: VersionType,
): boolean => {
  const versionIndex = VERSION_TYPES.indexOf(versionChangeType);
  const maxVersionIndex = VERSION_TYPES.indexOf(maxDeployVersion);

  return versionIndex <= maxVersionIndex;
};

const isAllowedToDeployNow = (deployOnlyInWorkingHours: boolean, timezone: string) => {
  if (!deployOnlyInWorkingHours) {
    return true;
  }

  const now = moment.tz(timezone);

  return isWorkingHour(now);
};

const run = async (payload: WebhookPayloadStatus): Promise<void> => {
  const input = getInputParams();
  const client = new GitHub(input.gitHubToken);

  if (payload.context !== EXPECTED_CONTEXT) {
    console.log('Context is not codeship, skipping');
    return;
  }

  const isSuccess = payload.state === EXPECTED_CONCLUSION;
  if (!isSuccess) {
    console.log('Status is not success, skipping');
    return;
  }

  const branch = payload.branches.find((e) => shouldDeployBranch(e.name));
  if (!branch) {
    console.log('Branch for dependabot not found, skipping');
    return;
  }

  const pullRequests = await client.pulls.list({
    direction: 'desc',
    sort: 'updated',
    state: 'open',
    repo: context.repo.repo,
    owner: context.repo.owner,
  });

  if (!isSuccessStatusCode(pullRequests.status)) {
    throw new Error('PRs could not be listed');
  }

  const pullRequest = pullRequests.data.find((e) => e.head.sha === branch.commit.sha);

  if (!pullRequest) {
    throw new Error('No PR returned');
  }

  console.log(`Found PR ${pullRequest.number} for deploy`);

  const versionChangeType = getVersionTypeChangeFromTitle(pullRequest.title);

  if (!shouldDeployVersion(versionChangeType, input.maxDeployVersion)) {
    console.log(
      `Skipping deploy for version type ${versionChangeType}. Running with maxDeployVersion ${input.maxDeployVersion}`,
    );
    return;
  }

  const labels = pullRequest.labels.map((e) => e.name);
  if (!shouldDeployLabel(labels)) {
    console.log(`Skipping deploy. PRs with Labels "${labels}" should not be deployed`);
    return;
  }

  const packageName = getPackageNameFromTitle(pullRequest.title);

  if (input.deployDependencies === 'dev' && isInProdDependencies(packageName)) {
    console.log(`Skipping deploy. Package ${packageName} found in prod dependencies`);
    return;
  }

  if (!isInAnyDependencies(packageName)) {
    console.log(`Skipping deploy. Package ${packageName} not found in any dependencies`);
    return;
  }

  await addReview(pullRequest.number, context, client);

  if (isAllowedToDeployNow(input.deployOnlyInWorkingHours, input.timezone)) {
    await deploy(pullRequest.number, context, client);
  } else {
    console.log('Skipping deploy outside of working hours');
  }
};

try {
  if (context.eventName === 'status') {
    run(context.payload as WebhookPayloadStatus);
  } else {
    console.log(`Not running for event ${context.eventName} and action ${context.action}`);
  }
} catch (error) {
  core.setFailed(error.message);
}
