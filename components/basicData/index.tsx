import * as React from 'react'

const removeKeys = ['social_network']

export default function basicData(
	data: Record<string, string | number>,
	title: string
) {
	return (
		<div className="flex flex-col width-max">
			<h1>{title}</h1>{' '}
			{Object.entries(data)
				.filter(
					([key]) =>
						!removeKeys.includes(key) &&
						data[key] !== null &&
						data[key] !== 'NaN'
				)
				.map(([key, value]) => (
					<div key={key} className="flex width-max">
						<label htmlFor={key}>{key}:&nbsp;</label>
						<input
							type="text"
							id={key}
							value={value}
							disabled={true}
						/>
					</div>
				))}
		</div>
	)
}
