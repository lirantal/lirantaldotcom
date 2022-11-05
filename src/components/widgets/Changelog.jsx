import { createSignal, For } from 'solid-js';
import itemsSeed from '~/data/recognitions.json';

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
		});
	};
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
											id="praise-checkbox-list"
											type="checkbox"
											value=""
											checked
											class="w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
											onChange={(e) => filterItems('praise', e)}
										/>
										<label
											for="vue-checkbox-list"
											class="py-3 ml-2 w-full text-sm font-medium text-red-900 dark:text-red-300"
										>
											Recognitions
										</label>
									</div>
								</li>
								<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
									<div class="flex items-center pl-3">
										<input
											id="award"
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
								<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
									<div class="flex items-center pl-3">
										<input
											id="shoutout"
											type="checkbox"
											value=""
											checked
											class="w-4 h-4 text-purple-400 bg-gray-100 rounded border-gray-300 focus:ring-purple-400 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
											onChange={(e) => filterItems('shoutout', e)}
										/>
										<label for="react-checkbox-list" class="text-purple-400 py-3 ml-2 w-full text-sm font-medium">
											Shoutout
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
										<For each={items()}>
											{(item, i) => (
												<li class="mb-10 ml-6">
													{item.type === 'praise' && (
														<span class="flex absolute -left-3 justify-center items-center w-6 h-6  rounded-full ring-6 ring-white dark:ring-white-900 dark:bg-white-900">
															🙌
														</span>
													)}

													{item.type === 'shoutout' && (
														<span class="flex absolute -left-3 justify-center items-center w-6 h-6  rounded-full ring-6 ring-white dark:ring-white-900 dark:bg-white-900">
															🎉
														</span>
													)}

													{item.type === 'award' && (
														<span class="flex absolute -left-3 justify-center items-center w-6 h-6  rounded-full ring-6 ring-white dark:ring-white-900 dark:bg-white-900">
															<div class="flex items-center text-yellow-300">
																<svg
																	aria-hidden="true"
																	class="w-7 h-7"
																	fill="currentColor"
																	viewBox="0 0 20 20"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
																</svg>
															</div>
														</span>
													)}

													<figure class="max-w-screen-md">
														{item.type === 'award' && (
															<>
																<h1 class="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h1>
																<blockquote>
																	<p class="text-sm font-base text-gray-900 dark:text-white">{item.description}</p>
																</blockquote>
															</>
														)}

														{(item.type === 'praise' || item.type === 'shoutout') && (
															<blockquote>
																<p class="text-lg font-semibold text-gray-900 dark:text-white">"{item.description}"</p>
															</blockquote>
														)}

														<a href={item.href}>
															<span class="mt-2 inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
																<svg
																	class="mr-2 w-4 h-4"
																	aria-hidden="true"
																	focusable="false"
																	data-prefix="fab"
																	data-icon="twitter"
																	role="img"
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 512 512"
																>
																	<path
																		fill="currentColor"
																		d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"
																	></path>
																</svg>
																{item.date}
															</span>
														</a>

														<figcaption class="flex items-center mt-6 space-x-3">
															{item.medium === 'twitter' && item.username ? (
																<img
																	class="w-6 h-6 rounded-full"
																	src={`https://unavatar.io/twitter/${item.username}`}
																	alt="profile picture"
																/>
															) : (
																<img class="w-6 h-6 rounded-full" src={item.profile_image} alt="profile picture" />
															)}

															<div class="flex items-center divide-x-2 divide-gray-300 dark:divide-gray-700">
																<span class="pr-3 font-sm text-gray-900 dark:text-slate-300">{item.name}</span>
																<cite class="pl-3 text-sm font-light text-gray-500 dark:text-gray-400">
																	{item.role}
																</cite>
															</div>
														</figcaption>
													</figure>
												</li>
											)}
										</For>
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
