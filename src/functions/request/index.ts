export const request = (func: string, payload: string | undefined): Promise<string> => {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        google.script.run
            .withSuccessHandler((response: string) => {
                resolve(response)
            })
            .withFailureHandler((error: object) => {
                reject(error)
            })
            [func](payload)
    })
}