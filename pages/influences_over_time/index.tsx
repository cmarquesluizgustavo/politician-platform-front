import type { NextPage } from 'next'
import { useCallback } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const Page: NextPage = () => {
	useCallback(async () => {
		const response = await fetch('/api/influences_over_time')

		if (response.ok) {
			const data = await response.json()
			console.log(data)
		}
	}, [])

	return (
		<div
			className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
		>
			<div className="flex flex-row w-52 w-max">
				<p className="text-5xl text-left">Influences Over Time</p>
			</div>
			<p>Coming soon...</p>
		</div>
	)
}

export default Page
