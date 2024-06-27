
export const auth = {
    register: (pseudo, password, verifPassword) => fetch("/api/register", {
        method: "POST", body: JSON.stringify({ pseudo, password, verifPassword }), headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    }).then(res => res.json()),
    login: (pseudo, password) => fetch("/api/login", {
        method: "POST", body: JSON.stringify({ pseudo, password }), headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    }).then(res => res.json()),
    logout: () => fetch("/api/logout", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    }).then(res => res.json()),
    getUser: () => fetch("/api/user", { credentials: 'include' }).then(res => res.json()),
}

export const user = {
    auth
}