import RuleBuilder from "src/ruleBuilder";
import { DEFAULT_SETTINGS } from "./setting";

@RuleBuilder.register
export class AddEmptyLineAfterListBlocks extends RuleBuilder {
	constructor() {
		super(
			"addEmptyLineAfterListBlocks",
			"为多种列表最后一行添加空行",
			DEFAULT_SETTINGS["addEmptyLineAfterListBlocks"],
			1
		);
	}

	applyUser(text: string): string {
		// 匹配一个列表项开头的正则表达式（支持多级缩进）
		// - 普通列表: -, *, +
		// - 有序列表: 1. 2)
		// - 任务列表: - [ ], - [x]
		const listItemRegex = /^\s*(?:-\s+|\*\s+|\+\s+|\d+[.)]\s+|- \[[ x]\])/;
		const codeBlockRegex = /^```/;

		const lines = text.split("\n");
		const resultLines: string[] = [];

		let isCodeBlockSeparation = false;

		if (lines.length === 0) {
			return "";
		}

		for (let i = 0; i < lines.length; i++) {
			const currentLine = lines[i];
			const isCurrentLineListItem = listItemRegex.test(currentLine);

			if (codeBlockRegex.test(currentLine)) {
				isCodeBlockSeparation = !isCodeBlockSeparation;
				resultLines.push(currentLine);
				continue;
			}
			// 我们需要检查前一行，所以从第二行开始判断
			if (i > 0) {
				const previousLine = lines[i - 1];
				const isPreviousLineListItem = listItemRegex.test(previousLine);

				// 核心逻辑：如果前一行是列表项，而当前行不是，
				// 并且当前行不是一个纯粹的空行（允许列表项之间有空行），
				// 那么就证明一个列表块刚刚结束。
				if (
					isPreviousLineListItem &&
					!isCurrentLineListItem &&
					currentLine.trim() !== "" &&
					!isCodeBlockSeparation
				) {
					// 在当前非列表行之前，插入一个空行
					resultLines.push("");
				}
			}

			// 将当前行加入结果数组
			resultLines.push(currentLine);
		}

		// 单独处理最后一行：如果整个文档以一个列表项结束，也需要在其后添加一个空行。
		const lastLine = lines[lines.length - 1];
		if (listItemRegex.test(lastLine)) {
			resultLines.push("");
		}

		return resultLines.join("\n");
	}
}
