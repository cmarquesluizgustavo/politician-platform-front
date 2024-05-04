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

    const layoutYear: Partial<Layout> = {
        xaxis: {
            title: 'Year',
            range: [minXYear, maxXYear]
        },
        yaxis: {
            title: 'Similarity Gain',
            range: [minY, maxY]
        }
    }

    const layoutLegislature: Partial<Layout> = {
        xaxis: {
            title: 'Legislature',
            range: [minXLegislature, maxXLegislature]
        },
        yaxis: {
            title: 'Similarity Gain',
            range: [minY, maxY]
        }
    }

    const dataYear: Partial<PlotData>[] = Object.entries(statsByLabelYear).map(([label, stats]) => ({
        x: stats.map((stat) => stat.network_id).sort(),
        y: stats.map((stat) => stat.value).sort(),
        type: 'scatter' as PlotType,
        mode: 'lines+markers' as const,
        name: label,
        line: { color: label }
    }))

    const dataLegislature: Partial<PlotData>[] = Object.entries(statsByLabelLegislature).map(([label, stats]) => ({
        x: stats.map((stat) => stat.network_id).sort(),
        y: stats.map((stat) => stat.value).sort(),
        type: 'scatter' as PlotType,
        mode: 'lines+markers' as const,
        name: label,
        line: { color: label },
        marker: { symbol: 'dot', size: 5}
    }))

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                <Plot data={dataYear} layout={layoutYear} />
            </div>
            <div>
                <Plot data={dataLegislature} layout={layoutLegislature} />
            </div>
        </div>
    )
}
