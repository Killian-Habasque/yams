
export const rule = {
    getRules: () => fetch("/api/rules").then(res => res.json()),
}
