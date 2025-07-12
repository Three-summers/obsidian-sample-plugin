export class Rule {
	alias: string;
	description: string;
	enable: boolean;
	priority: number;
	apply: ApplyFunction;

	constructor(
		alias: string,
		description: string,
		enable: boolean,
		priority: number,
		apply: ApplyFunction
	) {
		this.alias = alias;
		this.description = description;
		this.enable = enable;
		this.apply = apply;
		this.priority = priority;
	}
}

export const rules: Rule[] = [];

export function registerRule(rule: Rule) {
	rules.push(rule);
}

export type ApplyFunction = (text: string) => string;

export function sortRules() {
	rules.sort((a, b) => a.priority - b.priority);
}
