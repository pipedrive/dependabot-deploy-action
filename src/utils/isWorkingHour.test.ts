import { isWorkingHour } from './isWorkingHour';
import moment from 'moment-timezone';

describe(isWorkingHour.name, () => {
    const workingHours = [
        moment('2020-04-17 08:00'),
        moment('2020-04-17 15:59'),
        moment('2020-04-17 08:00')
    ];

    const notWorkingHours = [
        moment('2020-04-18 08:00'),
        moment('2020-04-18 15:59'),
        moment('2020-04-18 08:00')
    ];


    it.each(workingHours)('should return true', (datetime) => {

        const result = isWorkingHour(datetime);

        expect(result).toBe(true);
    })

    it.each(notWorkingHours)('should return false', (datetime) => {

        const result = isWorkingHour(datetime);

        expect(result).toBe(false);
    })
})