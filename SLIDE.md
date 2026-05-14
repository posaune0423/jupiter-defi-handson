---
marp: true
theme: jupiter
# paginate: true
style: @import url('https://unpkg.com/tailwindcss@^2/dist/utilities.min.css');
backgroundImage: url(./assets/bg.png)
footer: " "
---

<!-- _class: lead -->

# 「ゼロから理解するDeFiトレード」

<div class="text-xl">

**AggregatorとPerpsの仕組み**

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

| Section | Time   | 内容                                             | 目的                                 |
| :------ | :----- | :----------------------------------------------- | :----------------------------------- |
| 1       | 5 min  | Opening                                          | 自己紹介と進行の共有                 |
| 2       | 25 min | Perpetual〜Aggregator前半（Oracle・DEX・リスク） | 用語と因果の整理                     |
| 3       | 8 min  | Demo（画面共有）                                 | Jupiter・bulk trade などを実機で確認 |
| 4       | 15 min | Aggregator（SOR・ルート）                        | 経路探索の直感                       |
| 5       | 5 min  | Jupiter Swap を見てみる                          | Quote と Route の読み方              |
| 6       | 2 min  | Closing                                          | 参考リンク                           |
| Q&A     | 30 min | 質疑応答                                         | —                                    |

---

<!-- header: "" -->
<!-- _class: section-divider -->

# Part 1

## Perpetual と、そのまわりの仕組み

---

<!-- header: Perpetual -->

## Perpetual とは？

まずそもそも **perp** とは？ → **「永久先物」**

<div class="grid grid-cols-2 gap-6 mt-8">

<div class="glass-card">

<h4>言葉の分解</h4>

<ul>
<li><strong>永久（Perpetual）</strong></li>
<li><strong>先物（Future）</strong></li>
</ul>

</div>

<div class="glass-card">

<h4>この資料での意味</h4>

<p>満期のない先物契約イメージで、証拠金・Funding・清算などで状態が調整される世界。</p>

</div>

</div>

---

<!-- header: Perpetual -->

## 「先物取引」とは？

将来の決まった日時・条件で、あらかじめ決めた価格で売買する約束を、**いまの時点で**取り交わす取引。

<div class="grid grid-cols-3 gap-5 mt-8">

<div class="glass-card">

<h4>何をするか</h4>

<p>「将来、この価格で買う／売る」という<strong>契約</strong>を売買する。多くの市場では最終的に現物受け取りではなく、価格差の<strong>精算</strong>で決済されることが一般的。</p>

</div>

<div class="glass-card">

<h4>なぜあるか</h4>

<p>農産物やエネルギーなどで生まれた「将来の価格が読めない」リスクを、先物で<strong>ヘッジ</strong>するため。投資・投機で変動に乗る用途もある。</p>

</div>

<div class="glass-card">

<h4>レバレッジ</h4>

<p>証拠金の一部で大きなノーションに張れることが多い。その分利益も損失も拡大し、証拠金維持率を下回ると<strong>ロスカット</strong>等で強制決済されうる。</p>

</div>

</div>

---

<!-- header: Perpetual -->

## 小話（歴史）

<blockquote>

<p>米国の先物市場は1840年代にシカゴではじまりました。</p>

<p>シカゴは米国中西部の穀倉地帯の中央に位置していたことと、五大湖や鉄道を通じて穀物を集積・配送する交通の要所であったため、シカゴが先物取引の中心になったとされています。</p>

</blockquote>

---

<!-- header: Perpetual -->

## 小話（日本）

日本も米相場で先物取引が盛んだった。

<blockquote>

<p>江戸時代に本間宗久という相場師がロウソク足を発明したという説もある。</p>

</blockquote>

---

<!-- header: Perpetual -->

## レバレッジ・信用取引と Funding

要はレバレッジや信用取引ができる。

その上で、**現物価格との乖離**は **Funding Rate**
という概念で調整される、という整理。

<div class="note-banner">

Funding
の定義・指数・支払い周期はプロダクトごとに違うので、体験する前にドキュメントで確認するのが安全です。

</div>

---

<!-- header: Perpetual -->

## Funding Rate（向き）

| 相場                           | 支払いのイメージ（ざっくり） |
| :----------------------------- | :--------------------------- |
| Perp Price **&gt;** Spot Price | Long ⇒ Short へ              |
| Perp Price **&lt;** Spot Price | Short ⇒ Long へ              |

---

<!-- header: Perpetual -->

## 清算（Liquidation）

清算は、FXなどと違って追証（おいしょう）のような延命が常に効くとは限らず、**Equity（口座残高）**
が **Maintenance Margin** を下回ると強制清算に入りうる。

<div class="glass-card mt-6">

<h4>取引所・プロトコルによる</h4>

<p>条件式や優先順位は取引所・プロトコルごとに異なる。Equity が維持証拠金を下回ると強制決済に入りうる、というのが共通の注意点。</p>

</div>

---

<!-- header: Perpetual -->

## 清算条件（実装は取引所依存）

<div class="glass-card mt-6">

<p>例として、<strong>Equity &lt; Maintenance Margin</strong> かつ <strong>Position PnL &lt; 0</strong> のような状況で強制清算に入りうる、という整理がある（定義はプロダクトごとに異なる）。</p>

</div>

---

<!-- _class: logo-focus -->
<!-- header: Perpetual -->

## Oracle とは？

価格などの、Blockchain上だけでは計算できない**外部データ**を、Smart Contract
などを通してオンチェーンに載せる**橋渡し**的なシステム。

<div class="deck-logo-row">

<div class="deck-logo-box">

<img src="assets/logos/chainlink.svg" alt="Chainlink" class="deck-logo" />

<span>Chainlink</span>

</div>

<div class="deck-logo-box">

<img src="assets/logos/pyth.svg" alt="Pyth" class="deck-logo" />

<span>Pyth</span>

</div>

</div>

<div class="grid grid-cols-1 gap-6 mt-8">

<div class="glass-card">

<h4>Perp DEX との関係</h4>

<p>Perp DEX はこの Oracle を通して現物価格を知り、それに応じて FR を変化させ、価格の乖離を是正する。</p>

</div>

</div>

---

<!-- _class: logo-focus -->
<!-- header: Perpetual -->

## Perp DEX の種類

<div class="grid grid-cols-2 gap-6 mt-8">

<div class="glass-card">

<h4>CLOB 型</h4>

<ul class="dex-list">
<li><img src="assets/logos/hyperliquid.svg" alt="" class="deck-logo-sm" /> Hyperliquid</li>
<li><img src="assets/logos/bulk-trade-on-dark.png" alt="" class="deck-logo-sm" /> Bulk</li>
</ul>

</div>

<div class="glass-card">

<h4>AMM 型（LP がカウンターパーティ）</h4>

<ul class="dex-list">
<li><img src="assets/logos/jupiter.svg" alt="" class="deck-logo-sm" /> Jupiter Perp（JLP）</li>
<li>GMX（GM / GLP などの一括プール）</li>
<li>Gains Network（gTrade・金庫型）</li>
<li>MUX Protocol（MUXLP など）</li>
</ul>

</div>

</div>

---

<!-- header: Perpetual -->

## TradFi と DeFi の大きな違い

<div class="glass-card">

<ul>
<li>Crypto、特に DeFi では個人を<strong>特定しづらい</strong></li>
<li><strong>取引所や broker が損失を被ったときに、個人に対して請求できない</strong>前提が強い</li>
</ul>

</div>

---

<!-- header: Perpetual -->

## じゃあどうしているか？

基本的に **Protocol 内で** これらの risk を精算しきれるように設計している。

<div class="note-banner">

「誰が最終的に損を抱えるか」をコードと経済設計で決めている、という見方になる。

</div>

---

<!-- header: Perpetual -->

## Risk の転嫁先

<div class="grid grid-cols-2 gap-6 mt-6">

<div class="glass-card">

<h4>CLOB 型</h4>

<ul>
<li>ADL（auto de-leveraging）</li>
<li>Insurance Fund</li>
<li>socialized loss</li>
<li>運営 vault（例: HLP と JELLY事件）</li>
</ul>

</div>

<div class="glass-card">

<h4>AMM 型（LP がカウンターパーティ）</h4>

<ul>
<li>LP</li>
<li>Trader
<ul>
<li>Open Fee</li>
<li>Price Impact Fee</li>
<li>Borrow Fee Due</li>
</ul>
</li>
</ul>

</div>

</div>

---

<!-- header: Perpetual -->

## JELLY事件（小話）

運営側のプールや救済設計が注目された事例の一つ。細部は一次情報で確認する。

---

<!-- header: "" -->
<!-- _class: section-divider -->

# Demo

## 画面共有で Jupiter・bulk trade などを確認

---

<!-- header: "" -->
<!-- _class: section-divider -->

# Part 2

## Aggregator

複数の DEX から最適なスワップ経路を探し、一つの画面や API で扱うレイヤー。

---

<!-- header: Aggregator -->

## 既存金融でいう SOR

**SOR（Smart Order Router）** に相当する発想。

Blockchain 上には DEX と呼ばれる取引所が沢山存在している。

それらを **1つの Interface** で呼べるようにしたもので、さらに最適な交換レートの
**route** を探索してくれる。

---

<!-- _class: logo-focus -->
<!-- header: Aggregator -->

## 代表例

<div class="grid grid-cols-2 gap-6 mt-8">

<div class="glass-card logo-tile flex flex-col items-center text-center">

<img src="assets/logos/jupiter.svg" alt="Jupiter" class="deck-logo" />

<h4>Jupiter</h4>

<p>Solana でよく使われる入口の一例。</p>

</div>

<div class="glass-card logo-tile flex flex-col items-center text-center">

<img src="assets/logos/1inch.svg" alt="1inch" class="deck-logo" />

<h4>1inch</h4>

<p>Ethereum 側でも名前が挙がりやすい一例。</p>

</div>

</div>

---

<!-- header: Aggregator -->

## AMM 以外も束ねる

一般の AMM だけでなく、**prop AMM** や **RFQ**
など、市場メーカーからの見積もりも束ねて、ユーザーに実効レートの良い選択肢を出す。

<div class="glass-card mt-6">

<h4>既存金融との対比</h4>

<p>取引所の場内だけでなく、**立会外取引**に近い流動性も混ざり得る、という理解の仕方がある。</p>

</div>

---

<!-- header: Aggregator -->

## A. Direct Route

<div class="route-pre-wrap">

<pre><code>SOL -&gt; USDC</code></pre>

</div>

---

<!-- header: Aggregator -->

## B. Multi-hop Route

<div class="route-pre-wrap">

<pre><code>SOL -&gt; USDT -&gt; USDC
SOL -&gt; mSOL -&gt; USDC
SOL -&gt; JupSOL -&gt; USDC</code></pre>

</div>

---

<!-- _class: logo-focus -->
<!-- header: Aggregator -->

## C. Split Route

<div class="deck-logo-row mb-3">

<div class="deck-logo-box"><img src="assets/logos/jupiter.svg" alt="Jupiter" class="deck-logo-sm" /><span>Jupiter</span></div>

<div class="deck-logo-box"><img src="assets/logos/raydium.svg" alt="Raydium" class="deck-logo-sm" /><span>Raydium</span></div>

<div class="deck-logo-box"><img src="assets/logos/meteora.png" alt="Meteora" class="deck-logo-sm" /><span>Meteora</span></div>

<div class="deck-logo-box"><img src="assets/logos/orca.svg" alt="Orca" class="deck-logo-sm" /><span>Orca</span></div>

</div>

<div class="route-pre-wrap">

<pre><code>SOL -&gt; USDC  40% via Jupiter
SOL -&gt; USDC  35% via Raydium
SOL -&gt; USDT -&gt; USDC 25% via Meteora + Orca</code></pre>

</div>

---

<!-- header: "" -->
<!-- _class: section-divider -->

# Demo

## 画面共有で Jupiter・bulk trade などを確認

---

<!-- header: Closing -->

## 今日のまとめ

<div class="grid-summary">

<div class="glass-card">

<h4>Perps</h4>

<p>先物の発想、Funding、清算、Oracle。DEX 型ごとに設計が違う。</p>

</div>

<div class="glass-card">

<h4>リスク</h4>

<p>DeFi では個人追徴が弱い前提で、ADL・保険基金・LP・手数料などへ精算される。</p>

</div>

<div class="glass-card">

<h4>Aggregator</h4>

<p>SOR に近い。Direct / Multi-hop / Split で「最適」が変わる。</p>

</div>

</div>

---

<!-- header: Closing -->

## Closing

<div class="note-banner">

投資助言ではありません。実取引は各公式ドキュメントとリスク説明を確認してください。

</div>

---

<!-- header: Closing -->

## 参考資料

- Jupiter User Docs: https://docs.jup.ag/
- Jupiter Swap / Ultra: https://docs.jup.ag/user-docs/trade/swap
- Jupiter Perps / JLP: https://docs.jup.ag/user-docs/trade/perps-and-jlp
- Jupiter Mobile: https://docs.jup.ag/user-docs/manage/mobile

---

<!-- _class: thank-you-slide -->
<!-- header: "" -->

<div class="text-center">

# Thank You For Listening

</div>
