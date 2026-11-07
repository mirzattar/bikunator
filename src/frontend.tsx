/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react"
import { createRoot, type Root } from "react-dom/client"
import { App } from "./App"
import { Theme, ThemePanel } from "@radix-ui/themes"

const elem = document.getElementById("root")!
const app = (
	<StrictMode>
		<Theme accentColor="yellow" radius="small" appearance="dark">
			<App sseEndpoint="https://api.v2.bikun.ui.ac.id/sse" />
			<ThemePanel />
		</Theme>
	</StrictMode>
)

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
type HotData = { root?: Root };
((import.meta.hot.data as HotData).root ??= createRoot(elem)).render(app)
