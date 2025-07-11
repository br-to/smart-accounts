// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const EpModule = buildModule('Ep', (m) => {
  const ep = m.contract('EntryPoint');

  return { ep };
});

export default EpModule;
