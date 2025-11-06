// src/types/global.d.ts
export { }

declare global {
    interface Window {
        Android: {
            openInBrowser(url: string): void,
            openInWebView(url: string): void
        }
    }
}
