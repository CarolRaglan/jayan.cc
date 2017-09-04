export default function validate(err) {
  
  let obj = err.jqXHR.responseJSON.errors;
  for (let tem in obj) {
    return obj[tem];
  }
  
}
