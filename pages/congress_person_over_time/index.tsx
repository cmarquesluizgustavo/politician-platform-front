import type { NextPage } from 'next'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import congressMemberData from '@/components/congressMemberData'
import congressStatsChart from '@/components/statsChart'
import { IStats } from '@/types'
import { congressAlgorithms as algorithms } from '@/utils/algorithms'

const inter = Inter({ subsets: ['latin'] })

interface CongressMember extends Record<string, string | number> {
	id: number
	name: string
	birth_state: string
	education: string
	birth_date: string
	sex: string
	cpf: string
	social_network: string
	occupation: string
	ethnicity: string
}

async function getCongressMembers(): Promise<{ id: number; label: string }[]> {
	console.log('Fetching congress members')
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/congressperson`
	)

	if (response.ok) {
		const data = (await response.json()) as {
			members: { id: number; name: string }[]
		}
		console.log(data)

		return data.members.map(({ id, name }) => ({ id, label: name }))
	}

	return []
}

async function getCongressMember(id: number): Promise<CongressMember> {
	console.log('Fetching congress member')
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/congressperson/${id}`
	)

	if (response.ok) {
		const data = await response.json()
		console.log(data)

		return data
	}

	throw new Error('Failed to fetch congress member')
}

async function getCongresspersonStats(
	congressperson_id: number
): Promise<IStats[]> {
	console.log('Fetching congressperson stats')
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/stats/congressperson/${congressperson_id}`
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
	const [congressMembers, setCongressMembers] = useState<
		{ id: number; label: string }[]
	>([])

	const [congressMember, setCongressMember] = useState<CongressMember | null>(
		null
	)

	const [congressStats, setCongressStats] = useState<IStats[]>([])

	const [algorithm, setAlgorithm] = useState<string>(algorithms[0])

	useEffect(() => {
		try {
			const members = getCongressMembers().then((members) => {
				setCongressMembers(members)
			})
		} catch (error) {
			console.error(error)
			alert('Failed to fetch congress members')
			setCongressMembers([])
		}
	}, [])

	const congressMemberOnChange = async (
		_: any,
		value: { label: string; id: number } | null
	) => {
		console.log(`selecionei`, { value })

		if (!value) {
			setCongressMember(null)
			setCongressStats([])
			return
		}

		try {
			const [member, stats] = await Promise.all([
				getCongressMember(value.id),
				getCongresspersonStats(value.id)
			])
			setCongressMember(member)
			setCongressStats(stats)
		} catch (error) {
			console.error(error)
			alert('Failed to fetch congress member')
			setCongressMember(null)
			setCongressStats([])
		}
	}

	const algorithmOnChange = async (
		value: { label: string; id: string } | null
	) => {
		console.log('Mutating algorithm', { value })
		setAlgorithm(!value ? algorithms[0] : value.id)
	}

	const statsToShow = congressStats.filter((stat) => stat.type === algorithm)

	return (
		<div
			className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
		>
			<div className="flex flex-row w-52 w-max">
				<p className="text-5xl text-left">Congress Person Over Time</p>
			</div>
			<div className="flex justify-between">
				<Autocomplete
					disablePortal
					id="combo-box-demo"
					options={congressMembers}
					sx={{ width: 300 }}
					renderInput={(params) => (
						<TextField {...params} label="Congressistas" />
					)}
					onChange={(event, value) =>
						congressMemberOnChange(event, value)
					}
					className="flex"
				/>
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
			{congressMember && congressMemberData(congressMember)}
			{statsToShow.length > 0 && congressStatsChart(statsToShow)}
		</div>
	)
}

export default Page
