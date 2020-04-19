import { GitHub } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { isSuccessStatusCode } from './utils';

export const addReview = async (
  pullRequestNumber: number,
  context: Context,
  client: GitHub,
): Promise<void> => {
  console.log('Creating review');

  const createReviewResult = await client.pulls.createReview({
    event: 'APPROVE',
    pull_number: pullRequestNumber,
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  if (!isSuccessStatusCode(createReviewResult.status)) {
    throw new Error(`Review could not be created. ${JSON.stringify(createReviewResult)}`);
  }

  console.log('Review created');
};
