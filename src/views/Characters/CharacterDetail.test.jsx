import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import CharacterDetail from './CharacterDetail.jsx';

const mockServer = setupServer(
  rest.get('https://rickandmortyapi.com/api/character/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        image: 'something',
        name: 'PickleRick',
        species: 'human',
        status: 'alive',
      })
    );
  })
);

beforeAll(() => mockServer.listen());

afterAll(() => mockServer.close());

it('should display a loading message, then display a requested character', async () => {
  const container = render(
    <MemoryRouter initialEntries={['/characters/1']}>
      <Route path="/characters/:id">
        <CharacterDetail />
      </Route>
    </MemoryRouter>
  );

  screen.getByText(/loading/i);
  await screen.findByText(/PickleRick/i);
  expect(container).toMatchSnapshot();
});
