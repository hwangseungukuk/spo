export default function ({ redirect }) {
  console.log('MAINTENANCE_MODE', process.env.MAINTENANCE_MODE);
  if (process.env.MAINTENANCE_MODE === 'true') {
    window.location.href = '/maintenance.html';
  }
}
