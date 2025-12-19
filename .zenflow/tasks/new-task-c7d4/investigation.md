# Investigation: Analytics warnings (WebView unsupported)

## Bug summary
On the Analytics screen, the chart areas show red text warnings:

> React Native WebView does not support this platform.

This happens when viewing `localhost:8081/analytics` (Expo web).

## Reproduction
1. Run the app for web: `npm run web` (or `expo start --web`).
2. Navigate to the Analytics tab/route.
3. If there is expense data (so charts render), the chart areas show the warning instead of charts.

## Root cause analysis
`app/(tabs)/analytics.tsx` uses `react-native-webview` to render ECharts charts from HTML strings:

- `import { WebView } from 'react-native-webview';`
- Two `<WebView source={{ html: ... }} />` blocks.

`react-native-webview` does not support the `web` platform. On web, it exports a stub component that renders the warning text (“React Native WebView does not support this platform.”). Because the Analytics route is being rendered in the browser (`localhost:8081`), those stubs appear.

## Affected components
- `app/(tabs)/analytics.tsx`: both charts are implemented via `<WebView />`.
- Web builds (`expo start --web` / `npm run web`).

## Proposed solution
Guard `WebView` usage by platform and provide a web-safe fallback:

- Minimal: `Platform.OS === 'web'` → render a friendly placeholder (“Charts aren’t supported on web yet”) instead of `<WebView />`.
- Better: implement charts for web using a DOM-based chart library (e.g. ECharts React wrapper) and keep WebView for iOS/Android.
- Alternative: replace WebView+ECharts with a cross-platform RN charting approach already in the repo (e.g. `react-native-chart-kit` + `react-native-svg`), if it meets design needs.

## Edge cases / side effects
- The current charts load ECharts via a remote CDN inside the WebView; on native devices with restricted network access/offline mode, the charts can also fail to render (blank). If we keep WebView, bundling the chart library locally would be more reliable.
- The warning only appears when `chartData.categoryData.length > 0` (the branch that renders the charts). For empty data, the empty state is shown and no warning appears.

## Implementation notes
- Implemented a web/native split for chart rendering.
  - `components/analytics/AnalyticsCharts.web.tsx` renders a web-safe fallback.
  - `components/analytics/AnalyticsCharts.native.tsx` keeps the existing ECharts-in-WebView rendering for iOS/Android.
  - `components/analytics/AnalyticsCharts.tsx` selects the correct implementation at runtime.
- `app/(tabs)/analytics.tsx` now renders `<CategoryChart />` and `<DailyChart />` instead of using `WebView` directly.
- Also fixed a minor mutation bug by changing `chartData.categoryData.sort(...)` to `chartData.categoryData.slice().sort(...)` when computing “Top Category”.

## Testing notes
- No Jest/Vitest/Detox test harness was found in this repo (no `*.test.*`, `__tests__`, or test scripts in `package.json`).

## Test results
- `npm run lint` (passes; warnings pre-existing in other files).
- `npm run typecheck` (passes). The TS config excludes `supabase/functions/**` since those are Deno-based and not typecheckable with the app’s `tsconfig.json`.
- Manual: opening `localhost:8081/analytics` no longer shows “React Native WebView does not support this platform.”; the analytics section shows the fallback breakdown instead.
