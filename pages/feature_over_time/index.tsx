import statsChart from '@/components/statsChart'
import { Container } from '@/components/ui/container'
import { IStats } from '@/types'
import { networkAlgorithms as algorithms } from '@/utils/algorithms'
import { featuresSimilarity as features } from '@/utils/features'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import type { NextPage } from 'next'

import { ReactElement, useEffect, useState } from 'react'

async function getFeatureStats(feature: string): Promise<IStats[]> {
	console.log('Fetching feature stats')
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/stats/features/${feature}`
	)

	if (response.ok) {
		const data = (await response.json()) as {
			stats: IStats[]
		}
		console.log(data)

		return data.stats.map((stat) => ({
			...stat,
			label: stat.label.includes('global_') ? `avg ${feature}` : stat.label
		}))
	}

	return []
}

const Page: NextPage = () => {
	const [feature, setFeature] = useState<string>(features[0])
	const [featureStats, setFeatureStats] = useState<IStats[]>([])
	const [algorithm, setAlgorithm] = useState<string>(algorithms[0])

	useEffect(() => {
		try {
			getFeatureStats(feature).then((stats) => {
				setFeatureStats(stats)
			})
		} catch (error) {
			console.error(error)
			alert('Failed to fetch stats')
			setFeatureStats([])
		}
	}, [feature])

	const algorithmOnChange = async (
		value: { label: string; id: string } | null
	) => {
		console.log('Mutating algorithm', { value })
		setAlgorithm(!value ? algorithms[0] : value.id)
	}

	const featureOnChange = async (
		value: { label: string; id: string } | null
	) => {
		console.log('Mutating feature', { value })
		setFeature(!value ? features[0] : value.id)
	}

	const statsToShow = featureStats.filter((stat) => stat.type === algorithm)

	return (
		<Container>		
			<h1 className="text-5xl font-bold">Feature Over Time</h1>
			<div className="flex gap-4 mt-8">
				<FormControl fullWidth>
					<InputLabel id="demo-simple-select-label">
						Feature
					</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={feature}
						label="Feature"
						onChange={(event, value) => {
							const props = (value as ReactElement)?.props as {
								children: string
								value: string
							}

							featureOnChange(
								props && {
									label: props.children,
									id: props.value
								}
							)
						}}
					>
						{features.map((feature) => (
							<MenuItem key={feature} value={feature}>
								{feature}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl fullWidth>
					<InputLabel id="demo-simple-select-label">
						Algorithm
					</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={algorithm}
						label="Algorithm"
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
						{algorithms.map((algorithm) => (
							<MenuItem key={algorithm} value={algorithm}>
								{algorithm}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			{statsToShow.length > 0 && statsChart(statsToShow, true)}
		</Container>
	)
}

export default Page
