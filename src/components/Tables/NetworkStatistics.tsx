import React from 'react'

interface NetworkStatistics {
	diameter: number
	edges: number
	clustering: number
	totalProposals: number
}

interface NetworkStatisticsTableProps {
	statistics: NetworkStatistics
}

const NetworkStatisticsTable: React.FC<NetworkStatisticsTableProps> = ({
	statistics
}) => {
	return (
		<table>
			<tbody>
				<tr>
					<td>Diâmetro</td>
					<td>{statistics.diameter}</td>
				</tr>
				<tr>
					<td>Arestas</td>
					<td>{statistics.edges}</td>
				</tr>
				<tr>
					<td>Clusterização</td>
					<td>{statistics.clustering}</td>
				</tr>
				<tr>
					<td>Quantidade total de propostas</td>
					<td>{statistics.totalProposals}</td>
				</tr>
			</tbody>
		</table>
	)
}

export default NetworkStatisticsTable
