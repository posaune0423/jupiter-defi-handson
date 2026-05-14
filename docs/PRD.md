# PRD

[AUTON Program](https://www.auton-program.com/)という日興証券とかFracton VenturesがやってるDeFi-focused acceleration programにJupiterが協賛で入っていてそこで行うプレゼンのためのスライド資料をmarpで作ります。

内容としては：
- テーマ：AggregatorとPerpsについて
- 日程：第一候補は5/13（難しければ同じ週で調整可能）
- 時間：夕方以降（17時以降OK）
- 形式：オンライン
- 長さ：90分（60分トーク＋30分Q&A）

---

## この講義全体の内容

```
01. An Introduction to DeFi and Staking
✍️概要・About：ブロックチェーン、オンチェーンと伝統金融の違い、そしてステーキングの基本を理解し、DeFiの土台を固める。Understand the basics of blockchain, the differences between on-chain and traditional finance, and the fundamentals of staking to build a solid foundation in DeFi.
🗣️スピーカー・Speakers：
Next Finance Tech COO、Mikihiro Ono
SMBC Nikko Securities, DeFi Technology Department GM, Taisuke Isono
📅日程・Date：2026.5.11（Mon）
⏰時間・Time：17:00 - 18:30 JST
🔊言語・Language：JP

02. Automated market Makers (AMM) and Lending
✍️概要・About：AMMの仕組み、スリッページ、レンディング、DeFiの流動性と報酬構造がどう作られている。Learn about the mechanisms of AMMs, slippage, lending, and how liquidity and reward structures are created in DeFi.
🗣️スピーカー・Speaker：
Former Uniswap Labs Japan Lead for APAC growth, Daiki Endo
DeFi Radio, Makito Kadowaki
📅日程・Date：2026.5.12.（Tue）
⏰時間・Time：18:00 - 19:30 JST
🔊言語・Language：JP

03. Smart Contracts and Risk Management
✍️概要・About：スマートコントラクトがDeFiシステムをどのように形成しているか、システム全体のリスクについて探究し、リスクの監視および管理方法を学ぶ。Explore how smart contracts shape DeFi systems, system-wide risks, and learn about risk monitoring and management methods.
🗣️スピーカー・Speaker：Nethermind, Head of Product APAC, Dharani Kishore
📅日程・Date：2026.5.14（Thu）
⏰時間・Time：18:00 - 19:15 JST
🔊言語・Language：EN

04. Perpetuals and Aggregators
✍️概要・About：レバレッジ、永続的先物、オプション等のデリバティブ取引の構造、リスク・リターンのバランスを学ぶ。Study the structure of derivatives trading such as leverage, perpetual futures, and options, and learn about the balance between risk and return.
🗣️スピーカー・Speaker：Jupiter
📅日程・Date：2026.5.15（Fri）
⏰時間・Time：18:00 - 19:30 JST
🔊言語・Language：JP

05. Agentic Payments
✍️概要・About：x402決済技術の発展、エージェントたちがブロックチェーン上でどう動くか、これからの新しい可能性について学ぶ。Learn about the emergence of x402 payment rails, agents navigating blockchain, and the new possibilities that these technologies create.. 
🗣️スピーカー・Speakers：
Kite AI CTO and Co-founder, Scott Shi
Kite AI AI Product Lead, Yusuke Muraoka
📅日程・Date：2026.5.16.（Sat）
⏰時間・Time：9:00 - 10:30 JST
🔊言語・Language：EN
```


---

### Idea

```
今回の講義、
Jupiterのみの説明するというよりは、

まずは
「AggregatorやPerpsの仕組みをフラットに説明する」
→ その上で
「実際のツールの一例としてJupiterを紹介する」

という流れだと、すごく自然でわかりやすいかなと思っています！

特定のプロダクトの紹介というより、
「DeFiの仕組みを理解する中で自然に出てくるツール」
という見せ方ができると、参加者の理解や信頼感も高まるかなと🙏

その中で、初心者におすすめのDEFIアプリやウォレットとして、自分ならJupiterモバイルが使いやすく、全てが完結してるからそれから始める、的な例を入れてもらえれば！
```



---

## 🎤 講義テーマ案

「ゼロから理解するDeFiトレード：AggregatorとPerpsの仕組みと実践」

---

1. 導入（5〜7分）

背景：
「多くの人がDeFiでうまくいかない理由は、“ツールの理解不足”」
ゴール：
「この講義で“実際に使えるレベル”まで理解する」

---

2. DeFiとは何か？（8〜10分）

超シンプルに説明：
銀行 vs DeFi（仲介者なし）
基本要素：
スワップ
流動性
レバレッジ
わかりやすい例え：
「いろんなお店を自分で回る vs 自動で最適な場所を見つけてくれる」

---

3. Aggregator（Jupiterのコア）（15〜18分）

課題：
DEXごとに価格が違う
スリッページや非効率な約定
解決：
Aggregator＝市場全体から最適なルートを探す
わかりやすい説明：
「10個のショップを一瞬で比較して一番いい価格で買う」
Jupiterの役割：
複数の流動性を横断して最適ルートを構築
価格・手数料・実行効率を最適化
なぜ重要か：
無駄なコスト削減
より良い約定
UXの向上

---

（ここでデモ）5〜10分

実際にJupiterを使ってスワップを見せる
ルーティングの仕組みを軽く解説
「どのように複数のプールを使っているか」を視覚的に見せる

ここはかなり理解が深まるポイント

---

4. Perps（15〜18分）

Perpsとは：
現物を持たずに価格にベット
レバレッジを使える
基本概念：
Long / Short
レバレッジ
ロスカット（清算）
なぜ使うのか：
少ない資金で大きなポジション
ヘッジ
短期トレード
リスク（重要）：
清算リスク
ボラティリティ
過剰トレード

信頼性を上げるために、ここはリアルに話す

---

5. Aggregator × Perpsの組み合わせ（10分）

Aggregator：
エントリー/エグジットを最適化
Perps：
エクスポージャーを拡大

組み合わせることで：

より効率的なトレード
戦略の幅が広がる

例：

最適価格でポジションに入る
素早い資産ローテーション
ポジション管理の効率化

---

6. 今後の展望（5〜7分）

今後は：
もっとシンプルに
もっと高速に
裏側は意識しなくなる
ユーザーは：
DEXを意識しない
チェーンも意識しない
Jupiterのポジション：
「流動性のナビゲーションレイヤー」
AI × DeFiとの接点：
自動最適化
スマートなルーティング
トレードの自動化

---

7. Q&A（30分）

初心者質問歓迎
実際の使い方
トレードに関する疑問

---

補足（あると良いポイント）

シンプルな戦略例：
「$100あったらどう使うか？」
初心者向けのCTA：
「まずは少額でJupiterを触ってみる」