export const errHandler = (statusCode , message)=>{
    const error = new Error(message);
    error.statusCode = statusCode;
    console.error(error);  // Logging the error for debugging
    return error;
}