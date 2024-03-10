import type { IStats } from '@/types'
import dynamic from 'next/dynamic'
import type { Layout, PlotData, PlotType } from 'plotly.js'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function statsBarChart(stats: IStats[]) {
	const statsByAlgorithm = stats.reduce((acc, stat) => {
		if (['node', 'network'].includes(stat.type)) return acc

		if (!acc[stat.type]) acc[stat.type] = []

		acc[stat.type].push(stat)

		return acc
	}, {} as Record<string, IStats[]>)

	const layout: Partial<Layout> = {}

	console.log({ statsByAlgorithm, stats })

	if (Object.keys(statsByAlgorithm).length === 0) return null

	const data: Partial<PlotData>[] = [
		...Object.entries(statsByAlgorithm).map(([algorithm, stats]) => ({
			x: stats.map((stat) => stat.label).sort(),
			y: stats.map((stat) => stat.value).sort(),
			type: 'bar' as PlotType,
			name: algorithm,
			orientation: 'v' as const
		}))
	].sort((a, b) => a.name.localeCompare(b.name))

	return <Plot data={data} layout={layout} />
}
