import Head from 'next/head'
import statsChart from '@/components/statsChart'
import { Container } from '@/components/ui/container'
import { IStats } from '@/types'
import { networkFeatures as algorithms } from '@/utils/algorithms'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import type { NextPage } from 'next'
import { Inter } from 'next/font/google'
import { ReactElement, useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

async function getNetworkStats(): Promise<IStats[]> {
	console.log('Fetching network stats')
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/stats/networks?type=network`
	)

	if (response.ok) {
		const data = (await response.json()) as {
			stats: IStats[]
		}
		console.log(data)

		return data.stats
	}

	return []
}

const Page: NextPage = () => {
	const [networkStats, setNetworkStats] = useState<IStats[]>([])
	const [algorithm, setAlgorithm] = useState<string>(algorithms[0])

	useEffect(() => {
		try {
			getNetworkStats().then((stats) => {
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
		<>
			<Head>
				<title>Networks Over Time</title>
				<meta
					name="description"
					content="Visualize how the networks features change over
							time."
				/>
			</Head>
			<Container>
				<h1 className="text-5xl font-bold">Networks Over Time</h1>
				<div className="flex mt-8">
					<div className="w-1/3 pr-4">
						<FormControl fullWidth className="flex">
							<InputLabel id="demo-simple-select-label">
								Similarity Algorithm
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={algorithm}
								label="Age"
								onChange={(event, value) => {
									const props = (value as ReactElement)
										?.props as {
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
								{algorithms.map((algorithm) => (
									<MenuItem key={algorithm} value={algorithm}>
										{algorithm}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
				</div>
				<div className="w-full mt-4">
					{statsToShow.length > 0 && statsChart(statsToShow, true)}
				</div>
			</Container>
		</>
	)
}

export default Page
