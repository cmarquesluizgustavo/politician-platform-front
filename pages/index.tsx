import { Inter } from 'next/font/google'
import Link from 'next/link'
import Head from 'next/head'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	const particlesInit = async (main: any) => {
		// Initialize tsparticles instance
		await loadFull(main)
	}

	const particlesOptions = {
		background: {
			color: {
				value: '#ffffff' // Set background color to white
			}
		},
		fpsLimit: 60,
		interactivity: {
			events: {
				onHover: {
					enable: true,
					mode: 'repulse'
				},
				onClick: {
					enable: true,
					mode: 'push'
				}
			},
			modes: {
				repulse: {
					distance: 50 // Reduce repulse distance for subtle effect
				},
				push: {
					quantity: 2 // Reduce particle quantity on click for subtle effect
				}
			}
		},
		particles: {
			color: {
				// color must be dark grey
				value: '#333333'
			},
			links: {
				color: '#cccccc',
				distance: 150, // Shorter link distance for a less overwhelming effect
				enable: true,
				opacity: 0.5, // Lower opacity for subtle links
				width: 1 // Thinner link lines
			},
			collisions: {
				enable: true
			},
			move: {
				direction: 'none' as const,
				enable: true,
				outModes: {
					default: 'bounce' as const
				},
				random: false,
				speed: 1, // Reduce speed for subtle movement
				straight: false
			},
			number: {
				density: {
					enable: true,
					area: 800
				},
				value: 50 // Reduce number of particles
			},
			opacity: {
				value: 0.3 // Lower opacity for subtle particles
			},
			shape: {
				type: 'circle' as const
			},
			size: {
				value: { min: 1, max: 3 } // Reduce size range for more subtle particles
			}
		},
		detectRetina: true
	}

	return (
		<>
			<Head>
				<title>Análise das Redes de Co-autoria</title>
			</Head>
			<Particles
				className="absolute inset-0 -z-10"
				init={particlesInit}
				options={particlesOptions}
			/>
			<main
				className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
			>
				<div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
					<a
						href="https://github.com/cmarquesluizgustavo/Politicians/"
						className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
						target="_blank"
						rel="noopener noreferrer"
					>
						Uma Plataforma para Análise da Rede de Co-autoria de
						<br />
						Projetos de Lei entre Deputados Federais
					</a>
					<div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
						<a
							className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
							href="https://www.linkedin.com/in/luizgustavomarques/"
							target="_blank"
							rel="noopener noreferrer"
						>
							por Luiz Gustavo Costa Marques de Oliveira
						</a>
					</div>
				</div>
				<div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
					<Link
						href="./influences_over_time"
						className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
						target="_blank"
						rel="noopener noreferrer"
					>
						<h2 className={`mb-3 text-2xl font-semibold`}>
							Influências pelo tempo{' '}
						</h2>
						<p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
							Visualize como a influência de uma característica
							muda ao longo do tempo.
						</p>
					</Link>
					<Link
						href="./feature_over_time"
						className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
						target="_blank"
						rel="noopener noreferrer"
					>
						<h2 className={`mb-3 text-2xl font-semibold`}>
							Característica <br />
							pelo tempo{' '}
							<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
						</h2>
						<p
							className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}
						>
							Visualize como diferentes rótulos de uma
							característica variaram ao longo do tempo.
						</p>
					</Link>

					<Link
						href="./congress_person_over_time"
						className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
					>
						<h2 className={`mb-3 text-2xl font-semibold`}>
							Congressista pelo tempo{' '}
							<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
						</h2>
						<p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
							Visualize como as características de um dado
							congressista mudaram ao longo do tempo.
						</p>
					</Link>
					<Link
						href="./networks_over_time"
						className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
						target="_blank"
						rel="noopener noreferrer"
					>
						<h2 className={`mb-3 text-2xl font-semibold`}>
							Redes pelo tempo{' '}
							<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
						</h2>
						<p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
							Visualize como as características de rede mudaram ao
							longo do tempo.
						</p>
					</Link>

					<Link
						href="./network_stats"
						className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
						rel="noopener noreferrer"
					>
						<h2 className={`mb-3 text-2xl font-semibold`}>
							Estatísticas de Rede{' '}
							<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
						</h2>
						<p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
							Escolha uma rede para ver os dados de influências e
							estatísticas.
						</p>
					</Link>
				</div>
			</main>
		</>
	)
}
