export const TRIAL = 'Trial';
export const OPPORTUNIST = 'Opportunist';
export const RUNNER = 'Runner';
export const VISIONARY = 'Visionary';

export const licenseNameToLevel = (value) => {
  switch (value) {
    case TRIAL:
      return 1;
    case OPPORTUNIST:
      return 2;
    case RUNNER:
      return 3;
    case VISIONARY:
      return 4;
    default:
      return 1;
  }
};

export const convertMiliseconds = (mili, remove = '') => {
  let d, h, m, s;
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  d = Math.floor((mili / day) % (24 * 60));
  h = Math.floor((mili / hour) % 24);
  m = Math.floor((mili / minute) % 60);
  s = Math.floor((mili / second) % 60);
  if (s < 10) s = '0' + s;
  if (m < 10) m = '0' + m;
  if (h < 10) h = '0' + h;
  if (remove === 's') return d + 'd : ' + h + 'h : ' + m + 'm';
  else if (remove === 'm') return d + 'd : ' + h + 'h';
  else if (remove === 'h') return  d + 'd';
  else return d + 'd : ' + h + 'h : ' + m + 'm : ' + s + 's';
};
