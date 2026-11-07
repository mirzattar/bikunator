import { Box, Card, Code, Heading, Text, Flex, Badge, type BadgeProps, Link } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import { highlightHTML } from '@speed-highlight/core'
import "@speed-highlight/core/themes/github-dark.css"
import { useEffect, useState } from 'react'
import "./index.css"

export function App({ sseEndpoint }: { sseEndpoint: string }) {
	const [ html, setHtml ] = useState('')
	const [ badgeText, setBadgeText ] = useState('Loading')
	const [ badgeColor, setBadgeColor ] = useState<BadgeProps[ 'color' ]>('yellow')

	const setBadge = (text: string, color: BadgeProps[ 'color' ]) => {
		setBadgeText(text)
		setBadgeColor(color)
	}

	useEffect(() => {
		const es = new EventSource(sseEndpoint)

		es.addEventListener<"message">("message", (ev: MessageEvent<string>) => {
			setBadge("OK", 'green')
			const formatted = JSON.parse(ev.data)

			highlightHTML(JSON.stringify(
				formatted, null, 2
			) ?? "", "json", {
				block: true,
				showLineNumbers: true
			}).then(
				res => setHtml(res)
			)
		})

		es.addEventListener<'open'>("open", () => {
			setBadge("Established", 'blue')
		})

		es.addEventListener<'error'>("error", ev => {
			setBadge(`Error (${ev.timeStamp})`, 'red')
		})

		return
	}, [])

	return (
		<Box style={ { position: "absolute", left: "50%", top: "50%", translate: "-50% -50%" } }>
			<Card size="4" style={ { minWidth: "50rem" } }>
				<Flex direction="column" gap="2">
					<Heading as="h1" size="9">Bikunator <Badge color={ badgeColor }>{ badgeText }</Badge></Heading>
					<Text as="p" size="4"><Code><Link href={ sseEndpoint } target="_blank">{ sseEndpoint }</Link></Code></Text>
					<Card className="shj-lang-json shj-block" style={ { overflowY: "scroll", height: "75vh", whiteSpace: "pre", fontFamily: "monospace" } } dangerouslySetInnerHTML={ { __html: html } }></Card>
				</Flex>
			</Card>
		</Box>
	)
}

export default App
