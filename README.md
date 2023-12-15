# Tanatloc 3D

3D interface of [Tanatloc](https://tanatloc.com/) with extrac omponents.

## Usage

Tested in a [NextJS](https://nextjs.org/) application.

Include the `Canvas` component in `pages/_app.tsx` or `app/layout.tsx` depending on the router you use.

```ts
import dynamic from 'next/dynamic'
import { AppProps } from 'next/app'

import theme from '@/styles/theme'

const Canvas = dynamic(
  () => import('@airthium/tanatloc-3d').then((mod) => mod.default.Canvas),
  { ssr: false }
)

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <Canvas />
  </>
)

export default App
```

Use the `Renderer` component where you want in the application.

```ts
import dynamic from 'next/dynamic'
import { Tanatloc3DPart } from '@airthium/tanatloc-3d'

const Renderer = dynamic(
  () => import('@airthium/tanatloc-3d').then((mod) => mod.default.Renderer),
  { ssr: false }
)

import theme from '@/styles/theme'

const View: React.FunctionComponent = () => {
  //...

  return (
	<Renderer
	theme={theme}
	style={{ width: 'calc(100vw - 256px)' }}
	parts={parts as Tanatloc3DPart[]}
	selection={{
		enabled,
		part,
		type,
		highlighted,
		selected,
		point,
		onHighlight,
		onSelect,
		onPoint
	}}
	data={dataEnabled}
	postProcessing={postProcessingEnabled}
	snapshot={{
		project: {
		apiRoute: snapshot,
		size: { width: 2 * 260, height: 2 * 156 }
		}
	}}
	onData={onData}
	onPostProcessing={onPostProcessing}
	/>
  )
}

export default View
```

Use the `extra._404` component in the 404 page.

```ts
import dynamic from 'next/dynamic'

const NotFoundCone = dynamic(
  () => import('@airthium/tanatloc-3d').then((mod) => mod.default.extra._404),
  { ssr: false }
)

const NotFound: React.FunctionComponent = () => {
	//...

  return (
	{/* ... */}
	<NotFoundCone />
	{/* ... */}
  )
}

export default NotFound
```

Use the `extra.Background` component where you want a background.

```ts
import dynamic from 'next/dynamic'

const Background = dynamic(
  () =>
    import('@airthium/tanatloc-3d').then((mod) => mod.default.extra.Background),
  { ssr: false }
)

const WithBackground: React.FunctionComponent = () => {
  // ...

  return (
	{/* ... */}
	<Background />
	{/* ... */}
  )
}

export default WithBackground
```
