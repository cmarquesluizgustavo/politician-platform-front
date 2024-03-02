import React from 'react'

interface Deputy {
	id: string
	name: string
	influence: number
}

interface InfluentialCongresspeopleTableProps {
	congresspeople: Deputy[]
}

const InfluentialCongresspeopleTable: React.FC<
	InfluentialCongresspeopleTableProps
> = ({ congresspeople }) => {
	return (
		<table>
			<thead>
				<tr>
					<th>Nome</th>
					<th>Influência</th>
				</tr>
			</thead>
			<tbody>
				{congresspeople.map((deputy) => (
					<tr key={deputy.id}>
						<td>{deputy.name}</td>
						<td>{deputy.influence}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default InfluentialCongresspeopleTable
