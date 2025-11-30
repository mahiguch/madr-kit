# Publishing madrkit to npm

このドキュメントでは、`madrkit` を npm レジストリにパブリッシュして、グローバルインストール可能にする手順を説明します。

## 前提条件

- Node.js 18+ と npm がインストール済み
- npm アカウント（[npmjs.com](https://www.npmjs.com) で作成可能）
- GitHub リポジトリ（オプション）

## パブリッシュ手順

### Step 1: npm アカウントにログイン

```bash
npm login
```

初回の場合は、アカウント作成ページがブラウザで開きます：

```bash
npm adduser
```

### Step 2: パッケージ名の確認

`package.json` で名前が重複していないか確認：

```bash
npm view madrkit
# エラーが出れば使用可能
```

**注意**: npm レジストリは世界中で共有されるため、ユニークな名前が必要です。
`@username/madrkit` のようにスコープを付ける方法もあります。

### Step 3: バージョン番号を更新

```bash
# package.json の version を更新
npm version patch   # 0.1.0 → 0.1.1
npm version minor   # 0.1.0 → 0.2.0
npm version major   # 0.1.0 → 1.0.0
```

### Step 4: ビルドを実行

```bash
npm run build
```

### Step 5: npm に発行

```bash
npm publish
```

発行成功時：
```
npm notice
npm notice 📦 madrkit@0.1.0
npm notice === Tarball Contents ===
...
npm notice published X files
```

### Step 6: 発行確認

```bash
npm view madrkit

# またはインストール確認
npm install -g madrkit
madrkit --version
```

## グローバルインストール確認

```bash
# グローバルにインストール
npm install -g madrkit

# インストール確認
which madrkit
madrkit --help

# 使用確認
mkdir test-project && cd test-project
madrkit
```

## 以降のアップデート手順

新バージョンをリリースする場合：

```bash
# 1. コード変更をコミット
git add .
git commit -m "feat: New feature description"

# 2. バージョンアップ
npm version minor

# 3. ビルド
npm run build

# 4. npm に発行
npm publish

# 5. GitHub に push（オプション）
git push origin main
git push origin --tags
```

## スコープ付きパッケージの発行

組織アカウントがある場合、スコープ付きで発行可能：

**package.json**:
```json
{
  "name": "@yourorg/madrkit",
  ...
}
```

発行時：
```bash
npm publish --access public
```

## トラブルシューティング

### 認証エラー
```bash
npm login
npm whoami  # ログイン確認
```

### パッケージ名が既に存在
```bash
# スコープを追加
"name": "@username/madrkit"

# または別の名前
"name": "madrkit-cli"
```

### 発行失敗
```bash
# .npmrc を確認
cat ~/.npmrc

# リセットする場合
npm logout
npm login
```

### グローバル PATH に madrkit が見つからない
```bash
# npm global directory を確認
npm config get prefix

# PATH に追加（例：~/.bashrc）
export PATH="$PATH:/usr/local/bin"
source ~/.bashrc

# または npm link で開発版をテスト
npm link
```

## npm レジストリの設定

デフォルト以外のレジストリを使用する場合：

```bash
# Verdaccio（プライベートレジストリ）など
npm config set registry https://your-registry.com/

# 元に戻す
npm config set registry https://registry.npmjs.org/
```

## CI/CD での自動発行

GitHub Actions で自動発行の例：

**.github/workflows/publish.yml**:
```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 参考リンク

- [npm Documentation](https://docs.npmjs.com/)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [npm Scoped Packages](https://docs.npmjs.com/cli/latest/using-npm/scope)
- [semver (Semantic Versioning)](https://semver.org/)

---

発行後、以下のコマンドで確認可能：

```bash
# npm レジストリで検索
npm search madrkit

# パッケージ詳細
npm view madrkit

# グローバルインストール
npm install -g madrkit

# 使用開始
madrkit --help
```
