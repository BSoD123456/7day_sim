# 永远的7日之都 日常模拟器

点击[**这里**](https://bsod123456.github.io/7day_sim)进入。

## 说明

本模拟器主要用于永远的7日之都游戏内日常内容的计划与计算，用于帮助玩家调整尝试新的日常方案，为玩家节省因计算失误而凉掉的时间与钟。本工具仅为模拟计算工具，并不提供任何与实际游戏有关的功能。

### 操作

就像游戏里一样，在最下面的控制台上点就可以了。点击已选过的选项可以回退到前一步。点击每一天记录上的“回到此时”可以回退到当前时间。点击每一天记录上的“属性”和“区域”可以查看属性和区域的详细情况。

### 有的功能

- 计算所有行动的行动点开销
- 计算所有只与“幻力”，“科技”，“情报”有关的建设行动。包括各个特殊算法建筑与“地下研究所”。
- 计算巡查与开发的所需数值，并模拟开发对于每个区域空格数量的影响。
- 模拟战斗对于区域的解锁。
- “强制解锁”功能用于模拟“突袭”等剧情解锁区域的特殊情况，该功能并不消耗行动点。
- 设置功能仅可设置角色数量。因为仅有该数量是计算主属性必须的。
- 可以保存当前方案，自动生成一个保存链接，点击进入的话便可读取所保存的方案。

### 没有的功能

- 一切与事件有关的功能。因为事件太繁杂，我不可能拿到完整的内部数据做模拟。实际使用时可以自己看事件攻略得到巡查的地点与次数后使用巡查来模拟，并用备注功能记录。
- 一切与角色有关的功能。包括疲劳值计算，好感度计算。因为角色数据也很繁杂，不但有初始能力，还需要考虑升星后的影响。也是我无法拿到完整模拟数据的部分。这部分请自行计算。
- 一切与黑核获取有关的功能。理由同事件。依然可以自行通过巡查和建设来模拟获得黑核的过程。
- 一切与情报有关的功能。因为这部分完全随机触发，模拟起来意义并不大。而且对主属性影响最大的只有“不稳定黑门”。可以使用“空闲”指令浪费掉行动点，来补足对“不稳定黑门”的处理所需要的回合数。
- 漂亮的界面，以及详细的建造说明。因为界面是本人并不擅长甚至反感的领域，因此仅仅实现了功能所需的最简单的界面。如果有需要，可以直接FORK本项目，然后通过修改CSS文件轻松实现更漂亮的新界面。

### 模糊的细节

- 巡查超过7次以后的所需巡查力递增，是我猜测的数值。因为我根本没机会试到8次以上。
- “地下研究所”的生效范围，由于游戏中的文字说明并没有写仅对该区域生效，因此我也将其设计为只要全地图上有一个，就全域生效。实际游戏中到底是区域生效还是全域生效我并不确定，因为我没有余裕去尝试作这个死。
- 区立建筑的全区域+1效果，对于按照角色数计算数值的建筑（公共图书馆，情报中心，黑门监测站）并不生效。这点与实际游戏中完全吻合。虽然我觉得这像是游戏的BUG，但是我就曾因为这个BUG在计划出了差错，结果吃了大亏的。因此这里我完全重现了这个BUG。另，不确定现有版本该BUG修正与否。

## 许可声明

本项目中所使用的jquery-1.12.4.min.js, pako.min.js, base64.js请遵从它们原项目的许可声明。除此之外的所有内容，均可随意使用，流传，修改。**但是本人并不保证该模拟器的计算的正确性，也不对使用该模拟器产生的任何结果承担责任**。若无法接受此声明，请勿使用。

## 最后的一点废话

本来前几天满腔热情的开了这个坑，但是这几天的这些破事搞的人心凉凉的。本来都不准备继续做了，但是看着也快做完了，好歹善始善终吧，才给收尾发出来了。但是由于本项目纯凭个人兴趣，而现在说实话兴趣减退的有点厉害，所以请不要对项目的更新有大的期待。发现了BUG可以直接在项目中提交，我有空也可能会来修正。当然，欢迎FORK本项目自行更新维护。
