export declare const PRIMARY_CHECKOUT: string;
export declare const CHECKOUT_URLS: { readonly primary: string };
export declare const CHECKOUT_PATH_REDIRECTS: ReadonlyMap<string, string>;
export declare function resolveCheckoutPathRedirect(pathname: string): string | null;
