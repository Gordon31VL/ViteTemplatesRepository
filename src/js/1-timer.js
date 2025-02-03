import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let calculateTime = null;
const startButton = document.querySelector('[data-start]');
startButton.disabled = true;

const dataDays = document.querySelector('[data-days]');
const dataHours = document.querySelector('[data-hours]');
const dataMinutes = document.querySelector('[data-minutes]');
const dataSeconds = document.querySelector('[data-seconds]');

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    console.log(`Початкова дата: ${new Date()}`);
    console.log(`Кінцева дата: ${selectedDates[0]}`);

    if (selectedDates[0] < new Date()) {
      startButton.disabled = true;
      iziToast.error({
        titleColor: '#ffffff',
        messageColor: '#ffffff',
        color: '#EF4040',
        pauseOnHover: 'false',
        timeout: `5000`,
        iconUrl: '../img/bi_x-octagon.svg',
        title: 'Error',
        message: `Please choose a date in the future`,
      });
    } else {
      startButton.disabled = false;
      calculateTime = selectedDates[0] - new Date();
      writingTime(convertMs(calculateTime));
    }
  },
};

const datetimePicker = flatpickr('#datetime-picker', options);

startButton.addEventListener('click', event => {
  startButton.disabled = true;

  const timeCalculate = setInterval(() => {
    const timeLeft = userSelectedDate - new Date();

    if (timeLeft <= 0) {
      clearInterval(timeCalculate);
      console.log(`Відлік закінчено`);

      iziToast.success({
        title: 'Success',
        message: 'Countdown finished!',
      });
      return;
    }

    writingTime(convertMs(timeLeft));
  }, 1000);
});

function writingTime({ days, hours, minutes, seconds }) {
  dataDays.textContent = String(days).padStart(2, '0');
  dataHours.textContent = String(hours).padStart(2, '0');
  dataMinutes.textContent = String(minutes).padStart(2, '0');
  dataSeconds.textContent = String(seconds).padStart(2, '0');
}
