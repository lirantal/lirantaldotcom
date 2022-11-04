import { createSignal, For } from 'solid-js';

const itemsSeed = [
	{
		title: 'Flowbite App',
		subtitle: 'Released on January 13',
		description: 'Flowbite is a new app that helps you manage your finances and keep track of your spending.',
		badge: 'New',
		type: 'recognition',
	},
	{
		title: 'Flowbite App 2',
		subtitle: 'Released on January 12',
		description: 'Flowbite is a new app that helps you manage your finances and keep track of your spending.',
		badge: '',
		type: 'award',
	}
]

export default function Changelog() {
	const [items, setItems] = createSignal(itemsSeed); 
	const filterItems = (type, e) => {
		const shouldBeListed = !!e.target.checked;	
		setItems((itemsCurrent) => {
			if (shouldBeListed) {
				const list = itemsCurrent.concat(itemsSeed.filter((item) => item.type === type));
				return list;
			} else {
				const list = itemsCurrent.filter((item) => item.type !== type);
				return list;
			}
		})

	}
	return (
		<>
			<section>
				<div class="max-w-6xl mx-auto px-4 sm:px-6 overflow-hidden py-10 md:py-10">
					<div class="flex flex-wrap md:-mx-8">
						<div class="w-full px-0 sm:px-8">
							<h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Categories</h3>
							<ul class="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
								<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
									<div class="flex items-center pl-3">
										<input
											id="vue-checkbox-list"
											type="checkbox"
											value=""
											checked
											class="w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
											onChange={(e) => filterItems('recognition', e)}
										/>
										<label
											for="vue-checkbox-list"
											class="py-3 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
										>
											Recognitions
										</label>
									</div>
								</li>
								<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
									<div class="flex items-center pl-3">
										<input
											id="react-checkbox-list"
											type="checkbox"
											value=""
											checked
											class="w-4 h-4 text-green-400 bg-gray-100 rounded border-gray-300 focus:ring-green-400 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
											onChange={(e) => filterItems('award', e)}
										/>
										<label for="react-checkbox-list" class="text-green-400 py-3 ml-2 w-full text-sm font-medium">
											Awards
										</label>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section>
				<div class="max-w-6xl mx-auto px-4 sm:px-6 overflow-hidden">
					<div class="py-12 md:py-20">
						<div class="">
							<div class="flex flex-wrap md:-mx-8">
								<div class="w-full lg:w-1/2 px-0 sm:px-8">
									<ol class="relative border-l border-gray-200 dark:border-gray-700">


									<For each={items()}>{(item, i) =>

										<li class="mb-10 ml-6">
											<span class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
												<svg
													aria-hidden="true"
													class="w-3 h-3 text-blue-600 dark:text-blue-400"
													fill="currentColor"
													viewBox="0 0 20 20"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fill-rule="evenodd"
														d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
														clip-rule="evenodd"
													></path>
												</svg>
											</span>
											<h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
												{item.title}
												{item.badge ? <span class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
													{item.badge}
												</span> : ''}
											</h3>
											<time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
												{item.subtitle}
											</time>
											<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
												{item.description}
											</p>
											<a
												href="#"
												class="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
											>
												<svg
													class="mr-2 w-4 h-4"
													fill="currentColor"
													viewBox="0 0 20 20"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fill-rule="evenodd"
														d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
														clip-rule="evenodd"
													></path>
												</svg>{' '}
												Download ZIP
											</a>
										</li>

									}</For>



									</ol>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
