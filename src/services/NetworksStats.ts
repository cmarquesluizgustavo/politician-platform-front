import axios from 'axios'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export const getAllNetworks = async (type: string) => {
	const response = await axios.get(
		process.env.REACT_APP_API_URL + '/stats/networks/' + type
	)
	return response.data
}

export const getNetwork = async (type: string, network_id: number) => {
	const response = await axios.get(
		process.env.REACT_APP_API_URL +
			'/stats/networks/' +
			type +
			'/' +
			network_id
	)
	return response.data
}
