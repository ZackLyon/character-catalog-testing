import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import CharacterList from './CharacterList.jsx';

const mockServer = setupServer(
  rest.get('https://rickandmortyapi.com/api/character', (req, res, ctx) => {
    return res(
      ctx.json({
        info: { pages: 1 },
        results: [
          {
            id: 1,
            image: 'something',
            name: 'Rick',
            species: 'human',
            status: 'alive',
          },
          {
            id: 2,
            image: 'something',
            name: 'Morty',
            species: 'human',
            status: 'alive',
          },
          {
            id: 3,
            image: 'something',
            name: 'PickleRick',
            species: 'pickle',
            status: 'human again',
          },
        ],
      })
    );
  })
);

beforeAll(() => mockServer.listen());

afterAll(() => mockServer.close());

it('should display a loading message, then display a requested character', async () => {
  const container = render(
    <MemoryRouter initialEntries={['/characters']}>
      <Route path="/characters">
        <CharacterList />
      </Route>
    </MemoryRouter>
  );

  screen.getByAltText(/loading/i);
  await screen.findAllByText(/Rick/gi);
  await screen.findByText(/Morty/gi);
  await screen.findByText(/PickleRick/gi);
  expect(container).toMatchSnapshot();
});
