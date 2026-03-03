let accessToken: string | null = null;

export const setAccessToken = (accessToken: string | null) => {
    accessToken = accessToken;
}

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
    accessToken = null;
}