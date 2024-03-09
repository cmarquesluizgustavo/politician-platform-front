import * as React from 'react'

export default function congressMemberData(
	data: Record<string, string | number>
) {
	return (
		<div>
			<h1>Congress Member Data</h1>
			{Object.entries(data).map(([key, value]) => (
				<div key={key}>
					<label htmlFor={key}>{key}:</label>
					<input type="text" id={key} value={value} disabled={true} />
				</div>
			))}
		</div>
	)
}
