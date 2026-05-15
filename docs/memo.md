
ちょっとおさらい

- AMM
- 既存金融とDefiの違い



---

## Aggregator

---

既存金融でいう**SOR(Smart Order Router)**

Blockchain上にはDEXと呼ばれる取引所が沢山存在している。

それらを1つのInterfaceで呼べるようにしたもので、さらに最適な交換レートのrouteを探索してくれる


- Jupiter
- 1inch

---

一般のAMMだけじゃなくprop AMMやRFQ等のmarket makerからのquoteも受け付けてbest rateをuserに提示る

既存金融とかだと [[立会外取引]]みたいなもの

---

A. Direct Route
```
SOL -> USDC
```


B. Multi-hop Route
```
SOL -> USDT -> USDC
SOL -> mSOL -> USDC
SOL -> JupSOL -> USDC
```


C. Split Route
```
SOL -> USDC  40% via Jupiter
SOL -> USDC  35% via Raydium
SOL -> USDT -> USDC 25% via Meteora + Orca
```


---

Jupiter Swapとかを見てみる

---

## Perpetual

まずそもそもperpとは？ =>「永久先物」

永久(perpetual) 先物(future)

---

そもそも「先物取引」とは？ =>
将来の決まった日時・条件で、あらかじめ決めた価格で売買する約束を、今の時点で取り交わす取引

何をするか:
「将来、この価格で買う／売る」という契約を売買する（多くの市場では、最終的に現物を受け取るのではなく、価格差の精算で決済される形が一般的）。
なぜあるか:
農産物やエネルギーなどで生まれた「将来の価格が読めない」リスクを、先物でヘッジ（価格を固定する）するため。投資・投機のために価格変動に乗る用途もある。
レバレッジ:
証拠金の一部で大きなノーション（想定元本）に張れることが多い。その分、利益も損失も拡大し、証拠金維持率を下回るとロスカットなどで強制決済されうる。

---

小話

```
米国の先物市場は1840年代にシカゴではじまりました。

シカゴは米国中西部の穀倉地帯の中央に位置していたことと、五大湖や鉄道を通じて穀物を集積、配送する交通の要所であったため、シカゴが先物取引の中心になったとされています。
```

日本も米相場で先物取引が盛んだった

```
江戸時代に本間宗久という相場師がロウソク足を発明したという説もある
```

---

要はレバレッジとかを使える信用取引とかができる。
その上で現物価格との乖離は**Funding Rate**という概念で防ぐ

---
### Funding Rate

Perp Price > Spot Price
Long => Short
Perp Price < Spot Price
Short Long

---

### Liqudation

清算、FXなどと違って追証(おいしょう)のようなものはなくEquity(口座残高)がMaintenance Marginを下回っていたら強制清算

取引所にもよるが

$$
Equity<Mp​andPosition PnL<0
$$

---

**Oracle**とは？ =>
価格などのblockchain上で計算できない外部データをBlockchain上にSmart
Contractなどを通して持ってくる橋渡し的なシステム

ChainLink, PYTH

Perp
DexはこのOracleを通して現物価格を知り、それに応じてFRを変化させ価格の乖離を是正する

---

## Perp DEXの種類

- [[CLOB]]型
  - Hyperliquid
  - Bulk
- AMM型
  - Jupiter Perp

---

TradFiとDefiの大きな違い

- Crypto、特にDefiでは個人を特定不可
  - **取引所やbrokerが損失を被った時に個人に対して請求できない**

---

じゃあどうしてるか？
基本的にProtocol内でこれらのriskを精算しきれる様に設計している

Riskの転嫁先

- CLOB型
  - ADL(auto de-leveraging)
  - Insurance Fund
  - socialized loss
  - 運営vault
    - HLP(JELLY事件)
- AMM型
  - LP
  - Trader
    - Open Fee
    - Price Impact Fee
    - Borrow Fee Due

---

JELLY事件 小話

---

bulk trade, Jupiter Perpでデモ

---

Closing