export type SignInRequestDto = {
    username: string;
    password: string;
}

export type SighInResponseDto = {
    accessToken: string;
    type: string;
    info: {
        userId: string;
        username: string;
    };
}

export type SignUpRequestDto = {
    username: string;
    password: string;
    confirmPassword: string;
}