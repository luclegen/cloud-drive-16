import API from '../apis/api'

const URL = `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/files/`

class FilesService {
  create = files => API.post(URL, files)

  read = id => API.get(`${URL}${id}`)

  update = (id, file) => API.put(`${URL}${id}`, file)

  delete = id => API.patch(`${URL}${id}`)

  restore = id => API.patch(`${URL}r/${id}`)

  deleteForever = id => API.delete(`${URL}${id}`)

  list = name => API.get(name ? `${URL}?name=${name}` : URL)
}

export default new FilesService()