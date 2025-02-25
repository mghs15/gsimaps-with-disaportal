# gsimaps-with-disaportal
重ねるハザードマップの機能を地理院地図に追加してみる実験

https://mghs15.github.io/gsimaps-with-disaportal/

参考 blog https://qiita.com/mg_kudo/items/6bc5ad3cc33b6e13ba1f

>[!warning]
>実験的な実装です。表示される情報は誤った処理をしている可能性が否定できません。
>実際に災害リスクを確認される際は、自治体のハザードマップ等をご確認ください。

### クエリパラメータ

地図の状態は地理院地図のもともとの機能により、ハッシュで管理されていますが、一部独自の拡張をクエリパラメータで制御しています。
* `rkm`: 地図の表示時に、`rsk=1` なら、地図の中心部のリスク検索結果を表示します。リスク検索ダイアログを開いた状態となります。
  * 例　https://mghs15.github.io/gsimaps-with-disaportal/?rkm=1#12/33.558991/133.531265
* `q`: 地図の表示時に、`q=` に設定された文字列で住所検索を行い、一番上の検索結果の場所でリスク検索結果も表示します。リスク検索ダイアログを開いた状態となります。また、住所検索窓からフォーカスをスムーズに行えるように、検索結果ダイアログの DOM の位置を検索窓の次に来るように移動させます。
  * 例　https://mghs15.github.io/gsimaps-with-disaportal/?q=徳島

>[!warning]
>地図の状態を変更してもクエリパラメータへ状態は反映されません。
>あくまで、リンク設定時に初期表示を制御するための機能です。

## 参考資料
* 地理院地図のソースコード https://github.com/gsi-cyberjapan/gsimaps/
* 重ねるハザードマップ https://disaportal.gsi.go.jp/
* ハザードマップポータルサイトの災害リスクを矩形で読み込む実験 https://github.com/mghs15/disaster-risk-within-rectangle

