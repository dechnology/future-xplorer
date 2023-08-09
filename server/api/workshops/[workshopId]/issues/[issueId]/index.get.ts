export default defineEventHandler((event) => ({
  workshop: getWorkshop(),
  issue: getIssue(),
}));
