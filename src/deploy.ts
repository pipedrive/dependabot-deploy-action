import { GitHub } from "@actions/github";
import { Context } from "@actions/github/lib/context";
import { isSuccessStatusCode } from "./utils";

const LABEL_NAME = 'ready-for-deploy';

export const deploy = async (pullRequestNumber: number, context: Context, client: GitHub): Promise<void> => {
    console.log('Adding deploy label')

    const addLabelResult = await client.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequestNumber,
      labels: [LABEL_NAME],
    })
  
    if (!isSuccessStatusCode(addLabelResult.status)) {
      throw new Error(`Label could not be added. ${JSON.stringify(addLabelResult)}`)
    }
  
    console.log('Label for deploy added');
  }