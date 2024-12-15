import { describe, expect, test, vi } from 'vitest';

import { getCandidateDates, convertToDisplayString } from './index'; // モジュール名を適切に変更してください。

vi.mock('./syukujitsu.csv?raw', () => {
	return {
		default: `
  2024/1/1,元日
  2024/2/11,建国記念の日
  2024/3/20,春分の日
    `.trim()
	};
});

describe('getCandidateDates', () => {
	test('特定の曜日のみを抽出する', () => {
		const startDate = new Date('2024-01-01'); // 月曜日
		const endDate = new Date('2024-01-07'); // 日曜日
		const days = ['monday', 'wednesday'] as const; // 月曜日と水曜日
		const result = getCandidateDates(startDate, endDate, [...days], false);

		const expectedDates = [new Date('2024-01-01'), new Date('2024-01-03')];
		expect(result).toEqual(expectedDates);
	});

	test('祝日を含む曜日を抽出する', () => {
		const startDate = new Date('2024-01-01'); // 月曜日
		const endDate = new Date('2024-01-07'); // 日曜日
		const days = ['monday', 'holiday'] as const; // 月曜日と祝日
		const result = getCandidateDates(startDate, endDate, [...days], false);

		const expectedDates = [new Date('2024-01-01')];
		expect(result).toEqual(expectedDates);
	});

	test('祝日を除外する', () => {
		const startDate = new Date('2024-01-01'); // 月曜日
		const endDate = new Date('2024-01-07'); // 日曜日
		const days = ['monday', 'wednesday', 'holiday'] as const; // 月・水・祝日
		const result = getCandidateDates(startDate, endDate, [...days], true);

		const expectedDates = [new Date('2024-01-03')]; // 月曜日は祝日なので除外
		expect(result).toEqual(expectedDates);
	});
});

describe('convertToDisplayString', () => {
	test('通常の日付を変換する', () => {
		const date = new Date('2024-01-03'); // 水曜日
		const result = convertToDisplayString(date);
		expect(result).toBe('1/3(水)');
	});

	test('祝日の日付を変換する', () => {
		const date = new Date('2024-01-01'); // 月曜日 (祝日)
		const result = convertToDisplayString(date);
		expect(result).toBe('1/1(月祝)');
	});
});
