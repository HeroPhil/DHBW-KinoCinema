
export function getRandomNumber() {
    return Math.round(Math.random() * 100);
}

export function getSecuredData(userContext:any) {
    if (userContext !== null) { // maybe export this to basics?
        return { data: {
            name: "secret data",
        }};
    }
    return { error: "You are not signed in!"};    
}