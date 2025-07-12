import { ApplyFunction, Rule, registerRule } from "./rules";

export abstract class RuleBuilderBase {
	static getRule(this: new () => RuleBuilder): Rule {
		const build = new this();
		const rule = new Rule(
			build.alias,
			build.description,
			build.enable,
			build.priority,
			build.apply
		);
		return rule;
	}
}

export default abstract class RuleBuilder extends RuleBuilderBase {
	alias: string;
	description: string;
	enable: boolean;
	apply: ApplyFunction;
	priority: number;

	constructor(
		alias: string,
		description: string,
		enable: boolean,
		priority: number
	) {
		super();
		this.alias = alias;
		this.description = description;
		this.enable = enable;
		this.priority = priority;
		this.apply = this.applyUser;
	}

	static register(RuleBuilderClass: typeof RuleBuilderBase & (new() => RuleBuilder)): void {
		const rule = RuleBuilderClass.getRule();
		registerRule(rule);
	}

	abstract applyUser(text: string): string;
}
