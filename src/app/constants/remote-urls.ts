const BASE_URL_API = 'https://reqres.in/api'
const RemoteUrls = {

    users: `${BASE_URL_API}/users`, // ?page={page}
    userByIdFn: (id: string) => `${BASE_URL_API}/users/${id}`,

}

export default RemoteUrls;