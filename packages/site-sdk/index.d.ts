export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	publishedAt: string | null;
	category: string | null;
	tags: string[];
	url: string;
	markdownUrl: string;
}

export interface BlogPostCollection {
	name: string;
	description: string;
	count: number;
	items: BlogPost[];
}

export interface ClientOptions {
	baseUrl?: string;
	fetchImpl?: typeof fetch;
}

export interface RequestOptions {
	signal?: AbortSignal;
}

export declare class LirantalSiteClient {
	constructor(options?: ClientOptions);
	listPosts(options?: RequestOptions): Promise<BlogPostCollection>;
	searchPosts(query: string, options?: RequestOptions & { limit?: number }): Promise<BlogPost[]>;
}
