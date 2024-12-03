<script lang="ts">
	import { onMount } from 'svelte';

	const capitalizeFirstLetter = (s: string): string => {
		return s.substring(0, 1).toUpperCase() + s.substring(1, s.length);
	};

	const dayKeyTitle = [
		['monday', '月'],
		['tuesday', '火'],
		['wednesday', '水'],
		['thursday', '木'],
		['friday', '金'],
		['saturday', '土'],
		['sunday', '日']
	] as const;
	const defaultCheckedDayKeys: (typeof dayKeyTitle)[number][0][] = ['saturday', 'sunday'];

	const holidayKeyTitle = [
		['ignore', '気にしない'],
		['include', '含める'],
		['exclude', '除く']
	] as const;
	const defaultCheckedHolidayKey: (typeof holidayKeyTitle)[number][0] = 'include';

	const defaultOptionsForEachDate: string[] = ['朝コマ', '昼コマ', '夜コマ'];

	let marked = $state(false);
	let copied = $state(false);
	onMount(() => {
		marked = true;

		(document.getElementById('optionsForEachDate') as HTMLTextAreaElement).value =
			defaultOptionsForEachDate.join('\n');
	});
</script>

<div class="my-container">
	<div class="description">
		<h1 class:marked>候補くん</h1>

		<p>出欠表作成サービス「調整さん」の<span class="ochame">勝手</span>姉妹サービス。</p>
		<p>日程候補の作成をお手伝いします！</p>
	</div>

	<form>
		<h3>条件</h3>

		<h4>期間</h4>
		<div class="period-container">
			<input class="form-control" type="date" name="period-start-date" />
			<span>～</span>
			<input class="form-control" type="date" name="period-end-date" />
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
						id="date-{dayKey}"
						checked={defaultCheckedDayKeys.includes(dayKey)}
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
					/>
					<label class="form-check-label" for="holiday{capitalizeFirstLetter(key)}">{title}</label>
				</div>
			{/each}
		</div>

		<h4>各候補日の選択肢</h4>
		<textarea class="form-control" id="optionsForEachDate" rows="5"></textarea>

		<button type="button" class="btn btn-primary icon-button">
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
		</button>
	</form>

	<span class="vertical-dots"></span>

	<div class="result">
		<h3>結果</h3>
		<textarea class="form-control" id="result" rows="20"></textarea>

		<button type="button" class="btn btn-primary icon-button">
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
			{/if}

			コピー！
		</button>
	</div>

	<div class="footer">
		Powered by <a href="https://www.orch-canvas.tokyo/">Orchestra Canvas Tokyo</a>
	</div>
</div>

<style lang="sass">
	* 
		font-family: 'M PLUS Rounded 1c', sans-serif
		font-weight: 400
		font-style: normal

	:global(body) 
		display: flex
		flex-direction: column
		align-items: center

		/* ドット斜め */
		background-image: radial-gradient(#fecba1 10%, transparent 20%), radial-gradient(#fecba1 10%, transparent 20%)
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
	
	/* 導入部のテキスト */
	.description 
		display: flex
		flex-direction: column
		align-items: center

	h1 
		display: inline
		margin: 0 0 20px
		padding: 0 10px

		font-weight: 700
		text-align: center

		background: linear-gradient(transparent 70%, #fecba1 30%)
		background-repeat: no-repeat
		background-size: 0% 100%
		transition: background-size 1s
	
	.marked 
		background-size: 100% 100%

	p 
		text-align: center

	.ochame 
		display: inline-block
		position: relative
		transform: translateX(12px) translateY(-15px) rotateZ(-22deg)
		margin-top: 25px
		&::before
			position: absolute
			content: ''
			width: 1px
			height: 100%
			background: #fd9843
			transform: translateX(-8px) rotateZ(-30deg)
		&::after
			position: absolute
			content: ''
			width: 1px
			height: 100%
			background: #fd9843
			transform: translateX(5px) rotateZ(30deg)
	
	/* フォーム */
	form 
		display: flex
		gap: 50px
		flex-direction: column
		align-items: center
	
	h3 
		border-bottom: dotted #fecba1 4px
		padding: 0 10px

	h4 
		font-size: 1.3rem
		margin-bottom: -40px
	
	.dash 
		letter-spacing: -1px
	
	.period-container,
	.date-container,
	.holiday-container 
		display: flex
		flex-wrap: wrap
		align-items: center
		justify-content: space-evenly
		gap: 20px
	
	.form-control 
		width: unset /* 100%指定を上書きする */

	.icon-button
		display: flex
		align-items: center
		gap: 10px

	.vertical-dots
		display: inline-block
		vertical-align: middle
		line-height: 1
		width: 5px
		height: 5px
		background: #fecba1
		border-radius: 50%
		box-shadow: 0 -12px 0 0 #fecba1, 0 12px 0 0 #fecba1

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
	.footer a
			color: #fd9843
</style>
