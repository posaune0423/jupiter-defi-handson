---
marp: true
theme: jupiter
# paginate: true
style: @import url('https://unpkg.com/tailwindcss@^2/dist/utilities.min.css');
backgroundImage: url(./assets/bg.png)
footer: ' '
---

<!-- _class: lead -->

# 「ゼロから理解するDeFiトレード」

<div class="text-xl">

**AggregatorとPerpsの仕組みと実践**

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

<!-- header: "" -->

<div class="text-center">

# Thank You For Listening

</div>

---

<!-- header: Closing -->

## 参考資料