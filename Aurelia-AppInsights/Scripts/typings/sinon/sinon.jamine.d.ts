declare module jasmine {
	interface Matchers {
		toHaveBeenCalledOnce(): boolean;
		toHaveBeenCalledTwice(): boolean;
		toHaveBeenCalledThrice(): boolean;
		toHaveBeenCalledBefore(before: any): boolean;
		toHaveBeenCalledAfter(after: any): boolean;
		toHaveBeenCalledOn(context: any): boolean;
		toHaveBeenCalledWith(context: any): boolean;
		toHaveBeenAlwaysCalledWith(context: any): boolean;
		toHaveBeenCalledWithExactly(...args: any[]): boolean;
		toHaveBeenAlwaysCalledWithExactly(...args: any[]): boolean;
		toHaveBeenCalledWithMatch(...args: SinonMatcher[]): boolean;
		toHaveBeenAlwaysCalledWithMatch(...args: SinonMatcher[]): boolean;
		toHaveBeenCalledWithNew(): boolean;
		toHaveBeenNeverCalledWith(withObj: any): boolean;
		toHaveBeenNeverCalledWithMatch(...args: SinonMatcher[]): boolean;
		toHaveAlwaysThrown(err?: any): boolean;
		toHaveReturned(ret: any): boolean;
		toHaveAlwaysReturned(ret: any): boolean;
	}
}