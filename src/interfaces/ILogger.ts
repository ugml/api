export default interface ILogger {
  error(message: string);
  warn(message: string);
  info(message: string);
  log(message: string);
}
