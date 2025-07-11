import { ethers } from 'hardhat';

async function main() {
  // EntryPointコントラクトを新しくデプロイ
  const EntryPoint = await ethers.getContractFactory('EntryPoint');
  const entryPoint = await EntryPoint.deploy();
  await entryPoint.waitForDeployment();

  const entryPointAddress = await entryPoint.getAddress();
  console.log('EntryPoint deployed to:', entryPointAddress);

  // AccountFactoryをデプロイ
  const AccountFactory = await ethers.getContractFactory('AccountFactory');
  const accountFactory = await AccountFactory.deploy();
  await accountFactory.waitForDeployment();

  const factoryAddress = await accountFactory.getAddress();
  console.log('AccountFactory deployed to:', factoryAddress);

  const [signer0] = await ethers.getSigners();
  const addrress0 = await signer0.getAddress();

  // 動的にアドレスを計算
  const sender = await ethers.getCreateAddress({
    from: factoryAddress,
    nonce: 1,
  });

  const initCode =
    factoryAddress +
    accountFactory.interface
      .encodeFunctionData('createAccount', [addrress0])
      .slice(2);

  // AAのアカウントに資金を事前に送信
  await entryPoint.depositTo(sender, { value: ethers.parseEther('100') });

  const Account = await ethers.getContractFactory('Account');

  // PackedUserOperationStructに合わせて修正
  const userOp = {
    sender,
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData('execute'),
    // accountGasLimits: verificationGasLimit (32 bytes) + callGasLimit (32 bytes) をパック
    accountGasLimits: ethers.solidityPacked(
      ['uint128', 'uint128'],
      [200_000, 200_000] // [verificationGasLimit, callGasLimit]
    ),
    preVerificationGas: 50_000n, // BigIntに変更
    // gasFees: maxPriorityFeePerGas (32 bytes) + maxFeePerGas (32 bytes) をパック
    gasFees: ethers.solidityPacked(
      ['uint128', 'uint128'],
      [ethers.parseUnits('5', 'gwei'), ethers.parseUnits('10', 'gwei')] // [maxPriorityFeePerGas, maxFeePerGas]
    ),
    paymasterAndData: '0x',
    signature: '0x',
  };

  // UserOperationをEntryPointに送信
  const tx = await entryPoint.handleOps([userOp], addrress0);
  const receipt = await tx.wait();
  console.log('Transaction hash:', tx.hash);
  console.log('Transaction receipt:', receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
