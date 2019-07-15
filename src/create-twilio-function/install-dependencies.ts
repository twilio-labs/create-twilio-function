import { projectInstall } from 'pkg-install';

export async function installDependencies(targetDirectory) {
  const options = { cwd: targetDirectory };
  const { stdout } = await projectInstall(options);
  return stdout;
}
