# トラブルシューティングガイド

## コンパイルエラー

### `tstore` instruction エラー

**エラーメッセージ**:
```
The "tstore" instruction is only available for Cancun-compatible VMs (you are currently compiling for "paris").
   --> @openzeppelin/contracts/utils/TransientSlot.sol:180:13:
```

**発生条件**:
- Account Abstraction (ERC-4337) 関連のコントラクトを使用時
- OpenZeppelinの新しい機能（TransientSlot等）を使用時

**原因**:
- OpenZeppelinの `TransientSlot.sol` が Cancun アップグレードで導入された `TSTORE`/`TLOAD` オペコードを使用
- Hardhatのデフォルト設定では古い "paris" EVMバージョンを使用

**解決方法**:
`hardhat.config.ts` で EVMバージョンを `cancun` に設定:

```typescript
const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: {
      evmVersion: 'cancun',  // 追加
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
```

**背景知識**:
- **Cancun**: 2024年3月にEthereumメインネットで実装されたアップグレード
- **EIP-1153**: 一時的ストレージオペコード (`TSTORE`/`TLOAD`) を導入
- **従来のOpenZeppelinコントラクト** (ERC20、ERC721等) では不要
- **Account Abstraction関連** では必須

**参考リンク**:
- [EIP-1153: Transient storage opcodes](https://eips.ethereum.org/EIPS/eip-1153)
- [Ethereum Cancun Upgrade](https://ethereum.org/en/roadmap/dencun/)

## コントラクトサイズ警告

**警告メッセージ**:
```
Contract code size is 28994 bytes and exceeds 24576 bytes (a limit introduced in Spurious Dragon).
This contract may not be deployable on Mainnet.
```

**発生条件**:
- EntryPoint コントラクトなどの大きなコントラクトをコンパイル時

**解決方法**:
1. **オプティマイザーの有効化** (推奨):
   ```typescript
   optimizer: {
     enabled: true,
     runs: 200,  // 低めの値でサイズを削減
   }
   ```

2. **ライブラリの使用**: 共通機能をライブラリとして分離

3. **開発・テスト環境では通常問題なし**

## Transient Storage 警告

**警告メッセージ**:
```
Warning: Transient storage as defined by EIP-1153 can break the composability of smart contracts
```

**対処法**:
- 通常は OpenZeppelin が適切に処理するため、無視して問題なし
- 独自でtransient storageを使用する場合は、コール終了時にクリアすることを確認

---

*最終更新: 2025年7月9日*
