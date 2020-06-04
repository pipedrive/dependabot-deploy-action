import moment from 'moment-timezone';
import { isWorkingHour } from './isWorkingHour';

describe(isWorkingHour.name, () => {
  const workingHours = [
    moment('2020-04-17 07:00'),
    moment('2020-04-17 16:59'),
    moment('2020-04-17 07:00'),
  ];

  const notWorkingHours = [
    moment('2020-04-18 07:00'),
    moment('2020-04-18 16:59'),
    moment('2020-04-18 07:00'),
    moment('2020-04-17 06:59'),
    moment('2020-04-17 17:00'),
  ];

  it.each(workingHours)('should return true', (datetime) => {
    const result = isWorkingHour(datetime);

    expect(result).toBe(true);
  });

  it.each(notWorkingHours)('should return false', (datetime) => {
    const result = isWorkingHour(datetime);

    expect(result).toBe(false);
  });
});
