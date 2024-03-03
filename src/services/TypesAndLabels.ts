import axios from 'axios'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export const getTypes = async () => {
	const response = await axios.get(
		process.env.REACT_APP_API_URL + '/stats/types'
	)
	return response.data
}

export const getLabels = async () => {
	const response = await axios.get(
		process.env.REACT_APP_API_URL + '/stats/labels'
	)
	return response.data
}
