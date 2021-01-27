import base from "./base";

type LoginResult = {
    authtoken: string,
    user: {
        id: string
    }
}

export default (username: string, password: string): Promise<LoginResult | void> => {
    const params = {
        establishment_id: 2,
        password,
        username
    }

    return base("EduLink.Login", params)
}
