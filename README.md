# Finger Drum Trainer

Melodics風の4x4 MIDI PAD練習アプリのMVPです。

## できること

- 16 PADを高コントラスト色で表示
- ノーツ色とPAD色を一致
- PADごとに独立した判定バーを表示
- PAD行ごとの判定位置差を `spawnTime` 補正で吸収
- Web MIDIで実機PAD入力
- 設定タブからMIDI接続、MIDI Learn、BPM変更、割り当て確認
- MIDI Learnでノート番号をP01から順番に割り当て
- キーボード入力でMIDIなしでも試奏
- BPM変更、Play/Pause、Reset、スコア、コンボ、判定表示
- PAD採番は左下P01から右方向へ進み、段ごとに上へ上がる配置
- Sample Pi由来のCC0ドラム音源をPADに割り当て
- 4カウント後、短いイントロが入り、その後キック、スネア、ハイハット、シンバルだけの基本8ビート練習が始まる構成
- 見本ボタンで自動演奏を見ながら練習の流れを確認
- 設定タブから曲を選択可能
- 最後のノーツが流れ終わると自動でComplete表示になりゲーム終了

## 起動

```bash
cd /Users/hiratayuuya/Desktop/codex/finger-drum-trainer
python3 -m http.server 4173
```

ブラウザで `http://localhost:4173` を開きます。

## MIDI実機テスト

Chrome系ブラウザで `MIDI接続` を押して許可してください。

右パネルの `設定` タブから `Learn` を押します。その後、画面上のPADをクリックしてから実機MIDIPADを押すと、その画面PADにMIDI Note番号を保存します。

保存された割り当てはブラウザのlocalStorageに残ります。

## 音源

同梱サンプルはSample Piから選んでいます。Sample PiのREADMEでは、サンプルはFreesound由来でCreative Commons 0のpublic domainとして置かれていると説明されています。

https://github.com/alex-esc/sample-pi

## Windows/Mac配布方針

このMVPはWeb標準だけで動きます。デスクトップ配布は同じUIをElectronまたはTauriで包むのが現実的です。WebGLは必須ではありません。今回のような2D落下ノーツUIはCanvas 2Dで十分軽く、実機MIDIや音声まわりを優先した方が開発効率が高いです。
