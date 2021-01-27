import axios from "axios";

export default async (method: string, params: any) => {
    return await axios.post(`https://marlingschool.edulinkone.com/api/?method=${method}`, {
        id: "1",
        jsonrpc: "2.0",
        method,
        params
    }).then(res => res.data.result).catch(console.error)
}