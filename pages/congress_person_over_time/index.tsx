import congressMemberData from '@/components/basicData'
import congressStatsChart from '@/components/statsChart'
import { Container } from '@/components/ui/container'
import { IStats } from '@/types'
import { congressAlgorithms as algorithms } from '@/utils/algorithms'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import type { NextPage } from 'next'

import { ReactElement, useEffect, useState } from 'react'

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
    <Container>
      <h1 className="text-5xl font-bold">Congressperson Over Time</h1>
      <div className="flex gap-4 mt-8">
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
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Algoritmo</InputLabel>
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
            {algorithms.map((algorithm) => (
              <MenuItem key={algorithm} value={algorithm}>
                {algorithm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="flex mt-8">
        {congressMember && (
          <div className="flex-1 ml-8">
            <h2 className="text-3xl font-bold">Congress Member Data</h2>
            <table className="table-auto mt-4">
              <tbody>
                {Object.entries(congressMember).map(([key, value]) => (
                  <tr key={key}>
                    <td className="border px-4 py-2">{key}</td>
                    <td className="border px-4 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {statsToShow.length > 0 && (
  			<div className="flex-1 ml-8">
    			<h2 className="text-3xl font-bold">Influences gain over time</h2>
    				{congressStatsChart(statsToShow)}
  			</div>
		)}
      </div>
    </Container>
  )
}

export default Page
