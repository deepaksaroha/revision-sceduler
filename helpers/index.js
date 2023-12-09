window.onload = () => {
  const onSignin = () => {
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = {
      "client_id": "567480060715-50v5lqovablirlerpiq3ehv5vgao1og7.apps.googleusercontent.com",
      "redirect_uri": "http://localhost:5500",
      "response_type": "token",
      "scope": "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar.events",
      "include_granted_scopes": "true",
      "state": "pass-through-value"
    }

    const authurl = `${oauth2Endpoint}?client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&scope=${params.scope}`

    window.location = authurl;
  }

  const signinbtn = document.getElementById("signin_btn");
  signinbtn.addEventListener("click", onSignin);

  const questionLinkElement = document.getElementById("input");
  const submitButton = document.getElementById("button");
  const result = document.getElementById("res");

  const d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  const hrsoffsetdate = new Date(d.setHours(d.getHours()+5));
  const minoffsetdate = new Date(hrsoffsetdate.setMinutes(hrsoffsetdate.getMinutes()+30));

  const days = [1, 2, 5, 19, 29];

  const dates = days.map(day => {
    return {
      start: new Date(minoffsetdate.setDate(minoffsetdate.getDate()+day)).toISOString(),
      end: new Date(minoffsetdate.setDate(minoffsetdate.getDate()+1)).toISOString()
    }
  })

  const getToken = () => window.location.href.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];

  const getEventRequest = (start, end, description) => {
    const access_token = getToken();
    return fetch(
      `https://www.googleapis.com/calendar/v3/calendars/f5a2d6a5a24c04eb0ddb2ec17a66271509babf010719c9a1f55735f4bed2e4c4@group.calendar.google.com/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}` 
        },
        body: JSON.stringify({
          start: {
            dateTime: start,
          },
          end: {
            dateTime: end,
          },
          "description": description,
          "summary": "DSA",
          "colorId": "10"
        }),
      }
    )
  }

  const getRequests = (link) => {
    return dates.map(date => {
      return getEventRequest(date.start, date.end, link);
    })
  }
  
  const createEvent = (link) => {
    Promise.all(getRequests(link))
    .then(res=>{
      if(!res.ok){
        result.classList.add("sc");
        result.classList.remove("er");
        result.innerText = "Done";
      }else{
        throw new Error();
      }
    })
    .catch(err=>{
      result.classList.remove("sc");
      result.classList.add("er");
      result.innerText = "Nope";
    })
  };

  submitButton.addEventListener("click", () => {
    const questionLink = questionLinkElement.value;
    createEvent(questionLink);
  });

};
