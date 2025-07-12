import RuleBuilder from "src/ruleBuilder";
import { DEFAULT_SETTINGS } from "./setting";

@RuleBuilder.register
export class RemoveEmptyLines extends RuleBuilder {
	constructor() {
		super("removeEmptyLines", "去除多余的空行", DEFAULT_SETTINGS["removeEmptyLines"], 0);
	}

	applyUser(text: string): string {
		const removeEmptyLineRegex = /(^\s*\n|\r\n|\n)[\t\s]*(\r\n|\n)/g;
		return text.replace(removeEmptyLineRegex, "\n");
	}
}
