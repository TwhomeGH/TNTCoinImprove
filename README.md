# TNTCoinImprove
這是基於Rqinix TNTCoin的改良版本
[Rqinix TNTCoin](https://github.com/rqinix/TNTCoin)

# 新增的功能

指令事件/勝利場次控制事件

![選單](Docs/IMG_1778.jpeg "Action Menu")

Command 你可以用來運行其他的指令

![指令](Docs/IMG_1779.jpeg "Command")

Use Command ： 設定你要運行的其他Minecraft指令

Example : `say Hello322`

![勝利場次](Docs/IMG_1780.jpeg "WinManger")

WinManger 你可以用來增加/減少 最大勝利場次 或 當前場次

| 值 | 說明 | 類型 |
| --- | --- | --- |
| Add Win | 增加場次或減少場次 | Number |
| Change Max | 是否修改最大值 | boolean |



![新實驗選項](Docs/IMG_1786.jpeg "StructueConfig")

StructureConfig 該選項 讓你能夠隨時調整結構的大小

![結構設置](Docs/IMG_1787.jpeg "StructueConfig")

| 值 | 說明 | 類型 |
| --- | --- | --- |
| Width | 結構寬度 | Number |
| Height | 結構高度 | Number |
| Max limit Width | 限制結構最大寬度 | Number |
| Max limit Height | 限制結構最大高度 | Number |

- 限制結構寬度/高度 用於控制擴建上限

![填充設置](Docs/IMG_1788.jpeg "FillConfig")

| 值 | 說明 | 類型 |
| --- | --- | --- |
| Delay | 填充延遲 | Number |
| Amount | 填充數量 | Number |
| FillStop | 是否阻止運行中的填充事件 | boolean |

> 當前還未配置Delay與Amount的事件修改


![擴建設置](Docs/IMG_1789.jpeg "RangeSet")

| 值 | 說明 | 類型 |
| --- | --- | --- |
| range | 增加/減少寬度或高度 | Number |
| changeHeight | 是否改成修改高度 | boolean |

> 如果修改後超過最大限制寬度/高度 會以最高限制寬度/高度為最終值

