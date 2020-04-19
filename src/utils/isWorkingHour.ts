import moment from 'moment-timezone';

export const isWorkingHour = (datetime: moment.Moment) => {
    // 1 is Monday, 7 is Sunday
    const weekday = datetime.isoWeekday();
  
    if (weekday === 6 || weekday === 7) {
      console.log('isWorkingHour: false because it is a weekend');
      return false;
    }
  
    const hour = datetime.hour();
    if (hour < 8 || hour >= 16) {
      console.log('isWorkingHour: false because it is out of the working hours (08-00 - 16:00)');
      return false;
    }
  
    return true;
  }
  