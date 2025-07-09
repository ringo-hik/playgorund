import * as vscode from 'vscode';
import { createIcon, getContextIcon } from '../utils/iconUtils';

export class PumbaTreeProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (!element) {
      return this.getRootItems();
    }
    return this.getChildItems(element);
  }

  private getRootItems(): TreeItem[] {
    const items: TreeItem[] = [];

    // PUMBA 설정 항목
    const configItem = new TreeItem(
      'PUMBA Configuration',
      vscode.TreeItemCollapsibleState.Expanded,
      'pumbaConfig'
    );
    configItem.iconPath = getContextIcon('config');
    configItem.tooltip = 'Configure PUMBA build settings';
    items.push(configItem);

    // 빌드 실행 항목
    const buildItem = new TreeItem(
      'Remote Build',
      vscode.TreeItemCollapsibleState.Expanded,
      'pumbaBuild'
    );
    buildItem.iconPath = createIcon('cloud', new vscode.ThemeColor('charts.blue'));
    buildItem.tooltip = 'Start remote build with current workspace';
    items.push(buildItem);

    // 빌드 히스토리 항목
    const historyItem = new TreeItem(
      'Build History',
      vscode.TreeItemCollapsibleState.Collapsed,
      'pumbaHistory'
    );
    historyItem.iconPath = getContextIcon('history');
    historyItem.tooltip = 'View recent PUMBA build results';
    items.push(historyItem);

    return items;
  }

  private getChildItems(element: TreeItem): TreeItem[] {
    const items: TreeItem[] = [];

    switch (element.contextValue) {
      case 'pumbaConfig':
        items.push(new TreeItem(
          'Compiler: gcc10',
          vscode.TreeItemCollapsibleState.None,
          'configItem'
        ));
        items.push(new TreeItem(
          'Build Type: debug',
          vscode.TreeItemCollapsibleState.None,
          'configItem'
        ));
        items.push(new TreeItem(
          'Tests: unit, integration',
          vscode.TreeItemCollapsibleState.None,
          'configItem'
        ));
        
        const editConfigItem = new TreeItem(
          'Edit Configuration',
          vscode.TreeItemCollapsibleState.None,
          'editConfig'
        );
        editConfigItem.iconPath = createIcon('edit', new vscode.ThemeColor('charts.orange'));
        editConfigItem.command = {
          command: 'buildAgent.editPumbaConfig',
          title: 'Edit PUMBA Configuration'
        };
        items.push(editConfigItem);
        break;

      case 'pumbaBuild':
        const startBuildItem = new TreeItem(
          'Start Build',
          vscode.TreeItemCollapsibleState.None,
          'startBuild'
        );
        startBuildItem.iconPath = createIcon('play', new vscode.ThemeColor('charts.green'));
        startBuildItem.command = {
          command: 'buildAgent.pumbaBuild',
          title: 'Start PUMBA Build'
        };
        items.push(startBuildItem);

        items.push(new TreeItem(
          'Workspace: Current',
          vscode.TreeItemCollapsibleState.None,
          'info'
        ));
        items.push(new TreeItem(
          'Status: Ready',
          vscode.TreeItemCollapsibleState.None,
          'info'
        ));
        break;

      case 'pumbaHistory':
        items.push(new TreeItem(
          'Build #123 - Success (2h ago)',
          vscode.TreeItemCollapsibleState.None,
          'historyItem'
        ));
        items.push(new TreeItem(
          'Build #122 - Failed (4h ago)',
          vscode.TreeItemCollapsibleState.None,
          'historyItem'
        ));
        items.push(new TreeItem(
          'Build #121 - Success (1d ago)',
          vscode.TreeItemCollapsibleState.None,
          'historyItem'
        ));
        break;
    }

    return items;
  }
}

class TreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue?: string
  ) {
    super(label, collapsibleState);
  }
}