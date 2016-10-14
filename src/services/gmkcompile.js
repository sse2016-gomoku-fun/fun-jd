import { argv } from 'yargs';
import format from 'string-format';
import path from 'path';
import fsp from 'fs-promise';
import { exec } from 'child-process-promise';
import api from 'libs/api';
import compile from 'libs/compile';

export default async (mq, logger) => {

  if (argv.role !== 'compile') {
    return;
  }

  async function handleCompileTask(task) {
    const submission = await api.getAndMarkTaskSubmission(task);
    if (submission === null) {
      return;
    }
    const workingDirectory = path.resolve(format(DI.config.compile.workingDirectory, task));
    const source = format(DI.config.compile.source, task);
    const target = format(DI.config.compile.target, task);
    await fsp.writeFile(path.join(workingDirectory, source), submission.code);
  }

  const subscription = await mq.subscribe('compile');
  subscription.on('message', async (task, content, ackOrNack) => {
    logger.info('Received compile task: %j', task);
    try {
      handleCompileTask(task);
    } catch (e) {
      logger.error(e);
    }
    // ack the task anyway
    ackOrNack();
  });

  logger.info('Accepting compiler tasks...');

};
