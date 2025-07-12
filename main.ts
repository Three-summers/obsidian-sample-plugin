import {
	App,
	MarkdownView,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

import { rules, sortRules } from "src/rules";
import { DEFAULT_SETTINGS, MyPluginSettings } from "src/rules/setting";
import "src/ruleRegistert";

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		sortRules();
		this.addRibbonIcon("dice", "Run Plugin", (evt: MouseEvent) => {
			const activeView =
				this.app.workspace.getActiveViewOfType(MarkdownView);

			if (activeView?.getMode() == "source") {
				const editor = activeView.editor;
				let originalText = editor.getValue();

				for (const rule of rules) {
					if (this.settings[rule.alias]) {
						originalText = rule.apply(originalText);
					}
				}
				editor.setValue(originalText);

				new Notice("处理完毕");
			} else {
				new Notice("错误，请在编辑视图下操作");
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		for (const rule of rules) {
			new Setting(containerEl)
				.setName(rule.alias)
				.setDesc(rule.description)
				.addToggle((toggle) =>
					toggle
						.setValue(this.plugin.settings[rule.alias])
						.onChange(async (value) => {
							this.plugin.settings[rule.alias] = value;
							await this.plugin.saveSettings();
						})
				);
		}
	}
}
