window.onload = () => {
    const greeting = document.getElementById("greeting");
    const signinbtn = document.getElementById("signin_btn");
    const signoutbtn = document.getElementById("signout_btn");

    const questionLinkElement = document.getElementById("input");
    const submitButton = document.getElementById("button");
    const result = document.getElementById("res");

    const extractTokenFromUrl = () =>
        window.location.href.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];

    const extractExpiresAtFromUrl = () => 1000;

    const findHasAuthInfo = () => {
        return !!window.localStorage.getItem("authInfo");
    };

    const findIfExpired = () => {
        if (window.localStorage.getItem("authInfo")) {
            const expiryTime = JSON.parse(
                window.localStorage.getItem("authInfo")
            ).expiresAt;
            const currentTime = new Date().getTime();

            console.log(expiryTime, currentTime);
            return expiryTime <= currentTime;
        } else {
            return true;
        }
    };

    const getAccessToken = () => {
        try{
            return JSON.parse(window.localStorage.getItem("authInfo")).access_token;
        }catch(error){
            result.classList.remove("sc");
            result.classList.add("er");
            result.innerText = "Failed!";
        }
        
    };

    const getUserName = async () => {
        return fetch("https://people.googleapis.com/v1/people/me", {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Name Api Error!");
                }
                return res.json();
            })
            .then((res) => {
                return res?.names?.displayName;
            })
            .catch((err) => {
                throw new Error("Name Api Error!");
            });
    };

    const onSignin = () => {
        let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
        const params = {
            client_id:
                "567480060715-50v5lqovablirlerpiq3ehv5vgao1og7.apps.googleusercontent.com",
            redirect_uri: "http://localhost:5500",
            response_type: "token",
            scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar.events",
            include_granted_scopes: "true",
            state: "pass-through-value",
        };

        const authurl = `${oauth2Endpoint}?client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&scope=${params.scope}`;

        window.location = authurl;
    };

    signinbtn.addEventListener("click", onSignin);

    const onSignOut = () => {
        fetch(
            "https://oauth2.googleapis.com/revoke?token=" +
                getAccessToken(),
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                }
        ).then((res) => {
            window.localStorage.removeItem("authInfo");
            window.location.reload();
        }).catch(err => {
            console.log("error");
        })
    };

    signoutbtn.addEventListener("click", onSignOut);

    const onPageLoad = () => {
        const load = document.querySelector(".loading");
        const content = document.getElementById("content");
        const error = document.querySelector(".error");

        if (findHasAuthInfo()) {
            if (!findIfExpired()) {
                load.style.display = "block";
                content.style.display = "none";
                error.style.display = "none";
                getUserName()
                    .then((name) => {
                        greeting.innerText = greeting.innerText + " " + name;

                        load.style.display = "none";
                        content.style.display = "block";

                        error.style.display = "none";
                        greeting.style.display = "block";

                        signinbtn.style.display = "none";
                        signoutbtn.style.display = "block";
                    })
                    .catch((err) => {
                        error.innerText =
                            error.innerText + " " + err + ". Refresh.";

                        load.style.display = "none";
                        content.style.display = "block";

                        error.style.display = "block";
                        greeting.style.display = "none";

                        signinbtn.style.display = "none";
                        signoutbtn.style.display = "block";
                    });
            } else {
                onSignOut()
            }
        } else if (window.location.href.includes("access_token")) {
            const access_token = extractTokenFromUrl();
            const expiresDuration = extractExpiresAtFromUrl();

            window.localStorage.setItem(
                "authInfo",
                JSON.stringify({
                    access_token,
                    expiresAt: new Date().getTime() + expiresDuration * 1000,
                })
            );

            window.location.href = window.location.origin;
        } else {
            load.style.display = "none";
            content.style.display = "block";
            error.style.display = "none";

            greeting.style.display = "none";
            signinbtn.style.display = "block";
            signoutbtn.style.display = "none";
        }
    };

    onPageLoad();

    const d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    const hrsoffsetdate = new Date(d.setHours(d.getHours() + 5));
    const minoffsetdate = new Date(
        hrsoffsetdate.setMinutes(hrsoffsetdate.getMinutes() + 30)
    );

    const days = [1, 2, 5, 19, 29];

    const dates = days.map((day) => {
        return {
            start: new Date(
                minoffsetdate.setDate(minoffsetdate.getDate() + day)
            ).toISOString(),
            end: new Date(
                minoffsetdate.setDate(minoffsetdate.getDate() + 1)
            ).toISOString(),
        };
    });

    const getEventRequest = (start, end, description) => {
        const access_token = getAccessToken();
        return fetch(
            `https://www.googleapis.com/calendar/v3/calendars/f5a2d6a5a24c04eb0ddb2ec17a66271509babf010719c9a1f55735f4bed2e4c4@group.calendar.google.com/events`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({
                    start: {
                        dateTime: start,
                    },
                    end: {
                        dateTime: end,
                    },
                    description: description,
                    summary: "DSA",
                    colorId: "10",
                }),
            }
        );
    };

    const getRequests = (link) => {
        return dates.map((date) => {
            return getEventRequest(date.start, date.end, link);
        });
    };

    const createEvent = (link) => {
        Promise.all(getRequests(link))
            .then((res) => {
                if (!res.ok) {
                    throw new Error();
                } else {
                    result.classList.add("sc");
                    result.classList.remove("er");
                    result.innerText = "Done";
                }
            })
            .catch((err) => {
                result.classList.remove("sc");
                result.classList.add("er");
                result.innerText = "Failed!";
            });
    };

    submitButton.addEventListener("click", () => {
        const questionLink = questionLinkElement.value.toString();
        createEvent(questionLink);
    });
};
