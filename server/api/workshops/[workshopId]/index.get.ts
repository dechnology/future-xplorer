export default defineEventHandler((event) => ({
  workshop: getWorkshop(),
  issues: getIssues(10),
}));
