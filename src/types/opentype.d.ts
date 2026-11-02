declare module '@shuding/opentype.js' {
	const opentype: {
		parse(data: ArrayBuffer): {
			charToGlyphIndex(character: string): number;
			getAdvanceWidth(text: string, fontSize: number): number;
		};
	};
	export default opentype;
}
