export interface MyPluginSettings {
	[key: string]: boolean;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	addEmptyLineAfterListBlocks: true,
	removeEmptyLines: true,
};
