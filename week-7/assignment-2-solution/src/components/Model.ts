export type SignInRequest = {
    username: string;
    password: string;
};

export type SignUpRequest = {
    username: string;
    password: string;
};

export type SignInResponse = {
    message: string;
    token: string
}

export type SignUpResponse = {
    message: string;
    token: string
}

export type ToDoRequest = {
    title: string;
    description: string;
}


export interface AuthState {
    token: string | null
    username: string | null
}

export type ToDoResponse = {
    title: string;
    description: string,
    done: boolean,
    userId: string,
    _id: string,
}