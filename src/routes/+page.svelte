<script lang="ts">
	import { convertToDisplayString, dayKeyTitle, getCandidateDates } from '$lib';
	import { onMount } from 'svelte';
	import oct from './oct.svg';
	import { MetaTags } from 'svelte-meta-tags';

	// フォーム値の初期値を設定
	const defaultCheckedDayKeys: (typeof dayKeyTitle)[number][0][] = [
		'saturday',
		'sunday',
		'holiday'
	];
	const defaultOptionsForEachDate: string[] = ['朝コマ', '昼コマ', '夜コマ'];
	const optionsSepator = '\n';
	let formValues = $state({
		period: {
			startDate: '',
			endDate: ''
		},
		days: defaultCheckedDayKeys as (typeof dayKeyTitle)[number][0][],
		excludeHoliday: false,
		optionsForEachDate: defaultOptionsForEachDate.join(optionsSepator)
	});

	// LocalStorageから値を復元
	onMount(() => {
		formValues.period.startDate =
			localStorage.getItem('formValues.period.startDate') || formValues.period.startDate;
		formValues.period.endDate =
			localStorage.getItem('formValues.period.endDate') || formValues.period.endDate;
		formValues.days = JSON.parse(
			localStorage.getItem('formValues.days') || JSON.stringify(formValues.days)
		);
		formValues.excludeHoliday =
			localStorage.getItem('formValues.excludeHoliday') === 'true' || formValues.excludeHoliday;
		formValues.optionsForEachDate =
			localStorage.getItem('formValues.optionsForEachDate') || formValues.optionsForEachDate;
	});

	// LocalStorageに値を保存
	$effect(() => {
		localStorage.setItem('formValues.period.startDate', formValues.period.startDate);
		localStorage.setItem('formValues.period.endDate', formValues.period.endDate);
		localStorage.setItem('formValues.days', JSON.stringify(formValues.days));
		localStorage.setItem('formValues.excludeHoliday', formValues.excludeHoliday.toString());
		localStorage.setItem('formValues.optionsForEachDate', formValues.optionsForEachDate);
	});

	let resultTextArea = $state() as HTMLTextAreaElement;
	let result = $derived.by(() => {
		// バリデーション
		// 入力されていること、大小関係が維持されていること

		// 生成
		const startDate = new Date(formValues.period.startDate);
		const endDate = new Date(formValues.period.endDate);

		// 候補日程を抽出
		const candidateDates = getCandidateDates(
			startDate,
			endDate,
			formValues.days,
			formValues.excludeHoliday
		);

		// 候補文字列を作成
		const candidates: string[] = [];
		candidateDates.forEach((date) => {
			const displayDateString = convertToDisplayString(date);
			formValues.optionsForEachDate.split(optionsSepator).forEach((option) => {
				if (formValues.optionsForEachDate !== '' && option === '') return;
				candidates.push(displayDateString + ' ' + option);
			});
		});

		return candidates.join('\n');
	});

	// コピーボタンの状態を管理するrune
	let copied = $state(false);

	const meta = {
		title: '候補くん',
		description: '出欠表作成サービス「調整さん」の日程候補作成をお手伝いします！',
		canonicalUrl: 'https://kouhokun.orch-canvas.tokyo/'
	};
</script>

<MetaTags
	title={meta.title}
	description={meta.description}
	canonical={meta.canonicalUrl}
	twitter={{
		cardType: 'summary',
		title: meta.title,
		description: meta.description,
		image: 'https://kouhokun.orch-canvas.tokyo/web-app-manifest-512x512.png',
		imageAlt: '候補くんのアイコン'
	}}
/>

<div class="my-container">
	<div class="description">
		<h1 class="marking">候補くん</h1>

		<p>出欠表作成サービス「調整さん」の<span class="ochame poping">非公式</span>姉妹サービス。</p>
		<p>「この期間の土日祝日、午後か夜で調整をしたい……」</p>
		<p>そんなアナタの日程候補作成をお手伝いします！</p>
	</div>

	<span class="vertical-dots"></span>

	<form>
		<h3>条件</h3>

		<h4>期間</h4>
		<div class="period-container">
			<input
				class="form-control"
				type="date"
				name="period-start-date"
				bind:value={formValues.period.startDate}
			/>
			<span>～</span>
			<input
				class="form-control"
				type="date"
				name="period-end-date"
				bind:value={formValues.period.endDate}
			/>
		</div>

		<h4>曜日</h4>
		<div class="date-container">
			{#each dayKeyTitle as [dayKey, dayTitle]}
				<div class="form-check form-switch">
					<input
						class="form-check-input"
						type="checkbox"
						role="switch"
						name="date-{dayKey}"
						value={dayKey}
						id="date-{dayKey}"
						checked={defaultCheckedDayKeys.includes(dayKey)}
						bind:group={formValues.days}
					/>
					<label class="form-check-label" for="date-{dayKey}">{dayTitle}</label>
				</div>
			{/each}
		</div>

		<div class="excludeHoliday-container">
			<div class="form-check">
				<input
					class="form-check-input"
					type="checkbox"
					id="excludeHoliday"
					name="excludeHoliday"
					bind:checked={formValues.excludeHoliday}
				/>
				<label class="form-check-label" for="excludeHoliday"> 祝日を候補から除く</label>
			</div>
		</div>
		<p class="supplement-text">
			<span>対応期間: 1995&ndash;2025</span>
			<span>次回更新: 2025年2月</span>
		</p>

		<h4>各日程の選択肢</h4>
		<textarea
			class="form-control"
			id="optionsForEachDate"
			rows="5"
			bind:value={formValues.optionsForEachDate}
		></textarea>
	</form>

	<span class="vertical-dots"></span>

	<div class="result">
		<h3 id="result-header">結果</h3>
		<textarea
			class="form-control"
			id="result"
			rows="20"
			value={result}
			bind:this={resultTextArea}
			readonly
		></textarea>

		<button
			type="button"
			class="btn btn-orange-primary icon-button"
			onclick={() => {
				resultTextArea.select();
				document.execCommand('copy');

				copied = true;
				setTimeout(() => {
					copied = false;
				}, 5000);
			}}
		>
			{#if copied}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-clipboard-check"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"
					/>
					<path
						d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"
					/>
					<path
						d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"
					/>
				</svg>
				コピー完了！
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-clipboard"
					viewBox="0 0 16 16"
				>
					<path
						d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"
					/>
					<path
						d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"
					/>
				</svg>
				コピー！
			{/if}
		</button>
	</div>

	<span class="vertical-dots"></span>

	<div class="footer-container">
		<div class="footer-row">
			<span>Powered by</span>
			<a href="https://www.orch-canvas.tokyo/">
				<img src={oct} alt="Orchestra Canvas Tokyo" />
			</a>
		</div>
		<a href="https://github.com/orchestra-canvas-tokyo/kouhokun/tree/main" class="footer-row">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-github"
				viewBox="0 0 16 16"
			>
				<path
					d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
				/>
			</svg>
			<span>orchestra-canvas-tokyo/kouhokun</span>
		</a>
	</div>
</div>

<style lang="sass">
	$orange: #fd9843
	$light-orange: #fecba1
	$lighter-orange: #ffe5d0

	*
		font-family: 'M PLUS Rounded 1c', sans-serif
		font-weight: 400
		font-style: normal
			
		& ::selection,
		input::-webkit-datetime-edit-day-field:focus,
		input::-webkit-datetime-edit-month-field:focus,
		input::-webkit-datetime-edit-year-field:focus 
			color: black
			background-color: $lighter-orange

	:global(body)
		display: flex
		flex-direction: column
		align-items: center

		// ドット斜め
		background-image: radial-gradient($light-orange 10%, transparent 20%), radial-gradient($light-orange 10%, transparent 20%)
		background-size: 30px 30px
		background-position: 0 0, 15px 15px
		background-attachment: fixed

	.my-container
		display: flex
		flex-direction: column
		align-items: center
		gap: 80px

		margin: 40px
		border-radius: 20px
		padding: 40px
		min-height: calc(100dvh - 2 * 40px)
		width: calc(100dvw - 2 * 40px)
		max-width: 800px

		background-color: white

	/* テキスト */
	.description
		display: flex
		flex-direction: column
		align-items: center

	h1
		display: inline
		margin: 60px 0 20px
		padding: 0 10px

		font-weight: 700
		text-align: center

	h3
		border-bottom: dotted $orange 4px
		padding: 0 10px

	h4
		font-size: 1.3rem
		margin-bottom: -40px
		
	p
		text-align: center
	
	.supplement-text
		display: flex
		gap: 15px
		margin-top: -40px
		font-size: small
		color: grey

	.marking
		background: linear-gradient(transparent 70%, $light-orange 30%)
		background-repeat: no-repeat
		animation: .5s ease-out .5s 1 mark

	@keyframes mark
		from
			background-size: 0% 100%
		to
			background-size: 100% 100%

	.ochame
		display: inline-block
		position: relative
		margin-top: 25px
		transform: translateX(15px) translateY(-15px) rotateZ(-15deg)
		&::before
			position: absolute
			content: ''
			width: 1px
			height: 100%
			background: $orange
			transform: translateX(-8px) rotateZ(-30deg)
		&::after
			position: absolute
			content: ''
			width: 1px
			height: 100%
			background: $orange
			transform: translateX(5px) rotateZ(30deg)
		
	.poping
		animation: .25s linear 1.5s 2 pop
	
	@keyframes pop
		0%
			transform: translateX(15px) translateY(-15px) rotateZ(-15deg)
		50%
			transform: translateX(15px) translateY(-20px) rotateZ(-15deg)
		0%
			transform: translateX(15px) translateY(-15px) rotateZ(-15deg)

	/* フォーム */
	.btn-orange-primary
		--bs-btn-bg: #{$light-orange}
		--bs-btn-border-color: #{$light-orange}
		--bs-btn-hover-bg: #{$lighter-orange}
		--bs-btn-hover-border-color: #{$light-orange}
		--bs-btn-focus-shadow-rgb: #{$lighter-orange}
		--bs-btn-active-color: var(--bs-btn-hover-color)
		--bs-btn-active-bg: #{$lighter-orange}
		--bs-btn-active-border-color: #{$light-orange}

	form
		display: flex
		gap: 50px
		flex-direction: column
		align-items: center

	.period-container,
	.date-container,
	.excludeHoliday-container
		display: flex
		flex-wrap: wrap
		align-items: center
		justify-content: space-evenly
		gap: 20px
	
	.excludeHoliday-container
		margin-top: -40px

	.form-control
		width: unset // 100%指定を上書きする

	.form-control:focus,
	.form-check-input:focus
		border-color: $light-orange
		box-shadow: 0 0 0 .25rem $lighter-orange
	
	
	.form-check-input:checked
		background-color: $orange
		border-color: $orange

	.form-switch .form-check-input:focus
		--bs-form-switch-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23ffe5d0'/%3e%3c/svg%3e")

	textarea,
	textarea.form-control // .form-control指定を上書きできるよう
		width: 250px
		max-width: calc(100dvw - 2 * 2 * 40px)

	.vertical-dots
		display: inline-block
		vertical-align: middle
		line-height: 1
		width: 5px
		height: 5px
		background: $orange
		border-radius: 50%
		box-shadow: 0 -12px 0 0 $orange, 0 12px 0 0 $orange

	/* 結果 */
	.result
		display: flex
		gap: 50px
		flex-direction: column
		align-items: center

	/* フッター */
	.footer-container
		display: flex
		flex-direction: column
		align-items: center
		gap: 15px
		font-size: clamp(.5rem, 3.4dvw, .8rem)
		filter: opacity(60%)
		& a
			color: black
			text-decoration: unset
		& img
			height: 2em
	.footer-row
		display: flex
		align-items: center
		gap: .5em
</style>
