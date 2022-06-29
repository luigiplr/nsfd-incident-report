import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html className="h-full bg-gray-100">
            <Head />

            <body className="h-full">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
