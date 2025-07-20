# VSNotes-Plus ワークスペース情報

## 概要

このドキュメントは、`VSNotes-Plus`拡張機能の現在の実装状況と、将来の機能追加に向けた情報をまとめたものです。

## プロジェクト基本情報 (package.jsonより)

- **名称:** VSNotes-Plus (`vsnotes-plus`)
- **説明:** プレーンテキストでのノート作成とToDo管理のためのシンプルなVS Code拡張機能。
- **バージョン:** 0.1.5
- **リポジトリ:** [https://github.com/mafut/vsnotes-plus.git](https://github.com/mafut/vsnotes-plus.git)
- **ライセンス:** MIT
- **対象VSCodeバージョン:** ^1.80.0

## 主要機能と実装箇所 (extension.jsより)

`extension.js`は、本拡張機能のエントリーポイントであり、各コマンドと対応する処理を紐付けています。

| 機能 | コマンドID | 実装ファイル | 概要 |
| :--- | :--- | :--- | :--- |
| **ノートツリービュー** | `vsnotes` (View) | `src/treeView.js` | サイドバーにノート、タグ、タスクのツリービューを表示します。 |
| **ビューの更新** | `vsnotes.refresh` | `src/treeView.js` | ツリービューの内容を最新の状態に更新します。 |
| **タスクへ移動** | `vsnotes.gotoTask` | `src/treeView.js` | 選択したタスクのファイル上の位置にジャンプします。 |
| **新規ノート作成** | `vsnotes.newNote` | `src/note.js` | 新しいノートを作成します。コマンドパレットまたはツリービューのコンテキストメニューから実行できます。 |
| **ワークスペースに新規ノート作成** | `vsnotes.newNoteInWorkspace` | `src/note.js` | 現在のワークスペース内に新しいノートを作成します。 |
| **ノートの削除** | `vsnotes.delNote` | `src/note.js` | 選択したノートを削除します。ツリービューのコンテキストメニューから実行できます。 |
| **ノート一覧表示** | `vsnotes.listNotes` | `src/listNotes.js` | 最近使用したノートを一覧表示します。 |
| **タグ一覧表示** | `vsnotes.listTags` | `src/listTags.js` | ノート内のタグを一覧表示します。 |
| **セットアップ** | `vsnotes.setupNotes` | `src/setupNotes.js` | ノートの保存場所などの初期設定を行います。 |
| **Git: Commit & Push** | `vsnotes.commitPush` | `src/commitPush.js` | ノートディレクトリでGitのCommitとPushを実行します。 |
| **Git: Pull** | `vsnotes.pull` | `src/pull.js` | ノートディレクトリでGitのPullを実行します。 |
| **ノート検索** | `vsnotes.search` | `src/search.js` | ノートの内容を検索します。 |
| **ノートフォルダを開く** | `vsnotes.openNoteFolder` | `extension.js`内 | 設定されたノートフォルダを新しいVSCodeウィンドウで開きます。 |

---

## 今後の機能追加に向けた情報

### 1. 設定項目 (`contributes.configuration`)

`package.json`には多数の設定項目が定義されており、ユーザーはこれらをカスタマイズすることで拡張機能の挙動を細かく制御できます。

- **ノートのパス設定:** `vsnotes.defaultNotePath`
- **ファイル名のトークン:** `vsnotes.tokens` (例: `{dt}`で日時を挿入)
- **テンプレート機能:** `vsnotes.templates`
- **Git連携コマンド:** `vsnotes.commitPushShellCommand`, `vsnotes.pullShellCommand`
- **UI表示切替:** `vsnotes.treeviewHideTags`, `vsnotes.treeviewHideTasks` など

新機能を追加する際は、これらの設定項目を拡張したり、新たな設定項目を追加したりすることで、柔軟性の高い機能を提供できます。

### 2. コマンドとキーバインディング

新しい機能は、`package.json`の`contributes.commands`セクションにコマンドとして登録し、`extension.js`でその実体を登録する必要があります。必要に応じて`keybindings`も設定できます。

### 3. 依存ライブラリ

- **`fs-extra`**: ファイルシステムの操作をより簡単に行うためのライブラリ。
- **`gray-matter`**: ファイルからFront Matter（YAML形式のメタデータ）を解析・抽出します。ノートのプロパティ管理に利用されている可能性があります。
- **`klaw`**: ディレクトリを再帰的にウォークするためのライブラリ。ノートファイルの探索に使用されていると考えられます。
- **`moment`**: 日時のフォーマットや操作に使用されます。
- **`n-readlines`**: ファイルを一行ずつ読み込むためのライブラリ。

これらのライブラリを活用することで、既存の機能と一貫性を保ちつつ、効率的に新機能を開発できます。

### 4. TODO機能の拡張

現在、`listTasks`に関するコードがコメントアウトされています。これは、ToDo機能が未実装または開発途中であることを示唆しています。
`src/getTasks.js`や`src/listTasks.js`のファイルが存在することから、ToDo機能の基盤は部分的に存在すると考えられます。
今後の開発では、この機能を復活させ、ノート内のチェックボックス（例: `- [ ] task`）をタスクとして認識・管理する機能を実装することが有力な候補となります。

### 5. 検索機能の強化

`src/search.js`で実装されている検索機能は、基本的なテキスト検索だと思われます。これを拡張し、タグによる絞り込み、正規表現検索、AND/OR検索などの高度な検索機能を追加することで、ユーザーの利便性を大幅に向上させることができます。

---

## 変更履歴

### 2025/07/20: ツリービューのコンテキストメニュー機能追加

- **機能追加:** ツリービューのアイテム（ファイル・フォルダ）を右クリックした際のコンテキストメニューに「新規ノート作成」機能を追加しました。
  - **実装ファイル:** `src/note.js`, `package.json`
  - **詳細:**
    - `src/note.js`の`newNote`関数を修正し、引数として渡されたパスを基準にノートを作成できるようにしました。引数がない場合は、従来通りデフォルトのパスに作成されます。
    - `package.json`の`contributes.menus["view/item/context"]`を更新し、「新規ノート作成」コマンドをコンテキストメニューに追加しました。
- **ドキュメント更新:** `vsnotes.newNote`および`vsnotes.delNote`の説明に、コンテキストメニューからの利用が可能であることを追記しました。

### 2025/07/20: タグの階層構造化

- **機能追加:** タグに階層構造を導入しました。
  - **実装ファイル:** `src/getTags.js`, `src/treeView.js`
  - **詳細:**
    - `src/getTags.js`を修正し、`/`で区切られたタグ（例: `Memo/type1`）を階層構造として解析するように変更しました。
    - `src/treeView.js`を修正し、解析された階層構造をツリービューに正しく表示するようにしました。これにより、`Memo`タグの下に`type1`タグがネストして表示されます。
