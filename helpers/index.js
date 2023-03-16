window.onload = () => {
  const questionLinkElement = document.getElementById("input");
  const submitButton = document.getElementById("button");
  const result = document.getElementById("res");

  const d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  const hrsoffsetdate = new Date(d.setHours(d.getHours()+5));
  const minoffsetdate = new Date(hrsoffsetdate.setMinutes(hrsoffsetdate.getMinutes()+30));

  const d1 = new Date(minoffsetdate.setDate(minoffsetdate.getDate()+1)).toISOString();
  const d11 = new Date(minoffsetdate.setDate(minoffsetdate.getDate()+1)).toISOString();
  const d3 = new Date(minoffsetdate.setDate(minoffsetdate.getDate()+2)).toISOString();
  const d31 = new Date(minoffsetdate.setDate(minoffsetdate.getDate()+1)).toISOString();
  const d10 = new Date(minoffsetdate.setDate(minoffsetdate.getDate()+5)).toISOString();
  const d101 = new Date(minoffsetdate.setDate(minoffsetdate.getDate()+1)).toISOString();
  const d30 = new Date(minoffsetdate.setDate(minoffsetdate.getDate()+19)).toISOString();
  const d301 = new Date(minoffsetdate.setDate(minoffsetdate.getDate()+1)).toISOString();
  const d60 = new Date(minoffsetdate.setDate(minoffsetdate.getDate()+29)).toISOString();
  const d601 = new Date(minoffsetdate.setDate(minoffsetdate.getDate()+1)).toISOString();


  const getRequests = (link) => {
    return [
      fetch(
        `https://www.googleapis.com/calendar/v3/calendars/deepaksaroha1993@gmail.com/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            end: {
              dateTime: d11,
            },
            start: {
              dateTime: d1,
            },
            "description": link,
            "summary": "DSA",
            "colorId": "10"
          }),
        }
      ),
      fetch(
        `https://www.googleapis.com/calendar/v3/calendars/deepaksaroha1993@gmail.com/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            end: {
              dateTime: d31,
            },
            start: {
              dateTime: d3,
            },
            "description": link,
            "summary": "DSA",
            "colorId": "10"
          }),
        }
      ),
      fetch(
        `https://www.googleapis.com/calendar/v3/calendars/deepaksaroha1993@gmail.com/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            end: {
              dateTime: d101,
            },
            start: {
              dateTime: d10,
            },
            "description": link,
            "summary": "DSA",
            "colorId": "10"
          }),
        }
      ),
      fetch(
        `https://www.googleapis.com/calendar/v3/calendars/deepaksaroha1993@gmail.com/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            end: {
              dateTime: d301,
            },
            start: {
              dateTime: d30,
            },
            "description": link,
            "summary": "DSA",
            "colorId": "10"
          }),
        }
      ),
      fetch(
        `https://www.googleapis.com/calendar/v3/calendars/deepaksaroha1993@gmail.com/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            end: {
              dateTime: d601,
            },
            start: {
              dateTime: d60,
            },
            "description": link,
            "summary": "DSA",
            "colorId": "10"
          }),
        }
      )
    ]
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
