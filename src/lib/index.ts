import syukujitsu from './syukujitsu.csv?raw';

export const dayKeyTitle = [
	['monday', '月'],
	['tuesday', '火'],
	['wednesday', '水'],
	['thursday', '木'],
	['friday', '金'],
	['saturday', '土'],
	['sunday', '日'],
	['holiday', '祝']
] as const;

export const getCandidateDates = (
	startDate: Date,
	endDate: Date,
	days: (typeof dayKeyTitle)[number][0][],
	excludeHoliday: boolean
): Date[] => {
	const result: Date[] = [];

	for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
		const dayOptions = [
			'sunday',
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday'
		] as const;
		const currentDay = dayOptions[d.getDay()];

		const isHoliday = checkIfHoliday(d);

		let includeFlag = false;
		if (days.includes(currentDay)) includeFlag = true;
		if (days.includes('holiday') && isHoliday) includeFlag = true;
		if (isHoliday && excludeHoliday) includeFlag = false;

		if (includeFlag) result.push(new Date(d));
	}

	return result;
};

const holidays = syukujitsu.split('\n').map((row) => row.split(',')[0]);
const checkIfHoliday = (d: Date): boolean => {
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	const date = d.getDate();
	const dateString = `${year}/${month}/${date}`;

	return holidays.includes(dateString);
};

export const convertToDisplayString = (d: Date): string => {
	const month = d.getMonth() + 1;
	const date = d.getDate();

	let day = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
	if (checkIfHoliday(d)) day += '祝';

	return `${month}/${date}(${day})`;
};
