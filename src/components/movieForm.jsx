import React from 'react';
import Joi from 'joi-browser';
import Form from './common/form';
import { getGenres } from './../services/fakeGenreService';
import { getMovie, saveMovie } from './../services/fakeMovieService';

class MovieForm extends Form {
  state = {
    data: {
      title: '',
      genreId: '',
      numberinstock: '',
      rate: ''
    },
    genres: [],
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label('Title'),
    genreId: Joi.string()
      .required()
      .label('Genre'),
    numberinstock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label('Number in stock'),
    rate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label('Daily rental Rate')
  };

  componentDidMount() {
    const genres = getGenres();
    this.setState({ genres });

    const movieId = this.props.match.params.id;
    if (movieId === 'new') return;

    const movie = getMovie(movieId);
    if (!movie) return this.props.history.replace('/not-found');

    this.setState({ data: this.mapToViewModel(movie) });
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberinstock: movie.numberInStock,
      rate: movie.dailyRentalRate
    };
  }

  doSubmit = () => {
    //next call an API and process changes
    //console.log('Form submitted');

    saveMovie(this.state.data);
    this.props.history.push('/movies');
  };

  render() {
    return (
      <div>
        <h1> Movie Form - {this.props.match.params.id}</h1>
        <form onSubmit={this.handleFormSubmit}>
          {this.renderInput('title', 'Title')}
          {this.renderSelect('genreId', 'Genre', this.state.genres)}
          {this.renderInput('numberinstock', 'Number in stock')}
          {this.renderInput('rate', 'Rate')}
          {this.renderButton('Save')}
        </form>

        {/*<button
        className="btn btn-primary"
        onClick={() => history.push('/movies')}>
        Save
      </button>*/}
      </div>
    );
  }
}

export default MovieForm;
