export class ResponseDto<T> {
  statusCode: number | undefined;
  message: string | undefined;
  data: T | undefined;
}
