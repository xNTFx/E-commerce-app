export default function getCurrentDateWithoutSeconds() {
  const now = new Date();
  now.setMilliseconds(0);
  now.setSeconds(0);
  return now;
}
