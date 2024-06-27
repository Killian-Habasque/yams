
export const board = {
    getScores: () => fetch("/api/scores").then(res => res.json()),
    setScore: (bestscore) => fetch("/api/score", {
        method: 'PUT',
        body: JSON.stringify({ bestscore }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    }).then(res => res.json()),
}

export const score = {
    board
}