import basicData from '@/components/basicData'
import statsBarChart from '@/components/statsBarChart'
import { Container } from '@/components/ui/container'
import { IStats } from '@/types'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import type { NextPage } from 'next'
import { Inter } from 'next/font/google'
import { ReactElement, useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

async function getNetworkStats(network_id: number): Promise<IStats[]> {
    console.log('Fetching network stats')
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats/networks/${network_id}?onlyGlobal=true`
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

async function getNetworksIds(): Promise<{ label: string; id: string }[]> {
    console.log('Fetching network ids')
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/networks/ids`
    )

    if (response.ok) {
        const data = (await response.json()) as string[]

        console.log(data)

        return data.map((id) => ({
            label: id,
            id
        }))
    }

    return []
}

const Page: NextPage = () => {
    const [networkStats, setNetworkStats] = useState<IStats[]>([])
    const [networkId, setNetworkId] = useState<string>('56')
    const [networkIds, setNetworkIds] = useState<
        { label: string; id: string }[]
    >([{ label: '56', id: '56' }])

    useEffect(() => {
        getNetworksIds()
            .then((ids) => {
                setNetworkIds(ids)
            })
            .catch((error) => {
                console.error(error)
                alert('Failed to fetch networks ids')
                setNetworkIds([])
            })
        networkIdOnChange({ label: '56', id: '56' })
    }, [])

    const networkIdOnChange = async (
        value: { label: string; id: string } | null
    ) => {
        console.log('Mutating networkId', { value })
        setNetworkId(!value ? '' : value.id)

        if (value)
            getNetworkStats(Number(value.id)).then((stats) => {
                console.log({ stats })
                setNetworkStats(stats)
            })
    }

    const netStats = networkStats
        .filter((stat) => stat.type === 'network')
        .reduce((acc, stat) => {
            if (!acc[stat.label]) acc[stat.label] = stat.value

            return acc
        }, {} as Record<string, number>)

    return (
        <Container>
            <h1 className="text-5xl font-bold">Network Stats</h1>
            <div className="flex gap-4 mt-8">
                <FormControl className="flex">
                    <InputLabel id="demo-simple-select-label">
                        NetworkId
                    </InputLabel>
                    <Select
                        style={{ width: '100px' }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={networkId}
                        label="Network Id"
                        onChange={(event, value) => {
                            const props = (value as ReactElement)?.props as {
                                children: string
                                value: string
                            }

                            networkIdOnChange(
                                props && {
                                    label: props.children,
                                    id: props.value
                                }
                            )
                        }}
                    >
                        {networkIds.map(({ label, id }) => (
                            <MenuItem key={id} value={id}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className="flex mt-8">
                <div className="flex-1 ml-8">
                    {Object.keys(netStats).length > 0 && (
                        <>
                            <h2 className="text-3xl font-bold mb-4">Network Stats Basic Data</h2>
                            <table className="table-auto">
                                <tbody>
                                    {Object.entries(netStats).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="border px-4 py-2">{key}</td>
                                            <td className="border px-4 py-2">{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
                {networkStats.length > 0 && (
                    <div className="flex-1 ml-8">
                        <h2 className="text-3xl font-bold mb-4">Features Gains</h2>
                        {statsBarChart(networkStats)}
                    </div>
                )}
            </div>
        </Container>
    )
}

export default Page
