export class ResponseUtil {
  static success(
    data: any,
    message: string = 'Success!',
    statusCode: number = 200,
  ) {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static error(
    message: string = 'Failed',
    statusCode: number = 500,
    errors: any = null,
  ) {
    return {
      success: false,
      statusCode,
      message,
      errors,
    };
  }
}
