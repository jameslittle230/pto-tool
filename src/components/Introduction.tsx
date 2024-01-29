export const Introduction = () => (
  <div className="prose leading-snug">
    <h1>PTO Calculator</h1>
    <p>
      This tool helps you keep track of your balance of paid time off over the
      course of a long period of time. It's designed to work with the way my
      company does PTO, but it might work for yours, too.
    </p>
    <p>Here's how this tool works:</p>
    <ul>
      <li>
        Enter the date when you last accrued PTO and the amount of PTO you had
        on that day.
      </li>
      <li>Click on the calendar to mark days off.</li>
      <li>Hover over the chart to see your balance on any given day.</li>
    </ul>
    <p>Everything you enter will be saved to your browser's local storage.</p>
  </div>
);
