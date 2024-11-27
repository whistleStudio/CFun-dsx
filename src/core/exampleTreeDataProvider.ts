import { CancellationToken, Event, ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from "vscode";
import * as vscode from "vscode"
import { toc } from "../examples/toc";

export class ExampleTreeDataProvider implements TreeDataProvider<TreeItem> {
    private context: vscode.ExtensionContext // 以便获得路径
    private viewId: string // 获得挂在的侧边栏view id

    constructor(context: vscode.ExtensionContext, viewId: string) { 
      this.context = context
      this.viewId = viewId
    }

    onDidChangeTreeData?: Event<void | TreeItem | TreeItem[] | null | undefined> | undefined;

    getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
        return element;
    }
    getChildren(element?: TreeItem | undefined): ProviderResult<TreeItem[]> {
        let arr: TreeItem[] = new Array();
        console.log(this.viewId)
        if (element == undefined) {
          // 分别为每个view添加子目录
          for (let v of toc[this.viewId as keyof typeof toc]) {
            let item = new TreeItem(v.title, TreeItemCollapsibleState.None)
            if ("des" in v) item.description = v.des
            item.resourceUri= vscode.Uri.file(`${this.context.extensionPath}/src/examples/${this.viewId}/${v.title}.py`)
            // 文档打开展示
            item.command = {
              command: "cfdsx.openExample",
              title: "打开",
              arguments: [item]
            }
            arr.push(item);
          }
          return arr;
        } 
    }
    getParent?(element: TreeItem): ProviderResult<TreeItem> {
        throw new Error("Method not implemented.");
    }
    resolveTreeItem?(item: TreeItem, element: TreeItem, token: CancellationToken): ProviderResult<TreeItem> {
        throw new Error("Method not implemented.");
    }
 
}

// 打开并展示
export function openExampleDoc(item:vscode.TreeItem) {
  console.log(item)
  const fp = item.resourceUri?.path.slice(1)
  if (fp) {
    vscode.workspace.openTextDocument(fp)
    .then(doc => vscode.window.showTextDocument(doc, {preserveFocus: true}))
  }
}