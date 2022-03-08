import http from "../http-common";

class MovieDataService {
  getAll(params) {
    return http.get(`/?s=${params.title}&type=movie&page=${params.page}&apikey=241d3438`);
  }

  get(id) {
    return http.get(`/?i=${id}&plot=full&apikey=241d3438`);
  }
}

export default new MovieDataService();
