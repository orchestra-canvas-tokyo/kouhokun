<script lang="ts">
	import { convertToDisplayString, dayKeyTitle, getCandidateDates, holidayKeyTitle } from '$lib';
	import { onMount } from 'svelte';

	const capitalizeFirstLetter = (s: string): string => {
		return s.substring(0, 1).toUpperCase() + s.substring(1, s.length);
	};

	// フォーム値の初期値を設定
	const defaultCheckedDayKeys: (typeof dayKeyTitle)[number][0][] = ['saturday', 'sunday'];
	const defaultCheckedHolidayKey: (typeof holidayKeyTitle)[number][0] = 'include';
	const defaultOptionsForEachDate: string[] = ['朝コマ', '昼コマ', '夜コマ'];
	const optionsSepator = '\n';
	let formValues = $state({
		period: {
			startDate: '',
			endDate: ''
		},
		days: defaultCheckedDayKeys as (typeof dayKeyTitle)[number][0][],
		holiday: defaultCheckedHolidayKey as (typeof holidayKeyTitle)[number][0],
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
		formValues.holiday =
			(localStorage.getItem('formValues.holiday') as (typeof holidayKeyTitle)[number][0]) ||
			formValues.holiday;
		formValues.optionsForEachDate =
			localStorage.getItem('formValues.optionsForEachDate') || formValues.optionsForEachDate;
	});

	// LocalStorageに値を保存
	$effect(() => {
		localStorage.setItem('formValues.period.startDate', formValues.period.startDate);
		localStorage.setItem('formValues.period.endDate', formValues.period.endDate);
		localStorage.setItem('formValues.days', JSON.stringify(formValues.days));
		localStorage.setItem('formValues.holiday', formValues.holiday);
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
			formValues.holiday
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
</script>

<div class="my-container">
	<div class="description">
		<h1 class="marking">候補くん</h1>

		<p>出欠表作成サービス「調整さん」の<span class="ochame poping">非公式</span>姉妹サービス。</p>
		<p>日程候補の作成をお手伝いします！</p>
	</div>

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

		<h4>祝日を<span class="dash">――</span></h4>
		<div class="holiday-container">
			{#each holidayKeyTitle as [key, title]}
				<div class="form-check">
					<input
						class="form-check-input"
						type="radio"
						name="holiday"
						id="holiday{capitalizeFirstLetter(key)}"
						value={key}
						checked={defaultCheckedHolidayKey === key}
						bind:group={formValues.holiday}
					/>
					<label class="form-check-label" for="holiday{capitalizeFirstLetter(key)}">{title}</label>
				</div>
			{/each}
		</div>
		<p class="supplement-text">対応期間：1995&ndash;2025　次回更新：2025年2月</p>

		<h4>各日程の選択肢</h4>
		<textarea
			class="form-control"
			id="optionsForEachDate"
			rows="5"
			bind:value={formValues.optionsForEachDate}
		></textarea>

		<!-- <button type="button" class="btn btn-orange-primary icon-button">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-magic"
				viewBox="0 0 16 16"
			>
				<path
					d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707zM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1zM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707zM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0z"
				/>
			</svg>
			<span>候補を生成！</span>
		</button> -->
	</form>

	<span class="vertical-dots"></span>

	<div class="result">
		<h3 id="result-header">結果</h3>
		<textarea class="form-control" id="result" rows="20" value={result} bind:this={resultTextArea} readonly
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

	<div class="footer">
		Powered by <a href="https://www.orch-canvas.tokyo/">Orchestra Canvas Tokyo</a>
	</div>
</div>

<style lang="sass">
	@import "../../node_modules/bootstrap/scss/functions"
	@import '../../node_modules/bootstrap/scss/_variables'

	$orange: $orange-400
	$light-orange: $orange-200
	$lighter-orange: $orange-100

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

	.dash
		letter-spacing: -1px
	
	.supplement-text
		margin-top: -40px
		font-size: small
		color: grey

	.marking
		background: linear-gradient(transparent 70%, $light-orange 30%)
		background-repeat: no-repeat
		animation: .5s ease-out 0s 1 mark

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
		animation: .25s linear 1s 2 pop
	
	@keyframes pop
		0%
			transform: translateX(15px) translateY(-15px) rotateZ(-15deg)
		50%
			transform: translateX(15px) translateY(-20px) rotateZ(-15deg)
		0%
			transform: translateX(15px) translateY(-15px) rotateZ(-15deg)

	/* フォーム */
	.btn-orange-primary
		--bs-btn-color: #{$gray-800}
		--bs-btn-bg: #{$light-orange}
		--bs-btn-border-color: #{$light-orange}
		--bs-btn-hover-color: #{$gray-800}
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
	.holiday-container
		display: flex
		flex-wrap: wrap
		align-items: center
		justify-content: space-evenly
		gap: 20px

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

	#result
		width: 500px
		max-width: calc(100dvw - 2 * 2 * 40px)

	/* フッター */
	.footer
		font-size: clamp(.5rem, 3.4dvw, .8rem)
		& a
			color: $orange
</style>
