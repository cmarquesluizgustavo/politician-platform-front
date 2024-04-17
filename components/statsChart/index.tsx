import type { IStats } from '@/types'
import dynamic from 'next/dynamic'
import type { Layout, PlotData, PlotType } from 'plotly.js'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function statsChart(stats: IStats[]) {
	const statsByLabelNetworkType = stats.reduce((acc, stat) => {
		let title = `${stat.label}-${
			stat.network_id < 1000 ? 'legislature' : 'year'
		}`

		if (!acc[title]) {
			acc[title] = []
		}

		acc[title].push(stat)

		return acc
	}, {} as Record<string, IStats[]>)

	const minY = Math.min(...stats.map((stat) => stat.value))
	const maxY = Math.max(...stats.map((stat) => stat.value))

	const statsByLabelYear = Object.entries(statsByLabelNetworkType).reduce(
		(acc, [key, value]) => {
			const [label, networkType] = key.split('-')

			if (!acc[label]) {
				acc[label] = []
			}

			if (networkType === 'year') {
				acc[label].push(...value)
			}

			return acc
		},
		{} as Record<string, IStats[]>
	)

	const statsByLabelLegislature = Object.entries(
		statsByLabelNetworkType
	).reduce((acc, [key, value]) => {
		const [label, networkType] = key.split('-')

		if (!acc[label]) {
			acc[label] = []
		}

		if (networkType === 'legislature') {
			acc[label].push(...value)
		}

		return acc
	}, {} as Record<string, IStats[]>)

	const minXYear = Math.min(
		...Object.values(statsByLabelYear)
			.flat()
			.map((stats) => stats.network_id)
	)
	const maxXYear = Math.max(
		...Object.values(statsByLabelYear)
			.flat()
			.map((stats) => stats.network_id)
	)

	const minXLegislature = Math.min(
		...Object.values(statsByLabelLegislature)
			.flat()
			.map((stats) => stats.network_id)
	)

	const maxXLegislature = Math.max(
		...Object.values(statsByLabelLegislature)
			.flat()
			.map((stats) => stats.network_id)
	)

	const layout: Partial<Layout> = {
		xaxis: {
			title: 'Year',
			range: [minXYear, maxXYear]
		},
		xaxis2: {
			title: 'Legislature',
			range: [minXLegislature, maxXLegislature],
			overlaying: 'x',
			side: 'top'
			// type: 'category'
		},
		yaxis: {
			title: 'Similarity Index',
			range: [minY, maxY]
		},
		yaxis2: {
			// title: 'Per Legislature',
			range: [minY, maxY],
			overlaying: 'y',
			side: 'right'
		}
		// title: 'Congress Person Stats'
	}

	const data: Partial<PlotData>[] = [
		...Object.entries(statsByLabelYear).map(([label, stats]) => ({
			x: stats.map((stat) => stat.network_id).sort(),
			y: stats.map((stat) => stat.value).sort(),
			type: 'scatter' as PlotType,
			mode: 'lines+markers' as const,
			name: label,
			line: { color: label }
		})),
		...Object.entries(statsByLabelLegislature).map(([label, stats]) => ({
			x: stats.map((stat) => stat.network_id).sort(),
			y: stats.map((stat) => stat.value).sort(),
			type: 'scatter' as PlotType,
			mode: 'lines+markers' as const,
			name: label,
			xaxis: 'x2',
			yaxis: 'y2',
			line: { dash: 'dash', color: label },
			marker: { symbol: 'star' }
		}))
	].sort((a, b) => a.name.localeCompare(b.name))

	return (<div className='flex'><Plot data={data} layout={layout} /></div>)
}
