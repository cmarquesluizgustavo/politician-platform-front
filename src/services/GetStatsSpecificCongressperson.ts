import axios from 'axios'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export const getStatsSpecificCongressperson = async (
	congressperson_id: number,
	type: string
) => {
	const response = await axios.get(
		process.env.REACT_APP_API_URL +
			'/stats/congressperson/' +
			congressperson_id
	)
	return response.data
}

export const getCongresspersonIdByName = async (name: string) => {
	const response = await axios.get(
		process.env.REACT_APP_API_URL + '/congressperson/name/' + name
	)
	return response.data
}
