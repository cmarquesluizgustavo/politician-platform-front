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

interface CongressMember extends Record<string, string | number | Buffer> {
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
  photo: Buffer
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

    // Check if photo exists in the data
    const photoResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/congressperson/${id}/photo`
    )
    if (photoResponse.ok) {
      const photoData = await photoResponse.json()
      data.photo = Buffer.from(photoData.photo.data) // Convert photo data to Buffer

    }

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
        sx={{ width: 800}} // Adjust the width as per your preference
        renderInput={(params) => (
          <TextField {...params} label="Congressperson" />
        )}
        onChange={(event, value) =>
          congressMemberOnChange(event, value)
        }
        className="flex"
      />

      <FormControl fullWidth sx={{ minWidth: 20 }}> {/* Adjust the minimum width as per your preference */}
        <InputLabel id="demo-simple-select-label">Similarity Algorithm</InputLabel>
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
          sx={{ fontSize: 14 }} // Adjust the font size as per your preference
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
      <div className="flex-1">
      {congressMember && (
        <div className="ml-8">
          <h2 className="text-3xl font-bold">Congress Member Data</h2>
          <img
            src={`data:image/png;base64,${congressMember.photo}`}
            alt={congressMember.name}
            className="mt-4"
            style={{ maxWidth: '200px' }} // Adjust the max width as per your preference
          />
            <table className="table-auto mt-4">
              <tbody>
                {Object.entries(congressMember).map(([key, value]) => {
                  // Define label mappings with capitalization
                  const labelMappings: Record<string, string> = {
                    name: 'Name',
                    birth_state: 'Birth State',
                    education: 'Education',
                    birth_date: 'Birth Date',
                    sex: 'Sex',
                    cpf: 'CPF',
                    social_network: 'Social Networks',
                    occupation: 'Occupation',
                    ethnicity: 'Ethnicity'
                  };
                  // print ethiniticy value to terminal for debugging
                  console.log(key, value)
                  // Check conditions for rendering
                  // remove photo from the table
                  if (key === 'photo') {
                    return null;
                  }
                  if ((key === 'social_network' && value == "[]") ||
                      (key === 'ethnicity' && value === 'NaN') ||
                      (key === 'occupation' && value === 'other')) {
                    return null; // Skip rendering this row
                  }

                  // Convert key to capitalized label
                  const label = labelMappings[key] || key;
                  const capitalizedKeys = ['name', 'education', 'occupation', 'ethnicity'];
                  const isCapitalized = capitalizedKeys.includes(key);
                  const formattedValue = isCapitalized && typeof value === 'string'
                    ? value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
                    : value;


                  return (
                    <tr key={key}>
                      <td className="border px-4 py-3 font-bold">{label}</td>
                      <td className="border px-4 py-2">{key === 'birth_date' ? new Date(value).toLocaleDateString() : formattedValue}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="flex-1 ml-8">
        {statsToShow.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold">Influences gain over time</h2>
            {congressStatsChart(statsToShow)}
          </div>
        )}
      </div>
    </div>

    </Container>
  
  )
}

export default Page
