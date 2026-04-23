---
marp: true
theme: jupiter
# paginate: true
style: @import url('https://unpkg.com/tailwindcss@^2/dist/utilities.min.css');
backgroundImage: url(./assets/bg.png)
footer: '© Jupiter × SuzuPay  |  Clawathon Tokyo Edition'
---

<!-- _class: lead -->

# ビルダーのための<br/>Jupiter ワークショップ

<div class="text-xl">

**Agent Skillsで爆速開発**

</div>

---

<!-- header: Opening -->

### 自己紹介

<div class="grid grid-cols-2 gap-x-14 gap-y-6 items-center w-full max-w-full mx-auto mt-8 mb-4 px-6 box-border">

<div class="flex justify-center items-center min-w-0 pr-2">

<img src="assets/profile-picture.png" alt="asuma" class="block w-64 h-64 max-w-full flex-shrink-0 object-cover rounded-full border-0 shadow-none outline-none" />

</div>

<div class="min-w-0 pl-4 pr-2 text-left text-2xl leading-relaxed tracking-tight">

- Name: **asuma**
- Role: **Co-Founder / CTO [@DaikoAI](https://daiko.ai)**
- Links:
  - [posaune0423.com](https://posaune0423.com)
  - 𝕏: [@0xasuma_jp](https://x.com/0xasuma_jp)
  - Github: [@posaune0423](https://github.com/posaune0423)
  - Linkedin: [@posaune0423](https://linkedin.com/in/posaune0423)

</div>

</div>

---

<!-- _class: agenda-table -->

## 本日の流れ

| Section | Time | 内容 | 目的 |
| :-- | :-- | :-- | :-- |
| 1 | 5 min | API / Why Jupiter | Jupiterの強みを掴む |
| 2 | 5 min | Jupiter Agent Skills | 開発加速の仕組みを理解する |
| 3 | 20 min | デモ | Agent実装フローを見る |
| 4 | 15 min | 最小実装 | Swap / Lend / Recurring の基本形 |
| 5 | 10 min | 実務の注意点 | Error handling と hardening の要点 |
| 6 | 5 min | Q&A / Closing | 質疑応答と参考資料確認 |

---

## Jupiter API

---

<!-- _backgroundImage: url(./assets/jup-ecosystem.png) -->
<!-- _backgroundSize: cover -->
<!-- _backgroundPosition: center 80% -->

---

## Why Jupiter? ビルダー視点の 3 つの強み

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
    <p class="mb-3"><span class="why-num">01</span><span class="why-title">流動性の集約</span></p>
    <ul class="text-lg">
      <li>Metis / JupiterZ / DFlow / OKX など複数ルーターを 1 つの API で扱える</li>
      <li>最良レート探索と route selection を自前実装しなくてよい</li>
      <li>Swap 以外にも Trigger / Recurring / Lend / Price / Tokens が揃っている</li>
    </ul>
  </div>
  <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
    <p class="mb-3"><span class="why-num">02</span><span class="why-title">実装しやすい API</span></p>
    <ul class="text-lg">
      <li>Ultra Swap は <code>GET /order</code> → 署名 → <code>POST /execute</code> の明快な流れ</li>
      <li><code>x-api-key</code> を前提に REST で統一されている</li>
      <li>ハッカソンで必要な「まず動かす」までが速い</li>
    </ul>
  </div>
  <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
    <p class="mb-3"><span class="why-num">03</span><span class="why-title">Agent Skills と相性が良い</span></p>
    <ul class="text-lg">
      <li>API 選定、認証、gotchas、retry 方針をまとめて agent に渡せる</li>
      <li>ドキュメントを毎回読み直さずに統合コードを書き始められる</li>
      <li>実装スピードと正確性を同時に上げやすい</li>
    </ul>
  </div>
</div>

---

<!-- header: "" -->
<!-- _class: section-divider -->

# SECTION 2

## Jupiter Agent Skills とは

---
<!-- header: Section 2 -->

<div class="grid grid-cols-2 gap-x-10 items-center mt-4">

<div>

> Skills for AI coding agents to integrate with the Jupiter ecosystem.

基本的にはcoding agentがJupiter APIのintegrationをしやすくするためのskillで、4つの`SKILL.md`からなる

</div>

<div class="flex justify-center">

<img src="https://opengraph.githubassets.com/1/jup-ag/agent-skills" class="rounded-xl" style="max-height: 380px; object-fit: contain;" />

</div>

</div>

<!-- 基本的にはこれ単体でopenclawに入れれば何でも動く、みたいなskillではなくこのskillをClaude CodeやCodexなどに与えて使用するイメージ-->

---

- `integrate-jupiter`
  - jupiter apiのintegrationに関する一般的なskill
- `jupiter-lend`
  - lending機能のintegrateに特に特化したskill
- `jupiter-swap-migration`
  - 既存実装をJupiter Swap V2 APIにmigrateするためのskill
- `jupiter-vrfd`
  - Jupiter Token Verificationを扱うためのskill

 <!--Jupiter Token Verificationは何かDex Paidみたいな感じで1000JUPでtokenの認証ができるサービス  -->

---


<!-- header: "" -->
<!-- _class: section-divider -->

# SECTION 3

## デモ

<!-- 実際にCursor, Claudeなどのcoding agentを使ってjupiterでswapなどを実行するscriptを書いてもらい実行する -->

---

<!-- header: "" -->
<!-- _class: section-divider -->

# SECTION 4

## 最小実装ハンズオン

<!-- 実際に受講者が手を動かして実装するsection -->
<!-- Openclawのworkspaceを作るのがいいかな、swap, lendとかできて、DCAの自動化もOpenclawでやるみたいな -->
<!-- 
AIで開発する時代、手を動かして実装するハンズオンとかって意味ない気するな
今回はopenclawで動かすことを目標にしよう
 -->

---

<!-- header: Section 4 -->

## 1. Setup

<!-- ここは無料クレジット対象のkeyがその場で配られるかも -->
1. [portal.jup.ag](https://portal.jup.ag)にアクセスしAPI keyを取得

```bash
export JUPITER_API_KEY="your api key"
# or
dotenvx set JUPITER_API_KEY ${your_api_key} --env-file .env.encrypted
```
などで環境変数に値をset

---

## 2. OpenClawにagentを追加

```bash
openclaw agents add jupiter-demo \
  --workspace ./examples/openclaw \
  --non-interactive

openclaw agents set-identity \
  --workspace ./examples/openclaw \
  --from-identity
```

---

## 3. OpenClawをworkspace内で起動

```bash
cd ./examples/openclaw

openclaw tui
```

---

## 4. OpenClaw経由でswapを実行する

prompt例
```txt
SOLを1USDCにswapしてください
```

---

## 5. OpenClaw経由でlendを実行する

prompt例
```txt
最小額のdeposit額をlendしてください
```

---

## 6. OpenClaw経由でscheduling orderを実行する

<!-- dcaは100USDCがminimum, 2回分割の50USDC / order -->

prompt例
```txt
scheduling orderでdcaを実行してください
```

---

<!-- header: "" -->
<!-- _class: section-divider -->

# SECTION 5

## 実務上の注意点 / Advanced Topics

---

<!-- header: Section 5 -->

### 実務上の注意点 / Advanced Topics

1. 秘密鍵の扱い
2. Error Handling
3. Latency and Server Locations

---

### 1. 秘密鍵の扱い

- `.env`などのファイルに書くと最近のAIはgitignoreしたりしても結構中身を普通に読んでくる
- `dotenvx`で暗号化して保存し実行時に復号化
- `cli.json`などでpermissionを設定
  - ```json
    "deny": [
          "Bash(dotenvx get *)",
          "Bash(dotenvx decrypt *)",
          "Read(.env.keys)",
          "Read(/**/.env.keys)",
          "Write(.env.keys)",
          "Write(/**/.env.keys)"
        ]
    ```

---

<!-- _class: compact-table -->

### 2. Error Handling

| 罠 | 説明 |
| :-- | :-- |
| TTL（有効期限） | 署名済みTxは約2分で失効 → 再クォート必須 |
| 冪等性 | 同じ `requestId` + `signedTx` で2分以内なら再送可 |
| Rate Limit | 50 req / 10s 基本。`Retry-After` ヘッダーを必ず確認 |
| 署名エラー(-1003) | 全必要署名者が揃っているか確認 |
| `/build` と `/execute` 混用 | `/build` の Tx は自前RPC経由のみ。`/execute` に渡すと失敗 |
| payer 指定時 | ルートが Metis のみに限定（JupiterZ / DFlow 除外） |

---

<!-- _class: compact-table -->

### 2. Error Handling

エラーコード対応表

| Code | 分類 | 対処法 | Retry |
| :-- | :-- | :-- | :--: |
| `-1` | オーダー失効 | 再クォート | ✓ |
| `-1000` | ランディング失敗 | パラメータ調整して再試行 | ✓ |
| `-1001` | 不明エラー | 指数バックオフで再試行 | ✓ |
| `-1003` | 署名不足 | 全署名者を確認 | ✗ |
| `-1004` | Blockhash失効 | 再クォート（TTL切れ） | ✓ |
| `-2003` | クォート失効(RFQ) | 再クォート | ✓ |
| `429` | Rate Limit超過 | `Retry-After` 後に再試行 | ✓ |

---

### 2. Error Handling

<!-- このwithRetryという実装はskillの中にsample codeが載っています -->

リトライ戦略

<style scoped>
pre { font-size: 0.46em; }
</style>

```javascript
async function withRetry(fn, max = 3) {
  for (let i = 0; i < max; i++) {
    try { return await fn(); }
    catch (err) {
      const retry = [-1, -1000, -1001,
        -1004, -2003, 429].includes(err.code);
      if (!retry || i === max - 1) throw err;
      const ms = 2 ** i * 1000 + Math.random() * 1000;
      await sleep(ms);
      if ([-1, -1004, -2003].includes(err.code))
        await reQuote();
    }
  }
}
```

**タイムアウト目安**: クォート 5s / 実行 30s / 合計オペレーション 60s

---

### 2. Error Handling

本番投入チェックリスト

|  | 項目 | 内容 |
| :--: | :-- | :-- |
| ✓ | **APIキー検証** | 起動時に `x-api-key` 未設定なら即 Fail Fast |
| ✓ | **タイムアウト設定** | 全 fetch 呼び出しに `AbortController` を追加 |
| ✓ | **リトライ対象の分類** | retryable / non-retryable をエラーコードで判定 |
| ✓ | **requestId のロギング** | 全APIコールの requestId + status をログに記録 |
| ✓ | **冪等性の確認** | 再送前に同Txが確定していないかチェック |
| ✓ | **Slippage 上限設定** | アプリ設定から最大スリッページを強制 |
| ✓ | **残高・アドレス検証** | 実行前に mint アドレスと残高を確認 |

---

### Latency and Server Locations

Jupiter APIはrpc nodeへのtxの送信まで行ってくれる便利なサービスです。
ただし自分のアプリケーションからjupiter api serverまでの距離はdeployしているcloudやSaaSのregionによって変わってきます。

- **Asia-Pacific**: Singapore (ap-southeast-1) or Tokyo (ap-northeast-1)
- **Europe**: Frankfurt (eu-central-1)
- **Americas**: Virginia (us-east-1), Oregon (us-west-2), or São Paulo (sa-east-1)

---

<!-- header: "" -->

<div class="text-center">

# Thank You For Listening

</div>

---

<!-- header: Closing -->

## 参考資料

- [Jupiter Developers Docs](https://dev.jup.ag)
- [Jupiter Portal](https://portal.jup.ag)
- [Jupiter Status](https://status.jup.ag)
- [jup-ag/agent-skills](https://github.com/jup-ag/agent-skills)
- [Swap API Docs](https://developers.jup.ag/docs/swap/index.md)
- [Lend Docs](https://developers.jup.ag/docs/lend/index.md)
- [Recurring Docs](https://developers.jup.ag/docs/recurring/index.md)
