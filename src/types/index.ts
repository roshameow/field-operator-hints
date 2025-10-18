export interface OperatorInfo {
	name: string;
	category: string;
	definition: string;
	description: string;
}

export interface RegionMap {
	[region: string]: string[];
}

export interface SaFieldInfo {
	name: string;
	category: string;
}