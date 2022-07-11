function saveTheCookieForToken(token) {
    let today = new Date();
    let expire = new Date(); 
   
    let cookie_name = "username_form"; 
    let number_of_days = 1; 

    expire.setTime(today.getTime() + 60 * 60 * 1000 * 24 * number_of_days ); // just 1 day

    document.cookie = `${cookie_name}=${token};${expire.toGMTString()}`;
  }

  function saveTheCookieForCourse(idCourse) {
    let today = new Date();
    let expire = new Date(); 
   
    let cookie_name = "course_id"; 
    let number_of_days = 1; 

    expire.setTime(today.getTime() + 60 * 60 * 1000 * 24 * number_of_days ); // just 1 day

    document.cookie = `${cookie_name}=${idCourse};${expire.toGMTString()}`;
  }

  function getTokenFromCookie(){
    let cookie_name = "username_form";
   
    let pos_start = document.cookie.indexOf(" " + cookie_name + "=");
    if (pos_start == -1) pos_start=pos_start=document.cookie.indexOf(cookie_name + "=");

    if (pos_start != -1) { 
      
      let pos_end = document.cookie.indexOf(";", pos_start);

      if (pos_end == -1) pos_end = document.cookie.length;

      let substring = document.cookie.substring(pos_start, pos_end);
      let text=substring.split("=");
      return text[1];
  }
  return null
}

function deleteTokenFromCookie(){
  let today = new Date();
  let expire = new Date(); 
 
  let cookie_name = "username_form"; 
  let number_of_days = 1; 

  expire.setTime(today.getTime() + 60 * 60 * 1000 * 24 * number_of_days / 24); // just 1 hour

  document.cookie = `${cookie_name}=${0};${expire.toGMTString()}`;
 
}

function getIdCourseFromCookie(){
  let cookie_name = "course_id";
 
  let pos_start = document.cookie.indexOf(" " + cookie_name + "=");
  if (pos_start == -1) pos_start=pos_start=document.cookie.indexOf(cookie_name + "=");

  if (pos_start != -1) { 
    
    let pos_end = document.cookie.indexOf(";", pos_start);

    if (pos_end == -1) pos_end = document.cookie.length;

    let substring = document.cookie.substring(pos_start, pos_end);
    let text=substring.split("=");
    return text[1];
}
return null
}

