import type { NextPage } from 'next'
import { ReactElement, useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import { IStats } from '@/types'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { networkAlgorithms as algorithms } from '@/utils/algorithms'
import statsChart from '@/components/statsChart'

const inter = Inter({ subsets: ['latin'] })

async function getNetworkStats(): Promise<IStats[]> {
	console.log('Fetching network stats')
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/stats/networks?onlyGlobal=true`
	)

	if (response.ok) {
		const data = (await response.json()) as {
			stats: IStats[]
		}
		console.log(data)

		return data.stats.map((stat) => ({
			...stat,
			label: stat.label.replace('global_', '')
		}))
	}

	return []
}

const Page: NextPage = () => {
	const [networkStats, setNetworkStats] = useState<IStats[]>([])
	const [algorithm, setAlgorithm] = useState<string>(algorithms[0])

	useEffect(() => {
		try {
			const members = getNetworkStats().then((stats) => {
				setNetworkStats(stats)
			})
		} catch (error) {
			console.error(error)
			alert('Failed to fetch network stats')
			setNetworkStats([])
		}
	}, [])

	const algorithmOnChange = async (
		value: { label: string; id: string } | null
	) => {
		console.log('Mutating algorithm', { value })
		setAlgorithm(!value ? algorithms[0] : value.id)
	}

	const statsToShow = networkStats.filter((stat) => stat.type === algorithm)

	return (
		<div
			className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
		>
			<div className="flex flex-row w-52 w-max">
				<p className="text-5xl text-left">Influences Over Time</p>
			</div>
			<div className="flex justify-between p-24">
				<FormControl fullWidth className="flex">
					<InputLabel id="demo-simple-select-label">
						Algoritmo
					</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={algorithm}
						label="Age"
						onChange={(event, value) => {
							const props = (value as ReactElement)?.props as {
								children: string
								value: string
							}

							algorithmOnChange(
								props && {
									label: props.children,
									id: props.value
								}
							)
						}}
					>
						{' '}
						{algorithms.map((algorithm) => (
							<MenuItem key={algorithm} value={algorithm}>
								{algorithm}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			{statsToShow.length > 0 && statsChart(statsToShow)}
		</div>
	)
}

export default Page
