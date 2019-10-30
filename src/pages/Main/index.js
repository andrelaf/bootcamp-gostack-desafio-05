import React, {Component} from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Container from '../../components/Container';
import { List, Form, SubmitButton  } from './styles';
import api from '../../services/api';

export default class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newRepo: '',
       repositories: [],
        loading: false,
        error: null
    };
  }

  // Carrega os dados do local storage
  componentDidMount(){
    const repositories = localStorage.getItem('repositories');
    if(repositories){
      this.setState({repositories: JSON.parse(repositories)});
    }
  }

  // Salva os dados no local storage
  componentDidUpdate(_,prevState){
    const { repositories } = this.state;

    if(prevState.repositories !== repositories){
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }

  }

  handleInputChange = e => {
    this.setState({newRepo: e.target.value,  error: null })
  }

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({loading: true, error: false})

    try {
      const {newRepo, repositories} = this.state;

      if (newRepo === '') {
        throw String('Você precisa indicar um repositório');
      }

      const hasRepo = repositories.find(r => r.name === newRepo);
      if (hasRepo) {
        throw String('Repositório duplicado');
      }

      const response = await api.get(`/repos/${newRepo}`);
      const data = {
        name: response.data.full_name
      };

      this.setState({
        repositories: [...repositories,data],
        newRepo: '',
        loading: false
      })
    } catch (error) {
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
    }
  }

  render(){
    const { newRepo, repositories, loading, error } = this.state;
    return (
      <Container >
        <h1>
          <FaGithubAlt />
         Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit} error={error}>
          <input type="text" placeholder="Adicionar repositório" value={newRepo} onChange={this.handleInputChange} />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
