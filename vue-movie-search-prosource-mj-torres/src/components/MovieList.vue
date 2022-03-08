<template>
  <div class="list row">
    <div class="col-md-3 list-div">
      <div class="input-group mb-3 pt-5">
        <input
          type="text"
          class="form-control"
          placeholder="Search by title"
          v-model="searchTitle"
          @input="page = 1; retrieveMovies()"
        />
      </div>
      <div class="mb-5">
        <span>
          Total results:
          {{ count ? count : 'None' }}
        </span>
      </div>
      <table hover class="table" id="movies-list">
        <tbody>
          <tr :class="index === currentIndex ? 'active' : ''"
              v-for="(movie, index) in movies"
              :key="index"
              @click="setActiveMovie(movie, index)"
          >
            <td>
              <img :src="movie.Poster" class="thumbnail" />
            </td>
            <td>
              <h5>{{ movie.Title }}</h5>({{ movie.Year }})
            </td>
          </tr>
        </tbody>
      </table>
      <b-pagination
        v-if="count > 10"
        v-model="page"
        :total-rows="count"
        :per-page="pageSize"
        first-number
        last-number
        @change="handlePageChange"
        class="justify-content-center"
      ></b-pagination>
    </div> 
    <div class="col-md-9">
      <div v-if="currentMovie" class="row">
        <div class="view-header bg-dark col-md-12">
          <h1>{{ currentMovie.Title }}</h1>
          <h4>({{ currentMovie.Year }})</h4>
        </div>
        <div class="col-md-4 p-5">
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td colspan="2"><img :src="currentMovie.Poster" class="movie-image"/></td>
              </tr>
              <tr>
                <td><span class="labels">LANGUAGE</span><br />{{ currentMovie.Language }}</td>
                <td><span class="labels">DURATION</span><br />{{ currentMovie.Runtime }}</td>
              </tr>
              <tr>
                <td colspan="2"><span class="labels">CAST</span><br />{{ currentMovie.Actors }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-md-8 p-5">
          <div>
            <h4>Sypnosis</h4>
          </div>
          <div>
            {{ currentMovie.Plot }}
          </div>
        </div>
      </div>
      <div v-else>
        <div class="center">
          <h4 class="labels">Please select a title from the sidebar</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MovieDataService from "../services/MovieDataService";

export default {
  name: "movie-list",
  data() {
    return {
      movies: [],
      currentMovie: null,
      currentIndex: -1,
      searchTitle: "Dog",

      page: 1,
      count: 0,
      pageSize: 3,

      pageSizes: [3, 6, 9],
    };
  },
  methods: {
    getRequestParams(searchTitle, page, pageSize) {
      let params = {};

      if (searchTitle) {
        params["title"] = searchTitle;
      }

      if (page) {
        params["page"] = page;
      }

      if (pageSize) {
        params["size"] = pageSize;
      }

      return params;
    },
    getMovie(id) {
      MovieDataService.get(id)
        .then(response => {
          this.currentMovie = response.data
          if (response.data.Response === 'False') {
            alert(response.data.Error)
          }
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        });
    },
    retrieveMovies() {
      const params = this.getRequestParams(
        this.searchTitle,
        this.page,
        this.pageSize
      );

      MovieDataService.getAll(params)
        .then((response) => {
          const { Search, totalResults } = response.data;
          this.movies = Search;
          this.count = totalResults;

          if (response.data.Response === 'False') {
            alert(response.data.Error)
          }
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    handlePageChange(value) {
      this.page = value;
      this.retrieveMovies();
    },

    handlePageSizeChange(event) {
      this.pageSize = event.target.value;
      this.page = 1;
      this.retrieveMovies();
    },

    refreshList() {
      this.retrieveMovies();
      this.currentMovie = null;
      this.currentIndex = -1;
    },

    setActiveMovie(movie, index) {
      this.currentIndex = index;
      this.getMovie(movie.imdbID);
    },

    removeAllMovies() {
      MovieDataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.retrieveMovies();
  },
};
</script>

<style>
.list {
  text-align: left;
  max-width: 100%;
  margin: auto;
}
.list-div {
  box-shadow: 1px 0 10px -1px #888;
}
.thumbnail {
  width: 30px;
  height: auto;
}
.active {
  background: rgb(79, 161, 255);
}
.view-header {
  padding: 150px 30px 50px 120px;
  color: #fff;
}
.view-col {
  padding: 0;
}
.labels {
  color: rgb(138, 130, 130);
  font-weight: 600;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
